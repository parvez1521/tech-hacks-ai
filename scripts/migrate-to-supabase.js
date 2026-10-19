#!/usr/bin/env node
/**
 * Tech Hacks AI — Migration Utility to Supabase
 *
 * Reads local JSON data and converts it to Supabase records.
 * Modes:
 *   node scripts/migrate-to-supabase.js --sql       # Generate SQL INSERT statements
 *   node scripts/migrate-to-supabase.js --dry-run   # Audit local records to migrate
 *   node scripts/migrate-to-supabase.js             # Migrate live over REST if env vars set
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { toDbRow, toDiscoveryDbRow } from '../server/storageAdapter.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const SUBMISSIONS_FILE = path.join(ROOT_DIR, 'data', 'submissions.json');
const PUBLISHED_FILE = path.join(ROOT_DIR, 'data', 'published-additions.json');
const DISCOVERIES_FILE = path.join(ROOT_DIR, 'data', 'discoveries.json');

function loadJson(file, defaultValue = []) {
  let lastParsed = null;
  for (let attempt = 0; attempt < 5; attempt++) {
    if (fs.existsSync(file)) {
      try {
        const raw = fs.readFileSync(file, 'utf8');
        if (raw.trim()) {
          const parsed = JSON.parse(raw);
          if (parsed && (Array.isArray(parsed) ? parsed.length > 0 : Object.keys(parsed).length > 0)) {
            return parsed;
          }
          lastParsed = parsed;
        }
      } catch (err) {
        // Atomic file swap in progress, retry
      }
    }
    const start = Date.now();
    while (Date.now() - start < 40) {}
  }
  return lastParsed !== null ? lastParsed : defaultValue;
}

const args = process.argv.slice(2);
const isSqlMode = args.includes('--sql');
const isDryRun = args.includes('--dry-run');

const submissions = loadJson(SUBMISSIONS_FILE, []);
const published = loadJson(PUBLISHED_FILE, { tools: [], guides: [], lastUpdated: '' });
const discoveries = loadJson(DISCOVERIES_FILE, []);

console.log('='.repeat(70));
console.log('Tech Hacks AI — Database Migration Assistant');
console.log('='.repeat(70));
console.log(`Found ${submissions.length} local submissions.`);
console.log(`Found ${(published.tools || []).length} published tools and ${(published.guides || []).length} published guides.`);
console.log(`Found ${discoveries.length} daily tool discoveries.`);

if (isSqlMode) {
  console.log('\n-- SQL Migration Script for Supabase SQL Editor:');
  console.log('-- Run this script inside the Supabase SQL Editor to seed existing data.\n');

  for (const sub of submissions) {
    const row = toDbRow(sub);
    const escapeSql = (val) => {
      if (val === null || val === undefined) return 'NULL';
      if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
      if (typeof val === 'object') return `'${JSON.stringify(val).replace(/'/g, "''")}'::jsonb`;
      return `'${String(val).replace(/'/g, "''")}'`;
    };

    console.log(
      `INSERT INTO public.techhacks_submissions (id, type, status, created_at, updated_at, tool_data, guide_data, potential_duplicate, duplicate_reason, duplicate_matches, moderator_notes, is_verified, published_slug, published_at)` +
      ` VALUES (${escapeSql(row.id)}, ${escapeSql(row.type)}, ${escapeSql(row.status)}, ${escapeSql(row.created_at)}, ${escapeSql(row.updated_at)}, ${escapeSql(row.tool_data)}, ${escapeSql(row.guide_data)}, ${escapeSql(row.potential_duplicate)}, ${escapeSql(row.duplicate_reason)}, ${escapeSql(row.duplicate_matches)}, ${escapeSql(row.moderator_notes)}, ${escapeSql(row.is_verified)}, ${escapeSql(row.published_slug)}, ${escapeSql(row.published_at)})` +
      ` ON CONFLICT (id) DO NOTHING;`
    );
  }

  console.log('\n-- Daily Discoveries & Featured Tools:');
  for (const disc of discoveries) {
    const row = toDiscoveryDbRow(disc);
    const escapeSql = (val) => {
      if (val === null || val === undefined) return 'NULL';
      if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
      return `'${String(val).replace(/'/g, "''")}'`;
    };

    console.log(
      `INSERT INTO public.techhacks_discoveries (id, name, description, website_url, image_url, category, is_featured, is_new, status, created_at, updated_at)` +
      ` VALUES (${escapeSql(row.id)}, ${escapeSql(row.name)}, ${escapeSql(row.description)}, ${escapeSql(row.website_url)}, ${escapeSql(row.image_url)}, ${escapeSql(row.category)}, ${escapeSql(row.is_featured)}, ${escapeSql(row.is_new)}, ${escapeSql(row.status)}, ${escapeSql(row.created_at)}, ${escapeSql(row.updated_at)})` +
      ` ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description, website_url = EXCLUDED.website_url, image_url = EXCLUDED.image_url, category = EXCLUDED.category, is_featured = EXCLUDED.is_featured, is_new = EXCLUDED.is_new, status = EXCLUDED.status, updated_at = NOW();`
    );
  }

  const pubJson = JSON.stringify(published).replace(/'/g, "''");
  console.log(
    `\nINSERT INTO public.techhacks_published_additions (key, data, updated_at)` +
    ` VALUES ('root', '${pubJson}'::jsonb, NOW())` +
    ` ON CONFLICT (key) DO UPDATE SET data = EXCLUDED.data, updated_at = NOW();\n`
  );

  console.log('-- End of migration SQL.');
  process.exit(0);
}

if (isDryRun) {
  console.log('\n[Dry Run] Inspection summary:');
  console.log(`- Submissions ready for sync: ${submissions.length}`);
  submissions.forEach((s, idx) => {
    const title = s.toolData?.name || s.guideData?.title || 'Unknown';
    console.log(`  ${idx + 1}. [${s.type.toUpperCase()}] ${title} (${s.id}) - Status: ${s.status}`);
  });
  console.log(`- Daily Discoveries ready for sync: ${discoveries.length}`);
  discoveries.forEach((d, idx) => {
    console.log(`  ${idx + 1}. [DISCOVERY] ${d.name} (${d.category || 'General'}) - Status: ${d.status}${d.isFeatured ? ' [FEATURED]' : ''}`);
  });
  console.log(`- Published additions ready for sync: Key 'root' with ${(published.tools || []).length} tools and ${(published.guides || []).length} guides.`);
  console.log('\nTo generate ready-to-run SQL: node scripts/migrate-to-supabase.js --sql');
  console.log('To sync directly over REST: set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY then run node scripts/migrate-to-supabase.js');
  process.exit(0);
}

// Live migration via Supabase REST
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('\n[Note] Neither SUPABASE_URL nor SUPABASE_SERVICE_ROLE_KEY are set.');
  console.log('To dump SQL statements instead, run:');
  console.log('  node scripts/migrate-to-supabase.js --sql');
  process.exit(0);
}

async function migrateLive() {
  console.log(`\nConnecting to Supabase at: ${supabaseUrl}...`);
  let syncedSubs = 0;

  for (const sub of submissions) {
    const row = toDbRow(sub);
    const res = await fetch(`${supabaseUrl.replace(/\/+$/, '')}/rest/v1/techhacks_submissions`, {
      method: 'POST',
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates',
      },
      body: JSON.stringify(row),
    });

    if (res.ok) {
      syncedSubs++;
    } else {
      const err = await res.text();
      console.error(`Failed to sync submission ${sub.id}:`, err);
    }
  }

  console.log(`Successfully synced ${syncedSubs}/${submissions.length} submissions.`);

  // Sync Discoveries
  let syncedDisc = 0;
  for (const disc of discoveries) {
    const row = toDiscoveryDbRow(disc);
    const res = await fetch(`${supabaseUrl.replace(/\/+$/, '')}/rest/v1/techhacks_discoveries`, {
      method: 'POST',
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates',
      },
      body: JSON.stringify(row),
    });

    if (res.ok) {
      syncedDisc++;
    } else {
      const err = await res.text();
      console.error(`Failed to sync discovery ${disc.id}:`, err);
    }
  }
  console.log(`Successfully synced ${syncedDisc}/${discoveries.length} daily tool discoveries.`);

  // Published additions
  const pubRes = await fetch(`${supabaseUrl.replace(/\/+$/, '')}/rest/v1/techhacks_published_additions`, {
    method: 'POST',
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates',
    },
    body: JSON.stringify({
      key: 'root',
      data: published,
      updated_at: new Date().toISOString(),
    }),
  });

  if (pubRes.ok) {
    console.log('Successfully synced published additions.');
  } else {
    const err = await pubRes.text();
    console.error('Failed to sync published additions:', err);
  }

  console.log('\nMigration complete!');
}

migrateLive().catch((err) => {
  console.error('Migration error:', err);
  process.exit(1);
});

