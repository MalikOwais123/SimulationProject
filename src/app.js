class Machine {
  constructor(type, service, breakdown, repair) {
    this.type = type;
    this.serviceTime = service;
    this.breakdownTime = breakdown;
    this.repairTime = repair;
  }
}

class Repairman {
  constructor(type, utilizedHours, busy) {
    this.type = type;
    this.workingHours = utilizedHours;
    this.busy = busy;
  }
}

var formSet = document.getElementById("formSet"),
  submitButton = document.getElementById("formSubmit");
var simTime = document.getElementById("simTime"),
  sd = document.getElementById("sd"),
  numberDeluxe = document.getElementById("numberDeluxe"),
  numberNormal = document.getElementById("numberNormal"),
  goodUnitsDeluxe = document.getElementById("goodUnitsDeluxe"),
  goodUnitsNormal = document.getElementById("goodUnitsNormal"),
  chargesDeluxe = document.getElementById("chargesDeluxe"),
  chargesNormal = document.getElementById("chargesNormal"),
  serviceDeluxe = document.getElementById("serviceDeluxe"),
  serviceNormal = document.getElementById("serviceNormal"),
  repairDeluxe = document.getElementById("repairDeluxe"),
  repairNormal = document.getElementById("repairNormal"),
  repainmanDeluxe = document.getElementById("repainmanDeluxe"),
  repainmanNormal = document.getElementById("repainmanNormal");

var currentSimTIme = document.getElementById("currentSimTIme");
var currentMachineName = document.getElementById("currentMachineName"),
  currentMachineService = document.getElementById("currentMachineService"),
  currentMachineBreakdown = document.getElementById("currentMachineBreakdown"),
  currentMachineRepair = document.getElementById("currentMachineRepair");
var currentReadyDiv = document.getElementById("queueReady"),
  currentDeluxeDiv = document.getElementById("queueDeluxe"),
  currentNormalDiv = document.getElementById("queueNormal");
var currentIdleTime = document.getElementById("currentIdleTime"),
  currentRevenue = document.getElementById("currentRevenue"),
  currentUtilization = document.getElementById("currentUtilization");
var queueInnerHTML = '<p class="system-status-queue">0</p>',
  queueDeluxeHTML =
    '<p class="system-status-queue" style="color: #0fbf19; background-color: #0fbf19;">0</p>',
  queueNormalHTML =
    '<p class="system-status-queue" style="color: #14fb01; background-color: #14fb01;">0</p>',
  repairInnerHTML =
    '<p class="system-status-queue" style="color: #8aa8c4; background-color: #8aa8c4;">0</p>';

var playPause = document.getElementById("playPause"),
  stopBtn = document.getElementById("stopBtn");

var progressGIF = document.getElementById("progressGIF"),
  idleGIF = document.getElementById("idleGIF"),
  progressState = document.getElementById("progressState"),
  idleState = document.getElementById("idleState");

var resultSimTime = document.getElementById("resultSimTime"),
  resultIdleTime = document.getElementById("resultIdleTime"),
  resultRepairmanUtilization = document.getElementById(
    "resultRepairmanUtilization"
  ),
  resultBreakdown = document.getElementById("resultBreakdown"),
  resultCharges = document.getElementById("resultCharges"),
  resultRevenue = document.getElementById("resultRevenue");

//Simulation Variables
var allMachines = [],
  readyMachines = [],
  deluxeQueue = [],
  normalQueue = [],
  deluxeRepairman,
  normalRepairman,
  currentMachine,
  repairingDeluxe,
  repairingNormal,
  simulationTime,
  systemIdleTime,
  systemRevenue,
  systemRepairmanUtilization,
  maxQueueSize;
var fireNextEvent;

