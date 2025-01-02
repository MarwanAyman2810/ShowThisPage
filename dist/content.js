"use strict";
(() => {
    console.log('[Overlay Blocker] Content script started.');
    if (!document.body) {
        console.error('[Overlay Blocker] <body> element not found.');
        return;
    }
    const allDivs = document.body.querySelectorAll(':scope > div');
    let foundPopup = false;
    // **1. Hide Direct Child <div> Elements with Specific Styles**
    allDivs.forEach((div) => {
        const style = window.getComputedStyle(div);
        const position = style.position;
        const zIndex = style.zIndex;
        const numericZindex = parseInt(zIndex, 10);
        const isZindexValid = !isNaN(numericZindex) && numericZindex > 0;
        if (position === 'relative' && isZindexValid) {
            div.style.display = 'none';
            foundPopup = true;
            console.log(`[Overlay Blocker] Hiding one <div> with position='${position}' and z-index=${zIndex}.`);
        }
    });
    // **2. Hide Login Overlay Containers Based on Specific Selectors**
    const likelyLoginOverlayElementSelectors = [
        '.q-zIndex--blocking_wall',
        '.puppeteer_test_login_button_google',
        '.puppeteer_test_login_button_facebook',
    ];
    const likelyLoginOverlayElements = likelyLoginOverlayElementSelectors
        .map(selector => document.querySelector(selector))
        .filter((element) => element !== null);
    /**
     * Finds the nearest common ancestor HTMLElement for a list of elements.
     * @param elements Array of DOM elements.
     * @returns The common ancestor HTMLElement or null if none found.
     */
    function findCommonAncestor(elements) {
        if (elements.length === 0) {
            return null;
        }
        if (elements.length === 1) {
            return elements[0] instanceof HTMLElement ? elements[0] : null;
        }
        let ancestor = elements[0];
        while (ancestor) {
            if (!(ancestor instanceof HTMLElement)) {
                ancestor = ancestor.parentElement;
                continue;
            }
            let isCommonAncestor = true;
            for (let i = 1; i < elements.length; i++) {
                if (!ancestor.contains(elements[i])) {
                    isCommonAncestor = false;
                    break;
                }
            }
            if (isCommonAncestor) {
                return ancestor;
            }
            ancestor = ancestor.parentElement;
        }
        return null;
    }
    const loginOverlayContainer = findCommonAncestor(likelyLoginOverlayElements);
    const data = {
        loginOverlayContainer: loginOverlayContainer
            ? {
                tagName: loginOverlayContainer.tagName,
                id: loginOverlayContainer.id,
                className: loginOverlayContainer.className,
            }
            : null,
    };
    if (loginOverlayContainer) {
        loginOverlayContainer.style.display = 'none';
        foundPopup = true;
        console.log('[Overlay Blocker] Hiding login overlay container:', data.loginOverlayContainer);
    }
    // **3. Fallback Method: Remove the Last <div> in <body>**
    if (!foundPopup) {
        const bodyDivs = document.body.getElementsByTagName('div');
        const totalDivs = bodyDivs.length;
        if (totalDivs > 0) {
            const lastDiv = bodyDivs[totalDivs - 1];
            lastDiv.remove();
            foundPopup = true;
            console.log('[Overlay Blocker] Fallback: Removed the last <div> in <body> as a popup.');
        }
        else {
            console.log('[Overlay Blocker] Fallback: No <div> elements found in <body> to remove.');
        }
    }
    if (!foundPopup) {
        console.log('[Overlay Blocker] No popups found.');
    }
    console.log('[Overlay Blocker] Content script execution completed.');
})();
//# sourceMappingURL=content.js.map