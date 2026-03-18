#!/usr/bin/env node

/**
 * compress-and-reupload.js
 *
 * Downloads all asana images from Firebase Storage, compresses them
 * (max 400x400, JPEG 80%), re-uploads them, and updates the Firestore
 * document's imageUrl to point to the new compressed version.
 *
 * BEFORE RUNNING:
 * 1. Go to Firebase Console → Project Settings → Service Accounts
 * 2. Click "Generate new private key" → save as serviceAccountKey.json
 *    in the same folder as this script
 * 3. Run:
 *      npm install firebase-admin sharp
 *      node compress-and-reupload.js
 *
 * OPTIONS:
 *   --dry-run     Show what would happen without changing anything
 *   --verbose     Show detailed progress for each image
 *
 * Example:
 *   node compress-and-reupload.js --dry-run      # preview first
 *   node compress-and-reupload.js                 # do it for real
 */

const admin = require('firebase-admin');
const sharp = require('sharp');
const path = require('path');
const { URL } = require('url');

// ─── Config ──────────────────────────────────────────────────────────────────

const SERVICE_ACCOUNT_PATH = './serviceAccountKey.json';
const STORAGE_BUCKET = 'sadhakacustomizer.appspot.com';
const MAX_DIMENSION = 400;    // Max width or height in pixels
const JPEG_QUALITY = 80;      // 1–100
const CONCURRENCY = 3;        // Parallel uploads (be gentle with free tier)

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
  console.error('   Download it from: Firebase Console → Project Settings → Service Accounts');
  console.error('   Save it in the same folder as this script.\n');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: STORAGE_BUCKET,
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

// ─── Helpers ─────────────────────────────────────────────────────────────────

// Extract the storage file path from a Firebase Storage public URL.
// URL format: https://firebasestorage.googleapis.com/v0/b/BUCKET/o/ENCODED_PATH?alt=media&token=...
function extractStoragePath(url) {
  const urlObj = new URL(url);
  const encodedPath = urlObj.pathname.split('/o/')[1];
  if (!encodedPath) return null;
  return decodeURIComponent(encodedPath);
}

// Download via the Admin SDK (bucket.file().download()), which uses
// service account credentials and does NOT count against the public
// download quota / rate limits that cause 402/403 errors.
async function downloadImage(url) {
  const storagePath = extractStoragePath(url);
  if (!storagePath) {
    throw new Error(`Cannot extract storage path from URL: ${url}`);
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
      fit: 'inside',          // Preserve aspect ratio, fit within box
      withoutEnlargement: true // Don't upscale small images
    })
    .jpeg({ quality: JPEG_QUALITY })
    .toBuffer();

  const compressedKB = (compressed.length / 1024).toFixed(1);

  return {
    buffer: compressed,
    originalSize: buffer.length,
    compressedSize: compressed.length,
    originalDimensions: `${metadata.width}x${metadata.height}`,
    summary: `${originalKB} KB → ${compressedKB} KB (${metadata.width}x${metadata.height} → max ${MAX_DIMENSION})`
  };
}