function startSimulation() {
  getThingsDone();
  initializeEventList();
  fireNextEvent = setInterval(function () {
    console.log("fireNextEvent");

    simulationTime += 0.25;
    systemRepairmanUtilization = Math.round(
      ((deluxeRepairman.workingHours + normalRepairman.workingHours) /
        (2 * simulationTime)) *
        100
    ).toFixed(2);

    if (repairingDeluxe) {
      deluxeRepairman.workingHours += 0.25;
      repairingDeluxe.repairTime -= 0.25;
      if (repairingDeluxe.repairTime === 0) {
        repairingDeluxe.breakdownTime = calcBreakdown(
          0,
          repairingDeluxe.serviceTime
        );
        repairingDeluxe.repairTime = roundToNearest(repairDeluxe.value);
        // console.log("repairingDeluxe", repairingDeluxe.repairTime);
        readyMachines.push(repairingDeluxe);
        if (deluxeQueue.length > 0) {
          repairingDeluxe = deluxeQueue.shift();
        } else {
          deluxeRepairman.busy = 0;
          repairingDeluxe = undefined;
        }
        console.log(">>> Repaired Deluxe");
        console.log("Deluxe Busy", deluxeRepairman.busy);
        console.log("Deluxe Queue", deluxeQueue);
      }
    }
    if (repairingNormal) {
      repairingNormal.repairTime -= 0.25;
      normalRepairman.workingHours += 0.25;
      if (repairingNormal.repairTime === 0) {
        repairingNormal.breakdownTime = calcBreakdown(
          0,
          repairingNormal.serviceTime
        );
        repairingNormal.repairTime = roundToNearest(repairNormal.value);
        // console.log("repairingNormal", repairingNormal.repairTime);
        readyMachines.push(repairingNormal);
        if (normalQueue.length > 0) {
          repairingNormal = normalQueue.shift();
        } else {
          normalRepairman.busy = 0;
          repairingNormal = undefined;
        }
        console.log(">>> Repaired Normal");
        console.log("Normal Busy", normalRepairman.busy);
        console.log("Normal Queue", normalQueue);
      }
    }

    if (currentMachine) {
      currentMachine.breakdownTime -= 0.25;
      if (currentMachine.type === 1) {
        systemRevenue += 0.25 * goodUnitsDeluxe.value;
      } else {
        systemRevenue += 0.25 * goodUnitsNormal.value;
      }
    } else {
      if (readyMachines.length > 0) {
        currentMachine = readyMachines.shift();
      } else {
        systemIdleTime += 0.25;
      }
    }

    if (currentMachine.breakdownTime === 0) {
      console.log(">>> Breakdown");
      if (currentMachine.type === 1) {
        if (deluxeRepairman.busy === 1) {
          deluxeQueue.push(currentMachine);
        } else {
          repairingDeluxe = currentMachine;
          deluxeRepairman.busy = 1;
        }
        console.log("Deluxe Busy", deluxeRepairman.busy);
        console.log("Deluxe Queue", deluxeQueue);
      } else {
        if (normalRepairman.busy === 1) {
          normalQueue.push(currentMachine);
        } else {
          repairingNormal = currentMachine;
          normalRepairman.busy = 1;
        }
        console.log("Normal Busy", normalRepairman.busy);
        console.log("Normal Queue", normalQueue);
      }
      currentMachine = undefined;
    }

    updateFrontendVariables();
    stopFiring();
  }, 250);
}

function stopFiring() {
  console.log("{simTime.value}", { simTime: simTime.value, simulationTime });
  if (simTime.value * 8 <= simulationTime) {
    // console.log("deluxeRepairman", deluxeRepairman);
    // console.log("normalRepairman", normalRepairman);
    stopSimulation();
  }
}

function getThingsDone() {
  if (!formSet.elements[0].disabled) {
    // start simulation for the first time only (not for resume) and get things done only once
    submitSystemDetails();
  }
  playPause.classList.replace("btn-success", "btn-warning");
  playPause.classList.remove("control-buttons-play");
  playPause.innerHTML = '<i class="fas fa-pause"></i>';
  submitButton.disabled = "disabled";
  playPause.disabled = "disabled";
  stopBtn.disabled = "";
  progressGIF.style.display = progressState.style.display = "block";
  idleGIF.style.display = idleState.style.display = "none";
}

