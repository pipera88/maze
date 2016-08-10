var dp =(function weekly25() {
  "use strict";
  // r/dailyprogrammer weekly challenge #25.

  // arrays
  var maze, character, end, size, solution, icon, troll, vectors, icons;
  // string
  var facing, icon;
  // booleans
  var can_move, can_push;
  // numbers
  var num_trolls;
  var c1;
  size = [37, 23];
  can_move = {up:false, down:false, left:false, right:false};
  vectors = {up: [0,-1], down: [0,1], left:[-1,0], right:[1,0]};
  icons = {up: '^', down: 'v', left: '<', right: '>'};

  function init() {
    // createMaze();
    drawMaze();
    /*
    chooseStart();
    turnCharacter();
    drawCharacter(character);
    addControls();
    */

    // add the Trolls!
    num_trolls = 2;
    addTroll();

    c1 = new Character('p1');
    c1.chooseStart(maze);
    c1.draw(maze);
    addControls(c1);
  }

  function Character(name) {
    this.name = name;
    this.x = 0;
    this.y = 0;
    this.push = false;
    this.move = {up: false, down: false, left: false, right: false};
    this.dir = [1, 0]; // vector representing xy-coordinates. defaults to 'right'
    this.icon = ">";
  }   

  function drawMaze(m) {
    var default_maze, default_end;
    default_maze = ["#####################################",
      "# #       #       #     #         # #",
      "# # ##### # ### ##### ### ### ### # #",
      "#       #   # #     #     # # #   # #",
      "##### # ##### ##### ### # # # ##### #",
      "#   # #       #     # # # # #     # #",
      "# # ####### # # ##### ### # ##### # #",
      "# #       # # #   #     #     #   # #",
      "# ####### ### ### # ### ##### # ### #",
      "#     #   # #   # #   #     # #     #",
      "# ### ### # ### # ##### # # # #######",
      "#   #   # # #   #   #   # # #   #   #",
      "####### # # # ##### # ### # ### ### #",
      "#     # #     #   # #   # #   #     #",
      "# ### # ##### ### # ### ### ####### #",
      "# #   #     #     #   # # #       # #",
      "# # ##### # ### ##### # # ####### # #",
      "# #     # # # # #     #       # #   #",
      "# ##### # # # ### ##### ##### # #####",
      "# #   # # #     #     # #   #       #",
      "# # ### ### ### ##### ### # ##### # #",
      "# #         #     #       #       # #",
      "#X###################################"];
    default_end = [22, 1];

    default_maze.forEach( function(v,i,a) {
      a[i] = v.split('');
    });
    if (m === undefined) {
      maze = default_maze;
      end = default_end;
    } else {
      maze = m;
    }

    $('.maze').html(maze[0].join('') + "<br />");
    maze.forEach( function(v,i,a) {
      if (i === 0) return;

      $('.maze').append(v.join('') + "<br />");
    });
  }

  function createMaze() {
  }

  /*
   * Randomly selects a starting place for the character.
   */
  function chooseStart(c) {
    var x, y, empty_space;
    empty_space = false;
    while (!empty_space) {
      x = Math.floor(Math.random() * size[0]) - 1;
      y = Math.floor(Math.random() * size[1]) - 1;
      if (maze[y][x] !== "#" && maze[y][x] !== "X") {
        empty_space = true;
      }
    }
    character = [x,y];
    checkMovement();
    checkPush();
  }

  Character.prototype.chooseStart = function (m) {
    var x, y, empty_space;
    while (!empty_space) {
      x = Math.floor(Math.random() * size[0]) - 1;
      y = Math.floor(Math.random() * size[1]) - 1;
      if (m[y][x] !== "#" && m[y][x] !== "X") {
        empty_space = true;
      }
    }
    this.x = x;
    this.y = y;
    this.checkMovement(m);
    this.checkPush(m);
    console.log(this);
  };

  Character.prototype.checkMovement = function(m) {
    this.move = {up:false, down:false, left:false, right:false};
    // check up movement.
    if (m[this.y - 1][this.x] !== "#") {
      this.move.up = true;
    }
    // check down movement.
    if (m[this.y + 1][this.x] !== "#") {
      this.move.down = true;
    }
    // check left movement.
    if (m[this.y][this.x - 1] !== "#") {
      this.move.left = true;
    }
     // check right movement.
    if (m[this.y][this.x + 1] !== "#") {
      this.move.right = true;
    }
  };

  Character.prototype.checkPush = function(m) {
    var brick, space;
    // check if facing a wall.
    brick = [this.x, this.y].vectorAdd(this.dir);
    // [0,1] <= facing
    if (maze[brick[1]][brick[0]] === "#") {
      space = brick.vectorAdd(this.dir);
      if (maze[space[1]][space[0]] === " ") {
        this.push = true;
      }
    } else {
      // considered false if the character is facing an empty space.
      this.push = false;
    }
  };

  Character.prototype.draw = function(m) {
    m[this.y][this.x] = "<span class='character'>" + this.icon + "</span>";
    drawMaze(m);
  };

  Character.prototype.moveCharacter = function(m, d) {
    if (vectors[d][0] === this.dir[0] && vectors[d][1] === this.dir[1]) {
      if (this.move[d]) {
        m[this.y][this.x] = " ";
        this.x += this.dir[0];
        this.y += this.dir[1];
        this.checkMovement(m);
        this.checkPush(m);
      } else if (this.push) {
        this.pushBrick(m);
      }
    } else {
      this.turn(m, d);
    }
    this.draw(m);
  };

  /*
   * Pushes the wall one space.
   */
  Character.prototype.pushBrick = function(m) {
    var brick, space;
    if (this.push) {
      space = [this.x,this.y].vectorAdd(this.dir);
      brick = [this.x,this.y].vectorAdd(this.dir.vectorMultiply(2));
      m[space[1]][space[0]] = " ";
      m[brick[1]][brick[0]] = "#";
      this.checkMovement(m);
      this.push = false;
    } else {
      return "Can't push here.";
    }
  };

  /*
   * Turn the character, changing the representative icon.
   */
  Character.prototype.turn = function(m, d) {
    this.dir = vectors[d];
    this.icon = icons[d];
    this.checkPush(m);
  }

  /*
   * Takes [x,y] coordinates and draws the character at that location.
  function drawCharacter(coordinates) {
    checkMovement();
    checkPush();
    //turnCharacter();
    if (coordinates === undefined) {
      maze[character[1]][character[0]] = "<span class='character'>" + icon + "</span>";
    } else {
      maze[coordinates[1]][coordinates[0]] = "<span class='character'>" + icon + "</span>";
    }
    drawMaze(maze);
    // set the current coordinates of the character;
  }
   */
  /*
   *
  function turnCharacter(direction) {
    var d, dir;
    dir = ["up", "down", "left", "right"];
    if (direction === undefined) {
      for (var i = 0; i < 4; i++) {
        if (can_move[dir[i]]) {
          direction = dir[i];
          break;
        }
      }
    }
    switch (direction) {
      case "up":
      facing = "up";
      icon = "^";
      break;

      case "down":
      facing = "down";
      icon = "v";
      break;

      case "left":
      facing = "left";
      icon = "<";
      break;

      case "right":
      facing = "right";
      icon = ">";
      break;
    }
    //drawCharacter(character);
  }
  */

  /*
   * Checks available moves in the 4 cardinal directions.
  function checkMovement() {
    can_move = {up:false, down:false, left:false, right:false};
    // check up movement.
    if (maze[character[1] - 1][character[0]] !== "#") {
      can_move['up'] = true;
    }
    // check down movement.
    if (maze[character[1] + 1][character[0]] !== "#") {
      can_move['down'] = true;
    }
    // check left movement.
    if (maze[character[1]][character[0] - 1] !== "#") {
      can_move['left'] = true;
    }
     // check right movement.
    if (maze[character[1]][character[0] + 1] !== "#") {
      can_move['right'] = true;
    } 
  }
   */

  /*
   * Checks whether character can push the wall its currently facing.
  function checkPush() {
    // check if facing a wall.
    if (!can_move[facing]) {
      if (facing === "up") {
        if (character[1] !== 1 || character[1] !== 0) {
          can_push = (maze[character[1] - 2][character[0]] !== "#");
        }
      } else if (facing === "down") {
        if (character[1] !== size[1] - 1 || character[1] !== size) {
          can_push = (maze[character[1] + 2][character[0]] !== "#"); 
        }
      } else if (facing === "left") {
        if (character[0] !== 1 || character[0] !== 0) {
          can_push = (maze[character[1]][character[0] - 2] !== "#");
        }
      } else if (facing === "right") {
        if (character[0] !== size[0] - 1 || character[0] !== size[0]) {
          can_push = (maze[character[1]][character[0] + 2] !== "#");
        }
      }
    }
    // default/not facing a wall so can't push.
    //can_push = false;
  }
   */

  /*
   * moves the character or turns the character in the given direction.
   *
   * acceptable args are 'up', 'down', 'left', 'right'.
  function moveCharacter(direction) {
    maze[character[1]][character[0]] = " ";
    direction = direction.toLowerCase();
    // Turn the character.
    if (direction !== facing) {
      turnCharacter(direction);
      //return "Turned " + direction;
    }
    // Move the character one space.
    if (can_move[direction]) {
      switch(direction) {
        case "up":
          character[1] -= 1;
          break;
        case "down":
          character[1] += 1;
          break;
        case "left":
          character[0] -= 1;
          break;
        case "right":
          character[0] += 1;
          break;
      }
      drawCharacter(character);
    } else if (facing === direction && can_push) {
      pushWall(direction);
      drawCharacter(character);
    } else {
      console.log("Cant move this way");
      return "Can't move there. It's blocked!";
    }
  }
   */

  /*
   * Pushes the wall one space.
  function pushWall(direction) {
    if (facing === "up") {
      maze[character[1] - 2][character[0]] = "#";
      maze[character[1] - 1][character[0]] = " ";
    } else if (facing === "down") {
      maze[character[1] + 2][character[0]] = "#"
      maze[character[1] + 1][character[0]] = " "
    } else if (facing === "left") {
      maze[character[1]][character[0] - 2] = "#";
      maze[character[1]][character[0] - 1] = " ";
    } else if (facing === "right") {
      maze[character[1]][character[0] + 2] = "#";
      maze[character[1]][character[0] + 1] = " ";
    }
    //drawCharacter(character);
  }
   */


  function addControls(c) {
    $(document).on("keydown", function(evt) {
      // 38 up, 40 down, 37 left, 39 right.
      if (evt.keyCode >= 37 && evt.keyCode <= 40) {
        evt.preventDefault();
        evt.stopPropagation();
        if (evt.keyCode === 38) {
          //moveCharacter('up');
          c.moveCharacter(maze, 'up');

        } else if (evt.keyCode === 40) {
          //moveCharacter('down');
          c.moveCharacter(maze, 'down');
          
        } else if (evt.keyCode === 37) {
          //moveCharacter('left');
          c.moveCharacter(maze, 'left');
        } else if (evt.keyCode === 39) {
          //moveCharacter('right');
          c.moveCharacter(maze, 'right');
        }
      }
    });
  }

  /*
   * Add troll to the maze.
   */
  function addTroll() {

  }

  /* 
   * Moves the character in a random direction that is available to it.
   */
  function autoMove() {
    var d, c;
    c = ['up','down','left','right'];
    d = Math.floor(Math.random() * 4);
    if (can_move[c[d]]) {
      moveCharacter(c[d]);
    }
  }

  /*
   * Automates movement until exit is found. 
   * Saves coordinates of movement into array of arrays
   * and draws the solution in green.
   */
  function solve() {
    // add the start location to the solution array.
    solution = [character];
  }

  Array.prototype.vectorAdd = function(a2) {
    if (this.length !== a2.length) {
      return "Error: arrays must be equal length";
    }
    return this.map(function(v,i,a) {
      return v + a2[i];
    });
  };

  Array.prototype.vectorMultiply = function(multiplier) {
    if (typeof(multiplier) !== "number") {
      return "Error: multiplier value must be a number";
    }
    return this.map(function(v,i,a) {
      return v * multiplier;
    });
  };

  init();

  return {
    maze: maze,
    move: can_move,
    solve: solve,
    c: c1,
  }
})();