async function uploadCompressed(buffer, originalUrl) {
  const originalPath = extractStoragePath(originalUrl);
  if (!originalPath) {
    throw new Error(`Cannot extract storage path from URL: ${originalUrl}`);
  }

  // Upload to a compressed/ subfolder to keep originals intact
  const ext = path.extname(originalPath);
  const baseName = path.basename(originalPath, ext);
  const dirName = path.dirname(originalPath);
  const compressedPath = `${dirName}/compressed/${baseName}.jpg`;

  const file = bucket.file(compressedPath);
  await file.save(buffer, {
    metadata: {
      contentType: 'image/jpeg',
      metadata: {
        originalPath: originalPath,
        compressedAt: new Date().toISOString(),
      }
    },
  });

  // Make publicly readable
  await file.makePublic();

  // Return the public URL
  const publicUrl = `https://storage.googleapis.com/${STORAGE_BUCKET}/${encodeURIComponent(compressedPath).replace(/%2F/g, '/')}`;
  return publicUrl;
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║   Firebase Image Compress & Re-upload Tool   ║');
  console.log('╚══════════════════════════════════════════════╝');
  if (DRY_RUN) {
    console.log('\n🔍 DRY RUN MODE — no changes will be made.\n');
  }

  // 1. Fetch all asana documents with imageUrls
  console.log('Fetching asana documents from Firestore...');
  const snapshot = await db.collection('asanas').get();
  const asanaDocs = [];

  snapshot.forEach((doc) => {
    const data = doc.data();
    if (data.imageUrl) {
      asanaDocs.push({ id: doc.id, name: data.name || data.displayName || doc.id, imageUrl: data.imageUrl });
    }
  });

  console.log(`Found ${asanaDocs.length} asanas with images (${snapshot.size} total asanas).\n`);

  if (asanaDocs.length === 0) {
    console.log('Nothing to do.');
    return;
  }

  // 2. Process in batches
  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;
  let totalOriginalBytes = 0;
  let totalCompressedBytes = 0;
  const errors = [];

  for (let i = 0; i < asanaDocs.length; i += CONCURRENCY) {
    const batch = asanaDocs.slice(i, i + CONCURRENCY);
    const progress = `[${Math.min(i + CONCURRENCY, asanaDocs.length)}/${asanaDocs.length}]`;

    const results = await Promise.allSettled(
      batch.map(async (doc) => {
        try {
          // Skip if already compressed by a previous run of this script
          if (doc.imageUrl.includes('/compressed/')) {
            if (VERBOSE) console.log(`  ⏭  ${doc.name} — already compressed, skipping`);
            skipCount++;
            return;
          }

          // Download
          if (VERBOSE) console.log(`  ⬇  ${doc.name} — downloading...`);
          const originalBuffer = await downloadImage(doc.imageUrl);

          // Compress
          const result = await compressImage(originalBuffer);
          totalOriginalBytes += result.originalSize;
          totalCompressedBytes += result.compressedSize;

          if (VERBOSE) console.log(`  🗜  ${doc.name} — ${result.summary}`);

          if (DRY_RUN) {
            successCount++;
            return;
          }

          // Upload compressed version
          const newUrl = await uploadCompressed(result.buffer, doc.imageUrl);
          if (VERBOSE) console.log(`  ⬆  ${doc.name} — uploaded compressed version`);

          // Update Firestore
          await db.collection('asanas').doc(doc.id).update({ imageUrl: newUrl });
          if (VERBOSE) console.log(`  ✅ ${doc.name} — Firestore updated`);

          successCount++;
        } catch (err) {
          errorCount++;
          errors.push({ name: doc.name, error: err.message });
          console.error(`  ❌ ${doc.name} — ${err.message}`);
        }
      })
    );

    if (!VERBOSE) {
      process.stdout.write(`\r  Processing ${progress}...`);
    }
  }

  if (!VERBOSE) process.stdout.write('\n');

  // 3. Summary
  console.log('\n══════════════════════════════════════════════');
  console.log('  SUMMARY');
  console.log('══════════════════════════════════════════════');
  console.log(`  Processed:  ${successCount}`);
  console.log(`  Skipped:    ${skipCount}`);
  console.log(`  Errors:     ${errorCount}`);
  if (totalOriginalBytes > 0) {
    const savings = ((1 - totalCompressedBytes / totalOriginalBytes) * 100).toFixed(1);
    console.log(`  Original:   ${formatBytes(totalOriginalBytes)}`);
    console.log(`  Compressed: ${formatBytes(totalCompressedBytes)}`);
    console.log(`  Savings:    ${savings}%`);
  }
  if (DRY_RUN) {
    console.log('\n  This was a dry run. Run without --dry-run to apply changes.');
  }
  if (errors.length > 0) {
    console.log('\n  Failed images:');
    errors.forEach(e => console.log(`    - ${e.name}: ${e.error}`));
  }
  console.log('');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});