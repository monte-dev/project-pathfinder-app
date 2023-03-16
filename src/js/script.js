/* eslint-disable no-unused-vars */
window.addEventListener('DOMContentLoaded', () => {
  const finderHeading = document.querySelector('.finder__heading');
  const grid = document.querySelector('.grid');
  const finderBtn = document.querySelector('#finder__btn');
  const minSelectedSquares = 4;
  const gridSquare = document.querySelectorAll('.grid__square');
  
  let selectedSquares = []; // initialize selectedSquares to an empty array
  let finder_state = 1; // initialize finder_state to 1
  let squareStart = null;
  let squareFinish = null;

  // create a 10 by 10 grid and assign data attributes to each square
  function createGrid() {
    for (let row = 1; row <= 10; row++) {
      for (let col = 1; col <= 10; col++) {
        const square = document.createElement('div');
        square.classList.add('grid__square');
        square.dataset.row = row;
        square.dataset.col = col;
        grid.appendChild(square);
        square.dataset.selected = false;
      }
    }
  }

  let gridMap = [];
  // 2d array
  function createGridMap() {
    for(let row = 1; row <= 10; row++) {
      gridMap[row] = [];
      for(let col = 1; col <= 10; col++) {
        gridMap[row][col] = false;
      }
    }
  }
  createGridMap();
  createGrid();
  
  grid.addEventListener('click', (event, neighbourSquares) => {
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
            if (selectedSquare) {
              validSelection = true;
            } else {
              validSelection = false;
              break;
            }
          }
        }
        
        // if valid selection OR first square selection add class and data attribute to current square
        if (validSelection || selectedSquares.length === 0 ) {
          // allow user to only remove most recent square from array
          if (selectedSquares.includes(currentSquare)) {
            let previousSquare = selectedSquares.pop();
            previousSquare.classList.remove('grid__square--active');
            gridMap[currentRow][currentCol] = false;

          } 
          // else add current square to array and add class active
          else {
            selectedSquares.push(currentSquare);
            currentSquare.classList.add('grid__square--active');
          }
          // set the attribute depending on whether square is active or not
          currentSquare.setAttribute('data-selected', currentSquare.classList.contains  ('grid__square--active'));
          gridMap[currentRow][currentCol] = true;
        }
        // if invalid selection, alert user and return
        else {
          new Noty({
            type: 'error',
            text: 'Invalid selection. Please choose a square directly beside one of the previously selected squares.',
          }).show();
          return;
        }
      }
      // if clicked element is not a square, alert user and return
      else {
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
            gridMap[squareStart.dataset.row][squareStart.dataset.col] = 'start';
    
          } else if (!squareFinish) {
            squareFinish = currentSquare;
            squareFinish.classList.add('grid__square--finish');
            gridMap[squareFinish.dataset.row][squareFinish.dataset.col] = 'finish';
          } else {
            new Noty({
              type: 'warning',
              text: 'Start and finish have been selected',
            }).show();
          }
        } else {
          new Noty({
            type: 'warning',
            text: 'Select 2 squares (start and finish) from existing squares.',
          }).show();
        }
      }
    }
    // run calculatePath function only in state 3
    else if (finder_state === 3) {
      //
    }
  });

  // switch between states 1, 2 and 3 depending on progress in the app
  finderBtn.addEventListener('click', () => {
    // if app is in state 1 and min-length requirements have been met
    if (finder_state === 1 && selectedSquares.length >= minSelectedSquares) {
      finder_state = 2;
      updateStateDom('Pick start and finish', 'Compute');
    }
    // if app is in state 2 and start and finish have been selected
    else if (finder_state === 2  && squareStart && squareFinish) {
      finder_state = 3;
      // send arguments needed to calculate path
      findPath(squareStart, squareFinish, gridMap);
      // disable pointer events on grid
      grid.classList.add('grid--disabled');
      updateStateDom('The best route is', 'Start Again');
    }
    else if (finder_state === 3) {
      finder_state = 1;
      selectedSquares = [];
      squareStart = null;
      squareFinish = null;
      updateStateDom('Draw Routes', 'Finish Drawing');
      resetGrid();
    }
    // if app is in state 1 and min-length requirements have not been met
    else {
      if (selectedSquares.length <= minSelectedSquares){
        new Noty({
          type: 'warning',
          text: 'Please select at least 4 squares',
        }).show();
      } else {
        new Noty({
          type: 'warning',
          text: 'Please select a start and finish square',
        }).show();
        
      } 
    }
  });

  // find shortest path using BFS breadth first search algorithm
  function findPath(start, finish, gridMap) {
    const squaresToVisit = [start];
    
    // store visited squares to avoid visiting them again.
    const visitedSquares = new Set();
    // store the parent of each square to reconstruct the path
    const parentSquares = new Map();
    // loop through all squares until there are no more to visit
    while (squaresToVisit.length > 0) {
      // each loop takes the next square from the queue of squares to visit
      const currentSquare = squaresToVisit.shift();
      visitedSquares.add(currentSquare);
    
      // if the current square is the finish node, path found
      if (currentSquare === finish) {
        break;
      }
    
      // look at all neighbours of the current square 
      const neighbourSquares = getNeighbourSquares(currentSquare, gridMap);

      // if the neighbour is not visited, add it to the queue of squares to visit
      for (const neighbour of neighbourSquares) {
        if (!visitedSquares.has(neighbour)) {
          squaresToVisit.push(neighbour);
          visitedSquares.add(neighbour);
          parentSquares.set(neighbour, currentSquare);
        }
      }
      
    }

    // reconstruct the path from the finish square back to the start square
    const path = [];
    let currentSquare = finish;

    // 
    while (currentSquare !== start) {
      // add to beginning of array
      path.unshift(currentSquare);
      currentSquare = parentSquares.get(currentSquare);
    }
    path.unshift(start);
  
    // highlight the squares in the path
    for (let square of path) {
      if (square !== start && square !== finish) {
        square.classList.add('grid__square--path');
      }
    }

    showResult(path);
    
    // if after going through all squares finish is not found, no path exists
    if (!parentSquares.has(finish)) {
      new Noty({
        type: 'error',
        text: 'No path found.',
      }).show();
      return;
    }
  }
  
  function showResult(path){
    console.log(path.length);
    console.log(selectedSquares.length);
    const resultModal = document.getElementById('result__modal');
    const routeTotal = document.getElementById('route-total');
    const routeShortest = document.getElementById('route-shortest');
    resultModal.style.display = 'flex';
    routeTotal.innerHTML = selectedSquares.length + ' Fields';
    routeShortest.innerHTML = path.length + ' Fields';    
  }

  function getNeighbourSquares(square, gridMap) {
    const row = parseInt(square.dataset.row);
    const col = parseInt(square.dataset.col);
    const isSelected = square.getAttribute('data-selected');
    // store squares thar are neighbours (N S W E) to the current square
    const neighbourSquares = [];

    // check if current square has a neighbour in each direction
    // get neighbour squares representation in the DOM and push to array

    // north [row-1]
    if (row > 1 && gridMap[row-1][col] && isSelected === 'true') {
      neighbourSquares.push(getSquare(row-1, col));
    }
    // east [col+1]
    if (col < 10 && gridMap[row][col+1] && isSelected === 'true') {
      neighbourSquares.push(getSquare(row, col+1));
    }
    // south [row+1]
    if (row < 10 && gridMap[row+1][col] && isSelected === 'true') {
      neighbourSquares.push(getSquare(row+1, col));
    }
    // west [col-1]
    if (col > 1 && gridMap[row][col-1] && isSelected === 'true') {
      neighbourSquares.push(getSquare(row, col-1));
    }
    // edge cases
    if (col === 1 && gridMap[row][col+1] && isSelected === 'true') {
      neighbourSquares.push(getSquare(row, col+1));
    }
    if (col === 10 && gridMap[row][col-1] && isSelected === 'true') {
      neighbourSquares.push(getSquare(row, col-1));
    }
    if (row === 10 && gridMap[row-1][col] && isSelected === 'true') {
      neighbourSquares.push(getSquare(row-1, col));
      console.log('row 10', neighbourSquares);
      
    }
    if (row === 1 && gridMap[row+1][col] && isSelected === 'true') {
      neighbourSquares.push(getSquare(row+1, col));
    }

    // return array of neighbour squares

    return neighbourSquares;

  }

  // in the DOM select the square given row and col 
  function getSquare(row, col) {
    return document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
  }

  // change textContent of finderHeading and finderBtn
  function updateStateDom (headingText, buttonText) {
    finderHeading.textContent = headingText;
    finderBtn.textContent = buttonText;
  }

  // reset grid by removing all classes and data attr. 
  function resetGrid () {
    const squares = grid.querySelectorAll('.grid__square');
    for (const square of squares) {
      square.classList.remove('grid__square--active', 'grid__square--start', 'grid__square--finish', 'grid__square--path');
      square.dataset.selected = false;
    }
    grid.classList.remove('grid--disabled');
  }

  // switch subpages and browser URL hash
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