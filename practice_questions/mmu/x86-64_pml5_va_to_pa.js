//
//  x 8 6   -  3 2   m m u
//
import {Ram} from "./Ram.mjs";
import {DisplayRam} from "./DisplayRam.mjs";

function fillGarbage(page) {// Garbage looking as legit translation page
	for (let o = 0; o < 4096; o += 8) {
		let d = BigInt(Math.trunc(Math.random() * (2**24)) * 4096 +
						7);
		ram.writeQ(page + o, d);
	}
}

let va = Math.trunc(Math.random() * (2**32));
let pp = Math.trunc(Math.random() * (2**24)) * 4096;
let pa = pp + (va % 4096);

let i0 = Math.trunc(va / (2**30)) % 4;
let i1 = Math.trunc(va / (2**21)) % 512;
let i2 = Math.trunc(va / (2**12)) % 512;

let eVa = document.getElementById("va");
eVa.innerHTML = va.toString(16).padStart(8, "0");

let ram = new Ram;
ram.littleEndian = true;
ram.numPages = (2**22);  // Sign issue

let e = document.getElementById("displayArea");
let displayRam = new DisplayRam(e, ram);
displayRam.addressDigits = 8;
displayRam.unit = 4;
displayRam.unitDigits = 8;
displayRam.addressDigits=9;
displayRam.rtl = false;


// Ugly. Very ugly. Need another findUnusedPage routine.
// This is all due to Intel's CR3 bug in PAE
let lev0Tbl;
do {
	lev0Tbl = ram.findUnusedPage();
} while (lev0Tbl >= (2**32));

let lev1Tbl = ram.findUnusedPage();
let lev2Tbl = ram.findUnusedPage();
fillGarbage(lev0Tbl);
fillGarbage(lev1Tbl);
fillGarbage(lev2Tbl);

let lev0Entry = lev0Tbl + i0 * 8;
let lev1Entry = lev1Tbl + i1 * 8;
let lev2Entry = lev2Tbl + i2 * 8;
ram.writeQ(lev0Entry, BigInt(lev1Tbl + 7));
ram.writeQ(lev1Entry, BigInt(lev2Tbl + 7));
ram.writeQ(lev2Entry, BigInt(pp + 7));

for (let i = 0; i < 3; i++) {
	let addr;
	do {
		let o = Math.trunc(Math.random() * 512) * 8;
		addr = lev0Tbl + o;
	} while (addr == lev0Entry);
	let pp = ram.findUnusedPage();
	ram.writeQ(addr, BigInt(pp + 7));
	fillGarbage(pp);
	displayRam.showB(pp + Math.trunc(Math.random() * 4096));
}

for (let i = 0; i < 3; i++) {
	let addr;
	do {
		let o = Math.trunc(Math.random() * 512) * 8;
		addr = lev1Tbl + o;
	} while (addr == lev1Entry);
	let pp = ram.findUnusedPage();
	ram.writeQ(addr, BigInt(pp + 7));
	fillGarbage(pp);
	displayRam.showB(pp + Math.trunc(Math.random() * 4096));
}

for (let i = 0; i < 3; i++) {
	let addr;
	do {
		let o = Math.trunc(Math.random() * 512) * 8;
		addr = lev2Tbl + o;
	} while (addr == lev2Entry);
	let pp = ram.findUnusedPage();
	ram.writeQ(addr, BigInt(pp + 7));
	fillGarbage(pp);
	displayRam.showB(pp + Math.trunc(Math.random() * 4096));
}


displayRam.showQ(lev0Entry);
displayRam.showQ(lev1Entry);
displayRam.showQ(lev2Entry);


let eCr3 = document.getElementById("cr3");
eCr3.innerHTML = lev0Tbl.toString(16).padStart(8, "0");

displayRam.display();

function displayAnswer() {
	let eAnswer = document.getElementById("answer");
	eAnswer.innerHTML = pa.toString(16).padStart(9, "0");
}


let helpMode = false;
function setHelpMode() {
	helpMode = !helpMode;
	let e = document.getElementById("help");
	e.checked = helpMode;
	
	e = document.getElementById("cr3");
	e.title = "";
	if (helpMode) {
		let pfn = lev0Tbl;
		e.title = "tbl=" + pfn.toString(16);
	}

	e = document.getElementById("va");
	e.title = "";
	if (helpMode) {
		let i0 = Math.trunc(va / (2**30)) % 4;
		let i1 = Math.trunc(Math.trunc(va / (2**21)) % 512);
		let i2 = Math.trunc(Math.trunc(va / (2**12)) % 512);
		let off = Math.trunc(va % 4096);
		e.title="i0=" + i0.toString(16)+ "; " +
				"i1=" + i1.toString(16) + "; " +
				"i2=" + i2.toString(16) + "; " +
				"off=" + off.toString(16);
	}

}

let eAnswerButton = document.getElementById("answerButton");
eAnswerButton.addEventListener("click", displayAnswer); 

let eHelp = document.getElementById("help");
eHelp.addEventListener("click", setHelpMode); 
