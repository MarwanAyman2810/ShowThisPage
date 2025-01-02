((): void => {
  console.log('[Overlay Blocker] Content script started.');

  if (!document.body) {
    console.error('[Overlay Blocker] <body> element not found.');
    return;
  }

  const allDivs: NodeListOf<HTMLDivElement> = document.body.querySelectorAll(':scope > div');

  let foundPopup: boolean = false;

  // **1. Hide Direct Child <div> Elements with Specific Styles**
  allDivs.forEach((div: HTMLDivElement) => {
    const style: CSSStyleDeclaration = window.getComputedStyle(div);
    const position: string = style.position;
    const zIndex: string = style.zIndex;

    const numericZindex: number = parseInt(zIndex, 10);
    const isZindexValid: boolean = !isNaN(numericZindex) && numericZindex > 0;

    if (position === 'relative' && isZindexValid) {
      div.style.display = 'none';
      foundPopup = true;
      console.log(`[Overlay Blocker] Hiding one <div> with position='${position}' and z-index=${zIndex}.`);
    }
  });

  // **2. Hide Login Overlay Containers Based on Specific Selectors**
  const likelyLoginOverlayElementSelectors: string[] = [
    '.q-zIndex--blocking_wall',
    '.puppeteer_test_login_button_google',
    '.puppeteer_test_login_button_facebook',
  ];

  const likelyLoginOverlayElements: Element[] = likelyLoginOverlayElementSelectors
    .map(selector => document.querySelector(selector))
    .filter((element): element is Element => element !== null);

  /**
   * Finds the nearest common ancestor HTMLElement for a list of elements.
   * @param elements Array of DOM elements.
   * @returns The common ancestor HTMLElement or null if none found.
   */
  function findCommonAncestor(elements: Element[]): HTMLElement | null {
    if (elements.length === 0) {
      return null;
    }
    if (elements.length === 1) {
      return elements[0] instanceof HTMLElement ? elements[0] : null;
    }

    let ancestor: Element | null = elements[0];
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

  const loginOverlayContainer: HTMLElement | null = findCommonAncestor(likelyLoginOverlayElements);

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
    const bodyDivs: HTMLCollectionOf<HTMLDivElement> = document.body.getElementsByTagName('div');
    const totalDivs = bodyDivs.length;

    if (totalDivs > 0) {
      const lastDiv: HTMLDivElement = bodyDivs[totalDivs - 1];
      lastDiv.remove();
      foundPopup = true;
      console.log('[Overlay Blocker] Fallback: Removed the last <div> in <body> as a popup.');
    } else {
      console.log('[Overlay Blocker] Fallback: No <div> elements found in <body> to remove.');
    }
  }

  if (!foundPopup) {
    console.log('[Overlay Blocker] No popups found.');
  }

  console.log('[Overlay Blocker] Content script execution completed.');
})();
