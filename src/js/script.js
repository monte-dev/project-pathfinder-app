/* eslint-disable no-unused-vars */
window.addEventListener('DOMContentLoaded', () => {
  const finderHeading = document.querySelector('.finder__heading');
  const grid = document.querySelector('.grid');
  const finderBtn = document.querySelector('#finder__btn');
  
  let selectedSquares = []; // initialize selectedSquares to an empty array
  let finder_state = 1; // initialize finder_state to 1
  let squareStart = null;
  let squareFinish = null;
  let minSelectedSquares = 4;

  // create a 10 by 10 grid and assign data attributes to each square
  for (let row = 1; row <= 10; row++) {
    for (let col = 1; col <= 10; col++) {
      const square = document.createElement('div');
      square.classList.add('grid__square');
      square.dataset.row = row;
      square.dataset.col = col;
      grid.appendChild(square);
      // square.innerHTML = `${row}, ${col}`;
      square.dataset.selected = false;
    }
  }
  // console.log(grid.children);
  grid.addEventListener('click', (event) => {
    // allow selection of squares only in state 1
    if (finder_state === 1) {
      if (event.target.classList.contains('grid__square')) {
        const currentSquare = event.target;
        // get the row and column of the current square as a number
        const currentRow = parseInt(currentSquare.dataset.row);
        const currentCol = parseInt(currentSquare.dataset.col);

        // check if current square is ^, > , \/, < to any previously selected square
        let validSelection = false;
        for (const selectedSquare of selectedSquares) {
          // get the row and column of the selected square as a number
          const previousRow = parseInt(selectedSquare.dataset.row);
          const previousCol = parseInt(selectedSquare.dataset.col);
          // use math absolute to check position of new selection to previous selection
          if (
            (previousRow === currentRow && Math.abs(previousCol - currentCol) === 1) ||
          (previousCol === currentCol && Math.abs(previousRow - currentRow) === 1)
          ) {
            validSelection = true;
            break;
          }
        }

        // if valid selection, add class and data attribute to current square
        if (validSelection || selectedSquares.length === 0) {
          console.log('valid selection');
          currentSquare.classList.add('grid__square--active');
          currentSquare.setAttribute('data-selected', 'true');
          selectedSquares.push(currentSquare);
        }
        // if invalid selection, alert user and return
        else {
          alert('invalid selection, please choose a square directly beside one of previously selected squares.');
          console.log('invalid selection');
          return;
        }
      }
      // if clicked element is not a square, alert user and return
      else {
        console.log('not a square');
        return;
      }
    }
    // allow selection of start and finish squares only in state 2
    else if (finder_state === 2) {
      if (event.target.classList.contains('grid__square')) {
        const currentSquare = event.target;
        // check if current square is selected to only allow start and finish on squares that are part of the path
        if (currentSquare.dataset.selected === 'true') {
          if (!squareStart) {
            squareStart = currentSquare;
            squareStart.classList.add('grid__square--start');
          } else if (!squareFinish) {
            squareFinish = currentSquare;
            squareFinish.classList.add('grid__square--finish');
          } else {
            alert('Start and finish have been selected');
          }
        } else {
          alert('Select 2 squares (start and finish) from existing squares.');
        }
      }
    }
    // run calculatePath function only in state 3
    else if (finder_state === 3) {
      calculatePath();
    }
  });

  // switch between states 1, 2 and 3 depending on progress in the app
  finderBtn.addEventListener('click', () => {
    // if app is in state 1 and min-length requirements have been met
    if (finder_state === 1 && selectedSquares.length > minSelectedSquares) {
      finder_state = 2;
      finderHeading.textContent = 'Pick start and finish';
      finderBtn.textContent = 'Compute';
    }
    // if app is in state 2 and start and finish have been selected
    else if (finder_state === 2 && squareStart && squareFinish) {
      finder_state = 3;
      finderHeading.textContent = 'The best route is';
      finderBtn.textContent = 'Start Again';
    }
    // TODO if app is in state 3 
    else if (finder_state === 3) {
      finder_state = 1;
      selectedSquares = [];
      squareStart = false;
      squareFinish = false;
      finderHeading.textContent = 'Draw Routes';
      finderBtn.textContent = 'Finish Drawing';
    }
  });
  // TODO
  // calculate path as shortest route between start and finish declared in stage 2
  function calculatePath () {
    console.log('ran calculatePath');
    
  }

  // switch subpages

  const initializePages = () => {
    // switching subpages via navbar and URL hash logic
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
