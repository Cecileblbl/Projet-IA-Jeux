Bkeeper = new Bkeeper();

let isPaused = false;

document.getElementById("pauseButton").addEventListener("click", function () {
  isPaused = !isPaused;
  this.textContent = isPaused ? "Resume" : "Pause";
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

function displayBs(Bs) {
  var BInfo = document.getElementById("B-info");
  BInfo.innerHTML = "";

  // Assuming Bs is an array containing instances of different behavior classes

  Bs.forEach(function (B) {
    var behaviorDiv = document.createElement("div");

    // Add behavior name
    var behaviorName = document.createElement("h4");
    if (B instanceof ArrivalB) {
      behaviorName.textContent = "Arrival B";
    } else if (B instanceof SeekB) {
      behaviorName.textContent = "Seek B";
    } else if (B instanceof FleeB) {
      behaviorName.textContent = "Flee B";
    }
    behaviorDiv.appendChild(behaviorName);

    //remove behaviour button
    var removeButton = document.createElement("button");
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
