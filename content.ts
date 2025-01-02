// src/content.ts

((): void => {
  console.log('[Overlay Blocker] Content script started.');

  // Ensure that the document body exists
  if (!document.body) {
    console.error('[Overlay Blocker] <body> element not found.');
    return;
  }

  // Select all direct child <div> elements of the <body>
  const allDivs: NodeListOf<HTMLDivElement> = document.body.querySelectorAll(':scope > div');

  let foundPopup: boolean = false;

  allDivs.forEach((div: HTMLDivElement) => {
    // Retrieve the computed styles of the <div>
    const style: CSSStyleDeclaration = window.getComputedStyle(div);
    const position: string = style.position;
    const zIndex: string = style.zIndex;

    // Parse z-index to a number
    const numericZindex: number = parseInt(zIndex, 10);
    const isZindexValid: boolean = !isNaN(numericZindex) && numericZindex > 0;

    // Check if the <div> meets the criteria for being a popup overlay
    if (position === 'relative' && isZindexValid) {
      // Hide the entire <div>
      div.style.display = 'none';
      foundPopup = true;
      console.log(`[Overlay Blocker] Hiding one <div> with position='${position}' and z-index=${zIndex}.`);
    }
  });

  // Log the result if no popups are found
  if (!foundPopup) {
    console.log('[Overlay Blocker] No popups found.');
  }
})();
