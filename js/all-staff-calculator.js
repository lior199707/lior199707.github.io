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
let toRestaurantEl = document.getElementById("to-restaurant-text");
let totalWaitersHoursEl = document.getElementById("total-waiters-hours-text");
let waitersPerHourEl = document.getElementById("waiters-per-hour-text");
let totalKitchenHoursEl = document.getElementById("total-kitchen-hours-text");
let kitchenPerHourEl = document.getElementById("kitchen-per-hour-text");
let totalBartendersHoursEl = document.getElementById("total-bartenders-hours-text");
let bartendersPerHourEl = document.getElementById("bartenders-per-hour-text");
let totalShiftManagerHoursEl = document.getElementById("total-shift-manager-hours-text");
let shiftManagerPerHourEl = document.getElementById("shift-manager-per-hour-text");
let totalBusserHoursEl = document.getElementById("total-busser-hours-text");
let busserPerHourEl = document.getElementById("busser-per-hour-text");
let totalExpoHoursEl = document.getElementById("total-expo-hours-text");
let expoPerHourEl = document.getElementById("expo-per-hour-text");
let totalRunnersHoursEl = document.getElementById("total-runners-hours-text");
let runnersPerHourEl = document.getElementById("runners-per-hour-text");
let totalHostessHoursEl = document.getElementById("total-hostess-hours-text");
let hostessPerHourEl = document.getElementById("hostess-per-hour-text");



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
        let currHour = tableEl.rows[i].cells[2].children[0].value; 
        
        // check for empty or invalid cells
        if(!currHour){
            tableError = "Invalid table hours section found";
            return true;
        }
        //check for negative numbers
        if( currHour.includes('-')  ){
            tableError = "Table can't contain negative numbers";
            return true;
        }
        //check if there is an hour section filled with 0
        if(parseFloat(currHour) === 0){
            tableError = "Table hours section can't be 0";
            return true;
        }
    }
    return false
}

function addRow(){
    let row = tableEl.insertRow(tableRows + 1);
    row.classList.add('table-row');
    
    let rollCell = row.insertCell(0);
    let nameCell = row.insertCell(1);
    let hoursCell = row.insertCell(2);
    let amountCell = row.insertCell(3);

    rollCell.classList.add('table-data');
    nameCell.classList.add('table-data');
    hoursCell.classList.add('table-data');
    amountCell.classList.add('table-data');

    rollCell.innerHTML = `
    <select name="role" id="table-role" class="table-role">
        <option value="waiter">Waiter</option>
        <option value="kitchen">Kitchen</option>
        <option value="bartender">Bartender</option>
        <option value="shift-Manager">Shift Manager</option>
        <option value="busser">Busser</option>
        <option value="expo">Expo</option>
        <option value="runner">Runner</option>
        <option value="hostess">Hostess</option>
    </select>`;
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
// will contain the row in the table which a worker with a specific role was found
let waitersArr = [];
let kitchenArr = [];
let bartendersArr = [];
let shiftManagerArr = [];
let busserArr = [];
let expoArr = [];
let runnersArr = [];
let hostessArr = [];
// select values
let waiter = "waiter";
let kitchen = "kitchen";
let bartender = "bartender"
let shiftManager = "shift-Manager"
let busser = "busser"
let expo = "expo";
let runner = "runner";
let hostess = "hostess";

// total role hours
let totalWaiterHours = 0;
let totalKitchenHours = 0;
let totalBartendersHours = 0;
let totalShiftManagerHours = 0;
let totalBusserHours = 0;
let totalExpoHours = 0;
let totalRunnersHours = 0;
let totalHostessHours = 0;

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
    resetStaff();
    sortStaff();

    // if there are no waiters at all
    if(!waitersArr.length){
        handleError("Error, no waiters in the table");
        return;
    }

    let totalAffairs = calculateAffairs(totalTips);

    // waiters calculations
    totalWaitersHoursEl.textContent = "Total Waiters Hours: " + totalWaiterHours;
    totalTips -= totalAffairs;
    calculateRoleRevenue(waitersArr, totalTips, 100, totalWaiterHours, waitersPerHourEl, "Waiters Per Hour:");

    // activate buttons
    activateTableButtons();
});

function sortStaff(){
    for(let i = 1; i <= tableRows; i++){
        let role = tableEl.rows[i].cells[0].children[0].value;
        let roleHours = parseFloat(tableEl.rows[i].cells[2].children[0].value);
        if(role === waiter){
            waitersArr.push(i);
            totalWaiterHours += roleHours;
        }
        else if(role === kitchen){
            kitchenArr.push(i);
            totalKitchenHours += roleHours;
        }
        else if(role === bartender){
            bartendersArr.push(i);
            totalBartendersHours += roleHours;
        }
        else if(role === shiftManager){
            shiftManagerArr.push(i);
            totalShiftManagerHours += roleHours;
        }
        else if(role === busser){
            busserArr.push(i);
            totalBusserHours += roleHours;
        }
        else if(role === expo){
            expoArr.push(i);
            totalExpoHours += roleHours;
        }
        else if(role === runner){
            runnersArr.push(i);
            totalRunnersHours += roleHours;
        }
        else if(role === hostess){
            hostessArr.push(i);
            totalHostessHours += roleHours;
        }
    }
}

