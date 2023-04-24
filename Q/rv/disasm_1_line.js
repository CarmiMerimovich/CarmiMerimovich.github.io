//
// r v 3 2    D i s a s s e m b l e   o n e   l i n e
//
import {randomInstruction} from "./randomInstruction.js";
import {displayHelp} from "./displayHelp.js";
import {asm} from "./asm.js";

function showMachineAnswer() {
	let eAnswer = document.getElementById("machineAnswer");
	eAnswer.innerHTML = ri.str;
}

function setHelpMode() {
	helpMode = !helpMode;
	let e = document.getElementById("helpMode");
	e.checked = helpMode;
	
	e = document.getElementById("helpMachineText");
	e.innerHTML = "";
	if (helpMode)
		displayHelp(ri);
}

function checkHumanAnswer() {
	let eHumanAnswer = document.getElementById("humanAnswer");
	let line = eHumanAnswer.value;
	let a = asm(line);
	console.log(a);
}

let ri = randomInstruction();
let s = ri.code.toString(16).padStart(8,"0");
s += "<input type='checkbox', id='helpMode'>Help";
s += "<div dir='ltr' id='helpMachineText'></div>";

let eInstruction = document.getElementById("instructionQuestion");
eInstruction.innerHTML = s;

let eHelpMode = document.getElementById("helpMode");
eHelpMode.addEventListener("click", setHelpMode); 

let helpMode = false;

let eAnswerButton = document.getElementById("showAnswer");
eAnswerButton.addEventListener("click", showMachineAnswer); 

let eCheckAnswer = document.getElementById("checkHumanAnswer");
eCheckAnswerButton.addEventListener("click", checkAnswer); 

