// ===========================
// Asana Deletion Helpers
// ===========================
//
// Pure, side-effect-free logic for deleting asanas. This is the canonical copy,
// covered by asana-delete.test.js.
//
// IMPORTANT: asana-adder.html inlines an identical copy of findSadhakasUsingAsana
// and buildDeleteConfirmationMessage (so the page works even where this sibling
// file isn't served). If you change the logic here, change it there too.

// Fields on a sadhaka document that hold arrays of asana references.
// These mirror the asana-type sections in config.js (CATEGORIES).
const ASANA_ARRAY_FIELDS = [
  'jointsAndGlandsDiv',
  'cardioDiv',
  'nonCardioDiv',
  'relaxationDiv',
  'meditativeDiv',
  'breathingDiv',
  'pranayamaDiv',
  'meditationDiv',
];

// Given an asana name and a list of sadhaka documents, return the names of the
// sadhakas that reference that asana in any of their asana-array fields.
//
// sadhakaDocs may be Firestore QueryDocumentSnapshots (with .id and .data())
// or plain objects (already-unwrapped data). Matching on asanaName is exact,
// because that is exactly how the value is stored when an asana is selected
// (option.value === asana.name; see asana.js).
function findSadhakasUsingAsana(asanaName, sadhakaDocs, fields = ASANA_ARRAY_FIELDS) {
  if (!asanaName || !Array.isArray(sadhakaDocs)) return [];

  const users = [];

  for (const doc of sadhakaDocs) {
    const data = doc && typeof doc.data === 'function' ? doc.data() : doc;
    if (!data) continue;

    const sadhakaName = data.name || (doc && doc.id) || '(unnamed)';

    const usesAsana = fields.some(field => {
      const arr = data[field];
      return Array.isArray(arr) && arr.some(entry => entry && entry.asanaName === asanaName);
    });

    if (usesAsana) users.push(sadhakaName);
  }

  return users;
}

// Build the confirmation message shown before deleting an asana.
// `users` is the array returned by findSadhakasUsingAsana.
function buildDeleteConfirmationMessage(asanaName, users) {
  if (users && users.length > 0) {
    const list = users.join(', ');
    return (
      `⚠️ "${asanaName}" is used by ${users.length} Sadhaka(s): ${list}.\n\n` +
      `Deleting it will leave broken references in their programs. ` +
      `Those Sadhakas will NOT be modified.\n\nDelete anyway?`
    );
  }
  return `Are you sure you want to delete "${asanaName}"? This cannot be undone.`;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ASANA_ARRAY_FIELDS,
    findSadhakasUsingAsana,
    buildDeleteConfirmationMessage,
  };
}
