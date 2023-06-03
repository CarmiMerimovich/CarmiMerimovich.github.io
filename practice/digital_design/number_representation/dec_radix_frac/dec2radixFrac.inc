
let radix;
do {
    radix = 2 + Math.trunc(Math.random() * 15);
} while (radix == 10); // Not recommend but working
const range = 10**digits;

const eRadixHead = document.getElementById("radixHead");
eRadixHead.innerHTML = radix;

const eRadix = document.getElementById("radix");
eRadix.innerHTML = radix;

const num = Math.trunc(Math.random() * range).toString();
const number = num.padStart(digits, "0");

const eNumber = document.getElementById("number");
eNumber.innerHTML = `0.${number}<sub>10</sub>.`;

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
let allDigits = [];
let allFracs = [result];
do {
    let n = (parseInt(result) * radix).toString().padStart(digits+1, "0");

    let digit = n.substring(0, n.length - digits);
    let result2 = n.slice(-digits);

    s += `<tr>
        <td style="text-align: right;">0.${result} &times; ${radix} = </td>
        <td style="text-align: right;">${digit}.${result2}</td>
        <td style="text-align: center;">${parseInt(digit).toString(radix).toUpperCase()}</td></tr>`;
    result = result2;
    count++;
    allDigits.push(parseInt(digit).toString(radix).toUpperCase());
    if (allFracs.indexOf(result2) >= 0) {
        break;
    }
    allFracs.push(result2);
} while (parseInt(result) > 0 && count < step);

const eSolution = document.getElementById("solution");
if (parseInt(result) == 0)
    eSolution.innerHTML = `0&lrm;.${allDigits.join("")}<sub>${radix}</sub>`;
else {
    let l = allFracs.indexOf(result);
    eSolution.innerHTML = `0&lrm;.${allDigits.slice(0,l).join("")}<span style="color:blue;">${allDigits.slice(l).join("")}&lrm;.&lrm;.&lrm;.</span><sub>${radix}</sub>`;

}
const eCalculation = document.getElementById("calculation");
eCalculation.innerHTML =
     `<table> <tr><th></th><th></th><th>ספרה</th></tr>
${s} </table>`; 
if (parseInt(result) == 0) 
   eNextStepButton.style.visibility = "hidden";

}
