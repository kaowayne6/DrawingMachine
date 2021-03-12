//canvas state variables
var isAnimation = false;
var boolPreviewSize = false;
var boolPreviewToolSize = false;

//this stores all the moving parts in the canvas
var shapeQueue = [];

//Variables
var tool = 'Circle';
var shape = 'Circle';
// var shapeClr = ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet']; 
// var shapeIdx = 0;
var size = 100;
var deg = 15;
var tool_size = 20;
var fps = 60;

//Resets the canvas
function reset() {
  shapeQueue = [];
}

//Setup canvas and all the event handlers
function setup() {
  createCanvas(windowWidth, windowHeight);

  //Grabbing slider values from options menu
  var sizeSlider = document.getElementById("sizeRange");
  var degreesSlider = document.getElementById("degreeRange");
  var toolShapeSizeSlider = document.getElementById("toolRange");
  var fpsSlider = document.getElementById("fpsRange");
  var sizeOutput = document.getElementById("sizeOutput");
  var degreesOutput = document.getElementById("degreeOutput");
  var toolShapeSizeOutput = document.getElementById("toolOutput");
  var fpsOutput = document.getElementById("fpsOutput");

  //div
  var sizeDiv = document.getElementById("size_option");
  var toolSizeDiv = document.getElementById("tool_option");

  //Grab button values
  var toolShapeCircle = document.getElementById("tool_shape_circle");
  var toolShapeSquare = document.getElementById("tool_shape_square");
  var shapeCircle = document.getElementById("shape_circle");
  var shapeSquare = document.getElementById("shape_square");
  var shapeX = document.getElementById("shape_x");

  //Change the value output of the slider as it changes
  sizeSlider.oninput = function() {
    sizeOutput.innerHTML = sizeSlider.value;
    size = parseInt(sizeSlider.value);
  }

  //This takes care of enabling the previews
  sizeDiv.onmouseover = function() {
    boolPreviewSize = true;
  }
  sizeDiv.onmouseleave = function() {
    boolPreviewSize = false;
  }
  toolSizeDiv.onmouseover = function() {
    boolPreviewToolSize = true;
  }
  toolSizeDiv.onmouseleave = function() {
    boolPreviewToolSize = false;
  }

  degreesSlider.oninput = function() {
    degreesOutput.innerHTML = degreesSlider.value;
    deg = parseInt(degreesSlider.value);
  }
  toolShapeSizeSlider.oninput = function() {
    toolShapeSizeOutput.innerHTML = toolShapeSizeSlider.value;
    tool_size = parseInt(toolShapeSizeSlider.value);
  }
  fpsSlider.oninput = function() {
    fpsOutput.innerHTML = fpsSlider.value;
    fps = parseInt(fpsSlider.value);
  }

  //set onClicks for shapeType
  toolShapeCircle.onclick = function() {
    tool = 'Circle';
    toolShapeCircle.style.backgroundColor = "green";
    toolShapeSquare.style.backgroundColor = "initial";
  };
  toolShapeSquare.onclick = function() {
    tool = 'Square';
    toolShapeCircle.style.backgroundColor = "initial";
    toolShapeSquare.style.backgroundColor = "green";
  };

  //Set onclicks for movement type
  shapeCircle.onclick = function() {
    shape = 'Circle';
    shapeCircle.style.backgroundColor = "green";
    shapeSquare.style.backgroundColor = "initial";
    shapeX.style.backgroundColor = "initial";
  };
  shapeSquare.onclick = function() {
    shape = 'Square';
    shapeCircle.style.backgroundColor = "initial";
    shapeSquare.style.backgroundColor = "green";
    shapeX.style.backgroundColor = "initial";
  };
  shapeX.onclick = function() {
    shape = 'X';
    shapeCircle.style.backgroundColor = "initial";
    shapeSquare.style.backgroundColor = "initial";
    shapeX.style.backgroundColor = "green";
  };

  //initially set circle tool shape and circle shape to green
  toolShapeCircle.style.backgroundColor = "green";
  shapeCircle.style.backgroundColor = "green";

}

//On mouse pressed, add another moving object to queue
function mousePressed() {
  if (mouseX < 0 || mouseY < 0)
    return;
  if (shape == 'Square') {
    shapeQueue.push(['Square', size, mouseX, mouseY, mouseX - (size / 2), mouseY - (size / 2), 'Top', tool, tool_size]);
  } 
  
  else if (shape == 'Circle') {
    shapeQueue.push(['Circle', size, deg, mouseX, mouseY, mouseX, mouseY - size, 0, tool, tool_size])
  }
  
  else{  //shape is X
    shapeQueue.push(['X', mouseX, mouseY, size, tool_size, tool, mouseX-(size/2), mouseY-(size/2), 'LR']);
  }
  isAnimation = true;
}

//This should add some indicator on the canvas for how big the movement would be
function previewSize() {
  noFill();
  stroke("red");
  if (shape == 'Circle') {
    ellipse(windowWidth / 2, windowHeight / 2, size * 2, size * 2);
  } else if(shape == 'Square'){
    square(windowWidth / 2 - (size / 2), windowHeight / 2 - (size / 2), size);
  }
  else{  //X
    line(windowWidth/2-(size/2), windowHeight/2-(size/2),windowWidth/2+(size/2),windowHeight/2+(size/2));
    line(windowWidth/2+(size/2), windowHeight/2-(size/2),windowWidth/2-(size/2),windowHeight/2+(size/2));
  }
}

