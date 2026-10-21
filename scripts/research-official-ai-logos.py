#!/usr/bin/env python3
"""Research every catalog AI tool in a real browser and export fresh web assets.

This script intentionally never reads public/logos, the logo registry, or any
previous export as an input to the downloaded files. The local registry is only
used by the website itself; this exporter uses the catalog's tool names/sites,
then discovers assets from each live official page in Playwright.
"""

from __future__ import annotations

import asyncio
import base64
import csv
import hashlib
import json
import mimetypes
import re
import shutil
import subprocess
import sys
import zipfile
from dataclasses import dataclass, asdict
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import parse_qs, unquote, urljoin, urlparse
import xml.etree.ElementTree as ET

from playwright.async_api import Browser, BrowserContext, Page, async_playwright


ROOT = Path(__file__).resolve().parents[1]
EXPORT_DIR = ROOT / "exports" / "official-ai-logos"
LOGOS_DIR = EXPORT_DIR / "logos"
ZIP_PATH = ROOT / "exports" / "tech-hacks-ai-official-ai-logos.zip"
JSON_PATH = ROOT / "exports" / "tech-hacks-ai-official-ai-logos.manifest.json"
CONTACT_SHEET_PATH = Path("/tmp/tech-hacks-ai-official-logo-contact-sheet.png")

MAX_BYTES = 5 * 1024 * 1024
PAGE_TIMEOUT_MS = 30_000
REQUEST_TIMEOUT_MS = 15_000
MAX_RETRIES = 2
CONCURRENCY = 4
USER_AGENT = "Tech-Hacks-AI-official-logo-research/1.0 (+https://techhacksai.com)"

ALTERNATIVE_OFFICIAL_PAGES = {
    # The product landing page has no downloadable logo DOM, while the
    # project's official organization repository exposes the real asset.
    "aider": ["https://github.com/Aider-AI/aider"],
}

PREFER_OFFICIAL_FAVICON_ONLY = {
    # The page exposes partner/customer logos before a product logo. A
    # first-party favicon is safer than packaging another brand's asset.
    "higgsfield",
    "dreamina",
    "kling-ai",
    "krea-ai",
    "luma-dream-machine",
    "make",
    "meshy-3d",
    "recraft",
    "stable-diffusion-3",
}

MANIFEST_COLUMNS = [
    "tool_name",
    "canonical_slug",
    "official_website",
    "source_page_url",
    "direct_asset_url",
    "downloaded_filename",
    "file_format",
    "source_type",
    "verification_status",
    "downloaded_from_web",
    "notes",
]


@dataclass
class Candidate:
    url: str
    source_type: str
    score: int
    reason: str
    inline_svg: str = ""


@dataclass
class Result:
    tool_name: str
    canonical_slug: str
    official_website: str
    source_page_url: str = ""
    direct_asset_url: str = ""
    downloaded_filename: str = ""
    file_format: str = ""
    source_type: str = ""
    verification_status: str = "unresolved"
    downloaded_from_web: bool = False
    notes: str = ""
    sha256: str = ""
    candidates: list[dict] | None = None


def load_catalog() -> list[dict]:
    node_code = """
import { aiToolsData } from './src/data/aiToolsData.ts';
console.log(JSON.stringify(aiToolsData.map(({name, slug, websiteUrl}) => ({name, slug, websiteUrl}))));
"""
    completed = subprocess.run(
        ["node", "--experimental-strip-types", "--input-type=module", "-e", node_code],
        cwd=ROOT,
        check=True,
        capture_output=True,
        text=True,
    )
    tools = json.loads(completed.stdout)
    unique: dict[str, dict] = {}
    for tool in tools:
        if tool.get("slug") and tool["slug"] not in unique:
            unique[tool["slug"]] = tool
    return sorted(unique.values(), key=lambda tool: tool["slug"])


def safe_slug(value: str) -> str:
    slug = re.sub(r"[^a-z0-9._-]+", "-", str(value).strip().lower())
    return slug.strip("-") or "unresolved-logo"


def csv_cell(value: object) -> str:
    text = str(value or "")
    return f'"{text.replace(chr(34), chr(34) * 2)}"' if any(c in text for c in ',\n\r"') else text


def write_csv(path: Path, rows: list[dict], columns: list[str] = MANIFEST_COLUMNS) -> None:
    with path.open("w", encoding="utf-8", newline="") as handle:
        handle.write(",".join(columns) + "\n")
        for row in rows:
            handle.write(",".join(csv_cell(row.get(column, "")) for column in columns) + "\n")


