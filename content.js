
(function() {
  console.log('[Overlay Blocker] Content script started.');
  
  const allDivs = document.body.querySelectorAll(':scope > div');

  let foundPopup = false;

 
  allDivs.forEach(div => {
    const style = window.getComputedStyle(div);
    const position = style.position; 
    const zIndex = style.zIndex;     

    
    const numericZindex = parseInt(zIndex, 10);
    const isZindexValid = !isNaN(numericZindex) && numericZindex > 0;

    if (position === 'relative' && isZindexValid) {
      // 4) Hide the entire div
      div.style.display = 'none';
      foundPopup = true;
      console.log(`[Overlay Blocker] Hiding one <div> with position='${position}' and z-index=${zIndex}.`);
    }
  });

  
  if (!foundPopup) {
    console.log('[Overlay Blocker] No popups found.');
  }
})();
