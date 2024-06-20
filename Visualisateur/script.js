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

    // Iterate over behavior parameters
    for (var key in B) {
      if (B.hasOwnProperty(key) && typeof B[key] !== "function") {
        var parameterDiv = document.createElement("div");
        var parameterLabel = document.createElement("label");
        parameterLabel.textContent = key + ": ";
        var parameterInput = document.createElement("input");
        parameterInput.type = "text";

        // Check if the current property is 'target'
        if (key === "target" && B[key] instanceof p5.Vector) {
          // Stringify the vector object
          parameterInput.value = JSON.stringify(B[key].array());
        } else {
          parameterInput.value = B[key];
        }

        parameterInput.addEventListener("change", function (event) {
          if (key === "target" && B[key] instanceof p5.Vector) {
            // Parse the input value back to a vector object
            var vectorArray = JSON.parse(event.target.value);
            B[key] = createVector(
              vectorArray[0],
              vectorArray[1],
              vectorArray[2]
            );
          } else {
            B[key] = event.target.value;
            console.log;
          }
        });

        parameterDiv.appendChild(parameterLabel);
        parameterDiv.appendChild(parameterInput);
        behaviorDiv.appendChild(parameterDiv);
      }
    }

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

let maxSpeedInput = document.getElementById("maxSpeed");
maxSpeedInput.addEventListener("change", function () {
  let newMaxSpeed = Number(maxSpeedInput.value);
  vehicules.forEach((vehicle) => {
    vehicle.maxSpeed = newMaxSpeed;
  });
});

let maxForceInput = document.getElementById("maxForce");
maxForceInput.addEventListener("change", function () {
  let newMaxForce = Number(maxForceInput.value);
  vehicules.forEach((vehicle) => {
    vehicle.maxForce = newMaxForce;
  });
});