function initializeEventList() {
  console.log("Initializing Event List");
  // Working For Machines
  var calcDeluxeService = forceDescriptives(
      randomList(
        Number(numberDeluxe.value),
        Number(serviceDeluxe.value) - 5,
        Number(serviceDeluxe.value) + 5
      ),
      Number(serviceDeluxe.value),
      Number(sd.value)
    ),
    calcDeluxeRepair = forceDescriptives(
      randomList(
        Number(numberDeluxe.value),
        Number(repairDeluxe.value) - 2,
        Number(repairDeluxe.value) + 2
      ),
      Number(repairDeluxe.value),
      Number(sd.value)
    ),
    calcDeluxeBreakdown = [];
  for (let i = 0; i < Number(numberDeluxe.value); i++) {
    calcDeluxeBreakdown[i] = calcBreakdown(0, calcDeluxeService[i]);
  }
  var calcNormalService = forceDescriptives(
      randomList(
        Number(numberNormal.value),
        Number(serviceNormal.value) - 5,
        Number(serviceNormal.value) + 5
      ),
      Number(serviceNormal.value),
      Number(sd.value)
    ),
    calcNormalRepair = forceDescriptives(
      randomList(
        Number(numberNormal.value),
        Number(repairNormal.value) - 2,
        Number(repairNormal.value) + 2
      ),
      Number(repairNormal.value),
      Number(sd.value)
    ),
    calcNormalBreakdown = [];
  for (let i = 0; i < Number(numberNormal.value); i++) {
    calcNormalBreakdown[i] = calcBreakdown(0, calcNormalService[i]);
  }
  allMachines = produceMachines(
    calcDeluxeService,
    calcDeluxeRepair,
    calcDeluxeBreakdown,
    calcNormalService,
    calcNormalRepair,
    calcNormalBreakdown
  );
  readyMachines = allMachines;

  // Working For Repairmans
  deluxeRepairman = new Repairman(1, 0, 0);
  normalRepairman = new Repairman(0, 0, 0);

  // Working For Simulation Parameters
  if (readyMachines.length < 1) {
    alert("Restart Simulation With Atleast 1 Machine");
    stopSimulation();
    return;
  }
  simulationTime = 0;
  (deluxeQueue = []), (normalQueue = []);
  currentMachine = readyMachines.shift();
  repairingDeluxe = repairingNormal = undefined;
  (systemIdleTime = 0),
    (systemRevenue = 0),
    (systemRepairmanUtilization = 0),
    (maxQueueSize = 0);
  updateFrontendVariables();
  showResults();
}

function updateFrontendVariables() {
  currentSimTIme.innerHTML = simulationTime;

  currentIdleTime.innerHTML = systemIdleTime;
  currentRevenue.innerHTML = systemRevenue;
  currentUtilization.innerHTML = systemRepairmanUtilization;

  if (currentMachine.type === 1) {
    currentMachineName.innerHTML = "Deluxe Machine";
  } else {
    currentMachineName.innerHTML = "Normal Machine";
  }
  currentMachineService.innerHTML = currentMachine.serviceTime;
  currentMachineBreakdown.innerHTML = currentMachine.breakdownTime;
  currentMachineRepair.innerHTML = currentMachine.repairTime;

  currentReadyDiv.innerHTML = "";
  currentDeluxeDiv.innerHTML = "";
  currentNormalDiv.innerHTML = "";
  if (currentMachine) {
    currentReadyDiv.innerHTML += repairInnerHTML;
  }
  for (let i = 0; i < readyMachines.length; i++) {
    // if (readyMachines[i].type == 1) {
    //     currentReadyDiv.innerHTML += queueDeluxeHTML;
    // } else {
    //     currentReadyDiv.innerHTML += queueNormalHTML;
    // }
    currentReadyDiv.innerHTML += queueInnerHTML;
  }
  if (repairingDeluxe) {
    currentDeluxeDiv.innerHTML += repairInnerHTML;
  }
  for (let i = 0; i < deluxeQueue.length; i++) {
    currentDeluxeDiv.innerHTML += queueInnerHTML;
  }
  if (repairingNormal) {
    currentNormalDiv.innerHTML += repairInnerHTML;
  }
  for (let i = 0; i < normalQueue.length; i++) {
    currentNormalDiv.innerHTML += queueInnerHTML;
  }
}

