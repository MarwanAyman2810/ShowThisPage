"use strict";
// src/popup.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
document.addEventListener('DOMContentLoaded', () => {
    const blockBtn = document.getElementById('blockBtn');
    blockBtn.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const tabs = yield chrome.tabs.query({ active: true, currentWindow: true });
            const tab = tabs[0];
            if (!(tab === null || tab === void 0 ? void 0 : tab.id)) {
                console.warn('[Overlay Blocker] No active tab found.');
                return;
            }
            yield chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ['dist/content.js']
            });
            console.log('[Overlay Blocker] Overlay blocker injected into the active tab.');
        }
        catch (err) {
            console.error('[Overlay Blocker] Failed to inject content.js:', err);
        }
    }));
});
//# sourceMappingURL=popup.js.map