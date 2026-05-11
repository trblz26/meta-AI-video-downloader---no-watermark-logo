const btn  = document.getElementById('scanBtn');
const list = document.getElementById('list');

btn.addEventListener('click', async () => {
  btn.disabled = true;
  btn.textContent = 'Đang quét...';
  list.innerHTML = '';

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  let results;
  try {
    [{ result: results }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['scanner.js']
    });
  } catch (e) {
    list.innerHTML = `<div class="empty">Không thể chạy trên trang này.</div>`;
    btn.disabled = false;
    btn.textContent = '🔍 Quét video trên trang';
    return;
  }

  btn.disabled = false;
  btn.textContent = '🔍 Quét lại';

  if (!results || results.length === 0) {
    list.innerHTML = `<div class="empty">Không tìm thấy video nào.<br>Hãy phát video trước rồi quét lại.</div>`;
    return;
  }

  results.forEach(v => {
    const item = document.createElement('div');
    item.className = 'item';
    item.innerHTML = `
      <div class="item-label">
        <b>Video ${v.index}</b>
        ${v.url.startsWith('blob:') ? '⚠ blob (xem mẹo)' : ''}
      </div>
      <button class="dl" data-url="${escHtml(v.url)}">⬇ Tải</button>`;
    list.appendChild(item);
  });

  list.querySelectorAll('.dl').forEach(b => {
    b.addEventListener('click', () => {
      chrome.runtime.sendMessage({ action: 'download', url: b.dataset.url });
      b.textContent = '✓ Đang tải';
      b.style.background = '#22d3a5';
    });
  });
});

function escHtml(s) {
  return s.replace(/"/g, '&quot;');
}