def normalize_candidate_url(raw: str, page_url: str) -> str | None:
    if not raw or raw.startswith(("blob:", "javascript:", "mailto:", "tel:")):
        return None
    if raw.startswith("data:image/"):
        return raw
    if raw.startswith("//"):
        raw = f"https:{raw}"
    absolute = urljoin(page_url, raw)
    parsed = urlparse(absolute)
    if parsed.scheme not in {"http", "https"}:
        return None
    if parsed.hostname == "camo.githubusercontent.com":
        encoded = parsed.path.rstrip("/").split("/")[-1]
        try:
            decoded = bytes.fromhex(encoded).decode("utf-8")
            if decoded.startswith(("http://", "https://")):
                absolute = decoded
        except (ValueError, UnicodeDecodeError):
            pass
    # Next/Vercel image proxies can hide the actual source in a `url` query.
    query_url = parse_qs(parsed.query).get("url", [None])[0]
    if query_url and query_url.startswith(("http://", "https://")):
        absolute = unquote(query_url)
    return absolute


def likely_image_url(url: str) -> bool:
    if url.startswith("data:image/"):
        return True
    parsed = urlparse(url)
    path = parsed.path.lower()
    lower_url = url.lower()
    if "github.com/fluidicon" in lower_url or "huggingface_logo" in lower_url:
        return False
    if "github.githubassets.com" in lower_url and ("pinned-octocat" in lower_url or "/favicons/" in lower_url):
        return False
    if any(marker in lower_url for marker in ("onetrust", "header-arrow", "powered_by_logo", "microsoft/re1mu3b", "seedance-logo", "spc-banner-logo", "ioscode", "qrcode", "/qr")):
        return False
    return bool(re.search(r"\.(svg|png|webp|ico|jpe?g)(?:$|[?#])", path)) or any(
        marker in url.lower() for marker in ("favicon", "logo", "brand", "apple-touch-icon", "image/svg")
    )


def format_from_bytes(data: bytes, fallback: str = "") -> str | None:
    if not data:
        return None
    text = data[:4096].lstrip().decode("utf-8", errors="ignore")
    if re.search(r"^<svg[\s>]", text, re.I) and re.search(r"</svg\s*>$", text, re.I):
        return "svg"
    if data.startswith(b"\x89PNG\r\n\x1a\n"):
        return "png"
    if data.startswith(b"RIFF") and data[8:12] == b"WEBP":
        return "webp"
    if data.startswith(b"\x00\x00\x01\x00"):
        return "ico"
    if data.startswith(b"\xff\xd8\xff"):
        return "jpg"
    if data[:6] in {b"GIF87a", b"GIF89a"}:
        return "gif"
    return fallback if fallback in {"svg", "png", "webp", "ico", "jpg", "gif"} else None


def validate_asset(data: bytes, content_type: str = "", expected_extension: str = "") -> tuple[str | None, str | None]:
    if not data:
        return None, "empty response"
    if len(data) > MAX_BYTES:
        return None, f"response exceeds {MAX_BYTES} bytes"
    prefix = data[:4096].lstrip().lower()
    if "text/html" in content_type.lower() or prefix.startswith((b"<!doctype html", b"<html", b"<body")):
        return None, "HTML response instead of an image asset"
    fmt = format_from_bytes(data, expected_extension)
    if not fmt:
        return None, "unsupported or invalid image signature"
    if fmt == "svg":
        text = data.decode("utf-8", errors="strict")
        if re.search(r"<script[\s>]|<iframe[\s>]", text, re.I):
            return None, "SVG contains executable/embed content"
        try:
            root = ET.fromstring(text)
            if not root.tag.lower().endswith("svg"):
                return None, "SVG root element is not svg"
        except (ET.ParseError, UnicodeDecodeError) as error:
            return None, f"invalid SVG XML: {error}"
    return fmt, None


