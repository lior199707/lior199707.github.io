// || VARIABLES //

let tableBodyEl = document.getElementById("table-body");
let tableEl = document.getElementById("table");
let formEl = document.getElementById("form");
let totalTipsInput = document.getElementById("total-tips-input");
let addBtn = document.getElementById("add-btn");
let deleteBtn = document.getElementById("delete-btn");
let saveBtn = document.getElementById("save-btn");
let calculateBtn = document.getElementById("calculate-btn");
let errorEl = document.getElementById("snackbar");
let tableRows = 1;
// let formInputNum = 7;

// settings elements
let waiterPaysInput = document.getElementById("Waiter_pays_per_hour");
let kitchenInput = document.getElementById("Percentage_for_kitchen");
let bartndersInput = document.getElementById("Percentage_for_bartenders");
let shiftManagerInput = document.getElementById("Percentage_for_shift_manager");
let busserInput = document.getElementById("Percentage_for_busser");
let expoInput = document.getElementById("Percentage_for_expo");
let runnersInput = document.getElementById("Percentage_for_runners");
let hostessInput = document.getElementById("Percentage_for_hostess");
let formInputArr = [
    waiterPaysInput,
    kitchenInput,
    bartndersInput,
    shiftManagerInput,
    busserInput,
    expoInput, 
    runnersInput,
    hostessInput
];

// Initialize settings array places for each role
let waitersSettingPlace = 0;
let kitchenSettingPlace = 1;
let bartendersSettingPlace = 2;
let shiftManagerSettingPlace = 3;
let busserSettingPlace = 4;
let expoSettingPlace = 5;
let runnersSettingPlace = 6;
let hostessSettingPlace = 7;

// calculation text elements
let totalPointsEl = document.getElementById("total-points-text");
let perPointEl = document.getElementById("per-point-text");

// ||LOAD PAGE //

//settings arr
let formError = localStorage.getItem("formError");
if(formError){
    showError(formError);
    // erase the error
    localStorage.setItem("formError", "");
}
let settingsArr = JSON.parse(localStorage.getItem("settings"));
if(!settingsArr || settingsArr.length != formInputArr.length){
    settingsArr = [0, 0, 0, 0, 0, 0, 0, 0];
}
// initialize settings in the input bars
for(let i = 0; i < formInputArr.length; i++){
    formInputArr[i].value = settingsArr[i];
}

// ||FORM //

// checks if a percentage form input value is 100 or above
function singlePercentageOver100(){
    for(let i = 1; i < formInputArr.length; i++){
        if(parseFloat(formInputArr[i].value) >= 100){
            return true;
        }
    }
    return false;
}
// cehcks if the total percentage of the form input is 100 or above
function totalPercentageOver100(){
    let total = 0;
    for(let i = 1; i < formInputArr.length; i++){
        total += parseFloat(formInputArr[i].value);
    }
    return total >= 100;
}

//checks if there is a setting that includes a negative number
function formNegativeNumberFound(){
    if(waiterPaysInput.value.includes('-')){
        return true;
    }
    for(let i = 1; i < formInputArr.length; i++){
        if(formInputArr[i].value.includes('-')){
            return true;
        }
    }
    return false;
}

saveBtn.addEventListener("click", function(){
    // .includes('-')
    if(!formEl.checkValidity()){
        return;
    }
    if(formNegativeNumberFound()){
        localStorage.setItem("formError", "Error: Negative numbers aren't allowed");
        return;
    }
    if(singlePercentageOver100()){ 
        localStorage.setItem("formError", "Error: A percantage can't be 100 or above");
        return;
    }
    if(totalPercentageOver100()){ 
        localStorage.setItem("formError", "Error: Total Percentage can't be 100 or above");
        return;
    }
    let newSettings = [];
    for(let i = 0; i < formInputArr.length; i++){
        newSettings.push(parseFloat(formInputArr[i].value));
    }
    localStorage.setItem("settings", JSON.stringify(newSettings));
    localStorage.setItem("formError", "");
});

