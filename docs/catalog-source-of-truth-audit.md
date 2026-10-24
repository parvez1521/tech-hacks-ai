# SwitchRoute catalog source-of-truth audit

Checked 2026-10-24 against the current local registries. Counts below are derived from repository data; this audit does not claim that every provider's live terms were rechecked today.

## Catalog counts

| Metric | Definition and calculation | Source | Count |
| --- | --- | --- | ---: |
| AI tools and platforms | Unique non-community tool slugs returned by `getAllAiTools()` | `src/data/aiToolsData.ts`, `src/services/aiCatalogService.ts` | 75 |
| Open-source projects | Unique `toolsData` slugs | `src/data/seedData.ts` | 27 |
| Proprietary/paid targets | Unique target slugs in the proprietary alternatives registry | `src/data/alternatives.ts` | 25 |
| Catalog identities | Union of open-source project, AI tool, and proprietary target slugs | `src/services/aiCatalogService.ts#getCatalogStats` | 121 |
| Distinct alternative relationships | Unique directed `(alternative slug, target slug)` pairs from tool declarations and `aiAlternativeMappings`, with both slugs validated against known records | `src/data/seedData.ts`, `src/data/aiToolsData.ts`, `src/data/aiAlternativeMappings.ts`, `src/services/aiCatalogService.ts#getCatalogStats` | 224 |
| Proprietary targets with alternatives | Distinct proprietary target slugs among those validated relationships | Same relationship calculation above | 25 |
| Prompt records | Unique slugs across 48 original records and PromptFeed's generated index; duplicates count once | `src/data/promptsData.ts`, `data/promptfeed-import.json`, `data/promptfeed-catalog-index.json`, `data/promptfeed-catalog-count.json` | 582 |
| Image prompts | Distinct prompt slugs classified as image from explicit `mediaType` or recognized image categories | `scripts/generate-prompt-sitemap.mjs`, `data/prompt-media-counts.json` | 548 |
| Video prompts | Distinct prompt slugs classified as video from explicit `mediaType` or recognized video categories | Same media classification and generated count | 12 |
| Nonvisual prompts | Unique prompt slugs minus classified image and video prompt slugs | Same generated count | 22 |
| Everyday utilities | Normalized built-in utility registry records | `src/data/freeToolsData.ts`, `src/services/aiCatalogService.ts#getAllFreeTools` | 38 |

AI, project, target, and utility slug counts have no duplicate slugs in their current static registries. The 224 relationship count is a mapping count, not a product count.

## Offers and promotions

As of **2026-10-24**, `offersData.ts` contains **31 unique offers**. Applying `isOfferActive(offer, new Date('2026-10-24T12:00:00Z'))` gives **30 status-valid offers**, **1 pending-verification offer**, and **0 expired or archived-expired offers**. 29 active records have no explicit `validUntil`; 1 has a valid future expiry date. The only explicit expiry is 2026-12-31. None of the dates are malformed. Claim URLs are unique, terms URLs are unique, and the schema has no coupon-code field.

I revisited the provider claim and terms pages for the active records and the pending Figma Education record. The 30 active entries retain their existing `verified-active` or `limited-time` status, subject to each provider's eligibility and regional terms. Figma remains pending because the current offer could not be independently established from the reviewed sources; it is excluded from the homepage total. No record was classified as expired. GitHub's Student Developer Pack Copilot benefit and general Copilot Free plan have distinct eligibility/benefit descriptions, so they remain separate; no repeated promotion URL or coupon code was found.

Each row links to the official claim and terms source used for review. The older JetBrains terms URL returned 404 and now points to its current Student Pack page, which states eligibility, renewal, and non-commercial-use conditions. The old Anthropic help-center terms URL could not be fetched directly; Anthropic search results identified the current plan article, while the live official Legal Center links its consumer terms, which now back the terms field.