async def extract_candidates(page: Page, page_url: str) -> list[Candidate]:
    raw_items = await page.evaluate(
        """
        () => {
          const out = [];
          const push = (url, kind, text, score) => {
            if (!url) return;
            out.push({url, kind, text: String(text || '').slice(0, 300), score});
          };
          const attrText = (el) => [el.alt, el.getAttribute('alt'), el.title, el.getAttribute('aria-label'), el.className, el.id].filter(Boolean).join(' ');
          for (const link of document.querySelectorAll('link[rel]')) {
            const rel = String(link.rel || '').toLowerCase();
            if (/(icon|apple-touch-icon|mask-icon)/.test(rel)) push(link.href, 'link-icon', rel, 90);
          }
          for (const img of document.images) {
            const text = attrText(img);
            const lower = `${text} ${img.currentSrc || img.src || ''}`.toLowerCase();
            const inHeader = Boolean(img.closest('header, nav, [role="banner"]'));
            const hasLogoHint = /logo|brand|wordmark/.test(text.toLowerCase()) || /logo|brand|wordmark/.test(lower);
            const isPartnerOrContentImage = /hero|customer|partner|trusted|sponsor|client|logo_img|slide_img|company logo|hugging ?face|fluidicon|maintain consistency|sequence opens|seedance|siemens|fonds finanz|stellantis|nexon|dneg|supercell|flashforge|elegoo|bambu|incroco|shopify|daimler|clickhouse|stripe|boston university|merck|nokia|oracle|red hat|internal-brand|wallpaper|the times|testimonial|globant|dude wipes|finn|stability[- ]?ai/.test(lower);
            const isLikelyAvatar = /avatar|profile|user|author/.test(text.toLowerCase());
            const isGithubOrgAvatar = inHeader && /avatars\\.githubusercontent\\.com/.test(lower) && text.length < 80;
            if ((hasLogoHint || inHeader) && !isPartnerOrContentImage && (!isLikelyAvatar || isGithubOrgAvatar) && text.length < 180) {
              let score = isGithubOrgAvatar ? 150 : hasLogoHint ? 120 : inHeader ? 100 : 50;
              if (/header|navbar|nav|masthead/.test(text.toLowerCase())) score += 30;
              if (inHeader) score += 40;
              push(img.currentSrc || img.src || img.getAttribute('data-src'), 'image', text, score);
            }
            const srcset = img.getAttribute('srcset');
            if (srcset) {
              const largest = srcset.split(',').map((part) => part.trim().split(/\\s+/)[0]).filter(Boolean).at(-1);
              if (largest && (hasLogoHint || inHeader) && !isPartnerOrContentImage && !isLikelyAvatar) push(largest, 'srcset', text, 80);
            }
          }
          for (const svg of document.querySelectorAll('svg')) {
            const text = attrText(svg);
            const markup = svg.outerHTML || '';
            const viewBox = svg.getAttribute('viewBox') || '';
            const numbers = viewBox.split(/\\s+/).map(Number);
            const wide = numbers.length === 4 && numbers[2] / Math.max(numbers[3], 1) > 1.5;
            if (/logo|brand|wordmark/i.test(text)) {
              push(`inline-svg:${out.length}`, 'inline-svg', text || 'header inline SVG', 155);
              out[out.length - 1].inline = markup;
            }
          }
          return out;
        }
        """
    )
    candidates: list[Candidate] = []
    seen: set[str] = set()
    for item in raw_items:
        url = normalize_candidate_url(item.get("url", ""), page_url)
        if item.get("kind") == "inline-svg" and item.get("inline"):
            # Inline SVGs are useful browser evidence but do not have a
            # separately downloadable asset URL. Prefer a real linked image or
            # favicon; otherwise leave the tool unresolved rather than claiming
            # that a DOM fragment was downloaded from the web.
            continue
        image_hint = item.get("kind") in {"image", "srcset"} and (bool(re.search(r"logo|brand|wordmark", item.get("text", ""), re.I)) or "avatars.githubusercontent.com" in item.get("url", ""))
        if not url or url.startswith("data:") or url in seen or (not likely_image_url(url) and not image_hint):
            continue
        seen.add(url)
        url_lower = url.lower()
        if "avatars.githubusercontent.com" in url_lower:
            source_type = "official organization avatar"
            score = min(int(item.get("score", 0)), 75)
        else:
            source_type = "official logo" if item.get("kind") == "image" else "official favicon fallback"
            score = int(item.get("score", 0))
        candidates.append(Candidate(url=url, source_type=source_type, score=score, reason=f"{item.get('kind')}: {item.get('text', '')}"))
    # A first-party favicon path is still a valid official fallback if no
    # declared icon was exposed in the DOM.
    favicon_url = normalize_candidate_url("/favicon.ico", page_url)
    page_host = urlparse(page_url).hostname or ""
    is_huggingface_model_page = page_host in {"huggingface.co", "www.huggingface.co"} and "/chat" not in page_url.lower()
    if favicon_url and favicon_url not in seen and page_host not in {"github.com", "www.github.com"} and not is_huggingface_model_page:
        candidates.append(Candidate(url=favicon_url, source_type="official favicon fallback", score=45, reason="official website /favicon.ico fallback"))
    apple_touch_url = normalize_candidate_url("/apple-touch-icon.png", page_url)
    if apple_touch_url and apple_touch_url not in seen and page_host not in {"github.com", "www.github.com"} and not is_huggingface_model_page:
        candidates.append(Candidate(url=apple_touch_url, source_type="official favicon fallback", score=42, reason="official website /apple-touch-icon.png fallback"))
    candidates.sort(key=lambda candidate: candidate.score, reverse=True)
    return candidates[:20]


