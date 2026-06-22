import { describe, it, expect } from 'vitest';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const {
  ASANA_ARRAY_FIELDS,
  findSadhakasUsingAsana,
  buildDeleteConfirmationMessage,
} = require('./asana-delete.js');

// ─── Helpers ─────────────────────────────────────────────────────────────────

// Build a Firestore-like QueryDocumentSnapshot.
function mockDoc(id, data) {
  return { id, data: () => data };
}

// ─── findSadhakasUsingAsana ──────────────────────────────────────────────────

describe('findSadhakasUsingAsana', () => {
  it('returns sadhakas that reference the asana', () => {
    const docs = [
      mockDoc('Krishna', {
        name: 'Krishna',
        cardioDiv: [{ asanaName: 'Trikonasana' }, { asanaName: 'Virasana' }],
      }),
      mockDoc('Sreeram', {
        name: 'Sreeram',
        nonCardioDiv: [{ asanaName: 'Yogamudrasana' }],
      }),
      mockDoc('Maya', {
        name: 'Maya',
        meditativeDiv: [{ asanaName: 'Trikonasana' }],
      }),
    ];

    expect(findSadhakasUsingAsana('Trikonasana', docs)).toEqual(['Krishna', 'Maya']);
  });

  it('returns an empty array when no sadhaka uses the asana', () => {
    const docs = [
      mockDoc('Krishna', { name: 'Krishna', cardioDiv: [{ asanaName: 'Virasana' }] }),
    ];
    expect(findSadhakasUsingAsana('Tolasana', docs)).toEqual([]);
  });

  it('detects usage across every asana-array field', () => {
    const docs = ASANA_ARRAY_FIELDS.map((field, i) =>
      mockDoc(`S${i}`, { name: `S${i}`, [field]: [{ asanaName: 'Sukhasana' }] })
    );
    const users = findSadhakasUsingAsana('Sukhasana', docs);
    expect(users).toHaveLength(ASANA_ARRAY_FIELDS.length);
  });

  it('does not double-count a sadhaka that uses the asana in multiple sections', () => {
    const docs = [
      mockDoc('Krishna', {
        name: 'Krishna',
        cardioDiv: [{ asanaName: 'Virasana' }],
        nonCardioDiv: [{ asanaName: 'Virasana' }],
      }),
    ];
    expect(findSadhakasUsingAsana('Virasana', docs)).toEqual(['Krishna']);
  });

  it('matches exactly and is case-sensitive', () => {
    const docs = [
      mockDoc('Krishna', { name: 'Krishna', cardioDiv: [{ asanaName: 'Virasana' }] }),
    ];
    expect(findSadhakasUsingAsana('virasana', docs)).toEqual([]);
    expect(findSadhakasUsingAsana('Vira', docs)).toEqual([]);
  });

  it('falls back to the doc id when the data has no name', () => {
    const docs = [mockDoc('LegacyId', { cardioDiv: [{ asanaName: 'Virasana' }] })];
    expect(findSadhakasUsingAsana('Virasana', docs)).toEqual(['LegacyId']);
  });

  it('handles plain (already-unwrapped) objects as well as snapshots', () => {
    const plain = [{ name: 'Krishna', cardioDiv: [{ asanaName: 'Virasana' }] }];
    expect(findSadhakasUsingAsana('Virasana', plain)).toEqual(['Krishna']);
  });

  it('tolerates missing fields, non-array fields, and null entries', () => {
    const docs = [
      mockDoc('A', { name: 'A' }), // no asana arrays at all
      mockDoc('B', { name: 'B', cardioDiv: 'not-an-array' }),
      mockDoc('C', { name: 'C', cardioDiv: [null, { asanaName: 'Virasana' }] }),
    ];
    expect(findSadhakasUsingAsana('Virasana', docs)).toEqual(['C']);
  });

  it('returns [] for falsy asana names or non-array input', () => {
    expect(findSadhakasUsingAsana('', [])).toEqual([]);
    expect(findSadhakasUsingAsana(null, [])).toEqual([]);
    expect(findSadhakasUsingAsana('Virasana', null)).toEqual([]);
  });
});

// ─── buildDeleteConfirmationMessage ──────────────────────────────────────────

describe('buildDeleteConfirmationMessage', () => {
  it('produces a plain confirmation when the asana is unused', () => {
    const msg = buildDeleteConfirmationMessage('Tolasana', []);
    expect(msg).toContain('Tolasana');
    expect(msg).toContain('cannot be undone');
    expect(msg).not.toContain('⚠️');
  });

  it('warns and lists the sadhaka names when the asana is in use', () => {
    const msg = buildDeleteConfirmationMessage('Trikonasana', ['Krishna', 'Maya']);
    expect(msg).toContain('⚠️');
    expect(msg).toContain('2 Sadhaka(s)');
    expect(msg).toContain('Krishna, Maya');
    expect(msg).toContain('will NOT be modified');
  });
});
