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

// Initialize settings array places foe each role
let waitersSettingPlace = 0;
let kitchenSettingPlace = 1;
let bartendersSettingPlace = 2;
let shiftManagerSettingPlace = 3;
let busserSettingPlace = 4;
let expoSettingPlace = 5;
let runnersSettingPlace = 6;
let hostessSettingPlace = 7;

// calculation text elements
let totalHoursEl = document.getElementById("total-hours-text");
let perHourEl = document.getElementById("per-hour-text");
let toRestaurantEl = document.getElementById("to-restaurant-text");
let toShiftManagerEl = document.getElementById("to-shift-manager-text");
let toKitchenEl = document.getElementById("to-kitchen-text");
let toBartendersEl = document.getElementById("to-bartenders-text");
let toBusserEl = document.getElementById("to-busser-text");
let toExpoEl = document.getElementById("to-expo-text");
let toRunnersEl = document.getElementById("to-runners-text");
let toHostessEl = document.getElementById("to-hostess-text");

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

function singlePercentageOver100(){
    for(let i = 1; i < formInputArr.length; i++){
        if(parseFloat(formInputArr[i].value) >= 100){
            return true;
        }
    }
    return false;
}

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
    if(!formEl.checkValidity()){
        return;
    }
    if(formNegativeNumberFound()){
        localStorage.setItem("formError", "Error: Negative numbers aren't allowed");
        return;
    }
    if(singlePercentageOver100()){ 
        localStorage.setItem("formError", "Error: A percantage can't be 100 or above.");
        return;
    }
    if(totalPercentageOver100()){ 
        localStorage.setItem("formError", "Error: Total Percentage can't be 100 or above.");
        return;
    }
    let newSettings = [];
    for(let i = 0; i < formInputArr.length; i++){
        newSettings.push(parseFloat(formInputArr[i].value));
    }
    localStorage.setItem("settings", JSON.stringify(newSettings));
    localStorage.setItem("formError", "");
});

// ||TABLE //
function tableErrorFound(){
    for(let i = 1; i <= tableRows; i++){
        let currHour = tableEl.rows[i].cells[1].children[0].value; 
        let currPercentage = tableEl.rows[i].cells[2].children[0].value;
        // check for empty or invalid cells
        if(!currHour){
            tableError = "Invalid table hours section found";
            return true;
        }
        if(!currPercentage){
            tableError = "Invalid table percentage section found";
            return true;
        }
        //check for negative numbers
        if( currHour.includes('-') || currPercentage.includes('-') ){
            tableError = "Table can't contain negative numbers";
            return true;
        }
        if(currHour === 0){
            tableError = "Table hours section can't be 0";
            return true;
        }
        // check that the precentage is between 0 and 100
        currPercentage = parseFloat(currPercentage);
        if(currPercentage <= 0 || currPercentage > 100){
            tableError = "Percentage must be greater than 0 and up to 100"
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
    let percentageCell = row.insertCell(2);
    let amountCell = row.insertCell(3);

    nameCell.classList.add('table-data');
    hoursCell.classList.add('table-data');
    percentageCell.classList.add('table-data');
    amountCell.classList.add('table-data');

    nameCell.innerHTML = `<input type="text" class="table__input" />`;
    hoursCell.innerHTML = `<input type="number" class="table__input" />`;
    percentageCell.innerHTML = `<input type="number" class="table__input" />`;
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
    let totalTips = parseFloat(totalTipsInput.value);
    if(totalTips === 0){
        handleError("Total tips can't be 0");
        return;
    }
     if(tableErrorFound()){
        handleError(tableError);
        tableError = "";
        return;
    }
    
    let waitersHoursArr = [];

    //calculate total hours
    let totalHours = 0;
    let totalHoursByPercentage = 0;
    for(let i = 1; i <= tableRows; i++){
        let currHour = parseFloat(tableEl.rows[i].cells[1].children[0].value);
        let currPercentage = parseFloat(tableEl.rows[i].cells[2].children[0].value);
        let currHourByPercentage = currHour * (currPercentage / 100)
        waitersHoursArr.push(currHourByPercentage);
        totalHours += currHour;
        totalHoursByPercentage += currHourByPercentage;
    }
    if(totalHours === 0){
        handleError("Total waiters hours can't be 0");
        return;
    }

    totalHoursEl.textContent = `Total Hours: ${totalHours}`;
    // deduct the affairs from the total tips
    totalTips -= calculateAffairs(totalTips, totalHours);

    // calculate waiters wage per hour
    let perHour = round(totalTips / totalHoursByPercentage, 2);
    if(perHour < 0){
        perHour = 0;
    }
    perHourEl.textContent = `Per Hour: ${perHour}`;

    calculateWaitersWage(waitersHoursArr, perHour);

    // activate buttons
    activateTableButtons();
});

function calculateAffairs(totalTips, totalHours){
    // calculate restaurnat affair
    let waiterPaysPerHour = settingsArr[waitersSettingPlace];
    let toRestaurant = round(waiterPaysPerHour * totalHours, 1);
    toRestaurantEl.textContent = `To The Restaurant: ${toRestaurant}`;

    // calculate shift manager affair
    let toShiftManager = calculateAffairPercentage(settingsArr[shiftManagerSettingPlace], totalTips);
    toShiftManagerEl.textContent = `To Shift Manager: ${toShiftManager}`;

    // calculate kitchen affair
    let toKitchen = calculateAffairPercentage(settingsArr[kitchenSettingPlace], totalTips);
    toKitchenEl.textContent = `To Kitchen: ${toKitchen}`;

    // calculate bartenders affair
    let toBartenders = calculateAffairPercentage(settingsArr[bartendersSettingPlace], totalTips);
    toBartendersEl.textContent = `To Bartenders: ${toBartenders}`;

    // calculate busser affair
    let toBusser = calculateAffairPercentage(settingsArr[busserSettingPlace], totalTips);
    toBusserEl.textContent = `To Shift Manager: ${toBusser}`;

    // calculate expo affair
    let toExpo = calculateAffairPercentage(settingsArr[expoSettingPlace], totalTips);
    toExpoEl.textContent = `To Expo: ${toExpo}`;

    // calculate runners affair
    let toRunners = calculateAffairPercentage(settingsArr[runnersSettingPlace], totalTips);
    toRunnersEl.textContent = `To Runners: ${toRunners}`;

    // calculate hostess affair
    let toHostess = calculateAffairPercentage(settingsArr[hostessSettingPlace], totalTips);
    toHostessEl.textContent = `To Hostess: ${toHostess}`;

    let affairs_sum = toRestaurant + toShiftManager + toKitchen + toBartenders + toBusser + toExpo + toRunners + toHostess;

    if(affairs_sum > totalTips){
        showError("The cost of affairs is higher than total tips, but is still calculated in order to give you free choice");
    }
    return affairs_sum;
}

// helper function for calculating the affairs
function calculateAffairPercentage(percentage, amount){
    return round((percentage * amount) / 100, 1);
}

function calculateWaitersWage(hoursArr, perHour){
    for(let i = 1; i <= tableRows; i++){
        let currAmount = round(hoursArr[i - 1] * perHour, 1);
        tableEl.rows[i].cells[3].textContent = currAmount;
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