async def download_candidate(context: BrowserContext, candidate: Candidate) -> tuple[bytes | None, str, str | None]:
    if candidate.inline_svg:
        data = candidate.inline_svg.encode("utf-8")
        fmt, error = validate_asset(data, "image/svg+xml", "svg")
        return (data, fmt, None) if fmt else (None, "", error)
    if candidate.url.startswith("data:image/"):
        try:
            header, payload = candidate.url.split(",", 1)
            data = base64.b64decode(payload) if ";base64" in header else unquote(payload).encode("utf-8")
            content_type = header[5:].split(";", 1)[0]
            fmt, error = validate_asset(data, content_type, "")
            return (data, fmt, None) if fmt else (None, "", error)
        except Exception as error:  # noqa: BLE001 - embedded data boundary
            return None, "", str(error)
    last_error = ""
    for attempt in range(MAX_RETRIES + 1):
        try:
            response = await context.request.get(
                candidate.url,
                timeout=REQUEST_TIMEOUT_MS,
                fail_on_status_code=False,
                headers={"User-Agent": USER_AGENT, "Accept": "image/svg+xml,image/png,image/webp,image/x-icon,image/*;q=0.8,*/*;q=0.1"},
            )
            if not response.ok:
                last_error = f"HTTP {response.status}"
            else:
                data = await response.body()
                content_type = response.headers.get("content-type", "")
                expected = Path(urlparse(candidate.url).path).suffix.lower().lstrip(".")
                if expected == "jpeg":
                    expected = "jpg"
                fmt, error = validate_asset(data, content_type, expected)
                if fmt:
                    return data, fmt, None
                last_error = error or "asset validation failed"
        except Exception as error:  # noqa: BLE001 - browser/network boundary
            last_error = str(error)
        if attempt < MAX_RETRIES:
            await asyncio.sleep(0.4 * (attempt + 1))
    return None, "", last_error or "download failed"


