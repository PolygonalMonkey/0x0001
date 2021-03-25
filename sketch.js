var DEFAULT_SIZE = 800
var WIDTH = window.innerWidth
var HEIGHT = window.innerHeight
var DIM = Math.min(WIDTH, HEIGHT)
var M = DIM / DEFAULT_SIZE // SCALE FACTOR

let canvas = DEFAULT_SIZE * M;
let ttlPnts = 5;
let cols, rows, oX, oY;
let grdSprSz = 100 * M; // 100
let grdGap = 170 * M;   // 200

cols = 4; // vType Size
rows = 4;
oX = 80; // Entire Grid offset
oY = 80;
let rectCoors = { "x": [], "y": [] };

function setGridType(vType){

  switch (vType){

    // 2x2
    case 0: 
      // ttlPnts = 10; //100 IS GOOOCH
      ttlPnts = floor(R.random_between(10,100)); //100 IS GOOOCH
      cols = 2;
      rows = 2;
      grdSprSz = 250 * M; // 100
      grdGap = 400 * M; 
      oX = 80 * M;
      oY = 80 * M;
      fontsize = 200 * M;
      yOff = 175 * M;
      triSz = 48 * M;
      sqrSz = 80 * M;
      cirSz = 80 * M;
    break;

    // 4x4
    case 1:
      ttlPnts = 5;
      cols = 4;
      rows = 4;
      grdSprSz = 100 * M; // 100
      grdGap = 170 * M; 
      oX = 88 * M;
      oY = 88 * M;
      fontsize = 72 * M;
      yOff = 80 * M;
      triSz = 28 * M;
      sqrSz = 40 * M;
      cirSz = 40 * M;
    break;

    // 8x8
    case 2:
      ttlPnts = 5;
      cols = 8;
      rows = 8;
      grdSprSz = 70 * M; // 100
      grdGap = 95 * M; 
      oX = 32 * M;
      oY = 32 * M;
      fontsize = 16 * M;
      yOff = 0;
      triSz = 14 * M;
      sqrSz = 20 * M;
      cirSz = 20 * M;
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


var hashPairs = [];
var gridHashPairs = [];
var decPairs = [];

function random_hash() {
  let chars = "0123456789abcdef";
  let result = '0x';
  for (let i = 64; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

let tokenData = {"hash": [random_hash()]} // HASH VALUE MUST BE INSIDE THE ARRAY!!!
// let tokenData = {"hash": ["0x0bb03779540a0a975c7895b48449f190d7cebb24e30b1c05142f68b6ff070707"]} // TEST HASH

console.log(tokenData.hash[0]);
// let tokenData = { "hashes": ["0xff3960cf0117553097997a0a3d79d8a2cebb9fa21ab311e3f1e803e3d2420fc1"] };


function splitHash(dhp) {

  let numHash = tokenData.hash.length;

  for (let i = 0; i < numHash; i++) {
    for (let j = 0; j < 32; j++) {
      hashPairs.push(tokenData.hash[i].slice(2 + (j * 2), 4 + (j * 2)));
    }

  }
}


function getDecPairs(){
  decPairs = hashPairs.map(x => {
    return parseInt(x, 16);
  });
  return decPairs // 0 - 255 values
}

// SEED
class Random {
  constructor(seed) {
    this.seed = seed
  }
  random_dec() {
    this.seed ^= this.seed << 13
    this.seed ^= this.seed >> 17
    this.seed ^= this.seed << 5
    return ((this.seed < 0 ? ~this.seed + 1 : this.seed) % 1000) / 1000
  }
  random_between(a, b) {
    return a + (b - a) * this.random_dec()
  }
  random_int(a, b) {
    return Math.floor(this.random_between(a, b+1))
  }
  random_choice(x) {
    return x[Math.floor(this.random_between(0, x.length * 0.99))]
  }
}


splitHash();
getDecPairs();

console.log()
let MySeed = [decPairs[0],decPairs[2],decPairs[4],decPairs[6],decPairs[8]].join("");
console.log(MySeed);

let R = new Random(MySeed);

console.log(decPairs)

////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// dhp DotHasPosition / vType change txt arr based according to grid size
function setHashTxt(dhp, vType){

  switch (vType) {

    // 2x2
    case 0:
      gridHashPairs.push("0x", "..", "..", tokenData.hash[0][64]+tokenData.hash[0][65]);
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
      for(var i=0; i < tokenData.hash[0].length; i++){
        if(i == 0 || i == 1 || i == 64 || i == 65){
        }
        else {
          gridHashPairs.push(tokenData.hash[0][i])
        }
      }

      gridHashPairs = ["0x"].concat(gridHashPairs);
      gridHashPairs.push(tokenData.hash[0][64] + tokenData.hash[0][65])

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

  if( [decPairs[31],decPairs[30],decPairs[29]].join("") == "777"){
    fill(255,0,0);
  } else {
    fill(155);
  }
  text(hsh, x, y + yOff);
}


function getPoints(x, y) {
  let pnts = { "x": [], "y": [] }

  for (let i = 0; i < ttlPnts; i++) {
    // pnts.x.push(random(x, x + grdSprSz));
    // pnts.y.push(random(y, y + grdSprSz));
    pnts.x.push(R.random_between(x, x + grdSprSz));
    pnts.y.push(R.random_between(y, y + grdSprSz));
  }
  return pnts
}


let triSz = 28;
let sqrSz = 40;
let cirSz = 40;
function createShape(clr, shpPosX, shpPosY) {


  // CHOOSE RANDOME COLOR VAL
  let rand;
  // let rand = floor(random(0, 6)); // Add random bias here
  // console.log(rand);
  // noStroke();
  // noFill();
  strokeJoin(ROUND);

  if( [decPairs[31],decPairs[30],decPairs[29]].join("") == "777"){
    rand = floor(R.random_between(3,6));
  } else {
    rand = floor(R.random_between(0,6))
  }

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
      rect(shpPosX - 15 * M, shpPosY - 15 * M, sqrSz, sqrSz);
      break;


    case 3:
      noFill();
      ellipse(shpPosX, shpPosY, cirSz, cirSz);
      break;

    case 4:
      noFill();
      triangle(shpPosX - triSz, shpPosY + triSz, shpPosX, (shpPosY - triSz / 2) - (5 * M), shpPosX + triSz, shpPosY + triSz);
      break;

    case 5:
      noFill();
      rect(shpPosX - 15 * M, shpPosY - 15 * M , sqrSz, sqrSz);
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

  // var rand2 = floor(random(0, 3)); 
  var randC = floor(R.random_between(0,3)); 

  return clrs[cPalette][randC] // pick a color from a pallete

}


function drawLine() {
  
  // var cP = floor(random(0, 6));
  // var cP = mapRange(decPairs[0], 0, 255, 0, 6); // Choses color palette IMPORTANT
  // var cP = floor(random(0,6)) // Choses color palette
  var cP = floor(R.random_between(0,6)) // Choses color palette

  for (let i = 0; i < rectCoors.x.length; i++) {
    let pnts = getPoints(rectCoors.x[i], rectCoors.y[i]);

    noStroke();

    // console.log(pkClrs());
    
    // CHOOSE A SHAPE TO CREATE ON LINE POINT 0
    for (let i = 0; i < pnts.x.length; i++) {

      // LINES
      stroke(0);
      strokeWeight(3 * M);
      line(pnts.x[i - 2], pnts.y[i - 2], pnts.x[i], pnts.y[i],); // Toggle between these two line types?
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

  // let vType = Math.floor(random(0,3));
  // console.log(decPairs[28]);
  let vType = mapRange(decPairs[31],0,255,0,2);
  console.log(vType);
  setGridType(vType) //TypeHere
  
  
  var dotHashPos = mapRange(decPairs[30], 0, 255, 0,13);
  setHashTxt(dotHashPos, vType); //vType Here

  createGrid();

  drawLine();

  console.log("DONE.");
}