| Offer | Review result | Expiry | Official evidence |
|---|---|---|---|
| Reliance Jio & Google: Reliance Jio + Google AI Pro | Verified active | No stated expiry | [claim](https://www.jio.com/google-gemini-offer/) · [terms](https://www.jio.com/jcms/en-in/jio-google-gemini-terms-and-conditions/) |
| Google: Google AI Plus Student Plan — India | Verified active | 2026-12-31 | [claim](https://gemini.google/in/students/) · [terms](https://gemini.google/in/students/) |
| GitHub & Microsoft: GitHub Student Developer Pack (Free Copilot Individual) | Verified active | No stated expiry | [claim](https://education.github.com/pack) · [terms](https://docs.github.com/en/copilot/how-tos/copilot-on-github/set-up-copilot/enable-copilot/set-up-for-students) |
| Perplexity AI: Perplexity Education Pro (Student & Faculty Discount) | Verified active | No stated expiry | [claim](https://www.perplexity.ai/pro) · [terms](https://www.perplexity.ai/help-center/en/articles/12590157-what-is-education-pro) |
| Microsoft: Microsoft for Startups (Azure Credits) | Verified active | No stated expiry | [claim](https://www.microsoft.com/en-us/startups) · [terms](https://learn.microsoft.com/en-us/startups/overview) |
| Amazon Web Services: AWS Activate Credits for Startups | Verified active | No stated expiry | [claim](https://aws.amazon.com/activate/) · [terms](https://aws.amazon.com/activate/terms/) |
| JetBrains: JetBrains Student Pack | Verified active | No stated expiry | [claim](https://www.jetbrains.com/community/education/#students) · [terms](https://www.jetbrains.com/academy/student-pack/) |
| Notion: Notion for Education (Free Plus Plan for Students & Educators) | Verified active | No stated expiry | [claim](https://www.notion.com/help/notion-for-education) · [terms](https://www.notion.com/help/notion-for-education) |
| GitHub & Microsoft: GitHub Copilot Free (Ongoing Public Free Tier) | Verified active | No stated expiry | [claim](https://github.com/features/copilot) · [terms](https://docs.github.com/en/copilot/about-github-copilot/subscription-plans-for-github-copilot) |
| Microsoft: Microsoft Azure for Students ($100 USD Credit + Free AI Services) | Verified active | No stated expiry | [claim](https://azure.microsoft.com/en-us/free/students/) · [terms](https://azure.microsoft.com/en-us/pricing/offers/ms-azr-0170p/) |
| Figma: Figma for Education (Free Professional Plan) | Pending: validity unclear | No stated expiry | [claim](https://www.figma.com/education/) · [terms](https://help.figma.com/hc/en-us/articles/360041061214-Verify-education-status) |
| Adobe: Adobe Creative Cloud Student & Teacher Discount — India | Verified active | No stated expiry | [claim](https://www.adobe.com/in/creativecloud/buy/students.html) · [terms](https://www.adobe.com/in/offer-terms/ccm-ste-introductory.html) |
| Google Cloud: Google for Startups Cloud Program (AI Startup Tier) | Verified active | No stated expiry | [claim](https://cloud.google.com/startup/ai) · [terms](https://cloud.google.com/startup/ai) |
| Canva: Canva for Education & Campus (Free Classroom Suite) | Verified active | No stated expiry | [claim](https://www.canva.com/education/) · [terms](https://www.canva.com/education/eligibility-guidelines/) |
| Cursor: Cursor Hobby (Free Plan) | Verified active | No stated expiry | [claim](https://cursor.com/pricing) · [terms](https://cursor.com/pricing) |
| Google: Google AI Studio and Gemini API Free Tier | Verified active | No stated expiry | [claim](https://aistudio.google.com/) · [terms](https://ai.google.dev/gemini-api/docs/pricing) |
| Cloudflare: Cloudflare Workers Free Plan | Verified active | No stated expiry | [claim](https://developers.cloudflare.com/workers/) · [terms](https://developers.cloudflare.com/workers/platform/pricing/) |
| Vercel: Vercel Hobby Plan | Verified active | No stated expiry | [claim](https://vercel.com/docs/plans/hobby) · [terms](https://vercel.com/docs/plans/hobby) |
| OpenAI: ChatGPT Free Plan | Verified active | No stated expiry | [claim](https://openai.com/chatgpt/pricing/) · [terms](https://openai.com/policies/terms-of-use/) |
| Anthropic: Claude Free Plan | Verified active | No stated expiry | [claim](https://www.anthropic.com/pricing) · [terms](https://www.anthropic.com/legal/consumer-terms) |
| Perplexity: Perplexity Standard Free Plan | Verified active | No stated expiry | [claim](https://www.perplexity.ai/) · [terms](https://www.perplexity.ai/help-center/en/articles/11187416-which-perplexity-subscription-plan-is-right-for-you) |
| Groq: GroqCloud Free Developer Tier | Verified active | No stated expiry | [claim](https://console.groq.com/) · [terms](https://console.groq.com/docs/rate-limits) |
| Supabase: Supabase Free Plan | Verified active | No stated expiry | [claim](https://supabase.com/pricing) · [terms](https://supabase.com/docs/guides/platform/billing-on-supabase) |
| Google Firebase: Firebase Spark Plan | Verified active | No stated expiry | [claim](https://firebase.google.com/pricing) · [terms](https://firebase.google.com/docs/projects/billing/firebase-pricing-plans) |
| MongoDB: MongoDB Atlas Free Cluster | Verified active | No stated expiry | [claim](https://www.mongodb.com/pricing) · [terms](https://www.mongodb.com/docs/atlas/reference/free-shared-limitations/) |
| Google Cloud: Google Cloud Free Trial Credit | Verified active | No stated expiry | [claim](https://cloud.google.com/free) · [terms](https://docs.cloud.google.com/free/docs/free-cloud-features) |
| Oracle: Oracle Cloud Free Tier | Verified active | No stated expiry | [claim](https://www.oracle.com/cloud/free/) · [terms](https://www.oracle.com/cloud/free/faq/) |
| Neon: Neon Free Plan | Verified active | No stated expiry | [claim](https://neon.com/pricing) · [terms](https://neon.com/blog/neon-free-plan-1-gb-per-project) |
| Turso: Turso Free Plan | Verified active | No stated expiry | [claim](https://turso.tech/pricing) · [terms](https://turso.tech/pricing) |
| IBM Cloud: IBM Cloud Lite Plans | Verified active | No stated expiry | [claim](https://www.ibm.com/cloud/free) · [terms](https://cloud.ibm.com/docs/overview?topic=overview-tutorial-try-for-free) |
| Runway: Runway Student & Educator Discount | Verified active | No stated expiry | [claim](https://runway.com/educators) · [terms](https://help.runwayml.com/hc/en-us/articles/48154114602259-Student-and-Educator-Discounts) |

Homepage metrics read `getActiveOffers().length` from the offer source. The three offer cards remain the featured subset; the count and route label represent all active entries. The count is **30**, not the total record count.

## AI video inspiration collection

The existing Prompt Library has 12 video prompts (part of the 582 prompt records). The separate `public/video-inspiration.json` collection adds 21 curated external video examples and 4 tutorial/template links. These are separate counts and are never merged into the prompt count. Each entry has a stable local ID, publisher/creator attribution, platform/model, content type, source URL, prompt availability flag, and check date.

No third-party video is embedded, downloaded, or rehosted. No external thumbnail is hotlinked. The cards link to official source pages only; the source page provides the video where indicated. Embedding permission is recorded as unconfirmed and no embed URL is stored. Public prompts remain at their publisher's source rather than being copied into this site. All seven unique official source pages used by the 25 entries were checked on 2026-10-24.

Sources used:

- Google Veo prompt guide and generated video examples: <https://ai.google.dev/gemini-api/docs/veo?hl=en>
- ByteDance Seed's Seedance 2.5 examples and workflows: <https://seed.bytedance.com/en/blog/one-take-creation-flexible-referencing-introducing-seedance-2-5>
- Runway Gen-4.5 prompt/video examples: <https://runway.com/research/introducing-runway-gen-4.5>
- Luma Ray 3.14 examples: <https://lumalabs.ai/news/ray3_14>
- Higgsfield Academy evaluation tutorial: <https://higgsfield.ai/academy/courses/seedance-25-ai-filmmaking/set-the-test>
- Runway Gen-4 workflow guide: <https://help.runwayml.com/hc/en-us/articles/37327109429011-Creating-with-Gen-4-Video>
- Luma Dream Machine quick start: <https://lumalabs.ai/learning-hub/web-quick-start>

The original Sora research page was not included as a current tool example because OpenAI now marks the Sora product unavailable: <https://openai.com/index/sora/>. Kling's official Explore gallery is public, but the pages exposed in this review did not provide stable individual creator/source links for its cards; no Kling user media was copied or curated into this batch: <https://kling.ai/explore/klingai_videos>.

## Verified follow-up catalog candidates; not added

No AI tool or offer records were added in this pass. The current AI registry already includes Runway, Luma Dream Machine, Kling AI, Higgsfield, and Wan. The following focused content review has stronger value than broad expansion:

1. **Update the existing Runway record's model/version copy.** It still names Gen-3 Alpha, while Runway's current official research/product source identifies Gen-4.5 as its video model: <https://runway.com/research/introducing-runway-gen-4.5>. Review the free plan and pricing claims separately before changing those fields.
2. **Review ByteDance Seedance 2.5 as a distinct directory candidate.** Seed's official launch page describes Seedance 2.5 and its access paths; determine whether the SwitchRoute record should represent the model, the hosting products, or both before adding a canonical route: <https://seed.bytedance.com/en/seedance2_5>.
3. **Refresh the existing Google video-model coverage.** Veo 3.1 has an official model/API guide with prompt examples; confirm which existing Google catalog record owns it before adding or renaming a product record: <https://ai.google.dev/gemini-api/docs/veo?hl=en>.

The verified Runway student and educator discount was added as one distinct offer. It has no coupon code or fixed expiration in the official source, so it is listed as an ongoing verified discount with a 25% value, explicit geographic exclusions, renewal/re-verification conditions, and the official claim and terms URLs. No other new offer was added: duplicate eligibility offers and time-limited terms need provider-by-provider confirmation, especially for the 29 existing active records without an explicit end date.