async def research_one(browser: Browser, tool: dict, semaphore: asyncio.Semaphore) -> Result:
    result = Result(tool_name=tool["name"], canonical_slug=tool["slug"], official_website=tool["websiteUrl"])
    async with semaphore:
        context = await browser.new_context(ignore_https_errors=True, user_agent=USER_AGENT, locale="en-US")
        page = await context.new_page()
        try:
            response = await page.goto(tool["websiteUrl"], wait_until="domcontentloaded", timeout=PAGE_TIMEOUT_MS)
            await page.wait_for_timeout(2_000)
            final_url = page.url
            result.source_page_url = final_url
            try:
                candidates = await extract_candidates(page, final_url)
            except Exception as error:  # noqa: BLE001 - redirecting SPA boundary
                if "Execution context was destroyed" not in str(error):
                    raise
                await page.wait_for_timeout(2_000)
                final_url = page.url
                result.source_page_url = final_url
                candidates = await extract_candidates(page, final_url)
            result.candidates = [asdict(candidate) for candidate in candidates]
            if tool["slug"] in PREFER_OFFICIAL_FAVICON_ONLY:
                candidates = [candidate for candidate in candidates if candidate.source_type == "official favicon fallback"]
                result.candidates = [asdict(candidate) for candidate in candidates]
            if response is not None and response.status >= 400:
                result.notes = f"Official page returned HTTP {response.status}; browser DOM was still inspected."
            for candidate in candidates:
                if candidate.source_type == "official organization avatar":
                    # An organization avatar proves ownership of the repo but
                    # is not necessarily the product's logo. Do not package it
                    # as a product identity when no product asset is exposed.
                    continue
                data, fmt, error = await download_candidate(context, candidate)
                if data:
                    result.direct_asset_url = candidate.url
                    result.downloaded_from_web = True
                    result.source_type = candidate.source_type
                    result.file_format = fmt
                    result.verification_status = f"browser-inspected official page; {candidate.reason}; asset validated"
                    result.sha256 = hashlib.sha256(data).hexdigest()
                    result.notes = f"Page title: {(await page.title())[:160]}"
                    filename = f"{safe_slug(result.canonical_slug)}.{fmt}"
                    result.downloaded_filename = f"logos/{filename}"
                    (LOGOS_DIR / filename).write_bytes(data)
                    return result
                result.notes = f"{result.notes} Candidate {candidate.url}: {error}.".strip()
            for alternative_url in ALTERNATIVE_OFFICIAL_PAGES.get(tool["slug"], []):
                try:
                    alternative_response = await page.goto(alternative_url, wait_until="domcontentloaded", timeout=PAGE_TIMEOUT_MS)
                    await page.wait_for_timeout(1_500)
                    alternative_final_url = page.url
                    alternative_candidates = await extract_candidates(page, alternative_final_url)
                    if result.candidates is None:
                        result.candidates = []
                    result.candidates.extend(asdict(candidate) for candidate in alternative_candidates)
                    for candidate in alternative_candidates:
                        data, fmt, error = await download_candidate(context, candidate)
                        if data:
                            result.source_page_url = alternative_final_url
                            result.direct_asset_url = candidate.url
                            result.downloaded_from_web = True
                            result.source_type = candidate.source_type
                            result.file_format = fmt
                            result.verification_status = f"browser-inspected official page; {candidate.reason}; asset validated"
                            result.sha256 = hashlib.sha256(data).hexdigest()
                            result.notes = f"Alternative official page title: {(await page.title())[:160]}"
                            filename = f"{safe_slug(result.canonical_slug)}.{fmt}"
                            result.downloaded_filename = f"logos/{filename}"
                            (LOGOS_DIR / filename).write_bytes(data)
                            return result
                        result.notes = f"{result.notes} Alternative candidate {candidate.url}: {error}.".strip()
                except Exception as error:  # noqa: BLE001 - alternate official page boundary
                    result.notes = f"{result.notes} Alternative page {alternative_url} failed: {error}.".strip()
            if not result.notes:
                result.notes = "No direct logo or official favicon asset was exposed by the inspected page."
        except Exception as error:  # noqa: BLE001 - browser/network boundary
            result.notes = f"Browser inspection failed: {type(error).__name__}: {error}"
            result.verification_status = "unresolved; official page could not be inspected"
        finally:
            await context.close()
    return result


def write_readme(results: list[Result], generated_at: str) -> str:
    success = [result for result in results if result.downloaded_from_web]
    official = [result for result in success if result.source_type == "official logo"]
    favicon = [result for result in success if result.source_type == "official favicon fallback"]
    unresolved = [result for result in results if not result.downloaded_from_web]
    lines = [
        "TECH HACKS AI — OFFICIAL AI LOGO WEB EXPORT",
        "",
        f"Date of export: {generated_at}",
        f"Unique AI tools in catalog: {len(results)}",
        f"Actual web downloads: {len(success)}",
        f"Official logos verified: {len(official)}",
        f"Official favicon fallbacks: {len(favicon)}",
        f"Unresolved identities: {len(unresolved)}",
        "Files sourced from existing local assets: 0",
        "",
        "RESEARCH METHOD",
        "- Source of truth: src/data/aiToolsData.ts, deduplicated by canonical slug.",
        "- Each official website was opened and inspected in a Playwright Chromium browser.",
        "- Candidate assets were downloaded through the browser context from URLs exposed by the official page.",
        "- No files from public/logos, the logo registry, the previous ZIP, or prior exports were used as inputs.",
        "- Downloaded assets were checked for HTML masquerading, size, image signatures, and basic SVG/XML validity.",
        "",
        "USAGE AND LICENSING NOTES",
        "- Official brand marks may have trademark and brand-guideline restrictions.",
        "- Website favicons are clearly labelled fallbacks and may not be suitable for marketing or redistribution.",
        "- Review each source page and the brand's terms before publishing or redistributing these assets.",
        "- The manifest records the source page, direct asset URL, and verification status for every tool.",
        "",
        "UNRESOLVED TOOLS",
    ]
    if unresolved:
        lines.extend(f"- {result.tool_name} ({result.canonical_slug}): {result.notes}" for result in unresolved)
    else:
        lines.append("- None.")
    lines.extend([
        "",
        "ARCHIVE CONTENTS",
        "- logos/ — freshly downloaded web assets only.",
        "- manifest.csv — one row per catalog AI tool.",
        "- README.txt — this research and licensing note.",
        "- unresolved.csv — tools without a verified/downloaded asset.",
    ])
    return "\n".join(lines) + "\n"


