#!/usr/bin/env node

/**
 * download-and-compress.js
 *
 * Step 1 of Firebase → GitHub Pages migration.
 * Downloads asana images via Firebase Admin SDK, compresses them,
 * and saves to a local ./images/ folder ready to push to GitHub.
 *
 * Idempotent: skips images that already exist locally.
 * Safe to re-run daily until all images are captured.
 *
 * USAGE:
 *   node download-and-compress.js                  # download & compress
 *   node download-and-compress.js --verbose        # with detailed output
 *
 * AFTER RUNNING:
 *   git add images/
 *   git commit -m "Add compressed asana images"
 *   git push
 *
 * Then run: node update-firestore-urls.js
 */

const admin = require('firebase-admin');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

// ─── Config ──────────────────────────────────────────────────────────────────

const SERVICE_ACCOUNT_PATH = './serviceAccountKey.json';
const FIREBASE_BUCKET = 'sadhakacustomizer.appspot.com';
const OUTPUT_DIR = './images';
const MAX_DIMENSION = 400;
const JPEG_QUALITY = 80;
const CONCURRENCY = 3;

// ─── Parse CLI args ──────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const VERBOSE = args.includes('--verbose');

// ─── Initialize Firebase Admin ───────────────────────────────────────────────

let serviceAccount;
try {
  serviceAccount = require(SERVICE_ACCOUNT_PATH);
} catch (e) {
  console.error('\n❌ Could not find serviceAccountKey.json');
  console.error('   Download it from: Firebase Console → Project Settings → Service Accounts\n');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: FIREBASE_BUCKET,
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

// ─── Helpers ─────────────────────────────────────────────────────────────────

function extractStoragePath(url) {
  try {
    const urlObj = new URL(url);
    const encodedPath = urlObj.pathname.split('/o/')[1];
    if (!encodedPath) return null;
    return decodeURIComponent(encodedPath);
  } catch {
    return null;
  }
}

// Clean asana name into a safe filename
function makeFilename(asanaName, docId) {
  const clean = asanaName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 80);
  return `${clean}-${docId.substring(0, 8)}.jpg`;
}

async function downloadFromFirebase(imageUrl) {
  const storagePath = extractStoragePath(imageUrl);
  if (!storagePath) {
    throw new Error(`Cannot extract storage path from URL: ${imageUrl}`);
  }
  const file = bucket.file(storagePath);
  const [buffer] = await file.download();
  return buffer;
}

