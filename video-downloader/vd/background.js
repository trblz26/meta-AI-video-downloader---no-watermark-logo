chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === 'download' && msg.url) {
    chrome.downloads.download({
      url: msg.url,
      filename: `video-${Date.now()}.mp4`,
      saveAs: true
    });
  }
});
