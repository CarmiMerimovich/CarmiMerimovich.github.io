//
// m e m o r y _ c o n t e n t 
//
import {Ram} from "../Ram.mjs";
import {DisplayRam} from "../DisplayRam.mjs";

let unit = Math.pow(2,Math.trunc(Math.random() * 3));

let ram = new Ram;
let eEndian = document.getElementById("endian");
if (Math.random() < 0.5) {
	ram.littleEndian = true;
	eEndian.innerHTML = "little endian";
} else {
	ram.littleEndian = false;
	eEndian.innerHTML = "big endian";
}
ram.numPages = Math.pow(2,20); 

let pageAddress = ram.findUnusedPage();
let address = pageAddress + Math.trunc(Math.random() * (ram.pageSize - unit + 1));
var value = Math.trunc(Math.random() * Math.pow(2,unit*8));

for (let i = pageAddress; i < pageAddress + ram.pageSize; i++)
	ram.writeB(i, Math.trunc(Math.random() * 256));
	


let e = document.getElementById("displayArea");
let displayRam = new DisplayRam(e, ram);
displayRam.addressDigits = 8;
displayRam.unit = Math.pow(2,Math.trunc(Math.random() * 3));
displayRam.unitDigits = displayRam.unit * 2;
if (Math.random() < 0.5)
	displayRam.rtl = false;
else
	displayRam.rtl = true;
if (unit == 1) {
	ram.writeB(address, value);
	displayRam.showB(address);
} else if (unit == 2) {
	ram.writeW(address, value);
	displayRam.showW(address);
} else if (unit == 4) {
	ram.writeD(address, value);
	displayRam.showD(address);
}


let eAddress = document.getElementById("address");
eAddress.innerHTML = address.toString(16).padStart(8,"0");

displayRam.display();

function displayAnswer() {
	let eAnswer = document.getElementById("answer");
	eAnswer.innerHTML = value.toString(16);
}

let eUnit = document.getElementById("unit"+unit);
eUnit.style.display = "inline";

let eAnswerButton = document.getElementById("answerButton");
eAnswerButton.addEventListener("click", displayAnswer); 

