var
  /*constants*/
  COLS = 26,
  ROWS = 26,
  EMPTY = 0,
  SNAKE = 1,
  FRUIT = 2,
  LEFT = 0,
  UP = 1,
  RIGHT = 2,
  DOWN = 3,
  KEY_LEFT = 37,
  KEY_UP = 38,
  KEY_RIGHT = 39,
  KEY_DOWN = 40,
  
  /*Game Objects*/
  canvas, 
  ctx, 
  keystate, 
  frames, 
  score,
  
  /*Setup variables*/
  intialInput,
  submitButton,
  database;
  
  


  

grid = {
  width: null,
  height: null,
  _grid: null,



  /* Initiate and fill a c x r grid with the default value d */
  init: function(d, c, r) {
    this.width = c;
    this.height = r;
    this._grid = [];
    for (var x = 0; x < c; x++) {
      this._grid.push([]);
      for (var y = 0; y < r; y++) {
        this._grid[x].push(d);
      }
    }
  },


  /*Set the value of the grid cell at (x, y) */
  set: function(val, x, y) {
    this._grid[x][y] = val;
  },


  /* Get the value of the cell at (x, y) */
  get: function(x, y) {
    return this._grid[x][y];
  }
}


/*The snake, works as a queue (FIFO, first in first out) of data
with all the current positions in the grid with the snake id */
snake = {
  direction: null,
  last: null,
  _queue: null,

  /*clears the queue and sets the start position/direction*/
  init: function(d, x, y) {
    this.direction = d;
    this._queue = [];
    this.insert(x, y);
  },
  
  
  /*Adds an element to the queue*/
  insert: function(x, y) {
    this._queue.unshift({
      x: x,
      y: y
    });
    this.last = this._queue[0];
  },


  /*Removes and returns the first element in the queue. */
  remove: function() {
    return this._queue.pop();
  }
};


/*Set a food id at a random free cell in the grid*/
function setFood() {
  var empty = [];
  // iterate through the grid and find all empty cells
  for (var x = 0; x < grid.width; x++) {
    for (var y = 0; y < grid.height; y++) {
      if (grid.get(x, y) === EMPTY) {
        empty.push({
          x: x,
          y: y
        });
      }
    }
  }
  // chooses a random cell
  var randpos = empty[Math.round(Math.random() * (empty.length - 1))];
  grid.set(FRUIT, randpos.x, randpos.y);
}


/*Starts the game*/
function main() {
  // create and initiate the canvas element
  canvas = document.createElement("canvas");
  canvas.width = COLS * 20;
  canvas.height = ROWS * 20;
  ctx = canvas.getContext("2d");

  // add the canvas element to the body of the document
  document.body.appendChild(canvas);

  // sets an base font for bigger score display
  ctx.font = "20px arial";
  frames = 0;
  keystate = {};
  // tracks keyboard inputs
  document.addEventListener("keydown", function(evt) {
    keystate[evt.keyCode] = true;
  });
  document.addEventListener("keyup", function(evt) {
    delete keystate[evt.keyCode];
  });
  init();
  loop();
  
}


/*Resets and inits game objects*/
function init() {
  score = 0;
  grid.init(EMPTY, COLS, ROWS);
  var sp = {
    x: Math.floor(COLS / 2),
    y: ROWS - 1
  };
  snake.init(UP, sp.x, sp.y);
  grid.set(SNAKE, sp.x, sp.y);
  setFood();
}


/*The game loop function, used for game updates and rendering*/
function loop() {
  update();
  draw();
  // When ready to redraw the canvas call the loop function
  // first. Runs about 60 frames a second
  window.requestAnimationFrame(loop, canvas);
}


