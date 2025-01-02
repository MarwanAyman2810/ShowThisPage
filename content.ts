

((): void => {
  console.log('[Overlay Blocker] Content script started.');

  if (!document.body) {
    console.error('[Overlay Blocker] <body> element not found.');
    return;
  }

  const allDivs: NodeListOf<HTMLDivElement> = document.body.querySelectorAll(':scope > div');

  let foundPopup: boolean = false;

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

  const likelyLoginOverlayElementSelectors: string[] = [
    '.q-zIndex--blocking_wall',
    '.puppeteer_test_login_button_google',
    '.puppeteer_test_login_button_facebook',
  ];

  const likelyLoginOverlayElements: Element[] = likelyLoginOverlayElementSelectors
    .map(selector => document.querySelector(selector))
    .filter((element): element is Element => element !== null);

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

  if (!foundPopup) {
    console.log('[Overlay Blocker] No popups found.');
  }

  function handleMutations(mutations: MutationRecord[]) {
    mutations.forEach(() => {
    });
  }

  const observer = new MutationObserver(handleMutations);

  observer.observe(document.body, { childList: true, subtree: true });

  console.log('[Overlay Blocker] MutationObserver initialized.');
})();
