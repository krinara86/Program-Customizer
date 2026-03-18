import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createRequire } from 'module';

// ─── Mock browser globals before loading pdf.js ──────────────────────────────

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
const {
  urlToDataUri,
  convertWebPtoPNG,
  getImageDimensions,
  prefetchAllImages,
  fetchAndConvertImage,
  addImagePlaceholder,
  normalizeText,
  loadAsanasForPdf,
  addAsanaContent,
} = require('./pdf.js');

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeMockPdf() {
  const calls = [];
  return {
    _calls: calls,
    internal: { pageSize: { width: 595, height: 842 } },
    setFillColor: vi.fn((...args) => calls.push({ fn: 'setFillColor', args })),
    setDrawColor: vi.fn((...args) => calls.push({ fn: 'setDrawColor', args })),
    setLineWidth: vi.fn((...args) => calls.push({ fn: 'setLineWidth', args })),
    setFontSize: vi.fn((...args) => calls.push({ fn: 'setFontSize', args })),
    setFont: vi.fn((...args) => calls.push({ fn: 'setFont', args })),
    setTextColor: vi.fn((...args) => calls.push({ fn: 'setTextColor', args })),
    rect: vi.fn((...args) => calls.push({ fn: 'rect', args })),
    text: vi.fn((...args) => calls.push({ fn: 'text', args })),
    addImage: vi.fn((...args) => calls.push({ fn: 'addImage', args })),
    addPage: vi.fn(() => calls.push({ fn: 'addPage' })),
    circle: vi.fn((...args) => calls.push({ fn: 'circle', args })),
    splitTextToSize: vi.fn((text, width) => [text]),
  };
}

function makeColors() {
  return {
    primaryPurple: [122, 149, 168],
    lavenderAccent: [187, 201, 210],
    textDark: [58, 58, 58],
    textMuted: [116, 138, 153],
    whiteBg: [255, 255, 255],
    borderBeige: [231, 217, 203],
    borderLight: [187, 201, 210],
    cardBg: [255, 255, 255],
  };
}

function makeAsanaDiv(name) {
  // Minimal DOM-like object that addAsanaContent can traverse
  const select = { value: name, classList: { add: vi.fn() } };
  return {
    querySelector: (sel) => {
      if (sel === '.asanaNameSelect') return select;
      if (sel === '#repetitionsInput') return { value: '3x' };
      if (sel === '#specialNotesTextarea') return { value: 'hold steady' };
      return null;
    },
  };
}

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
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: false, status: 404 });

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
      width: 0, height: 0,
      getContext: vi.fn().mockReturnValue(mockCtx),
      toDataURL: vi.fn().mockReturnValue('data:image/png;base64,converted'),
    };
    vi.spyOn(document, 'createElement').mockReturnValue(mockCanvas);

    const OriginalImage = globalThis.Image;
    globalThis.Image = class {
      constructor() { this.width = 100; this.height = 100; }
      set src(_) { setTimeout(() => this.onload(), 0); }
    };

    const result = await convertWebPtoPNG('data:image/webp;base64,abc');
    expect(result).toBe('data:image/png;base64,converted');

    globalThis.Image = OriginalImage;
  });

  it('returns null when the image fails to load', async () => {
    const OriginalImage = globalThis.Image;
    globalThis.Image = class {
      set src(_) { setTimeout(() => this.onerror(new Error('load failed')), 0); }
    };

    const result = await convertWebPtoPNG('data:image/webp;base64,bad');
    expect(result).toBeNull();

    globalThis.Image = OriginalImage;
  });

  it('returns null when canvas conversion throws', async () => {
    const mockCanvas = {
      width: 0, height: 0,
      getContext: vi.fn().mockReturnValue({ drawImage: vi.fn() }),
      toDataURL: vi.fn().mockImplementation(() => { throw new Error('canvas tainted'); }),
    };
    vi.spyOn(document, 'createElement').mockReturnValue(mockCanvas);

    const OriginalImage = globalThis.Image;
    globalThis.Image = class {
      constructor() { this.width = 50; this.height = 50; }
      set src(_) { setTimeout(() => this.onload(), 0); }
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
        this.width = 320; this.height = 240;
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
      set src(_) { setTimeout(() => this.onerror(new Error('bad image')), 0); }
    };

    const dims = await getImageDimensions('data:image/png;base64,bad');
    expect(dims).toEqual({ width: 180, height: 180 });

    globalThis.Image = OriginalImage;
  });
});

