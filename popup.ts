// src/popup.ts

document.addEventListener('DOMContentLoaded', () => {
  
  const blockBtn: HTMLElement = document.getElementById('blockBtn') as HTMLElement;

  
  blockBtn.addEventListener('click', async () => {
    try {
      
      const tabs: chrome.tabs.Tab[] = await chrome.tabs.query({ active: true, currentWindow: true });
      const tab: chrome.tabs.Tab | undefined = tabs[0];

      if (!tab?.id) {
        console.warn('[Overlay Blocker] No active tab found.');
        return;
      }

      
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['dist/content.js']
      });

      console.log('[Overlay Blocker] Overlay blocker injected into the active tab.');
    } catch (err) {
      console.error('[Overlay Blocker] Failed to inject content.js:', err);
    }
  });
});
