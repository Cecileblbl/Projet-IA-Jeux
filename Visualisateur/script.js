document
  .getElementById("behaviourOptions")
  .addEventListener("change", function () {
    var selectedBehaviour = this.value;
    if (selectedBehaviour !== "none") {
      addBehaviour(selectedBehaviour);
      displayBehaviours(behaviours);
    }
  });

function displayBehaviours(behaviours) {
  var behaviourInfo = document.getElementById("behaviour-info");
  behaviourInfo.innerHTML = "";

  behaviours.forEach(function (behaviour) {
    if (behaviour instanceof ArrivalBehaviour) {
      console.log(behaviour);
      var behaviourDiv = document.createElement("div");
      behaviourDiv.textContent = "Arrival Behaviour";
      behaviourInfo.appendChild(behaviourDiv);
    }
    if (behaviour instanceof SeekBehaviour) {
      console.log(behaviour);
      var behaviourDiv = document.createElement("div");
      behaviourDiv.textContent = "Seek Behaviour";
      behaviourInfo.appendChild(behaviourDiv);
    }
    if (behaviour instanceof FleeBehaviour) {
      console.log(behaviour);
      var behaviourDiv = document.createElement("div");
      behaviourDiv.textContent = "Flee Behaviour";
    }
  });
}

function addBehaviour(behaviour) {
  // Add the selected behaviour to the vehicle
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
