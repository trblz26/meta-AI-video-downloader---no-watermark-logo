// Scan all <video> elements and return their src URLs
(function () {
  const found = [];
  document.querySelectorAll('video').forEach((v, i) => {
    // Collect every candidate URL
    const candidates = [];

    // 1. src attribute / property
    [v.src, v.getAttribute('src'), v.currentSrc].forEach(s => s && candidates.push(s));

    // 2. <source> children
    v.querySelectorAll('source').forEach(s => {
      [s.src, s.getAttribute('src')].forEach(u => u && candidates.push(u));
    });

    // Dedupe and filter empty/blob-only (blob: still useful)
    const urls = [...new Set(candidates)].filter(u => u && u.length > 4);
    if (urls.length === 0) return;

    // Pick the best: prefer non-blob, longest URL usually = highest quality
    const nonBlob = urls.filter(u => !u.startsWith('blob:'));
    const best = nonBlob.sort((a, b) => b.length - a.length)[0] || urls[0];

    found.push({ index: i + 1, url: best, allUrls: urls });
  });

  return found;
})();
