#!/usr/bin/env node

/**
 * update-firestore-urls.js
 *
 * Step 2 of Firebase → GitHub Pages migration.
 * Updates Firestore imageUrl fields to point to GitHub Pages.
 *
 * Run AFTER:
 *   1. All images are downloaded (download-and-compress.js)
 *   2. Images are pushed to GitHub (git add images/ && git commit && git push)
 *   3. GitHub Pages is enabled and serving the site
 *
 * USAGE:
 *   node update-firestore-urls.js --dry-run        # preview changes
 *   node update-firestore-urls.js                   # apply changes
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// ─── Config ──────────────────────────────────────────────────────────────────

const SERVICE_ACCOUNT_PATH = './serviceAccountKey.json';
const FIREBASE_BUCKET = 'sadhakacustomizer.appspot.com';
const IMAGES_DIR = './images';
const MAPPING_FILE = './images/_mapping.json';

// *** YOUR GITHUB PAGES BASE URL ***
// Repo: https://github.com/krinara86/Program-Customizer
// Pages URL: https://krinara86.github.io/Program-Customizer/
const GITHUB_PAGES_BASE = 'https://krinara86.github.io/Program-Customizer/images';

// ─── Parse CLI args ──────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const VERBOSE = args.includes('--verbose');

// ─── Initialize Firebase Admin ───────────────────────────────────────────────

let serviceAccount;
try {
  serviceAccount = require(SERVICE_ACCOUNT_PATH);
} catch (e) {
  console.error('\n❌ Could not find serviceAccountKey.json');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: FIREBASE_BUCKET,
});

const db = admin.firestore();

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║  Update Firestore URLs → GitHub Pages            ║');
  console.log('╚══════════════════════════════════════════════════╝');
  if (DRY_RUN) {
    console.log('\n🔍 DRY RUN MODE — no changes will be made.\n');
  }

  // Load mapping
  if (!fs.existsSync(MAPPING_FILE)) {
    console.error(`\n❌ Mapping file not found: ${MAPPING_FILE}`);
    console.error('   Run download-and-compress.js first.\n');
    process.exit(1);
  }

  const mapping = JSON.parse(fs.readFileSync(MAPPING_FILE, 'utf8'));
  const docIds = Object.keys(mapping);

  console.log(`Found ${docIds.length} asanas in mapping.`);
  console.log(`GitHub Pages base: ${GITHUB_PAGES_BASE}\n`);

  let updateCount = 0;
  let skipNoImage = 0;
  let skipNoFile = 0;
  let skipAlreadyDone = 0;
  let errorCount = 0;
  const errors = [];
  const updates = [];

  // Build list of updates needed
  for (const docId of docIds) {
    const entry = mapping[docId];
    const filename = entry.filename;
    const localPath = path.join(IMAGES_DIR, filename);

    // Skip if no image URL in original
    if (!entry.imageUrl) {
      skipNoImage++;
      continue;
    }

    // Skip if already pointing to GitHub Pages
    if (entry.imageUrl.includes('github.io')) {
      skipAlreadyDone++;
      continue;
    }

    // Skip if local file doesn't exist (wasn't downloaded)
    if (!fs.existsSync(localPath)) {
      skipNoFile++;
      if (VERBOSE) console.log(`  ⏭  ${entry.name} — no local file, skipping`);
      continue;
    }

    const newUrl = `${GITHUB_PAGES_BASE}/${encodeURIComponent(filename).replace(/%20/g, '%20')}`;
    updates.push({ docId, name: entry.name, newUrl });
  }

  console.log(`  To update:          ${updates.length}`);
  console.log(`  No image:           ${skipNoImage}`);
  console.log(`  Already on GitHub:  ${skipAlreadyDone}`);
  console.log(`  No local file:      ${skipNoFile}\n`);

  if (updates.length === 0) {
    console.log('✅ Nothing to update!');
    return;
  }

  // Apply updates in batches of 500 (Firestore batch limit)
  const BATCH_SIZE = 500;

  for (let i = 0; i < updates.length; i += BATCH_SIZE) {
    const batchUpdates = updates.slice(i, i + BATCH_SIZE);

    if (DRY_RUN) {
      batchUpdates.forEach(u => {
        console.log(`  📝 ${u.name}`);
        if (VERBOSE) console.log(`     → ${u.newUrl}`);
        updateCount++;
      });
    } else {
      const batch = db.batch();

      batchUpdates.forEach(u => {
        const ref = db.collection('asanas').doc(u.docId);
        batch.update(ref, { imageUrl: u.newUrl });
        if (VERBOSE) console.log(`  📝 ${u.name} → ${u.newUrl}`);
      });

      try {
        await batch.commit();
        updateCount += batchUpdates.length;
        console.log(`  ✅ Batch committed: ${batchUpdates.length} documents`);
      } catch (err) {
        errorCount += batchUpdates.length;
        errors.push(err.message);
        console.error(`  ❌ Batch failed: ${err.message}`);
      }
    }
  }

  // Summary
  console.log('\n══════════════════════════════════════════════════');
  console.log('  SUMMARY');
  console.log('══════════════════════════════════════════════════');
  console.log(`  Updated:    ${updateCount}`);
  console.log(`  Errors:     ${errorCount}`);

  if (DRY_RUN) {
    console.log('\n  This was a dry run. Run without --dry-run to apply changes.');
  } else if (errorCount === 0) {
    console.log('\n✅ All Firestore URLs now point to GitHub Pages!');
    console.log('   Your PDF downloads will now fetch images from GitHub instead of Firebase Storage.');
  }

  if (errors.length > 0) {
    console.log('\n  Errors:');
    errors.forEach(e => console.log(`    - ${e}`));
  }
  console.log('');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
