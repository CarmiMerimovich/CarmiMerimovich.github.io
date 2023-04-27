//
//  r  v  3  2    v a   t o   p a
//
import {Ram} from "./Ram.mjs";
import {DisplayRam} from "./DisplayRam.mjs";

function fillGarbage(page) {// Garbage looking as legit
	let bits;
	if (Math.random() < 0.5)
		bits = 1;
	else
		bits = 15;
	
	for (let o = 0; o < 4096; o += 4) {
		let d = Math.trunc(Math.random()* (2**20) ) * 1024;
		ram.writeD(page + o, d + bits);
	}
}


let va = Math.trunc(Math.random() * (2**32));
let pp = Math.trunc(Math.random() * (2**22)) * 4096;
let pa = pp + (va % 4096);

let i0 = Math.trunc(va / (2**22));
let i1 = Math.trunc(va / 4096) % 1024;

let eVa = document.getElementById("va");
eVa.innerHTML = va.toString(16).toUpperCase().padStart(8, "0");

let ram = new Ram;
ram.littleEndian = true;
ram.numPages = (2**22);  // Sign issue?!

let e = document.getElementById("displayArea");
let displayRam = new DisplayRam(e, ram);
displayRam.addressDigits = 9;
displayRam.unit = 4;
displayRam.unitDigits = 8;
displayRam.rtl = false;


let extTbl = ram.findUnusedPage();
let inrTbl = ram.findUnusedPage();
for (let o = 0; o < 4096; o += 4) {
	let d = Math.trunc(Math.random()* (2**20) ) * 1024;
	ram.writeD(extTbl + o, d + 1);
}
for (let o = 0; o < 4096; o += 4) {
	let d = Math.trunc(Math.random()* (2**20) ) * 1024;
	ram.writeD(inrTbl + o, d + 15);
}

let extEntry = extTbl + i0 * 4;
let inrEntry = inrTbl + i1 * 4;
ram.writeD(extEntry, Math.trunc(inrTbl/4) + 1);
ram.writeD(inrEntry, Math.trunc(pp/4) + 15);

for (let i = 0; i < 3; i++) {
	let addr;
	do {
		let o = Math.trunc(Math.random() * 1024) * 4;
		addr = extTbl + o;
	} while (addr == extEntry);
	let pp = ram.findUnusedPage();
	ram.writeD(addr, Math.trunc(pp/4));
	fillGarbage(pp);
	displayRam.showD(pp + Math.trunc(Math.random() * (4096-4)));
}

for (let i = 0; i < 3; i++) {
	let addr;
	do {
		let o = Math.trunc(Math.random() * 1024) * 4;
		addr = inrTbl + o;
	} while (addr == inrEntry);
	let pp = ram.findUnusedPage();
	ram.writeD(addr, Math.trunc(pp/4) + 7);
	fillGarbage(pp);
	displayRam.showD(pp + Math.trunc(Math.random() * (4096-4)));
}

displayRam.showD(extEntry);
displayRam.showD(inrEntry);

let eSatp = document.getElementById("satp");
let satp = (2**31) +
			Math.trunc(Math.random() * 512) * (2**22) + 
			Math.trunc(extTbl / 4096);
eSatp.innerHTML = satp.toString(16).toUpperCase().padStart(8, "0");

displayRam.display();

function displayAnswer() {
	let eAnswer = document.getElementById("answer");
	eAnswer.innerHTML = pa.toString(16).toUpperCase().padStart(8, "0");
}

function displayDump() {
	displayRam.display();
}

let helpMode = false;
function setHelpMode() {
	helpMode = !helpMode;
	let e = document.getElementById("help");
	e.checked = helpMode;
	
	e = document.getElementById("satp");
	e.title = "";
	if (helpMode) {
		let m = Math.trunc(satp / Math.pow(2,31));
		let asid = Math.trunc(satp/ Math.pow(2,22)) % 512;
		let pfn = Math.trunc(satp % Math.pow(2, 22))* 4096;
		e.title="mode=" + m.toString(16)+ "; " +
				"asid=" + asid.toString(16) + "; " +
				"tbl=" + pfn.toString(16);
	}

	e = document.getElementById("va");
	e.title = "";
	if (helpMode) {
		let i0 = Math.trunc(Math.trunc(va / Math.pow(2, 22)) % 1024);
		let i1 = Math.trunc(Math.trunc(va / 4096) % 1024);
		let off = Math.trunc(va % 4096);
		e.title="i0=" + i0.toString(16)+ "; " +
				"i1=" + i1.toString(16) + "; " +
				"off=" + off.toString(16);
	}

}

let eAnswerButton = document.getElementById("answerButton");
eAnswerButton.addEventListener("click", displayAnswer); 

let eHelp = document.getElementById("help");
eHelp.addEventListener("click", setHelpMode);
