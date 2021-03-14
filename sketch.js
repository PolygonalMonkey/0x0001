
let canvas = 800;
let rad = 30; // Width of the shape
let xpos, ypos; // Starting position of shape

let xspeed = 2.8; // Speed of the shape
let yspeed = 2.2; // Speed of the shape

let xdirection = 1; // Left or Right
let ydirection = 1; // Top to Bottom

let diameter;
let angle = 0;
let ttlPnts = 5;
let cols, rows, oX, oY;
let grdSprSz = 100; // 100
let grdGap = 170;   // 200

cols = 4; // vType Size
rows = 4;
oX = 80; // Entire Grid offset
oY = 80;
let rectCoors = { "x": [], "y": [] };


function setGridType(vType){

  switch (vType){

    // 2x2
    case 0: 
      ttlPnts = 100; //100 IS GOOOCH
      cols = 2;
      rows = 2;
      grdSprSz = 250; // 100
      grdGap = 400; 
      oX = 80;
      oY = 80;
      fontsize = 200;
      yOff = 175;
      triSz = 48;
      sqrSz = 80;
      cirSz = 80;

    break;

    // 4x4
    case 1:
      ttlPnts = 5;
      cols = 4;
      rows = 4;
      grdSprSz = 100; // 100
      grdGap = 170; 
      oX = 88;
      oY = 88;
      fontsize = 72;
      triSz = 28;
      sqrSz = 40;
      cirSz = 40;
    break;

    // 8x8
    case 2:
      ttlPnts = 5;
      cols = 8;
      rows = 8;
      grdSprSz = 70; // 100
      grdGap = 95; 
      oX = 32;
      oY = 32;
      fontsize = 16;
      triSz = 14;
      sqrSz = 20;
      cirSz = 20;

    break;

    default:
  }
}


// LOADS FONT
function preload() {
  font = loadFont('RobotoMono-Light.ttf');
}

function mapRange(value, low1, high1, low2, high2) {
  return Math.floor(low2 + (high2 - low2) * (value - low1) / (high1 - low1));
}

function getRndBias(min, max, bias, influence) {
  var rnd = Math.random() * (max - min) + min,   // random in range
      mix = Math.random() * influence;           // random mixer
  return Math.floor(rnd * (1 - mix) + bias * mix);           // mix full range and bias
}

// console.log(mapRange(128, 0, 255, 0, 6));
// console.log(getRndBias(0, 255, 200, 0.75));


// HashTxt nums scale
// Continous lines or Spark in drawLine()
//  . . . position bias???
// Shape blanks ???


var hashPairs = [];
var gridHashPairs = [];
var decPairs = [];
let tokenData = { "hashes": ["0xff3960cf0117553097997a0a3d79d8a2cebb9fa21ab311e3f1e803e3d2420fc1"] };

function splitHash(dhp) {

  let numHashes = tokenData.hashes.length;
  // console.log(tokenData.hashes[0]);

  for (let i = 0; i < numHashes; i++) {
    for (let j = 0; j < 32; j++) {
      hashPairs.push(tokenData.hashes[i].slice(2 + (j * 2), 4 + (j * 2)));
    }

  }
}


function getDecPairs(){
  decPairs = hashPairs.map(x => {
    return parseInt(x, 16);
  });
  // console.log(decPairs);
  return decPairs // 0 - 255 values
}


// dhp DotHasPosition / vType change txt arr based according to grid size
function setHashTxt(dhp, vType){

  switch (vType) {

    // 2x2
    case 0:
      gridHashPairs.push("0x", "..", "..", tokenData.hashes[0][64]+tokenData.hashes[0][65]);
      break;

    // 4x4
    case 1:
      gridHashPairs = ["0x"].concat(
        hashPairs.slice(0, dhp).concat(
          ["..."]).concat(
            hashPairs.slice(dhp + 18, 32)
          )
      );
      break;

    // 8x8
    case 2:
      // var arr64 = [];
      for(var i=0; i < tokenData.hashes[0].length; i++){
        if(i == 0 || i == 1 || i == 64 || i == 65){
        }
        else {
          gridHashPairs.push(tokenData.hashes[0][i])
        }
      }

      gridHashPairs = ["0x"].concat(gridHashPairs);
      gridHashPairs.push(tokenData.hashes[0][64] + tokenData.hashes[0][65])

      // console.log(gridHashPairs);
      break;

    default:
  }
}




function createGrid() {

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      var y = i * grdGap;
      var x = j * grdGap;
      // stroke();
      noStroke();

      // GRID GREEN SQUARES HERE!!!
      // fill(0, 255, 0);
      // rect(x + oX, y + oY, grdSprSz, grdSprSz);

      rectCoors.x.push(x + oX);
      rectCoors.y.push(y + oY);

    }
  }

  hashTxtCreate(); // The loop that takes in the grid coordinates and starts to draw the text drawHashTxt();
  
}


let font,
    fontsize = 72;
let yOff = 80 // Hash pairs text yOffset so the text is inside the grid squares
function hashTxtCreate(){
  for (let i = 0; i < gridHashPairs.length; i++) {
    drawHashTxt(gridHashPairs[i], rectCoors.x[i], rectCoors.y[i])   
  }
}

