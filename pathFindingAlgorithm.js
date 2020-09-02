let cols = 75;
let rows = 25;
let grid = new Array(cols);

let w, h;

let openSet = [];
let closedSet = [];

let start = undefined;
let end = undefined;

let path = [];

let noSolution = false;

let playAStar = false;

let playDijkstar = false;

let playBFS = false;

let playDFS = false;

let addWalls = false;

let addStart = false;

let addEnd = false;

let randWalls = false;

function mouseClicked() {
  let i = floor(mouseX / w);
  let j = floor(mouseY / h);
  console.log(i, j);
  if (addStart) {
    addWalls = false;
    addEnd = false;
    if (i >= 0 && j >= 0 && i < cols && j < rows && grid[i][j] != end) {
      start = grid[i][j];
      openSet.push(start);
      addStart = false;
    }
  }
  if (addEnd) {
    addWalls = false;
    addStart = false;
    if (i >= 0 && j >= 0 && i < cols && j < rows && grid[i][j] != start) {
      end = grid[i][j];
      addEnd = false;
    }
  }
  if (addWalls) {
    addStart = false;
    addEnd = false;
    if (i >= 0 && j >= 0 && i < cols && j < rows && grid[i][j] != start && grid[i][j] != end) {
      grid[i][j].wall = true;
    }
  }
}

function removeFromArray(arr, ele) {
  for (let i = arr.length - 1; i >= 0; i--) {
    if (arr[i] == ele) {
      arr.splice(i, 1);
    }
  }
}

function heuristic(a, b) {
  let d = abs(a.i - b.i) + abs(a.j - b.j);
  return d;
}

function randGen() {
  randWalls = true;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = new Spot(i, j);
    }
    start = undefined;
    openSet.pop();
    end = undefined;
  }

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].addNeighbours(grid);
    }
  }
}

function Spot(i, j) {
  this.i = i;
  this.j = j;
  this.f = 0;
  this.g = 0;
  this.h = 0;
  this.neighbours = [];
  this.previous = undefined;
  this.wall = false;
  this.visited = false;

  if (randWalls) {
    if (random(1) < 0.3) {
      this.wall = true;
    }
  }

  this.show = function(col) {
    fill(col);
    if (this.wall) {
      fill("#1b262c");
    }
    noStroke(0);
    rect(this.i * w, this.j * h, w, h);
  }

  this.addNeighbours = function(grid) {
    if (this.i > 0) {
      this.neighbours.push(grid[this.i - 1][this.j]);
    }
    if (this.i < cols - 1) {
      this.neighbours.push(grid[this.i + 1][this.j]);
    }
    if (this.j > 0) {
      this.neighbours.push(grid[this.i][this.j - 1]);
    }
    if (this.j < rows - 1) {
      this.neighbours.push(grid[this.i][this.j + 1]);
    }
  }
}

function setup() {
  createCanvas(1500, 500);

  w = width / cols;
  h = height / rows;

  for (let i = 0; i < cols; i++) {
    grid[i] = new Array(rows);
  }

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = new Spot(i, j);
    }
  }

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].addNeighbours(grid);
    }
  }

}