//This should add some indicator on the canvas for size of object moving
function previewToolSize() {
  noFill();
  stroke("red");
  if (tool == 'Circle') {
    ellipse(windowWidth / 2, windowHeight / 2, tool_size, tool_size);
  } else if(tool == 'Square'){
    square(windowWidth / 2 - (tool_size / 2), windowHeight / 2 - (tool_size / 2), tool_size);
  }
}

//This function deals with drawing the X movement type
//['X', centX, centY, size, tool_size, tShape, currX, currY, direction]
function drawX(arr){
  //Put indexes into human friendly variables
  let centX = arr[1];
  let centY = arr[2];
  let mSize = arr[3];
  let tSize = arr[4];
  let tShape = arr[5];
  let currX = arr[6];
  let currY = arr[7];
  let direction = arr[8];
  
  //Display shape at current x and y
  if (tShape == 'Circle') {
    ellipse(currX, currY, tSize, tSize);
  } else { //square
    square(currX, currY, tSize);
  }
  
  //Direction either left to right or right to left
  if(direction == 'LR'){
    if (currX + (mSize / 10) > (centX + (mSize / 2))) {
      direction = 'RL';
      currX = centX + (mSize/2);
      currY = centY - (mSize/2);
    } else {
      currX += mSize / 10;
      currY += mSize/10;
    }
  }
  else{  //RL
    if (currX - (mSize / 10) < (centX - (mSize / 2))) {
      direction = 'LR';
      currX = centX - (mSize/2);
      currY = centY - (mSize/2);
    } else {
      currX -= mSize / 10;
      currY += mSize/10;
    }
  }
  
  //['X', centX, centY, size, tool_size, tShape, currX, currY, direction]
  arr[1] = centX;
  arr[2] = centY;
  arr[3] = mSize;
  arr[4] = tSize;
  arr[5] = tShape;
  arr[6] = currX;
  arr[7] = currY;
  arr[8] = direction;
  
  return arr;
}

//This function deals with drawing the circle movement type
function drawCircle(arr) {
  //Puts variables into user friendly word variables
  let rad = arr[1];
  let degr = arr[2];
  let centX = arr[3];
  let centY = arr[4];
  let radX = arr[5];
  let radY = arr[6];
  let cDeg = arr[7];
  let tShape = arr[8];
  let tSize = arr[9];
  //make point

  if (tShape == 'Circle') {
    ellipse(radX, radY, tSize, tSize);
  } else { //square
    square(radX, radY, tSize);
  }

  //Updates next point
  cDeg += degr; //adds degrees
  //Figures out new x and y
  let newX = rad * Math.sin(cDeg * (Math.PI / 180));
  let newY = rad * Math.cos(cDeg * (Math.PI / 180)) * -1;

  //sets new coords for next cycle
  radX = centX + newX;
  radY = centY + newY;

  //If at full circle
  if (cDeg >= 360) {
    cDeg = 0;
  }

  //reupdate values and pass it back
  arr[1] = rad;
  arr[2] = degr;
  arr[3] = centX;
  arr[4] = centY;
  arr[5] = radX;
  arr[6] = radY;
  arr[7] = cDeg;
  return arr;
}

//This function deals with drawing the square movement type
function drawSquare(arr) {
  //Assign values to human variable names
  let size = arr[1];
  let centX = arr[2];
  let centY = arr[3];
  let edgeX = arr[4];
  let edgeY = arr[5];
  let direction = arr[6];
  let tShape = arr[7];
  let tSize = arr[8];

  //creates tool shape
  if (tShape == 'Circle') {
    ellipse(edgeX, edgeY, tSize, tSize);
  } else { //square
    square(edgeX, edgeY, tSize);
  }
  //Updates position based on which way the tool is moving
  if (direction == 'Top') {
    if (edgeX + (size / 10) > (centX + (size / 2))) {
      direction = 'Right';
      edgeY += size / 10;
    } else {
      edgeX += size / 10;
    }
  } else if (direction == 'Right') {
    if (edgeY + (size / 10) > (centY + (size / 2))) {
      direction = 'Bottom';
      edgeX -= size / 10;
    } else {
      edgeY += size / 10;
    }
  } else if (direction == 'Bottom') {
    if (edgeX - (size / 10) < (centX - (size / 2))) {
      direction = 'Left';
      edgeY -= size / 10;
    } else {
      edgeX -= size / 10;
    }

  } else { //left
    if (edgeY - (size / 10) < (centY - (size / 2))) {
      direction = 'Top';
      edgeX += size / 10;
    } else {
      edgeY -= size / 10;
    }
  }

  //updates array back and returns it
  arr[1] = size;
  arr[2] = centX;
  arr[3] = centY;
  arr[4] = edgeX;
  arr[5] = edgeY;
  arr[6] = direction;
  return arr;
}

//Draw on canvas
function draw() {
  frameRate(fps);
  background('black');
  fill("white");
  noStroke();

  //This goes through all current animations and displays them
  if (isAnimation) {
    //Changes color
    // fill(shapeClr[shapeIdx]);
    // if (shapeIdx + 1 >= shapeClr.length) {
    //   shapeIdx = 0;
    // } else {
    //   shapeIdx++;
    // }

    for (let i = 0; i < shapeQueue.length; i++) {
      let temp_arr = shapeQueue[i];

      //Circle
      if (temp_arr[0] == 'Circle') {
        temp_arr = drawCircle(temp_arr);
      }

      //Square
      else if (temp_arr[0] == 'Square') {
        temp_arr = drawSquare(temp_arr);
      }
      
      //X
      else{
        temp_arr = drawX(temp_arr);
      }
    }
  }

  //If hovering over size or tool size div, show preview
  if (boolPreviewSize) {
    previewSize();
  }
  if (boolPreviewToolSize) {
    previewToolSize();
  }

}