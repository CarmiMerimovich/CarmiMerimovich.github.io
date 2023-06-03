//
// c v a r _ c o n t e n t
//
import {Ram} from "./Ram.mjs";
import {DisplayRam} from "./DisplayRam.mjs";


let ram = new Ram;
ram.littleEndian = true;
ram.numPages = Math.pow(2,20); 

let valueA = Math.trunc(Math.random() * 256);
let valueB = Math.trunc(Math.random() * 256);

let pageAddress = ram.findUnusedPage();
let address = pageAddress + Math.trunc(Math.random() * 1022) * 4;
ram.writeB(address+4, valueA);
ram.writeB(address+8, valueB);


let esp = address;
let Esp = document.getElementById("esp");
Esp.innerHTML = esp.toString(16);

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
displayRam.showD(address+8);




displayRam.display();

function displayAnswer() {
	let eAnswer = document.getElementById("answer");
	let v = (valueA + valueB) % 256;
	eAnswer.innerHTML = v.toString(16);
}

let eAnswerButton = document.getElementById("answerButton");
eAnswerButton.addEventListener("click", displayAnswer); 



