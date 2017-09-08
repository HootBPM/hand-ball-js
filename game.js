/***********************************************
* First Game

* ** Setup **
* Make sure to place the script tag for this at the 
* bottom of the html body tag

* create a html canvas element with an id selector
* <canvas id="gameCanvas" width="800px" height="600px"></canvas>


***********************************************/
//IIFE to load the game canvas
(function() {

    console.log("Loading Game");

    // waits for the window to run before starting the game
    window.onload = function() {
        var game = new Game().loadCanvas('gameCanvas');
       
        game.run();
        
        //set the paddle position by mouse cursor
        game.canvas.addEventListener('mousemove', function(e) {
            var mousePos = game.findMousePosition(e);
            game.paddle1Y = mousePos.y - (game.PADDLE_HEIGHT/2);
        });
        
        game.canvas.addEventListener('mousedown', function(e){
            //reset the score
            game.playerScore = 0;
            game.level = 1
            game.run();
        })
    }
    
    function Game() {
        this.canvas;
        this.canvasContext;

        //store the frames per second for the game refresh
        this.FPS_DEFAULT = 60;
        this.fps = this.FPS_DEFAULT;
        this.fpsIncrementor = 5;
        //store the orginal x and y coords of ball
        this.xMotion = 100;
        this.yMotion = 150;
        //store the initial xDirection vector
        this.xDirection = 20;
        this.yDirection = 10;
        //stores the paddles y coords
        this.paddle1Y = 250;
        
        //CONSTANTS for paddle
        this.PADDLE_HEIGHT = 100;
        this.PADDLE_WIDTH = 10;
        
        //player score
        this.playerScore = 0;
        this.level = 1;
        this.levelDelimiter = 3;
        
        return this;
    }
    
    //loading the canavs with an inital background
    Game.prototype.loadCanvas = function(selector) {
        //gets the element from the HTML element by ID
        this.canvas = document.getElementById(selector);
        //getting the context 2d / 3d
        this.canvasContext = this.canvas.getContext('2d');
        //return the HTML element not the 'this' object
        return this;
    };
    
    Game.prototype.run = function() {
        var self = this;
        //set the interval at which the canvas refreshes
        clearInterval(this.interval);
        this.interval = setInterval(function() {
                self.play();	
            }, self.fps);
        
        return self;
    }
    
    //runs the game
    Game.prototype.play = function() {
        // next line blanks out the screen with black
        this.drawRectangle(0, 0, this.canvas.width, this.canvas.height, 'black');
        // this is left player paddle
        this.drawRectangle(0, this.paddle1Y, 10, this.PADDLE_HEIGHT, 'white');
        // moves and draws the ball
        this.move();        
        this.drawBall('white', this.xMotion, this.yMotion);
        // add text to screen for score
        this.canvasContext.fillText("Your score is "+this.playerScore, 
                                    30, 20);
        this.canvasContext.fillText("Let's Play Hand Ball", 
                                    this.canvas.width/2 - 50, 20);
        this.canvasContext.fillText("Level " +this.level, 
                                    this.canvas.width - 50, 20);
        this.canvasContext.fillText("-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------", 0, 27);
        
        this.canvasContext.fillText("-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------", 0, this.canvas.height-20);
        
        return this;
    }

    // draws rectangles on the canvas
    Game.prototype.drawRectangle = function(leftX, topY, width, height, color) {
        this.canvasContext.fillStyle = color;
        this.canvasContext.fillRect(leftX,topY, width, height);
        return this;
    }

    //finds the position of the mouse and returns the coords
    //uses the event param passed in by the canvas html element event listener
    Game.prototype.findMousePosition = function(e) {
        var rect = this.canvas.getBoundingClientRect();
        var root = document.documentElement;
        var mouseX = e.clientX - rect.left - root.scrollLeft;
        var mouseY = e.clientY - rect.top - root.scrollTop;
        return {
            x:mouseX,
            y:mouseY
        };
    }

    //moves the ball by changing the direaction and adding/subtracting to the motion of the ball
    Game.prototype.move = function() {
        //controls the x axis motion of the ball
        this.xMotion = this.xMotion + this.xDirection;
        //calculates when the ball reaches the left edge of the canvas
        if (this.xMotion < 0){
            if (this.yMotion > this.paddle1Y &&
                this.yMotion < this.paddle1Y+this.PADDLE_HEIGHT) {
                //change the direction
                this.xDirection = -this.xDirection;
                //make the ball direction and speed change depending on where it hits the paddle
                var deltaY = this.yMotion - (this.paddle1Y + this.PADDLE_HEIGHT/2);
                this.yDirection = deltaY * 0.35;
                //update the player score and move up level if criteria met
                this.playerScore++;
                this.moveUpLevel();
            } else {
                //reset the ball
                this.resetBall();
            }
        }
        //calculates when the ball reaches the right edge of the canvas
        if (this.xMotion > this.canvas.width){
            this.xDirection = -this.xDirection;
        }
        //controls the y axis motion of the ball
        this.yMotion = this.yMotion + this.yDirection;
        //calculates when the ball reaches the bottom edge of the canvas
        if (this.yMotion > this.canvas.height-40){
            this.yDirection = -this.yDirection;
        }
        //calculates when the ball reaches the top edge of the canvas
        // - 35 pixes to account for text at the top of scrren
        if (this.yMotion < 35) {
            this.yDirection = -this.yDirection;
        }
        return this;
    };
    
    // Creates a ball
    Game.prototype.drawBall = function(color, x, y) {
        this.canvasContext.fillStyle = color;
        this.canvasContext.beginPath();
        this.canvasContext.arc(x, y, 7, 0, Math.PI*2, true);
        this.canvasContext.fill();
        
        //return 'this' Game object
        return this;
    };
    
    Game.prototype.resetBall = function() {
        //change the direction of the ball on reset
        this.xDirection = -this.xDirection;
        //gets the horizontal center of the ball
        this.xMotion = this.canvas.width/2;
        //get the vertical center of the ball
        this.yMotion = this.canvas.height/2;
        this.fps = this.FPS_DEFAULT;
        
        this.canvasContext
            .fillText("---------------------------------------------------", 
                225, 200);        
        
        this.canvasContext
            .fillText("Your Score is "+this.playerScore, 
                265, 250);        
        
        this.canvasContext
            .fillText("Level achieved "+this.level, 
                265, 270);        
        
        this.canvasContext
            .fillText("Click to play again", 
                260, 360);        
        
        this.canvasContext
            .fillText("---------------------------------------------------", 
                225, 400);        
        
        //stops the screen refresh
        clearInterval(this.interval);
        
        //return 'this' Game object
        return this;
    }
    
        //moves the level up every time the player gets t10 points
    //moving the level up meas makeing the ball go faster
    Game.prototype.moveUpLevel = function(){
        //check the player has increased score to deleimiter
        if(this.playerScore%this.levelDelimiter === 0){
            //change the paddle heigh as the levels increase
            if (this.level > 5 && this.PADDLE_HEIGHT > 30) {
                this.PADDLE_HEIGHT -= 5;
            }
            //level up
            this.level++
            //rerun the interval to increase the game speed    
            this.fps -= this.fpsIncrementor;
            this.run();
        }
    }
    
}());
