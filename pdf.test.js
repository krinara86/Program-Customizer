import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createRequire } from 'module';

// Mock browser globals before loading pdf.js
globalThis.jspdf = { jsPDF: class {} };
globalThis.html2canvas = vi.fn();
globalThis.db = {};
globalThis.asanas = [];
globalThis.sadhakaNames = [];
globalThis.currentUser = null;
globalThis.CATEGORIES = [];
globalThis.DEFAULT_PRAYER_TEXT = '';
globalThis.DEFAULT_DIET_TEXT = '';
globalThis.DEFAULT_ROUTINE_TEXT = '';
globalThis.DEFAULT_MEDITATION_TEXT = '';
globalThis.DEFAULT_LIABILITY_TEXT = '';
globalThis.DEFAULT_REFERENCE_BOOKS_TEXT = '';
globalThis.firebase = { firestore: () => ({}) };

const require = createRequire(import.meta.url);
const { urlToDataUri, convertWebPtoPNG, getImageDimensions } = require('./pdf.js');

// ─── urlToDataUri ────────────────────────────────────────────────────────────

describe('urlToDataUri', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  it('returns a base64 data URI on successful fetch', async () => {
    const fakeBlob = new Blob(['fake-image'], { type: 'image/png' });

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      blob: () => Promise.resolve(fakeBlob),
    });

    const result = await urlToDataUri('https://example.com/image.png');

    expect(result).toMatch(/^data:image\/png;base64,/);
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });

  it('retries on failure and succeeds on a later attempt', async () => {
    const fakeBlob = new Blob(['fake-image'], { type: 'image/png' });

    globalThis.fetch = vi.fn()
      .mockRejectedValueOnce(new Error('network error'))
      .mockResolvedValueOnce({
        ok: true,
        blob: () => Promise.resolve(fakeBlob),
      });

    const result = await urlToDataUri('https://example.com/image.png', 3);

    expect(result).toMatch(/^data:/);
    expect(globalThis.fetch).toHaveBeenCalledTimes(2);
  });

  it('returns null after all retries are exhausted', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('network error'));

    const result = await urlToDataUri('https://example.com/image.png', 2);

    expect(result).toBeNull();
    expect(globalThis.fetch).toHaveBeenCalledTimes(2);
  });

  it('returns null when server responds with HTTP error', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
    });

    const result = await urlToDataUri('https://example.com/missing.png', 1);

    expect(result).toBeNull();
  });
});

// ─── convertWebPtoPNG ────────────────────────────────────────────────────────

describe('convertWebPtoPNG', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('converts a WebP data URI to PNG', async () => {
    const mockCtx = { drawImage: vi.fn() };
    const mockCanvas = {
      width: 0,
      height: 0,
      getContext: vi.fn().mockReturnValue(mockCtx),
      toDataURL: vi.fn().mockReturnValue('data:image/png;base64,converted'),
    };
    vi.spyOn(document, 'createElement').mockReturnValue(mockCanvas);

    const OriginalImage = globalThis.Image;
    globalThis.Image = class {
      constructor() {
        this.width = 100;
        this.height = 100;
      }
      set src(_) {
        setTimeout(() => this.onload(), 0);
      }
    };

    const result = await convertWebPtoPNG('data:image/webp;base64,abc');

    expect(result).toBe('data:image/png;base64,converted');
    expect(mockCanvas.getContext).toHaveBeenCalledWith('2d');
    expect(mockCtx.drawImage).toHaveBeenCalled();

    globalThis.Image = OriginalImage;
  });

  it('returns null when the image fails to load', async () => {
    const OriginalImage = globalThis.Image;
    globalThis.Image = class {
      set src(_) {
        setTimeout(() => this.onerror(new Error('load failed')), 0);
      }
    };

    const result = await convertWebPtoPNG('data:image/webp;base64,bad');

    expect(result).toBeNull();

    globalThis.Image = OriginalImage;
  });

  it('returns null when canvas conversion throws', async () => {
    const mockCanvas = {
      width: 0,
      height: 0,
      getContext: vi.fn().mockReturnValue({ drawImage: vi.fn() }),
      toDataURL: vi.fn().mockImplementation(() => { throw new Error('canvas tainted'); }),
    };
    vi.spyOn(document, 'createElement').mockReturnValue(mockCanvas);

    const OriginalImage = globalThis.Image;
    globalThis.Image = class {
      constructor() {
        this.width = 50;
        this.height = 50;
      }
      set src(_) {
        setTimeout(() => this.onload(), 0);
      }
    };

    const result = await convertWebPtoPNG('data:image/webp;base64,abc');

    expect(result).toBeNull();

    globalThis.Image = OriginalImage;
  });
});

// ─── getImageDimensions ──────────────────────────────────────────────────────

describe('getImageDimensions', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('returns actual image dimensions on success', async () => {
    const OriginalImage = globalThis.Image;
    globalThis.Image = class {
      set src(_) {
        this.width = 320;
        this.height = 240;
        setTimeout(() => this.onload(), 0);
      }
    };

    const dims = await getImageDimensions('data:image/png;base64,abc');

    expect(dims).toEqual({ width: 320, height: 240 });

    globalThis.Image = OriginalImage;
  });

  it('returns default 180x180 when image fails to load', async () => {
    const OriginalImage = globalThis.Image;
    globalThis.Image = class {
      set src(_) {
        setTimeout(() => this.onerror(new Error('bad image')), 0);
      }
    };

    const dims = await getImageDimensions('data:image/png;base64,bad');

    expect(dims).toEqual({ width: 180, height: 180 });

    globalThis.Image = OriginalImage;
  });
});
