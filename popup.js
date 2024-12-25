// popup.js
document.addEventListener('DOMContentLoaded', () => {
  const blockBtn = document.getElementById('blockBtn');

  blockBtn.addEventListener('click', async () => {
    try {
      // Identify the current active tab in the current window
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab?.id) {
        console.warn('No active tab found.');
        return;
      }

      // Inject "content.js" into the active tab
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.js']
      });

      console.log('Overlay blocker injected into the active tab.');
    } catch (err) {
      console.error('Failed to inject content.js:', err);
    }
  });
});
