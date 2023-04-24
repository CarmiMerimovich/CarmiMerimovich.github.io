//
// c _ a b s
//
import {Ram} from "../Ram.mjs";
import {DisplayRam} from "../DisplayRam.mjs";


let ram = new Ram;
ram.littleEndian = true;
ram.numPages = (2**20); 


let unit = Math.trunc(2 ** Math.trunc(Math.random() * 3));

let value = 2 ** (unit * 8 - 1);

let cType;
if (unit == 1)
	cType = "char";
else if (unit == 2)
	cType = "short";
else if (unit == 4)
	cType = "int";
else if (unit == 4)
	cType = "long int`";

let eFunctionType = document.getElementById("functionType");
eFunctionType.innerHTML = cType;

let eArgumentType = document.getElementById("argumentType");
eArgumentType.innerHTML = cType;


let pageAddress = ram.findUnusedPage();
let address = pageAddress + Math.trunc(Math.random() * 1023) * 4;
if (unit == 1)
	ram.writeB(address+4, value);
else if (unit == 2)
	ram.writeW(address+4, value);
else if (unit == 4)
	ram.writeD(address+4, value);


let esp = address;
let eEsp = document.getElementById("esp");
eEsp.innerHTML = esp.toString(16).padStart(8, "0");

let e = document.getElementById("displayArea");
let displayRam = new DisplayRam(e, ram);

displayRam.addressDigits = 8;
displayRam.unit = Math.pow(2,Math.trunc(Math.random() * 3));
displayRam.unitDigits = displayRam.unit * 2;
if (Math.random() < 0.5)
	displayRam.rtl = false;
else
	displayRam.rtl = true;

displayRam.showD(address);
displayRam.showD(address+4);

displayRam.display();

function displayAnswer() {
	let answer = -value;
	let eAnswer = document.getElementById("answer");
	eAnswer.innerHTML = answer.toString();
}


let eAnswerButton = document.getElementById("answerButton");
eAnswerButton.addEventListener("click", displayAnswer); 