function draw() {

  let slider = document.getElementById("myRange");
  slider.oninput = function() {
    output.innerHTML = this.value;
    console.log(this.value);
    frameRate(parseInt(this.value));
  }

  if (playAStar) {
    if (openSet.length > 0) {
      let winner = 0;
      for (let i = 0; i < openSet.length; i++) {
        if (openSet[i].f < openSet[winner].f) {
          winner = i;
        }
      }
      var current = openSet[winner];
      if (openSet[winner] === end) {
        noLoop();
        console.log("DONE!!");
      }

      removeFromArray(openSet, current);
      closedSet.push(current);

      var neighbours = current.neighbours;
      for (let i = 0; i < neighbours.length; i++) {
        let neighbour = neighbours[i];

        if (!closedSet.includes(neighbour) && !neighbour.wall) {
          var tempG = current.g + 1;

          if (openSet.includes(neighbour)) {
            if (tempG < neighbour.g) {
              neighbour.g = tempG;
            }
          } else {
            neighbour.g = tempG;
            openSet.push(neighbour);
          }

          neighbour.h = heuristic(neighbour, end);
          neighbour.f = neighbour.g + neighbour.h;
          neighbour.previous = current;
        }
      }
    } else {
      noLoop();
      alert("No Solution!");
      console.log("no solution!");
      noSolution = true;
    }

  }

  if (playDijkstar) {
    if (openSet.length > 0) {
      let winner = 0;
      for (let i = 0; i < openSet.length; i++) {
        if (openSet[i].f < openSet[winner].f) {
          winner = i;
        }
      }
      var current = openSet[winner];
      if (openSet[winner] === end) {
        noLoop();
        console.log("DONE!!");
      }

      removeFromArray(openSet, current);
      closedSet.push(current);

      var neighbours = current.neighbours;
      for (let i = 0; i < neighbours.length; i++) {
        let neighbour = neighbours[i];

        if (!closedSet.includes(neighbour) && !neighbour.wall) {
          var tempG = current.g + 1;

          if (openSet.includes(neighbour)) {
            if (tempG < neighbour.g) {
              neighbour.g = tempG;
            }
          } else {
            neighbour.g = tempG;
            openSet.push(neighbour);
          }

          neighbour.previous = current;
        }
      }
    } else {
      noLoop();
      alert("No Solution!");
      console.log("no solution!");
      noSolution = true;
    }

  }

  if (playBFS) {
    if (openSet.length > 0) {
      let winner = 0;
      for (let i = 0; i < openSet.length; i++) {
        if (openSet[i].f < openSet[winner].f) {
          winner = i;
        }
      }
      var current = openSet[winner];
      if (openSet[winner] === end) {
        noLoop();
        console.log("DONE!!");
      }

      removeFromArray(openSet, current);
      closedSet.push(current);

      var neighbours = current.neighbours;
      for (let i = 0; i < neighbours.length; i++) {
        let neighbour = neighbours[i];

        if (!closedSet.includes(neighbour)) {
          var tempG = current.g + 1;

          if (openSet.includes(neighbour)) {
            if (tempG < neighbour.g) {
              neighbour.g = tempG;
            }
          } else {
            neighbour.g = tempG;
            openSet.push(neighbour);
          }

          //neighbour.h = heuristic(neighbour, end);
          //neighbour.f = neighbour.g + neighbour.h;
          neighbour.previous = current;
        }
      }
    } else {
      noLoop();
      alert("No Solution!");
      console.log("no solution!");
      noSolution = true;
    }

  }

  if (playDFS) {
    if (openSet.length > 0) {
      console.log("in dfs");
      var current = openSet.pop();
      if (current === end) {
        noLoop();
        console.log("DONE!!");
      }
      if (!current.visited) {
        current.visited = true;
        for (let i = 0; i < current.neighbours.length; i++) {
          let neighbour = current.neighbours[i];
          if (!neighbour.visited && !neighbour.wall) {
            openSet.push(neighbour);
            neighbour.previous = current;
          }
        }
      }
    } else {
      noLoop();
      alert("No Solution!");
      console.log("no solution!");
      noSolution = true;
    }
  }

  background(0);

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].show("#bbe1fa");
    }
  }


  for (let i = 0; i < openSet.length; i++) {
    openSet[i].show("#3282b8");
  }


  if (!noSolution && (playAStar || playDijkstar || playBFS || playDFS)) {
    path = [];
    let temp = current;
    path.push(temp);
    while (temp.previous) {
      path.push(temp.previous);
      temp = temp.previous;
    }
  }

  for (let i = 0; i < closedSet.length; i++) {
    closedSet[i].show("#0f4c75");
  }

  for (let i = 0; i < path.length; i++) {
    path[i].show("#ea5455");
  }

  if (end) {
    end.show("#ffc93c");
  }
}

function pathAStar() {
  if (start && end) {
    playAStar = true;
  }
}

function pathDijkstar() {
  if (start && end) {
    playDijkstar = true;
  }
}

function pathBFS() {
  if (start && end) {
    playBFS = true;
  }
}

function pathDFS() {
  if (start && end) {
    playDFS = true;
  }
}

function reset() {
  openSet = [];
  closedSet = [];
  path = [];
  start = undefined;
  end = undefined;
  addStart = false;
  addEnd = false;
  addWalls = false;
  playAStar = false;
  playBFS = false;
  playDijkstar = false;
  playDFS = false;
  randWalls = false;
  noSolution = false;
  for (let i = 0; i < cols; i++) {
    grid[i] = new Array(rows);
  }

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = new Spot(i, j);
    }
  }

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].addNeighbours(grid);
    }
  }
  loop();
}
