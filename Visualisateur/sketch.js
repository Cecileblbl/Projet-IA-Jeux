let button;
let select;
let behaviours = [];

function setup() {
  createCanvas(800, 400); // Increase the canvas width to accommodate the side menus
  background(220);
  // Draw the left menu
  fill(255); // Set the fill color to white
  rect(0, 0, 100, height); // Draw a rectangle at the left edge of the canvas

  // Draw the right menu
  fill(255); // Set the fill color to white
  rect(width - 100, 0, 100, height); // Draw a rectangle at the right edge of the canvas

  // Create the "add behaviour" button
  button = createButton("add behaviour");
  button.position(10, 10);

  // Create the dropdown menu with options
  select = createSelect();
  select.position(10, 50);
  select.option("seek");
  select.option("arrival");
  select.option("flee");
  select.hide(); // Hide the dropdown menu initially
  // Hide the dropdown menu when an option is selected
  select.changed(() => {
    addBehaviour();
    select.hide();
  });

  // Show the dropdown menu when the button is pressed
  button.mousePressed(() => {
    if (select.style("display") === "none") {
      select.show();
    } else {
      select.hide();
    }
  });
}

function draw() {
  showBehaviours();
}

function addBehaviour() {
  // Add the selected behaviour to the vehicle
  let behaviour = select.value();
  if (behaviour === "seek") {
    behaviours.push(new SeekBehaviour(undefined));
  }
  if (behaviour === "arrival") {
    behaviours.push(new ArrivalBehaviour(undefined));
  }
  if (behaviour === "flee") {
    behaviours.push(new FleeBehaviour(undefined));
  }
  console.log(behaviours);
}

function showBehaviours() {
  // Display the behaviours in the left menu
  for (let i = 0; i < behaviours.length; i++) {
    behaviours[i].show(10, 100 + i * 50);
  }
}