def write_json_manifest(results: list[Result], generated_at: str) -> None:
    payload = {
        "generated_at": generated_at,
        "catalog_source": "src/data/aiToolsData.ts",
        "unique_ai_tool_count": len(results),
        "actual_web_downloads": sum(result.downloaded_from_web for result in results),
        "official_logos_verified": sum(result.source_type == "official logo" for result in results),
        "official_favicon_fallbacks": sum(result.source_type == "official favicon fallback" for result in results),
        "unresolved_count": sum(not result.downloaded_from_web for result in results),
        "existing_local_assets_used": 0,
        "entries": [asdict(result) for result in results],
    }
    JSON_PATH.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")


async def main() -> None:
    tools = load_catalog()
    if len(tools) != 65:
        raise RuntimeError(f"Expected the current catalog to contain 65 unique tools; found {len(tools)}")
    EXPORT_DIR.mkdir(parents=True, exist_ok=True)
    if LOGOS_DIR.exists():
        shutil.rmtree(LOGOS_DIR)
    LOGOS_DIR.mkdir(parents=True, exist_ok=True)
    if ZIP_PATH.exists():
        ZIP_PATH.unlink()
    generated_at = datetime.now(timezone.utc).isoformat()

    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch(headless=True)
        semaphore = asyncio.Semaphore(CONCURRENCY)
        results = await asyncio.gather(*(research_one(browser, tool, semaphore) for tool in tools))
        await browser.close()

    results.sort(key=lambda result: result.canonical_slug)
    downloaded = [result for result in results if result.downloaded_from_web]
    filenames = [result.downloaded_filename for result in downloaded]
    if len(filenames) != len(set(filenames)):
        raise RuntimeError("Duplicate downloaded filenames detected")
    hashes = [result.sha256 for result in downloaded]
    duplicate_hashes = {value for value in hashes if hashes.count(value) > 1}
    for result in downloaded:
        if result.sha256 in duplicate_hashes:
            result.notes = f"{result.notes} Suspected duplicate content hash: {result.sha256}.".strip()

    rows = [asdict(result) for result in results]
    for row in rows:
        row.pop("sha256", None)
        row.pop("candidates", None)
    write_csv(EXPORT_DIR / "manifest.csv", rows)
    unresolved_rows = [row for row in rows if not row["downloaded_from_web"]]
    write_csv(EXPORT_DIR / "unresolved.csv", unresolved_rows)
    (EXPORT_DIR / "README.txt").write_text(write_readme(results, generated_at), encoding="utf-8")
    write_json_manifest(results, generated_at)

    with zipfile.ZipFile(ZIP_PATH, "w", compression=zipfile.ZIP_DEFLATED) as archive:
        for path in sorted(LOGOS_DIR.rglob("*")):
            if path.is_file():
                archive.write(path, Path("logos") / path.relative_to(LOGOS_DIR))
        archive.write(EXPORT_DIR / "manifest.csv", "manifest.csv")
        archive.write(EXPORT_DIR / "README.txt", "README.txt")
        archive.write(EXPORT_DIR / "unresolved.csv", "unresolved.csv")

    print(json.dumps({
        "unique_ai_tools": len(results),
        "actual_web_downloads": len(downloaded),
        "official_logos_verified": sum(result.source_type == "official logo" for result in results),
        "official_favicon_fallbacks": sum(result.source_type == "official favicon fallback" for result in results),
        "unresolved": len(unresolved_rows),
        "existing_local_assets": 0,
        "suspected_duplicate_hashes": len(duplicate_hashes),
        "zip_path": str(ZIP_PATH),
        "zip_bytes": ZIP_PATH.stat().st_size,
        "json_manifest": str(JSON_PATH),
        "manifest_csv": str(EXPORT_DIR / "manifest.csv"),
        "unresolved_csv": str(EXPORT_DIR / "unresolved.csv"),
    }, indent=2))
    for row in unresolved_rows:
        print(f"UNRESOLVED\t{row['canonical_slug']}\t{row['notes']}")


if __name__ == "__main__":
    asyncio.run(main())