// ─── loadAsanasForPdf ────────────────────────────────────────────────────────

describe('loadAsanasForPdf', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  it('stores full asana data including imageUrl and displayName', async () => {
    const mockDocs = [
      { data: () => ({ name: 'Vrikshasana', description: 'Tree pose', displayName: 'Tree Pose', imageUrl: 'https://img/tree.png', category: 'Physical Asana' }) },
      { data: () => ({ name: 'Shavasana', description: 'Corpse pose', displayName: 'Corpse Pose', imageUrl: 'https://img/corpse.jpg', category: 'Relaxation' }) },
      { data: () => ({ name: 'NoImageAsana', description: 'No image', displayName: 'No Image', category: 'Breathing' }) },
    ];

    globalThis.db = {
      collection: vi.fn().mockReturnValue({
        get: vi.fn().mockResolvedValue({
          forEach: (cb) => mockDocs.forEach(cb),
        }),
      }),
    };

    const result = await loadAsanasForPdf();

    expect(result).toBeInstanceOf(Map);
    expect(result.size).toBe(3);

    // Verify full data is stored (the core fix)
    const tree = result.get('Vrikshasana');
    expect(tree).toEqual({
      name: 'Vrikshasana',
      description: 'Tree pose',
      displayName: 'Tree Pose',
      imageUrl: 'https://img/tree.png',
    });

    // Verify null imageUrl for asanas without images
    const noImg = result.get('NoImageAsana');
    expect(noImg.imageUrl).toBeNull();
  });

  it('throws on Firestore error', async () => {
    globalThis.db = {
      collection: vi.fn().mockReturnValue({
        get: vi.fn().mockRejectedValue(new Error('Firestore down')),
      }),
    };

    await expect(loadAsanasForPdf()).rejects.toThrow('Firestore down');
  });
});

// ─── prefetchAllImages ───────────────────────────────────────────────────────

describe('prefetchAllImages', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  it('fetches all unique image URLs in parallel and returns a cache', async () => {
    const fakeBlob = new Blob(['img'], { type: 'image/png' });
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      blob: () => Promise.resolve(fakeBlob),
    });

    const asanasMap = new Map([
      ['Asana1', { imageUrl: 'https://img/a.png', name: 'Asana1' }],
      ['Asana2', { imageUrl: 'https://img/b.png', name: 'Asana2' }],
      ['Asana3', { imageUrl: null, name: 'Asana3' }],
    ]);

    const cache = await prefetchAllImages(asanasMap);

    // 2 images fetched (Asana3 has no imageUrl)
    expect(cache.size).toBe(2);
    expect(cache.get('https://img/a.png')).toMatch(/^data:/);
    expect(cache.get('https://img/b.png')).toMatch(/^data:/);
  });

  it('deduplicates identical URLs across different asanas', async () => {
    const fakeBlob = new Blob(['img'], { type: 'image/png' });
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      blob: () => Promise.resolve(fakeBlob),
    });

    const sharedUrl = 'https://img/shared.png';
    const asanasMap = new Map([
      ['Asana1', { imageUrl: sharedUrl, name: 'Asana1' }],
      ['Asana2', { imageUrl: sharedUrl, name: 'Asana2' }],
    ]);

    const cache = await prefetchAllImages(asanasMap);

    // Only 1 entry in cache, even though 2 asanas share the URL
    expect(cache.size).toBe(1);
    // Only 1 network fetch (not 2)
    expect(globalThis.fetch).toHaveBeenCalledTimes(1);
  });

  it('handles partial failures — successful images are cached, failed ones are null', async () => {
    const fakeBlob = new Blob(['img'], { type: 'image/png' });

    // First URL succeeds, second fails
    globalThis.fetch = vi.fn()
      .mockImplementation((url) => {
        if (url.includes('good')) {
          return Promise.resolve({ ok: true, blob: () => Promise.resolve(fakeBlob) });
        }
        return Promise.reject(new Error('network fail'));
      });

    const asanasMap = new Map([
      ['Good', { imageUrl: 'https://img/good.png', name: 'Good' }],
      ['Bad', { imageUrl: 'https://img/bad.png', name: 'Bad' }],
    ]);

    const cache = await prefetchAllImages(asanasMap);

    expect(cache.size).toBe(2);
    expect(cache.get('https://img/good.png')).toMatch(/^data:/);
    // Failed image is null in cache, not missing
    expect(cache.get('https://img/bad.png')).toBeNull();
  });

  it('returns empty cache when no asanas have images', async () => {
    const asanasMap = new Map([
      ['Asana1', { imageUrl: null, name: 'Asana1' }],
      ['Asana2', { imageUrl: null, name: 'Asana2' }],
    ]);

    const cache = await prefetchAllImages(asanasMap);
    expect(cache.size).toBe(0);
  });
});