function drawHashTxt(hsh, x, y) {

  noStroke();
  textFont(font);
  textSize(fontsize);

  fill(155);
  // fill(255,0,0);
  text(hsh, x, y + yOff);
}


function getPoints(x, y) {
  let pnts = { "x": [], "y": [] }

  for (let i = 0; i < ttlPnts; i++) {
    pnts.x.push(random(x, x + grdSprSz));
    pnts.y.push(random(y, y + grdSprSz));
  }

  return pnts
}


let triSz = 28;
let sqrSz = 40;
let cirSz = 40;
function createShape(clr, shpPosX, shpPosY) {


  // CHOOSE RANDOME COLOR VAL
  let rand = floor(random(0, 6)); // Add random bias here
  // noStroke();
  // noFill();

  switch (rand) {
    case 0:
      fill(clr);
      ellipse(shpPosX, shpPosY, cirSz, cirSz);
      break;

    case 1:
      fill(clr);
      triangle(shpPosX - triSz, shpPosY + triSz, shpPosX, shpPosY - triSz / 2 - 5, shpPosX + triSz, shpPosY + triSz);
      break;

    case 2:
      fill(clr);
      rect(shpPosX - 15, shpPosY - 15, sqrSz, sqrSz);
      break;


    case 3:
      noFill();
      ellipse(shpPosX, shpPosY, cirSz, cirSz);
      break;

    case 4:
      noFill();
      triangle(shpPosX - triSz, shpPosY + triSz, shpPosX, shpPosY - triSz / 2 - 5, shpPosX + triSz, shpPosY + triSz);
      break;

    case 5:
      noFill();
      rect(shpPosX - 15, shpPosY - 15, sqrSz, sqrSz);
      break;

    case 6:
      // BLANK
      break;

    default:
  }
}


// PICK COLORS FOR SHAPES
let clrs, c0, c1, c2, c3, c4, c5, c6;
function pkClrs(cPalette) {

  //  Kawaii
  c0 = [
    color(109, 95, 146),
    color(216, 145, 177),
    color(255, 215, 145)
  ]

  // Snake
  c1 = [
    color(51, 73, 9),
    color(170, 200, 112),
    color(103, 120, 66)
  ]

  // Coral
  c2 = [
    color(123, 172, 239),
    color(255, 254, 252),
    color(235, 256, 185),
  ]

  // Sunrise
  c3 = [
    color(84, 189, 182),
    color(230, 220, 171),
    color(255, 65, 135),
  ]

  // Melody
  c4 = [
    color(61, 46, 87),
    color(26, 73, 143),
    color(107, 134, 181),
  ]

  // Psychadelic
  c5 = [
    color(255, 93, 38),
    color(234, 50, 84),
    color(233, 255, 112),
  ]

  // Sunset
  c6 = [
    color(253, 205, 121),
    color(213, 96, 76),
    color(16, 41, 46),
  ]

  clrs = [c0, c1, c2, c3, c4, c5, c6]

  var rand2 = floor(random(0, 3)); 

  return clrs[cPalette][rand2] // pick a color from a pallete

}


function drawLine() {
  
  // var cP = floor(random(0, 6));
  var cP = mapRange(decPairs[0], 0, 255, 0, 6); // Choses color palette
  var cP = floor(random(0,6)) // Choses color palette

  for (let i = 0; i < rectCoors.x.length; i++) {
    let pnts = getPoints(rectCoors.x[i], rectCoors.y[i]);

    noStroke();

    // console.log(pkClrs());
    
    // CHOOSE A SHAPE TO CREATE ON LINE POINT 0
    for (let i = 0; i < pnts.x.length; i++) {
      // CIRCLE
      // fill(255, 0, 0);
      // noStroke();
      // ellipse(pnts.x[i], pnts.y[i], 30, 30);

      
      // LINES
      stroke(0);
      strokeWeight(3);
      line(pnts.x[i - 2], pnts.y[i - 2], pnts.x[i], pnts.y[i],); // Toggle between these two line types
      // line(pnts.x[0], pnts.y[0], pnts.x[i], pnts.y[i],); 
    }



    // CALLS CREATE DIFFERENT SHAPES
    createShape(pkClrs(cP), pnts.x[0], pnts.y[0]);


  }
}



// MAIN SETUP START!!!!
function setup() {
  createCanvas(canvas, canvas);
  background(200);

  let vType = Math.floor(random(0,3));
  setGridType(vType)
  

  splitHash();
  
  getDecPairs();
  console.log(decPairs)
  
  var dotHashPos = mapRange(decPairs[10], 0, 255, 0,13);
  setHashTxt(dotHashPos, vType);

  // console.log(gridHashPairs);

  // STARTS HERE   CREATES GRID >>> HASH_TXT_LOOP >>> HASH_TXT_DRAW >>> GET_POINTS_4_LINES >>>
  //                    >>> 
  createGrid();

  drawLine();

  console.log("DONE.");
}


function draw() {
  //UPDATING SIN WAVE
  angle += 0.04;

}
