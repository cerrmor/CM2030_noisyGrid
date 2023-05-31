//button variable
var projectButton;

//Changing the step size will scale the grid 
var stepSize = 20;
//changing the cols variable adds more columns in the x direction
var cols = 25;
//changing the rows variable adds more rows in the y direction
var rows = 25;

/*changing the nScaling variable will change the rate at which 
the perlin noise will fluctuate. The smaller the Scaling the 
closer to random that changes will appear or the larger the 
Scaling the more uniform.*/
var nScaling = 500;

//variable for storing the compass objects
var compassNeedles =[];

function setup() {
  /*scales the canvas according to changes in the number 
  of rows and/or columns needed to display, and changes in 
  scaling size of stepSize*/
  createCanvas(stepSize*cols, stepSize*rows+150);
  //initilises the instructions upon page load
  instructionMenu();
  //initilises the button that redirects the user to the supporting documentation page
  projectButton = createButton("Click Me!");
  projectButton.position(width/2+125, height-43);
  projectButton.size(100,35);
  projectButton.mouseClicked(toProject);
  //changes the standard of radians to degrees for rotation
  angleMode(DEGREES);
}
///////////////////////////////////////////////////////////////////////
function draw() {
  background(125);

  image(instructionMenu(), 0,height-150);

  colorGrid();
  compassGrid();
}
/////////////////////////////////////////////////////////////////
//draws the instructions to the canvas
function instructionMenu()
{
  var instruction = createGraphics(width, 150);
  instruction.background(255);
  instruction.fill(0);
  instruction.stroke(0,255,0);
  instruction.rect(0,0,instruction.width,instruction.height,20);
  instruction.fill(255);
  instruction.stroke(0);
  instruction.textSize(15);
  instruction.text("Welcome to the Noisy Grid",10,20);
  instruction.text("Grid Controls:\n"+
                   "The speed at which the lines move is controlled by the mouse position\n"+
                   "on the page in the horizontal direction.\n\n"+
                   "left side = Fastest\n"+
                   "right side = Slowest",10,45);
  instruction.text("Supporting Documentation  ==>",155,130);

  return instruction;
}
///////////////////////////////////////////////////////////////////////
function colorGrid(){
  push();
  //iterates the number of columns
  for( var x = 0; x < cols; x++)
  {
    //iterates the number of rows
    for(var y = 0; y < rows; y++)
    {
      /*normilizes the mouse X position between 100 and 400
      to use in scaling the speed of changes based off the
      mouse position in the x direction on the canvas*/
      var speed = map(mouseX,0,width,100,400);
      /*3D perlin noise generation, based off frameCount to be
      used in causing organic appearing changes in the color grid*/
      var n = noise((x*stepSize)/nScaling,(y*stepSize)/nScaling, frameCount/speed);
      //normalizes the perlin noise between 0 and 255 for color changes
      var c = map(n, 0, 1, 0, 255);
      //set the two colours to interpolate between 
      var cFrom = color(c,255,0);
      var cTo = color(0,c,255);
      //generates the colour to be drawn from interpolation
      var fillC = lerpColor(cFrom, cTo, n);

      fill(fillC);
      noStroke();
      rect(x*stepSize,y*stepSize,stepSize,stepSize)
    }
  }
  pop();
}
///////////////////////////////////////////////////////////////////////
function compassGrid(){
  //runs once to fill the compassNeedles array 
  if(compassNeedles.length < cols*rows)
  {
    for( var i =0; i < cols; i++)
    {
      for(var j = 0; j < rows; j++)
      {
        //creates a new instance of the compass needle
        //in the compassNeedles array
        var compass = new CompassNeedle(i,j);
        compassNeedles.push(compass);
      }
    }
  }
  //draws the compass needle
  else
  {
    for( var i =0; i < compassNeedles.length; i++)
    {
      compassNeedles[i].drawCompass();       
    }
  }
}

/////////////////////////////////////////////////////////////////
//Compass Needle Class 
function CompassNeedle(i,j)
{
  this.i = i;
  this.j = j;
  //gives the x and y position based off stepSize for
  //where the compassNeedle should appear in the colour grid
  var x = this.i * stepSize;
  var y = this.j * stepSize;

  this.drawCompass = function ()
  {
    var speed = map(mouseX,0,width,100,400);
    var n = noise(x/nScaling, y/nScaling+stepSize/2, frameCount/speed);
    //tx, and ty sets the translation distence from origin
    var tx = x + stepSize/2;
    var ty = y + stepSize/2;
    //normalizes the perlin noise between 0 and 750 degrees
    //for rotation of the compass needle 
    var rotA = map(n, 0, 1, 0, 750);
    //normalizes the perlin noise between 0 and 255 for changeing the
    //line color
    var lineColor = map(n,0,1,0,255);
    //normalizes the perlin noise between 0 and stepSize for drawing 
    //the line length
    var lineLength = map(n,0,1,0,stepSize);
    //normalizes the perlin noise between 0 and 8 for drawing the 
    //line thickness
    var lineWeight = map(n,0,1,0,8);
    push();

    translate(tx, ty);
    rotate(rotA);
    strokeWeight(lineWeight);
    stroke(0,0,lineColor);
    line(0, 0, 0, -(0 + lineLength));
    
    pop(); 
  }
}

/////////////////////////////////////////////////////////////////
//navigates to the page with supporting documentation
function toProject()
{
  location.href="https://cerrmor.github.io/project_pages/noisyGrid.html";
}
