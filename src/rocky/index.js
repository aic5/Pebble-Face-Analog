var rocky = require('rocky');

// Display colors
var line_color = '#ecedef';      // blue
var face_color = '#6a6b60';      // #666666

// Hands Colors
var hand_seconds_color = '#ef3e44';     // 'red'
var hand_minutes_color = '#d8d8d8';   // 'white'
var hand_hours_color = '#77ccef'; // 'lightblue'

// Hands thickness
var hand_seconds_thick = 3;
var hand_minutes_thick = 6;
var hand_hours_thick = 9;


// Weekday names
var day_names = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

// Screen size
var w = 144;
var h = 168;

// Center points
var cx = w / 2;
var cy = h / 2;

// Face watch offset
var face_offset = 10;

// -20 so we're inset 10px on each side
var maxLength = (Math.min(w, h) - 2 * face_offset) / 2;

// Peg size
var peg_size = 5;


// Context related variables
function get_vars(ctx) {

  //Colors

  //Screen dimensions
  w = ctx.canvas.unobstructedWidth;
  h = ctx.canvas.unobstructedHeight;
  
  
}

// Draw the watch pegs
function draw_pegs (ctx, color) {
  
  var peg_color = line_color;
  
  drawPeg(ctx, cx, cy, peg_size, 0, 'white', 4); // 12
  drawPeg(ctx, cx, cy, peg_size, fractionToRadian(1 / 12), peg_color, 2); // 1
  drawPeg(ctx, cx, cy, peg_size, fractionToRadian(2 / 12), peg_color, 2); // 2
  drawPeg(ctx, cx, cy, peg_size, fractionToRadian(3 / 12), 'white', 4); // 3
  drawPeg(ctx, cx, cy, peg_size, fractionToRadian(4 / 12), peg_color, 2); // 4
  drawPeg(ctx, cx, cy, peg_size, fractionToRadian(5 / 12), peg_color, 2); // 5
  drawPeg(ctx, cx, cy, peg_size, fractionToRadian(6 / 12), 'white', 4); // 6
  drawPeg(ctx, cx, cy, peg_size, fractionToRadian(7 / 12), peg_color, 2); // 7
  drawPeg(ctx, cx, cy, peg_size, fractionToRadian(8 / 12), peg_color, 2); // 8
  drawPeg(ctx, cx, cy, peg_size, fractionToRadian(9 / 12), 'white', 4); // 9
  drawPeg(ctx, cx, cy, peg_size, fractionToRadian(10 / 12), peg_color, 2); // 10
  drawPeg(ctx, cx, cy, peg_size, fractionToRadian(11 / 12), peg_color, 2); // 11

  
}

// Draw the background
function draw_background (ctx) {

  // Draw a full circle outline
  // Black background
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, w , h);  
  
  // Large circle
  //ctx.fillStyle = line_color;
  //ctx.rockyFillRadial(w / 2, h / 2, 0, ((w / 2) - 2), 0, 2 * Math.PI);
  
  // Small circle
  //ctx.fillStyle = face_color;
  //ctx.rockyFillRadial(w / 2, h / 2, 0, ((w / 2) - 4), 0, 2 * Math.PI);
}

// Text test
function txt_test(ctx) {

  // Current date/time
  var d = new Date();
  
  // Set the text color
  ctx.fillStyle = 'white';

  // Center align the text
  ctx.textAlign = 'center';

  // Display Time, in the middle of the screen
  ctx.font = '28px Gothic'; //'20px Gothic'
  ctx.fillText(d.toLocaleTimeString().substr(0, 4), w / 2, h / 2 + (maxLength / 2) - 10);

  // Display Date, in the right of the screen
  ctx.font = '18px Gothic'; //'20px Gothic'
  ctx.fillText(d.getDate() + " " + day_names[d.getDay()], w / 2 + maxLength - 20, h / 2 - 15);
  
}

function drawHand(ctx, cx, cy, angle, length, color, lineWidth) {
  // Find the end points
  var x2 = cx + Math.sin(angle) * length;
  var y2 = cy - Math.cos(angle) * length;

  // Configure how we want to draw the hand
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = color;

  // Begin drawing
  ctx.beginPath();

  // Move to the center point, then draw the line
  ctx.moveTo(cx, cy);
  ctx.lineTo(x2, y2);

  // Stroke the line (output to display)
  ctx.stroke();
}

function drawPeg(ctx, cx, cy, r, angle, color, lineWidth) {
  // Find the end points
  var x2 = cx + Math.sin(angle) * (maxLength + face_offset) ;
  var y2 = cy - Math.cos(angle) * (maxLength + face_offset);

  // Find inital peg points
  var cpx = cx + Math.sin(angle) * ((maxLength + face_offset) - r);
  var cpy = cy - Math.cos(angle) * ((maxLength + face_offset) - r);
  
  // Configure how we want to draw the hand
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = color;

  // Begin drawing
  ctx.beginPath();

  // Move to the center point, then draw the line
  ctx.moveTo(cpx, cpy);
  ctx.lineTo(x2, y2);

  // Stroke the line (output to display)
  ctx.stroke();
}

// Draw watch hands
function drawHands (ctx, d) {
  
  // Calculate the second hand angle
  var secondsFraction = (d.getSeconds()) / 60;
  var secondsAngle = fractionToRadian(secondsFraction);

  // Draw the seconds hand
  drawHand(ctx, cx, cy, secondsAngle, maxLength, hand_seconds_color, hand_seconds_thick);
  
  // Calculate the minute hand angle
  var minuteFraction = (d.getMinutes()) / 60;
  var minuteAngle = fractionToRadian(minuteFraction);

  // Draw the minute hand
  drawHand(ctx, cx, cy, minuteAngle, maxLength, hand_minutes_color, hand_minutes_thick);

  // Calculate the hour hand angle
  var hourFraction = (d.getHours() % 12 + minuteFraction) / 12;
  var hourAngle = fractionToRadian(hourFraction);

  // Draw the hour hand
  drawHand(ctx, cx, cy, hourAngle, maxLength * 0.6, hand_hours_color, hand_hours_thick);
  
}

function fractionToRadian(fraction) {
  return fraction * 2 * Math.PI;
}


// Rocky related functions
rocky.on('secondchange', function(event) {
  rocky.requestDraw();
});

rocky.on('draw', function(event) {

  // This is where context comes to life
  var ctx = event.context;
 
  // Context related variables
  get_vars(ctx);

  // Draw background
  draw_background(ctx);
  
  // Peg
  draw_pegs(ctx, 'white');

  // Text test
  txt_test(ctx);

  // Current date/time
  var d = new Date(); 

  // Draw watch hands
  drawHands(ctx, d);
  
  
 // Current date/time
 // var d = new Date();
  
  // Display the time, in the middle of the screen
 // ctx.fillText(d.toLocaleTimeString(), w / 2, h / 2, w);
  
  /*
  ctx.strokeStyle = 'white';
  ctx.beginPath();
  ctx.arc(72, 84, 40, 0, 2 * Math.PI, false);
  ctx.stroke();
*/
  
});