async function compressImage(buffer) {
  const image = sharp(buffer);
  const metadata = await image.metadata();
  const originalKB = (buffer.length / 1024).toFixed(1);

  const compressed = await image
    .resize(MAX_DIMENSION, MAX_DIMENSION, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .jpeg({ quality: JPEG_QUALITY })
    .toBuffer();

  const compressedKB = (compressed.length / 1024).toFixed(1);

  return {
    buffer: compressed,
    originalSize: buffer.length,
    compressedSize: compressed.length,
    summary: `${originalKB} KB → ${compressedKB} KB (${metadata.width}x${metadata.height} → max ${MAX_DIMENSION})`,
  };
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('╔══════════════════════════════════════════════════╗');
  console.log('║  Download & Compress Images for GitHub Pages     ║');
  console.log('╚══════════════════════════════════════════════════╝\n');

  // Create output directory
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Fetch all asana documents
  console.log('Fetching asana documents from Firestore...');
  const snapshot = await db.collection('asanas').get();
  const toDo = [];
  const alreadyLocal = [];
  const noImage = [];

  // Build a mapping file: docId → filename (needed by the URL update script)
  const mapping = {};

  snapshot.forEach((doc) => {
    const data = doc.data();
    const name = data.name || data.displayName || doc.id;
    const filename = makeFilename(name, doc.id);
    mapping[doc.id] = { name, filename, imageUrl: data.imageUrl || null };

    if (!data.imageUrl) {
      noImage.push(name);
    } else {
      const localPath = path.join(OUTPUT_DIR, filename);
      if (fs.existsSync(localPath)) {
        alreadyLocal.push(name);
      } else {
        toDo.push({ id: doc.id, name, imageUrl: data.imageUrl, filename });
      }
    }
  });

  // Save the mapping for the URL update script
  fs.writeFileSync(
    path.join(OUTPUT_DIR, '_mapping.json'),
    JSON.stringify(mapping, null, 2)
  );

  console.log(`  Total asanas:       ${snapshot.size}`);
  console.log(`  No image:           ${noImage.length}`);
  console.log(`  Already downloaded:  ${alreadyLocal.length}`);
  console.log(`  To download:        ${toDo.length}\n`);

  if (toDo.length === 0) {
    console.log('✅ All images already downloaded locally!');
    console.log(`\nNext steps:`);
    console.log(`  1. git add images/`);
    console.log(`  2. git commit -m "Add compressed asana images"`);
    console.log(`  3. git push`);
    console.log(`  4. node update-firestore-urls.js`);
    return;
  }

  // Process in batches
  let successCount = 0;
  let errorCount = 0;
  let totalOriginal = 0;
  let totalCompressed = 0;
  const errors = [];

  for (let i = 0; i < toDo.length; i += CONCURRENCY) {
    const batch = toDo.slice(i, i + CONCURRENCY);

    await Promise.allSettled(
      batch.map(async (doc) => {
        try {
          if (VERBOSE) console.log(`  ⬇  ${doc.name} — downloading...`);
          const originalBuffer = await downloadFromFirebase(doc.imageUrl);

          const result = await compressImage(originalBuffer);
          totalOriginal += result.originalSize;
          totalCompressed += result.compressedSize;

          if (VERBOSE) console.log(`  🗜  ${doc.name} — ${result.summary}`);

          // Save locally
          const outPath = path.join(OUTPUT_DIR, doc.filename);
          fs.writeFileSync(outPath, result.buffer);

          if (VERBOSE) console.log(`  💾 ${doc.name} → ${doc.filename}`);
          successCount++;
        } catch (err) {
          errorCount++;
          errors.push({ name: doc.name, error: err.message });
          if (VERBOSE) console.error(`  ❌ ${doc.name} — ${err.message}`);
        }
      })
    );

    if (!VERBOSE) {
      process.stdout.write(`\r  Processing [${Math.min(i + CONCURRENCY, toDo.length)}/${toDo.length}]...`);
    }
  }

  if (!VERBOSE) process.stdout.write('\n');

  // Summary
  console.log('\n══════════════════════════════════════════════════');
  console.log('  SUMMARY');
  console.log('══════════════════════════════════════════════════');
  console.log(`  Downloaded & compressed:  ${successCount}`);
  console.log(`  Already had locally:      ${alreadyLocal.length}`);
  console.log(`  Errors:                   ${errorCount}`);

  if (totalOriginal > 0) {
    const savings = ((1 - totalCompressed / totalOriginal) * 100).toFixed(1);
    console.log(`  Original total:           ${formatBytes(totalOriginal)}`);
    console.log(`  Compressed total:         ${formatBytes(totalCompressed)}`);
    console.log(`  Savings:                  ${savings}%`);
  }

  const totalLocal = successCount + alreadyLocal.length;
  const totalWithImages = toDo.length + alreadyLocal.length;
  console.log(`\n  Local images: ${totalLocal} / ${totalWithImages}`);

  if (errorCount > 0) {
    console.log(`\n  ⚠️  ${errorCount} images failed. Run this script again tomorrow`);
    console.log(`     (quota resets daily) — it will pick up where it left off.`);
    console.log('\n  Failed:');
    errors.forEach(e => console.log(`    - ${e.name}: ${e.error}`));
  }

  if (totalLocal === totalWithImages) {
    console.log('\n✅ ALL images downloaded!');
  }

  console.log(`\nNext steps:`);
  console.log(`  1. git add images/`);
  console.log(`  2. git commit -m "Add compressed asana images"`);
  console.log(`  3. git push`);
  if (errorCount > 0) {
    console.log(`  4. Wait a day, run this script again for remaining ${errorCount} images`);
  }
  console.log(`  ${errorCount > 0 ? '5' : '4'}. node update-firestore-urls.js`);
  console.log('');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
