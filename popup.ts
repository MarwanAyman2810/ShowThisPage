// src/popup.ts

document.addEventListener('DOMContentLoaded', () => {
  const blockBtn: HTMLElement | null = document.getElementById('blockBtn');

  if (!blockBtn) {
    console.error('[Overlay Blocker] Block button not found in popup.');
    return;
  }

  blockBtn.addEventListener('click', async () => {
    try {
      // Query the active tab in the current window
      const tabs: chrome.tabs.Tab[] = await chrome.tabs.query({ active: true, currentWindow: true });
      const tab: chrome.tabs.Tab | undefined = tabs[0];

      if (!tab?.id) {
        console.warn('[Overlay Blocker] No active tab found.');
        return;
      }

      // Inject the compiled "content.js" into the active tab
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['dist/content.js'] // Path to the compiled JavaScript file
      });

      console.log('[Overlay Blocker] Overlay blocker injected into the active tab.');
    } catch (err) {
      console.error('[Overlay Blocker] Failed to inject content.js:', err);
    }
  });
});