/*Updates the game logic*/
function update() {
  frames++;
  // changes snakes direction based off of keystrokes
  if (keystate[KEY_LEFT] && snake.direction !== RIGHT) {
    snake.direction = LEFT;
  }
  if (keystate[KEY_UP] && snake.direction !== DOWN) {
    snake.direction = UP;
  }
  if (keystate[KEY_RIGHT] && snake.direction !== LEFT) {
    snake.direction = RIGHT;
  }
  if (keystate[KEY_DOWN] && snake.direction !== UP) {
    snake.direction = DOWN;
  }
  // each five frames update the game state.
  if (frames % 5 === 0) {
    // pop the last element from the snake queue i.e. the head
    var nx = snake.last.x;
    var ny = snake.last.y;
    // updates the position depending on the snake direction
    switch (snake.direction) {
      case LEFT:
        nx--;
        break;
      case UP:
        ny--;
        break;
      case RIGHT:
        nx++;
        break;
      case DOWN:
        ny++;
        break;
    }

    // checks all gameover conditions; if it hits the x or y coordinate then the game ends 
    if (0 > nx || nx > grid.width - 1 ||
      0 > ny || ny > grid.height - 1 ||
      grid.get(nx, ny) === SNAKE
    ) {
      return init();
    }
    // check wheter the new position are on the fruit item
    if (grid.get(nx, ny) === FRUIT) {
      // increment the score and sets a new fruit position
      score++;
      setFood();
    } else {
      // take out the snake from the first game and remove it's tail from the grid
      var tail = snake.remove();
      grid.set(EMPTY, tail.x, tail.y);
    }
    // add a snake id at the new position and append it to the snake queue
    grid.set(SNAKE, nx, ny);
    snake.insert(nx, ny);
  }
}


/*Render the grid to the canvas.*/
function draw() {
  // calculate tile-width and -height
  var tw = canvas.width / grid.width;
  var th = canvas.height / grid.height;
  // iterate through the grid and draw all cells
  for (var x = 0; x < grid.width; x++) {
    for (var y = 0; y < grid.height; y++) {
      // sets the fillstyle depending on the id of each cell
      switch (grid.get(x, y)) {
        case EMPTY:
          ctx.fillStyle = "#fff";
          break;
        case SNAKE:
          ctx.fillStyle = "#000";
          break;
        case FRUIT:
          ctx.fillStyle = "#f00";
          break;
      }
      ctx.fillRect(x * tw, y * th, tw, th);
    }
  }
  // changes the fillstyle once more and draws the score message to the canvas
  ctx.fillStyle = "#000";
  ctx.fillText("SCORE: " + score, 10, canvas.height - 10);
}



/*------------------------------------- Code for Firebase ----------------------------------
function startGame() {
  initalInput = createInput("initials");
  submitButton = createButton("submit");
  submitButton.mousePressed(submitScore);

  var answer = prompt("type 'yes' to start the game", "yes");
  if (answer !=null) {
    main();
  }

function submitScore(){
  var data = {
    initals: initialInput.value(),
    score: score
  }
  console.log(data);
  var ref = database.ref('score');
  ref.push(data);
}

/*var database = firebase.database();
--> firebase is the main object that's connected to my online database as it's now in a variable


var read = database.ref('score/snake');
-----------> I want to access the scores node in that tree data <------------

var data = {
	name: "PCL",
	score: 30
	}
ref.push(data);

var initialInput;
var submitButton;

initalInput = createInput('initials');
submitButton = createButton('submit');
submitButton.mousePressed(submitScore);

-------------------> write a function to submit score <----------------

function submitScore() {
	var data = {
		initials: initalInput.value(),
		score: score
		}
	console.log(data)
	var database = firebase.database();
	var ref = database.ref('scores');

	var data = {
		name: PCL,
		score: 30
		}
  ref.push(data);
  
  var ref = database.ref('scores');
ref.on('value', gotData, errData);

function gotData(data){

	var scorelistings = selectAll('.scorelisting');
	for (var  i= 0; i< scorelistinngs.length; i++) 
	
	console.log(data.val);
	var scores = data.val();
	var keys = Object.keys(scores);
	console.log(keys);
	for (var i = 0, i <keys.length, i++) {
		var k = keys[i];
		var initials = scores[k].initials;
		var score = scores[k].score;
		//console.log(initials, scores);
		var li = createElement('li', initials + ':' +score) //creates element for the scores
		li.class('scorelisting'); //assigning these elements to the listing 		

    li.parent('scorelist');
    
function errData(err) {
	console.log('Error!');
	console.log(err);
	}
		
	*/