function produceMachines(dSer, dRep, dBr, nSer, nRep, nBr) {
  var machines = [];
  for (let i = 0; i < dSer.length; i++) {
    if (dRep[i] === 0) {
      dRep[i] = 0.75;
    }
    machines.push(new Machine(1, dSer[i], dBr[i], dRep[i]));
  }
  for (let i = 0; i < nSer.length; i++) {
    if (nRep[i] === 0) {
      nRep[i] = 0.75;
    }
    machines.push(new Machine(0, nSer[i], nBr[i], nRep[i]));
  }
  return shuffle(machines);
}

function calcBreakdown(a, b) {
  // Uniform Random No#
  var x = Math.random() * (b - a) + a;
  if (x > 2) return roundToNearest(x);
  return b;
}

function roundToNearest(number) {
  return (Math.round(number * 4) / 4).toFixed(2);
}

function shuffle(array) {
  var stack = [],
    newArray = [];
  let i = array.length - 1;
  while (array.length !== newArray.length) {
    let j = Math.floor(Math.random() * (i + 1));
    if (!stack.includes(j) && j < array.length) {
      stack.push(j);
      newArray.push(array[j]);
    }
    if (i > 0) i--;
    else i = array.length;
  }
  return newArray;
}

function submitSystemDetails() {
  [].slice.call(formSet.elements).forEach(function (item) {
    item.disabled = !item.disabled;
  });
}

function showResults() {
  //Show Results
  resultSimTime.innerHTML = simulationTime;
  resultIdleTime.innerHTML = systemIdleTime;
  resultRepairmanUtilization.innerHTML = systemRepairmanUtilization;
  resultBreakdown.innerHTML = maxQueueSize;
  resultCharges.innerHTML =
    deluxeRepairman.workingHours * chargesDeluxe.value +
    normalRepairman.workingHours * chargesNormal.value;
  resultRevenue.innerHTML = systemRevenue;
}

function stopSimulation() {
  clearInterval(fireNextEvent);
  if (numberDeluxe.value < numberNormal.value)
    maxQueueSize = Math.round(numberNormal.value / 2);
  else maxQueueSize = Math.round(numberDeluxe.value / 2);
  showResults();
  //Update to Restart Simulation
  submitSystemDetails();
  playPause.classList.replace("btn-warning", "btn-success");
  playPause.classList.add("control-buttons-play");
  playPause.innerHTML = '<i class="fas fa-play"></i>';
  submitButton.disabled = "";
  playPause.disabled = "";
  stopBtn.disabled = "disabled";
  progressGIF.style.display = progressState.style.display = "none";
  idleGIF.style.display = idleState.style.display = "block";
}

/*
    REFERENCE POINT
    https://stackoverflow.com/questions/22619719/javascript-generate-random-numbers-with-fixed-mean-and-standard-deviation/47998841
*/

function randomList(n, a, b) {
  console.log("n, a, b :>> ", n, a, b);
  // create a list of n numbers between a and b
  var list = [],
    i;
  for (i = 0; i < n; i++) {
    list[i] = Math.random() * (b - a) + a;
  }
  console.log("list :>> ", list);
  return list;
}

function descriptives(list) {
  // compute mean, sd and the interval range: [min, max]
  var mean,
    sd,
    i,
    len = list.length,
    sum,
    a = Infinity,
    b = -a;
  for (sum = i = 0; i < len; i++) {
    sum += list[i];
    a = Math.min(a, list[i]);
    b = Math.max(b, list[i]);
  }
  mean = sum / len;
  for (sum = i = 0; i < len; i++) {
    sum += (list[i] - mean) * (list[i] - mean);
  }
  sd = Math.sqrt(sum / (len - 1));
  return {
    mean: mean,
    sd: sd,
    range: [a, b],
  };
}

function forceDescriptives(list, mean, sd) {
  // transfom a list to have an exact mean and sd
  var oldDescriptives = descriptives(list),
    oldMean = oldDescriptives.mean,
    oldSD = oldDescriptives.sd,
    newList = [],
    len = list.length,
    i;
  for (i = 0; i < len; i++) {
    newList[i] = roundToNearest(
      Math.abs((sd * (list[i] - oldMean)) / oldSD + mean)
    );
  }
  console.log("newList :>> ", newList);
  return newList;
}
