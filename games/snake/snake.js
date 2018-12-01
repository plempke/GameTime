var
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
    /**
     * Game objects
     */
    canvas, /* HTMLCanvas */
    ctx, /* CanvasRenderingContext2d */
    keystate, /* Object, used for keyboard inputs */
    frames, /* number, used for animation */
    score; /* number, keep track of the player score */

grid = {
    /*This holds the number of columns, rows, and array data representation*/

    width: null,
    height: null,
    _grid: null,
    /*Initiates and fills an c, x, r, grid with the value of d */
    init: function(d, c, r) {
        this.width = c;
        this.height = r;
        this._grid = [];

        for (var x = 0; x < c; x++){
            this._grid.push([]);
            for (var y = 0; y <r; y++) {
                this._grid[x].push(d);
            }
        }
    },

    set: function(val, x, y) {
        this._grid[x][y] = val;
    },

    get: function(x,y) {
        return this._grid[x][y];
    }
    

}