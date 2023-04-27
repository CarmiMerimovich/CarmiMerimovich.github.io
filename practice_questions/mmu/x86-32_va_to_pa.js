//
//  x 8 6   -  3 2   m m u
//
import {Ram} from "./Ram.mjs";
import {DisplayRam} from "./DisplayRam.mjs";

function fillGarbage(page) {// Garbage looking as legit translation page
	for (let o = 0; o < 4096; o += 4) {
		let d = Math.trunc(Math.random() * (2**20)) * 4096 +
						7;
		ram.writeD(page + o, d);
	}
}

let va = Math.trunc(Math.random() * (2**32));
let pp = Math.trunc(Math.random() * (2**20)) * 4096;
let pa = pp + (va % 4096);

let i0 = Math.trunc(va / (2**22));
let i1 = Math.trunc(va / 4096) % 1024;

let eVa = document.getElementById("va");
eVa.innerHTML = va.toString(16).toUpperCase().padStart(8, "0");

let ram = new Ram;
ram.littleEndian = true;
ram.numPages = Math.pow(2,20);  // Sign issue

let e = document.getElementById("displayArea");
let displayRam = new DisplayRam(e, ram);
displayRam.addressDigits = 8;
displayRam.unit = 4;
displayRam.unitDigits = 8;
displayRam.addressDigits = 8;
displayRam.rtl = false;


let extTbl = ram.findUnusedPage();
let inrTbl = ram.findUnusedPage();
fillGarbage(extTbl);
fillGarbage(inrTbl);

let extEntry = extTbl + i0 * 4;
let inrEntry = inrTbl + i1 * 4;
ram.writeD(extEntry, inrTbl + 7);
ram.writeD(inrEntry, pp + 7);

for (let i = 0; i < 3; i++) {
	let addr;
	do {
		let o = Math.trunc(Math.random() * 1024) * 4;
		addr = extTbl + o;
	} while (addr == extEntry);
	let pp = ram.findUnusedPage();
	ram.writeD(addr, pp + 7);
	fillGarbage(pp);
	displayRam.showD(pp + Math.trunc(Math.random() * 4096));
}

for (let i = 0; i < 3; i++) {
	let addr;
	do {
		let o = Math.trunc(Math.random() * 1024) * 4;
		addr = inrTbl + o;
	} while (addr == inrEntry);
	let pp = ram.findUnusedPage();
	ram.writeD(addr, pp + 7);
	fillGarbage(pp);
	displayRam.showD(pp + Math.trunc(Math.random() * 4096));
}

displayRam.showD(extEntry);
displayRam.showD(inrEntry);


let eCr3 = document.getElementById("cr3");
eCr3.innerHTML = extTbl.toString(16).toUpperCase().padStart(8, "0");

displayRam.display();

function displayAnswer() {
	let eAnswer = document.getElementById("answer");
	eAnswer.innerHTML = pa.toString(16).toUpperCase().padStart(8, "0");
}


let helpMode = false;
function setHelpMode() {
	helpMode = !helpMode;
	let e = document.getElementById("help");
	e.checked = helpMode;
	
	e = document.getElementById("cr3");
	e.title = "";
	if (helpMode) {
		let pfn = extTbl;
		e.title="tbl=" + pfn.toString(16);
	}

	e = document.getElementById("va");
	e.title = "";
	if (helpMode) {
		let i0 = Math.trunc(Math.trunc(va / Math.pow(2, 22)) % 1024);
		let i1 = Math.trunc(Math.trunc(va / 4096) % 1024);
		let off = Math.trunc(va % 4096);
		e.title="i0=" + i0.toString(16).toUpperCase()+ "; " +
				"i1=" + i1.toString(16).toUpperCase() + "; " +
				"off=" + off.toString(16).toUpperCase();
	}

}

let eAnswerButton = document.getElementById("answerButton");
eAnswerButton.addEventListener("click", displayAnswer); 

let eHelp = document.getElementById("help");
eHelp.addEventListener("click", setHelpMode); 