// ─── fetchAndConvertImage ────────────────────────────────────────────────────

describe('fetchAndConvertImage', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  it('returns base64 for a normal PNG', async () => {
    const fakeBlob = new Blob(['img'], { type: 'image/png' });
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      blob: () => Promise.resolve(fakeBlob),
    });

    const result = await fetchAndConvertImage('https://example.com/img.png');
    expect(result).toMatch(/^data:image\/png;base64,/);
  });

  it('converts WebP to PNG transparently', async () => {
    const fakeBlob = new Blob(['img'], { type: 'image/webp' });
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      blob: () => Promise.resolve(fakeBlob),
    });

    const mockCtx = { drawImage: vi.fn() };
    const mockCanvas = {
      width: 0, height: 0,
      getContext: vi.fn().mockReturnValue(mockCtx),
      toDataURL: vi.fn().mockReturnValue('data:image/png;base64,converted'),
    };
    vi.spyOn(document, 'createElement').mockReturnValue(mockCanvas);

    const OriginalImage = globalThis.Image;
    globalThis.Image = class {
      constructor() { this.width = 100; this.height = 100; }
      set src(_) { setTimeout(() => this.onload(), 0); }
    };

    const result = await fetchAndConvertImage('https://example.com/img.webp');
    expect(result).toBe('data:image/png;base64,converted');

    globalThis.Image = OriginalImage;
  });

  it('returns null on total fetch failure', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('offline'));

    const result = await fetchAndConvertImage('https://example.com/img.png');
    expect(result).toBeNull();
  });
});

// ─── addImagePlaceholder ─────────────────────────────────────────────────────

describe('addImagePlaceholder', () => {
  it('draws a placeholder rectangle and "Image unavailable" text', () => {
    const pdf = makeMockPdf();
    const colors = makeColors();
    const pdfConfig = { pageWidth: 595, pageHeight: 842, margin: 60 };

    const newY = addImagePlaceholder(pdf, pdfConfig, 100, 'Vrikshasana', colors);

    // Should draw a rect for the placeholder
    expect(pdf.rect).toHaveBeenCalled();
    // Should write the unavailable text
    expect(pdf.text).toHaveBeenCalledWith(
      'Image unavailable',
      expect.any(Number),
      expect.any(Number),
      expect.objectContaining({ align: 'center' })
    );
    // Should advance Y past the placeholder
    expect(newY).toBeGreaterThan(100);
  });
});

// ─── addAsanaContent (the core integration) ──────────────────────────────────