function tableErrorFound(){
    for(let i = 1; i <= tableRows; i++){
        let currHour = tableEl.rows[i].cells[1].children[0].value; 
        // check for empty or invalid cells
        if(!currHour){
            tableError = "Invalid table hours section found";
            return true;
        }
        //check for negative numbers
        if(currHour.includes('-')){
            tableError = "Table can't contain negative numbers";
            return true;
        }
        if(paeseFloat(currHour) === 0){
            tableError = "Table hours section can't be 0";
            return true;
        }
    }
    return false
}

function addRow(){
    let row = tableEl.insertRow(tableRows + 1);
    row.classList.add('table-row');
    
    let nameCell = row.insertCell(0);
    let hoursCell = row.insertCell(1);
    let amountCell = row.insertCell(2);

    nameCell.classList.add('table-data');
    hoursCell.classList.add('table-data');
    amountCell.classList.add('table-data');

    nameCell.innerHTML = `<input type="text" class="table__input" />`;
    hoursCell.innerHTML = `<input type="number" class="table__input" />`;
    amountCell.innerHTML = `<td class="table-data">0</td>`;
    tableRows++;
};

addBtn.addEventListener("click", function(){
    addRow();
});

deleteBtn.addEventListener("click", function(){
    if(tableRows > 1){
        tableEl.deleteRow(tableRows);
        tableRows--;
    }
    else{
        showError("Can't delete more rows");
    }
});

// ||CALCULATIONS //
let tableError = "";
calculateBtn.addEventListener("click", function(){
    // deactivate buttons
    deactivateTableButtons();

    if (!totalTipsInput.value){
        handleError("Please fill the Total Tips input field");
        return; 
     }
     if(totalTipsInput.value.includes('-')){
        handleError("Total tips can't be a negative number");
        return;
     }
     if(tableErrorFound()){
        handleError(tableError);
        tableError = "";
        return;
     }
    
    let totalTips = parseFloat(totalTipsInput.value);
    if(totalTips === 0){
        handleError("Total tips can't be 0");
        return;
    }

    let waitersPointsArr = [];
    let totalPoints = 0;
    for(let i = 1; i <= tableRows; i++){
        let currPoints = parseFloat(tableEl.rows[i].cells[1].children[0].value);
        waitersPointsArr.push(currPoints);
        totalPoints += currPoints;
    }
    if(totalPoints === 0){
        handleError("Total Points can't be 0");
        return;
    }
    totalPointsEl.textContent = `Total Poins: ${totalPoints}`;

    // calculate waiters wage per hour
    let perPoint = totalTips / totalPoints;
    if(perPoint < 0){
        perPoint = 0;
    } 
    perPointEl.textContent = `Per Point: ${round(perPoint, 2)}`;

    calculateStaffWage(waitersPointsArr, perPoint);

    // activate buttons
    activateTableButtons();
});

function calculateStaffWage(pointsArr, perPoint){
    for(let i = 1; i <= tableRows; i++){
        let currAmount = round(pointsArr[i - 1] * perPoint, 1);
        tableEl.rows[i].cells[2].textContent = currAmount;
    }
}

// || GENERAL

function round(num, decimalPlace){
    let numStr = num.toString();
    let result = "";
    let numOfDigitsAfterDot = 0;
    let hasSeenDot = false;
    for(let i = 0; i < numStr.length; i++){
        if(numOfDigitsAfterDot === decimalPlace){
            break;
        }
        result += numStr[i];
        if(hasSeenDot){
            numOfDigitsAfterDot++;
        }
        if(numStr[i] === '.'){
            hasSeenDot = true;
        }
    }
    return parseFloat(result);
}

function handleError(error){
    showError(error);
    activateTableButtons();
}

function showError(error){
  // Add the "show" class to DIV
  errorEl.textContent = error;
  errorEl.className = "show";
  
  // After 3 seconds, remove the show class from DIV
  setTimeout(function(){ 
    errorEl.className = errorEl.className.replace("show", "");
    errorEl.textContent = "";
}, 3000);
}

function activateTableButtons(){
    addBtn.disabled = false;
    deleteBtn.disabled = false;
}

function deactivateTableButtons(){
    addBtn.disabled = true;
    deleteBtn.disabled = true;
}