function calculateAffairs(totalTips){
    let toKitchen = 0;
    let toBartenders = 0;
    let toShiftManager = 0;
    let toBusser = 0;
    let toExpo = 0;
    let toRunners = 0;
    let toHostess = 0;
    //calculate kitchen revenue
    
    if(kitchenArr.length){
        toKitchen = calculateRoleRevenue(kitchenArr, totalTips, settingsArr[kitchenSettingPlace], totalKitchenHours, kitchenPerHourEl, "Kitchen Per Hour:");
        totalKitchenHoursEl.textContent = "Total Kitchen Hours: " + totalKitchenHours;
    }
    else{
        setZero(totalKitchenHoursEl, kitchenPerHourEl, "Total Kitchen Hours:", "Kitchen Per Hour:");
    }
    if(bartendersArr.length){
        toBartenders = calculateRoleRevenue(bartendersArr, totalTips, settingsArr[bartendersSettingPlace], totalBartendersHours, bartendersPerHourEl , "Bartenders Per Hour:");
        totalBartendersHoursEl.textContent = "Total Bartenders Hours: " + totalBartendersHours;
    }
    else{
        setZero(totalBartendersHoursEl, bartendersPerHourEl, "Total Bartenders Hours:", "Bartenders Per Hour:");
    }
    if(shiftManagerArr.length){
        toShiftManager = calculateRoleRevenue(shiftManagerArr, totalTips, settingsArr[shiftManagerSettingPlace], totalShiftManagerHours, shiftManagerPerHourEl, "Shift Manager Per Hour:");
        totalShiftManagerHoursEl.textContent = "Total shift Manager Hours: " + totalShiftManagerHours;
    }
    else{
        setZero(totalShiftManagerHoursEl, shiftManagerPerHourEl, "Total Shift Manager Hours:", "Shift Manager Per Hour:");
    }
    if(busserArr.length){
        toBusser = calculateRoleRevenue(busserArr, totalTips, settingsArr[busserSettingPlace], totalBusserHours, busserPerHourEl, "Busser Per Hour:");
        totalBusserHoursEl.textContent = "Total Busser Hours: " + totalBusserHours;
    }
    else{
        setZero(totalBusserHoursEl, busserPerHourEl, "Total Busser Hours:", "Busser Per Hour:");
    }
    if(expoArr.length){
        toExpo = calculateRoleRevenue(expoArr, totalTips, settingsArr[expoSettingPlace], totalExpoHours, expoPerHourEl, "Expo Per Hour:");
        totalExpoHoursEl.textContent = "Total Expo Hours: " + totalExpoHours;
    }
    else{
        setZero(totalExpoHoursEl, expoPerHourEl, "Total Expo Hours:", "Expo Per Hour:");
    }
    if(runnersArr.length){
        toRunners = calculateRoleRevenue(runnersArr, totalTips, settingsArr[runnersSettingPlace], totalRunnersHours, runnersPerHourEl, "Runners Per Hour:");
        totalRunnersHoursEl.textContent = "Total Runners Hours: " + totalRunnersHours;
    }
    else{
        setZero(totalRunnersHoursEl, runnersPerHourEl, "Total Runners Hours:", "Runners Per Hour:");
    }
    if(hostessArr.length){
        toHostess = calculateRoleRevenue(hostessArr, totalTips, settingsArr[hostessSettingPlace], totalHostessHours, hostessPerHourEl, "Hostess Per Hour:");
        totalHostessHoursEl.textContent = "Total Hostess Hours: " + totalHostessHours;
    }
    else{
        setZero(totalHostessHoursEl, hostessPerHourEl, "Total Hostess Hours:", "Hostess Per Hour:");
    }
    //to restaurant calculations
    let toRestaurant = round(settingsArr[waitersSettingPlace] * totalWaiterHours, 2);
    toRestaurantEl.textContent = "To The Restaurant: " + toRestaurant;

    let affairs_sum = toKitchen + toBartenders + toShiftManager + toBusser + toExpo + toRunners + toRestaurant + toHostess;

    if(affairs_sum > totalTips){
        showError("The cost of affairs is higher than total tips, but is still calculated in order to give you free choice");
    }
    return affairs_sum;
}

function calculateRoleRevenue(roleArr, totalTips, percentage, totalRoleHours, perHourEl, perHourText){
    totalRoleRevenue = (percentage * totalTips) / 100;
    result = 0;
    let perHour = totalRoleRevenue / totalRoleHours;
    perHourEl.textContent = `${perHourText} ${round(perHour, 2)}`
    for(let i = 0; i < roleArr.length; i++){
        let tableRow = roleArr[i];
        let hours = parseFloat(tableEl.rows[tableRow].cells[2].children[0].value);
        let money = round(perHour * hours, 1);
        tableEl.rows[tableRow].cells[3].textContent = money;
        result += money;
    }
    return result;
}

function setZero(totalHoursEl, perHourEl, totalHoursText, perHourText){
    totalHoursEl.textContent = totalHoursText + " 0";
    perHourEl.textContent = perHourText + " 0";
}
// // helper function for calculating the roles revenue
// function calculateAffairPercentage(percentageStr, amount){
//     return round((parseFloat(percentageStr) * amount) / 100, 1);
// }







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

function resetStaff(){
    // reset arrays
    waitersArr = [];
    kitchenArr = [];
    bartendersArr = [];
    shiftManagerArr = [];
    busserArr = [];
    expoArr = [];
    runnersArr = [];
    hostessArr = [];
    //reset total hours
    totalWaiterHours = 0;
    totalKitchenHours = 0;
    totalBartendersHours = 0;
    totalShiftManagerHours = 0;
    totalBusserHours = 0;
    totalExpoHours = 0;
    totalRunnersHours = 0;
    totalHostessHours = 0;
}

function activateTableButtons(){
    addBtn.disabled = false;
    deleteBtn.disabled = false;
}

function deactivateTableButtons(){
    addBtn.disabled = true;
    deleteBtn.disabled = true;
}