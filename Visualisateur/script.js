Bkeeper = new Bkeeper();

let isPaused = false;

document.getElementById("pauseButton").addEventListener("click", function () {
  isPaused = !isPaused;
  this.textContent = isPaused ? "Resume" : "Pause";

  // Change button style based on isPaused
  if (isPaused) {
    this.style.backgroundColor = "#d62929"; // Red background color
    this.style.color = "white"; // White text color
  } else {
    this.style.backgroundColor = "#4a90e2"; // Blue background color
    this.style.color = "white"; // White text color
  }
});

document.getElementById("BOptions").addEventListener("change", function () {
  var selectedB = this.value;
  if (selectedB !== "none") {
    Bkeeper.addB(selectedB);
    displayBs(Bkeeper.Bs);
  }
  // set none as selected option
  this.value = "none";
});

// Récupérez les boutons par leur ID
const addVehicleButton = document.getElementById("addVehicule");
const removeVehicleButton = document.getElementById("removeVehicule");
const clearVehiclesButton = document.getElementById("clearVehicules");

// Ajoutez un écouteur d'événements au bouton "Add vehicule"
addVehicleButton.addEventListener("click", function () {
  // get vehicleNumber input value
  const vehicleNumberInput = document.getElementById("vehicleNumber");
  const vehicleNumber = parseInt(vehicleNumberInput.value);
  for (let i = 0; i < vehicleNumber; i++) {
    addVehicule();
  }
});

// Ajoutez un écouteur d'événements au bouton "Remove vehicule"
removeVehicleButton.addEventListener("click", function () {
  const vehicleNumberInput = document.getElementById("vehicleNumber");
  const vehicleNumber = parseInt(vehicleNumberInput.value);
  for (let i = 0; i < vehicleNumber; i++) {
    // Supprimez un véhicule du tableau
    vehicules.pop();
  }
  console.log(
    "Véhicule supprimé. Nombre total de véhicules :",
    vehicules.length
  );
});

// Ajoutez un écouteur d'événements au bouton "Clear vehicules"
clearVehiclesButton.addEventListener("click", function () {
  // Videz le tableau de véhicules
  vehicules = [];
  console.log(
    "Véhicules effacés. Nombre total de véhicules :",
    vehicules.length
  );
});

let addObstacleButton = document.getElementById("addObstacle");
addObstacleButton.addEventListener("click", function () {
  // Ajoutez un obstacle au tableau
  let obstacleNumber = document.getElementById("obstacleNumber").value;
  for (let i = 0; i < obstacleNumber; i++) {
    addObstacle();
  }
  console.log("Obstacle ajouté. Nombre total d'obstacles :", obstacles.length);
});

let removeObstacleButton = document.getElementById("removeObstacle");
removeObstacleButton.addEventListener("click", function () {
  // Supprimez un obstacle du tableau
  obstacles.pop();
  console.log(
    "Obstacle supprimé. Nombre total d'obstacles :",
    obstacles.length
  );
});

let clearObstaclesButton = document.getElementById("clearObstacles");
clearObstaclesButton.addEventListener("click", function () {
  // Videz le tableau d'obstacles
  obstacles = [];
  console.log(
    "Obstacles effacés. Nombre total d'obstacles :",
    obstacles.length
  );
});

function displayBs(Bs) {
  var BInfo = document.getElementById("B-info");
  BInfo.innerHTML = "";

  // Assuming Bs is an array containing instances of different behavior classes

  Bs.forEach(function (B) {
    var behaviorDiv = document.createElement("div");

    // Add behavior name
    var behaviorName = document.createElement("h4");
    behaviorName.textContent = B.constructor.name;
    behaviorDiv.appendChild(behaviorName);

    //remove behaviour button
    var removeButton = document.createElement("button");
    removeButton.id = "removeButton";
    removeButton.textContent = "Remove";
    removeButton.addEventListener("click", function () {
      Bkeeper.removeB(B);
      displayBs(Bkeeper.Bs);
    });
    behaviorDiv.appendChild(removeButton);

    B.UIdisplay(behaviorDiv);

    // Append behaviorDiv to the main container
    BInfo.appendChild(behaviorDiv);
  });
}

// Define a function to update and display data
function updateAndDisplayData() {
  var data = document.getElementById("data");
  data.innerHTML = "";

  // Assuming vehicles is defined and contains some data
  var vehiclesData = document.createElement("div");

  // Display number of vehicles
  if (vehicules) {
    var vehiclesCount = document.createElement("p");
    vehiclesCount.textContent = "Number of vehicles: " + vehicules.length;
    vehiclesData.appendChild(vehiclesCount);
  }

  // Add vehiclesData to data
  data.appendChild(vehiclesData);
}

// Call updateAndDisplayData() initially to display data
updateAndDisplayData();

// Set up an interval to update data periodically (every 1 second in this example)
setInterval(updateAndDisplayData, 1000);

// Create and append the maxSpeed slider
const datainputs = document.getElementById("datainputs");
datainputs.appendChild(
  createSlider("Vitesse maximale", 0, 10, 0.1, 1, function (e) {
    let newMaxSpeed = parseFloat(e.target.value);
    maxSpeedValue.textContent = newMaxSpeed;
    vehicules.forEach((vehicle) => {
      vehicle.maxSpeed = newMaxSpeed;
    });
  })
);

// Create and append the maxForce slider
datainputs.appendChild(
  createSlider("Force maximale", 0, 2, 0.1, 0.2, function (e) {
    let newMaxForce = parseFloat(e.target.value);
    maxForceValue.textContent = newMaxForce;
    vehicules.forEach((vehicle) => {
      vehicle.maxForce = newMaxForce;
    });
  })
);

// Helper function to create a slider element
function createSlider(labelText, min, max, step, value, onChange) {
  const container = document.createElement("div");
  container.className = "range-slider";

  const boxMinMax = document.createElement("div");
  boxMinMax.className = "box-minmax";

  const label = document.createElement("span");
  label.textContent = `${labelText} (${min} - ${max}) `;

  const valueSpan = document.createElement("span");
  valueSpan.textContent = value;

  const slider = document.createElement("input");
  slider.type = "range";
  slider.min = min;
  slider.max = max;
  slider.step = step;
  slider.value = value;
  slider.className = "rs-range";

  const valueLabel = document.createElement("span");
  valueLabel.className = "rs-label";
  valueLabel.textContent = value;

  slider.addEventListener("input", (e) => {
    const newValue = parseFloat(e.target.value);
    valueSpan.textContent = newValue;
    valueLabel.textContent = newValue;
    onChange(e);
  });

  boxMinMax.appendChild(label);
  boxMinMax.appendChild(valueSpan);

  container.appendChild(boxMinMax);
  container.appendChild(slider);
  container.appendChild(valueLabel);

  // Assign the valueSpan element to a global variable for updating
  if (labelText.includes("Vitesse maximale")) {
    window.maxSpeedValue = valueSpan;
  } else if (labelText.includes("Force maximale")) {
    window.maxForceValue = valueSpan;
  }

  return container;
}
