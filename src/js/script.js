/* eslint-disable no-unused-vars */
window.addEventListener('DOMContentLoaded', () => {
  const finderHeading = document.querySelector('.finder__heading');
  const grid = document.querySelector('.grid');
  const finderBtn = document.querySelector('.finder__btn');

  let selectedSquares = []; // initialize selectedSquares to an empty array

  // create a 10 by 10 grid and assign data attributes to each square
  for (let row = 0; row < 10; row++) {
    for (let col = 0; col < 10; col++) {
      const square = document.createElement('div');
      square.classList.add('grid__square');
      square.dataset.row = row;
      square.dataset.col = col;
      grid.appendChild(square);
      square.innerHTML = `${row}, ${col}`;
    }
  }
  
  grid.addEventListener('click', (event) => {
    if (event.target.classList.contains('grid__square')) {
      const currentSquare = event.target;
      // get the row and column of the current square as a number
      const currentRow = parseInt(currentSquare.dataset.row);
      const currentCol = parseInt(currentSquare.dataset.col);

      // check if current square is north,east,south,west to any previously selected square
      let validSelection = false;
      for (const selectedSquare of selectedSquares) {
        const previousRow = parseInt(selectedSquare.dataset.row);
        const previousCol = parseInt(selectedSquare.dataset.col);
        
        if (
          (previousRow === currentRow && Math.abs(previousCol - currentCol) === 1) ||
          (previousCol === currentCol && Math.abs(previousRow - currentRow) === 1)
        ) {
          validSelection = true;
          break;
        }
      }

      if (validSelection || selectedSquares.length === 0) {
        console.log('valid selection');
        currentSquare.classList.add('grid__square--active');
        selectedSquares.push(currentSquare);
      } else {

        console.log('invalid selection');
        return;
      }
    } else {
      console.log('not a square');
      return;
    }
  });

  // switch subpages

  const initializePages = () => {


    const pages = Array.from(document.querySelector('#pages').children);

    const idFromHash = window.location.hash.replace('#/', '');
    
    let pageMatchingHash = pages[0].id;

    for(let page of pages){
      if(page.id == idFromHash){
        pageMatchingHash = page.id;
        break;
      }
    }

    activatePage(pageMatchingHash);

    const pageLinks = document.querySelectorAll('header nav a');
    pageLinks.forEach(pageLink => {
      pageLink.addEventListener('click', (event) => {
        const clickedElement = event.target;
        event.preventDefault();
        // get page ID from href attr.
        const id = clickedElement.getAttribute('href').replace('#', '');
        activatePage(id);
        // change URL hash, add / to prevent scrolling to #
        window.location.hash = '#/' + id;
      });
    });  
  };
  function activatePage(pageId) {
    const pages = Array.from(document.querySelector('#pages').children);
    for (const page of pages) {
      page.classList.toggle('active', page.id === pageId);
    }
  }

  initializePages();

});
