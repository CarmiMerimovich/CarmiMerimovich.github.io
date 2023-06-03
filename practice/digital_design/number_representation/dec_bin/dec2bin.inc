
const number = Math.trunc(Math.random() * range);
const eNumber = document.getElementById("number");
eNumber.innerHTML = number.toString() + "<sub>10</sub>.";

let step = 0;

function makeAnswer() {
step = 10000;
makeStep();
}
function firstStep() {
step = 0;
makeStep();
}
function makeStep() {
step++;
answer();
}

function answer() {

const eHiddens = document.getElementsByClassName("hidden");
for (const e of eHiddens)
    e.style.visibility = "visible";


const eFirtStepButton = document.getElementById("firstStepButton");
eFirtStepButton.style.visibility = "hidden";
const eNextStepButton = document.getElementById("nextStepButton");
eNextStepButton.style.visibility = "visible";

const eAnswerButton = document.getElementById("answerButton");
eAnswerButton.style.visibility = "hidden";

let result = number;
let s = "";
let count = 0;
do {
    let digit = result % 2;
    let result2 = Math.trunc(result / 2);
    s += `<tr>
        <td style="text-align: right;">${result}</td>
        <td style="text-align: center;">2</td>
        <td style="text-align: right;">${result2}</td>
        <td style="text-align: center;">${digit}</td></tr>`;
    result = result2;
    count++;
} while (result > 0 && count < step);

const eSolution = document.getElementById("solution");
eSolution.innerHTML = "" + (number % 2 ** count).toString(2).padStart(count, "0") + "<sub>2</sub>";

const eCalculation = document.getElementById("calculation");
eCalculation.innerHTML =
     `<table> <tr><th>מחולק</th><th>מחלק</th><th>תוצאה</th><th>שארית</th></tr>
${s} </table>`; 
if (result == 0) 
   eNextStepButton.style.visibility = "hidden";

}
