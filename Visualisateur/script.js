Bkeeper = new Bkeeper();

document.getElementById("BOptions").addEventListener("change", function () {
  var selectedB = this.value;
  if (selectedB !== "none") {
    Bkeeper.addB(selectedB);
    displayBs(Bkeeper.Bs);
  }
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
        parameterInput.value = B[key];
        parameterInput.addEventListener("change", function (event) {
          B[key] = event.target.value;
        });
        parameterDiv.appendChild(parameterLabel);
        parameterDiv.appendChild(parameterInput);
        behaviorDiv.appendChild(parameterDiv);
      }
    }

    BInfo.appendChild(behaviorDiv);
  });
}