describe('addAsanaContent', () => {
  let pdf, colors, pdfConfig;

  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    vi.spyOn(console, 'log').mockImplementation(() => {});

    pdf = makeMockPdf();
    colors = makeColors();
    pdfConfig = { pageWidth: 595, pageHeight: 842, margin: 60, y: 100 };
  });

  it('uses pre-loaded asanasMap — does NOT query Firestore', async () => {
    const firestoreQuery = vi.fn();
    globalThis.db = { collection: vi.fn().mockReturnValue({ where: firestoreQuery }) };

    const asanasMap = new Map([
      ['Vrikshasana', { name: 'Vrikshasana', displayName: 'Tree Pose', description: 'Stand on one leg', imageUrl: null }],
    ]);
    const imageCache = new Map();
    const asanaDiv = makeAsanaDiv('Vrikshasana');

    await addAsanaContent(pdf, asanaDiv, pdfConfig, asanasMap, colors, imageCache);

    // The critical assertion: Firestore was never called
    expect(globalThis.db.collection).not.toHaveBeenCalled();
    expect(firestoreQuery).not.toHaveBeenCalled();
  });

  it('uses imageCache — does NOT call urlToDataUri during rendering', async () => {
    // This test ensures no network calls happen inside addAsanaContent
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('should not be called'));

    const asanasMap = new Map([
      ['Vrikshasana', { name: 'Vrikshasana', displayName: 'Tree Pose', description: 'Stand on one leg', imageUrl: 'https://img/tree.png' }],
    ]);
    const imageCache = new Map([
      ['https://img/tree.png', 'data:image/png;base64,fakeImageData'],
    ]);

    const OriginalImage = globalThis.Image;
    globalThis.Image = class {
      set src(_) {
        this.width = 100; this.height = 100;
        setTimeout(() => this.onload(), 0);
      }
    };

    const asanaDiv = makeAsanaDiv('Vrikshasana');
    await addAsanaContent(pdf, asanaDiv, pdfConfig, asanasMap, colors, imageCache);

    // fetch should never be called — image comes from cache
    expect(globalThis.fetch).not.toHaveBeenCalled();
    // addImage should be called with cached data
    expect(pdf.addImage).toHaveBeenCalledWith(
      'data:image/png;base64,fakeImageData',
      'PNG',
      expect.any(Number), expect.any(Number),
      expect.any(Number), expect.any(Number)
    );

    globalThis.Image = OriginalImage;
  });

  it('calls addImage when image is successfully cached', async () => {
    const asanasMap = new Map([
      ['Shavasana', { name: 'Shavasana', displayName: 'Corpse Pose', description: 'Lie down', imageUrl: 'https://img/corpse.jpg' }],
    ]);
    const imageCache = new Map([
      ['https://img/corpse.jpg', 'data:image/jpeg;base64,jpegData'],
    ]);

    const OriginalImage = globalThis.Image;
    globalThis.Image = class {
      set src(_) {
        this.width = 200; this.height = 150;
        setTimeout(() => this.onload(), 0);
      }
    };

    const asanaDiv = makeAsanaDiv('Shavasana');
    const resultY = await addAsanaContent(pdf, asanaDiv, pdfConfig, asanasMap, colors, imageCache);

    expect(pdf.addImage).toHaveBeenCalledTimes(1);
    expect(pdf.addImage).toHaveBeenCalledWith(
      'data:image/jpeg;base64,jpegData',
      'JPEG',
      expect.any(Number), expect.any(Number),
      expect.any(Number), expect.any(Number)
    );
    expect(resultY).toBeGreaterThan(pdfConfig.y);

    globalThis.Image = OriginalImage;
  });

  it('draws a placeholder when imageUrl exists but fetch failed (null in cache)', async () => {
    const asanasMap = new Map([
      ['FailAsana', { name: 'FailAsana', displayName: 'Fail Pose', description: 'This image failed', imageUrl: 'https://img/fail.png' }],
    ]);
    // imageUrl is in the cache but its value is null (fetch failed)
    const imageCache = new Map([
      ['https://img/fail.png', null],
    ]);

    const asanaDiv = makeAsanaDiv('FailAsana');
    const resultY = await addAsanaContent(pdf, asanaDiv, pdfConfig, asanasMap, colors, imageCache);

    // addImage should NOT have been called
    expect(pdf.addImage).not.toHaveBeenCalled();

    // But a placeholder should have been drawn (rect + "Image unavailable" text)
    const textCalls = pdf._calls.filter(c => c.fn === 'text');
    const placeholderText = textCalls.find(c => c.args[0] === 'Image unavailable');
    expect(placeholderText).toBeDefined();

    // Y should still advance (placeholder takes space)
    expect(resultY).toBeGreaterThan(pdfConfig.y);
  });

  it('draws a placeholder when imageUrl exists but is not in cache at all', async () => {
    const asanasMap = new Map([
      ['MissingAsana', { name: 'MissingAsana', displayName: 'Missing Img', description: 'Not in cache', imageUrl: 'https://img/missing.png' }],
    ]);
    // imageCache is empty — this URL was never fetched
    const imageCache = new Map();

    const asanaDiv = makeAsanaDiv('MissingAsana');
    await addAsanaContent(pdf, asanaDiv, pdfConfig, asanasMap, colors, imageCache);

    expect(pdf.addImage).not.toHaveBeenCalled();
    const textCalls = pdf._calls.filter(c => c.fn === 'text');
    const placeholderText = textCalls.find(c => c.args[0] === 'Image unavailable');
    expect(placeholderText).toBeDefined();
  });

  it('skips image section entirely when asana has no imageUrl', async () => {
    const asanasMap = new Map([
      ['NoImg', { name: 'NoImg', displayName: 'No Image Pose', description: 'No picture', imageUrl: null }],
    ]);
    const imageCache = new Map();

    const asanaDiv = makeAsanaDiv('NoImg');
    await addAsanaContent(pdf, asanaDiv, pdfConfig, asanasMap, colors, imageCache);

    expect(pdf.addImage).not.toHaveBeenCalled();
    // Also should NOT have placeholder text
    const textCalls = pdf._calls.filter(c => c.fn === 'text');
    const placeholderText = textCalls.find(c => c.args[0] === 'Image unavailable');
    expect(placeholderText).toBeUndefined();
  });

  it('returns pdfConfig.y unchanged when asana is not found in asanasMap', async () => {
    const asanasMap = new Map(); // empty — asana not found
    const imageCache = new Map();

    const asanaDiv = makeAsanaDiv('NonExistentAsana');
    const resultY = await addAsanaContent(pdf, asanaDiv, pdfConfig, asanasMap, colors, imageCache);

    // Should return original y without crashing
    expect(resultY).toBe(pdfConfig.y);
    expect(pdf.addImage).not.toHaveBeenCalled();
  });

  it('returns pdfConfig.y when asanaDiv has no select element', async () => {
    const emptyDiv = { querySelector: () => null };
    const asanasMap = new Map();
    const imageCache = new Map();

    const resultY = await addAsanaContent(pdf, emptyDiv, pdfConfig, asanasMap, colors, imageCache);
    expect(resultY).toBe(pdfConfig.y);
  });
});

