[Live version](https://project-pathfinder-app.monte-dev.repl.co)

Please allow 30 seconds to load the page initially due to replit free tier limitations.




##Pathfinder
This is a simple web application designed to find the shortest path between two points using a specific algorithm. The project structure is based on modern web development standards and utilizes SASS and BEM naming conventions for better readability and maintainability. Main functionality of path finder is built using Breadth First Search algorithm (BFS).

## Features
- Draw a custom route on a 10x10 grid
- Select starting and ending points for the route
- Calculates the shortest path between the starting and ending points
- Displays a summary of the full route and the shortest route

![p_implementation](https://user-images.githubusercontent.com/119732972/230498032-9b3deae3-34fa-49f2-a1a4-9ba6016231aa.png)


### Usage
- Draw your desired route on the grid by clicking on the squares. The route should consist of at least 4 squares.

- Click the "Finish Drawing" button. The app will then prompt you to pick a starting point and an ending point.

- Select the starting and ending points by clicking on the squares that are part of your drawn route.

- Click the "Compute" button. The app will calculate the shortest path between the starting and ending points and display the result in a summary modal.

- Close the summary modal and click the "Start Again" button to reset the grid and draw a new route.

## Installation

Clone the repository:

`git clone https://github.com/monte-dev/pathfinder.git`

Change to the project directory:

`cd pathfinder`.

Navigate to the project directory in your terminal.
Run `npm install` to install all necessary dependencies.

### Development
Run `npm run init-project` to set up the initial project structure.
Run `npm run watch` to start the development server with live-reloading.

Open your browser and navigate to http://localhost:3000.

### Testing
Run `npm test` to run all test suites (HTML, JavaScript, and SCSS).
### Building
Run `npm run build` to create a production-ready build of the project in the dist folder.

## Dependencies
AOS (Animate on Scroll): A library that allows you to animate elements as you scroll down the page.
Noty: A library for creating notifications in web applications.
