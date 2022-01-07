"use strict";
const overlay = document.querySelector(".overlay");
const messageBox = document.querySelector(".message--box");
const copy = document.querySelector(".copy");
const save = document.querySelector(".save");
const load = document.querySelector(".load");
const colorPicker = document.querySelector(".colorSelect");
const canvas = document.querySelector(".canvas");
const thickness = document.querySelector(".thickness");
let mouseX;
let mouseY;
let mouseDownCanvas = false;
let mousePositions = [];

// exported function for usability
const saveSketch = function () {
  return mousePositions.toString();
};
const drawFunc = function (xf, yf) {
  if (!mouseDownCanvas) return;
  mousePositions.push([
    (xf - canvas.getBoundingClientRect().x).toString().padStart(3, 0),
    (yf - canvas.getBoundingClientRect().y).toString().padStart(3, 0),
    thickness.value,
    colorPicker.value,
    mousePositions.length,
  ]);
  createDotOnCanvas(
    xf - canvas.getBoundingClientRect().x,
    yf - canvas.getBoundingClientRect().y
  );
};

// arr structure
// x, y, thickness, color, currentNum
const loadSketch = function (arr) {
  mousePositions = [];
  let canvasContext2 = canvas.getContext("2d");
  canvasContext2.clearRect(0, 0, 600, 300);
  const sortedArr = arr.toString().split(",").chunk(5);
  sortedArr.forEach((_, i) => {
    thickness.value = sortedArr[i][2];
    colorPicker.value = sortedArr[i][3];
    mousePositions.push([
      (sortedArr[i][0] - canvas.getBoundingClientRect().x)
        .toString()
        .padStart(3, 0),
      (sortedArr[i][1] - canvas.getBoundingClientRect().y)
        .toString()
        .padStart(3, 0),
      thickness.value,
      colorPicker.value,
      mousePositions.length,
    ]);
    createDotOnCanvas(sortedArr[i][0], sortedArr[i][1]);
  });
};
// create dot at position
const createDotOnCanvas = function (x, y) {
  let canvasContext = canvas.getContext("2d");
  canvasContext.beginPath();
  canvasContext.arc(x, y, thickness.value, 0, 2 * Math.PI);
  canvasContext.strokeStyle = colorPicker.value;
  canvasContext.stroke();
  canvasContext.fillStyle = colorPicker.value;
  canvasContext.fill();
  canvasContext.closePath();
};

// get pos of mouse
const showCoords = function (e) {
  let x = e.clientX;
  let y = e.clientY;
  return {
    x: x,
    y: y,
  };
};

// if mouse down then true else false
canvas.addEventListener("mousedown", () => {
  mouseDownCanvas = true;
  clickCount++;
});
document.addEventListener("mouseup", () => {
  mouseDownCanvas = false;
});

// update mouse x and y variables
function updateDisplay(event) {
  mouseX = event.pageX;
  mouseY = event.pageY;
}
let clickCount = 0;
canvas.addEventListener("click", function () {
  clickCount++;
});

// saving using mouse positions
save.addEventListener("click", function () {
  if (clickCount) {
    copy.value = saveSketch();
    copy.select();
    copy.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(copy.value);
    saveSketch();

    overlay.style.backgroundColor = "rgba(141, 141, 141, 0.3)";
    messageBox.style.opacity = "1";
    messageBox.innerHTML = "Copied to clipboard";
    setTimeout(function () {
      overlay.style.backgroundColor = "rgba(141, 141, 141, 0.0)";
      messageBox.style.opacity = "0";
    }, 1500);
  }
});

// loading
load.addEventListener("click", function () {
  overlay.style.backgroundColor = "rgba(141, 141, 141, 0.3)";
  messageBox.style.opacity = "1";
  overlay.style.pointerEvents = "auto";
  messageBox.innerHTML =
    "Enter Save ID below. </br></br></br>  <input type='text' class='sketchId'> <br></br></br><button class='done--btn'>done</button>";
  document.querySelector(".done--btn").addEventListener("click", function () {
    loadSketch(document.querySelector(".sketchId").value.toString());
    overlay.style.backgroundColor = "rgba(141, 141, 141, 0.0)";
    messageBox.style.opacity = "0";
    overlay.style.pointerEvents = "none";
  });
});

// update during movement
canvas.addEventListener("mousemove", updateDisplay, false);
canvas.addEventListener("mouseenter", updateDisplay, false);
canvas.addEventListener("mouseleave", updateDisplay, false);

// update frame
setInterval(function () {
  drawFunc(mouseX, mouseY);
});

// chunk arr function
Array.prototype.chunk = function (size) {
  let result = [];

  while (this.length) {
    result.push(this.splice(0, size));
  }

  return result;
};

// scrapped as it was too buggy
const eraseCanvas = function (x, y) {
  let canvasContext = canvas.getContext("2d");
  canvasContext.beginPath();
  canvasContext.arc(x, y, thickness.value, 0, 2 * Math.PI);
  canvasContext.globalCompositeOperation = "destination-out";

  canvasContext.fill();
  canvasContext.stroke();
};