// ─── End-to-end: multiple asanas, images consistently present ────────────────

describe('End-to-end: all images appear in PDF for a multi-asana plan', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  it('every asana with an imageUrl has addImage called exactly once', async () => {
    const pdf = makeMockPdf();
    const colors = makeColors();

    // Simulate 5 asanas, all with images
    const asanaNames = ['Vrikshasana', 'Trikonasana', 'Tolasana', 'Virasana', 'Shavasana'];
    const asanasMap = new Map();
    const imageCache = new Map();

    asanaNames.forEach((name, i) => {
      const url = `https://img/${name.toLowerCase()}.png`;
      asanasMap.set(name, {
        name, displayName: name, description: `Desc for ${name}`, imageUrl: url,
      });
      imageCache.set(url, `data:image/png;base64,fakeData${i}`);
    });

    const OriginalImage = globalThis.Image;
    globalThis.Image = class {
      set src(_) {
        this.width = 200; this.height = 200;
        setTimeout(() => this.onload(), 0);
      }
    };

    let y = 100;
    for (const name of asanaNames) {
      const pdfConfig = { pageWidth: 595, pageHeight: 842, margin: 60, y };
      const asanaDiv = makeAsanaDiv(name);
      y = await addAsanaContent(pdf, asanaDiv, pdfConfig, asanasMap, colors, imageCache);
    }

    // Every single asana should have had its image added
    expect(pdf.addImage).toHaveBeenCalledTimes(5);

    // Verify each specific image was added
    const addImageCalls = pdf.addImage.mock.calls;
    asanaNames.forEach((name, i) => {
      expect(addImageCalls[i][0]).toBe(`data:image/png;base64,fakeData${i}`);
    });

    globalThis.Image = OriginalImage;
  });

  it('no Firestore queries are made during PDF rendering of 5 asanas', async () => {
    const firestoreCollection = vi.fn();
    globalThis.db = { collection: firestoreCollection };

    const pdf = makeMockPdf();
    const colors = makeColors();

    const asanaNames = ['A', 'B', 'C', 'D', 'E'];
    const asanasMap = new Map();
    const imageCache = new Map();

    asanaNames.forEach(name => {
      asanasMap.set(name, { name, displayName: name, description: `Desc ${name}`, imageUrl: null });
    });

    let y = 100;
    for (const name of asanaNames) {
      const pdfConfig = { pageWidth: 595, pageHeight: 842, margin: 60, y };
      const asanaDiv = makeAsanaDiv(name);
      y = await addAsanaContent(pdf, asanaDiv, pdfConfig, asanasMap, colors, imageCache);
    }

    // Zero Firestore calls — the entire point of the fix
    expect(firestoreCollection).not.toHaveBeenCalled();
  });

  it('mixed scenario: some images succeed, some fail — all get visual treatment', async () => {
    const pdf = makeMockPdf();
    const colors = makeColors();

    const asanasMap = new Map([
      ['Good1', { name: 'Good1', displayName: 'Good One', description: 'ok', imageUrl: 'https://img/good1.png' }],
      ['Fail1', { name: 'Fail1', displayName: 'Fail One', description: 'failed', imageUrl: 'https://img/fail1.png' }],
      ['Good2', { name: 'Good2', displayName: 'Good Two', description: 'ok', imageUrl: 'https://img/good2.png' }],
      ['NoImg', { name: 'NoImg', displayName: 'No Image', description: 'none', imageUrl: null }],
    ]);

    const imageCache = new Map([
      ['https://img/good1.png', 'data:image/png;base64,good1Data'],
      ['https://img/fail1.png', null],  // failed fetch
      ['https://img/good2.png', 'data:image/png;base64,good2Data'],
    ]);

    const OriginalImage = globalThis.Image;
    globalThis.Image = class {
      set src(_) {
        this.width = 100; this.height = 100;
        setTimeout(() => this.onload(), 0);
      }
    };

    let y = 100;
    for (const name of ['Good1', 'Fail1', 'Good2', 'NoImg']) {
      const pdfConfig = { pageWidth: 595, pageHeight: 842, margin: 60, y };
      const asanaDiv = makeAsanaDiv(name);
      y = await addAsanaContent(pdf, asanaDiv, pdfConfig, asanasMap, colors, imageCache);
    }

    // 2 successful images added
    expect(pdf.addImage).toHaveBeenCalledTimes(2);

    // 1 placeholder drawn for Fail1 (check for "Image unavailable" text)
    const allTextCalls = pdf._calls.filter(c => c.fn === 'text');
    const placeholders = allTextCalls.filter(c => c.args[0] === 'Image unavailable');
    expect(placeholders).toHaveLength(1);

    // NoImg should have neither addImage nor placeholder
    // Total addImage = 2 (Good1 + Good2), placeholder = 1 (Fail1), nothing for NoImg

    globalThis.Image = OriginalImage;
  });

  it('20 asanas all get images — stress test for sequential reliability', async () => {
    const pdf = makeMockPdf();
    const colors = makeColors();
    const asanasMap = new Map();
    const imageCache = new Map();

    for (let i = 0; i < 20; i++) {
      const name = `Asana${i}`;
      const url = `https://img/asana${i}.png`;
      asanasMap.set(name, { name, displayName: name, description: `Desc ${i}`, imageUrl: url });
      imageCache.set(url, `data:image/png;base64,data${i}`);
    }

    const OriginalImage = globalThis.Image;
    globalThis.Image = class {
      set src(_) {
        this.width = 150; this.height = 150;
        setTimeout(() => this.onload(), 0);
      }
    };

    let y = 100;
    for (let i = 0; i < 20; i++) {
      const pdfConfig = { pageWidth: 595, pageHeight: 842, margin: 60, y };
      const asanaDiv = makeAsanaDiv(`Asana${i}`);
      y = await addAsanaContent(pdf, asanaDiv, pdfConfig, asanasMap, colors, imageCache);
    }

    // All 20 images should be present
    expect(pdf.addImage).toHaveBeenCalledTimes(20);

    globalThis.Image = OriginalImage;
  });
});

// ─── normalizeText ───────────────────────────────────────────────────────────

describe('normalizeText', () => {
  it('returns empty string for null/undefined input', () => {
    expect(normalizeText(null)).toBe('');
    expect(normalizeText(undefined)).toBe('');
    expect(normalizeText('')).toBe('');
  });

  it('preserves paragraph breaks but collapses single newlines', () => {
    const input = 'Line one\nLine two\n\nParagraph two';
    const result = normalizeText(input);
    expect(result).toBe('Line one Line two\n\nParagraph two');
  });

  it('trims whitespace and collapses excessive spaces', () => {
    const input = '  Hello    world  ';
    expect(normalizeText(input)).toBe('Hello world');
  });
});
