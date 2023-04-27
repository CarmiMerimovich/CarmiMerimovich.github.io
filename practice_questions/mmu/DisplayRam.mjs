export {DisplayRam};

import {Ram} from "./Ram.mjs";

class DisplayRam {
	constructor(elem, ram) {
		this.elem = elem;	// Where to show
		this.ram = ram;		// What to show	
		this.rtl = false;	// Direction of dump
		this.radix = 16;	// Radix of dump
		this.addressDigits = 0;	// Minimal number of digits
		this.unit = 1;		// dump unit (1,2,4)
		this.unitDigits = 0;	// dump unit minimal digits
		this.signed = false;
		this.showControls = false;
		this.importantAddresses = null;
		this.displayedAddress = null;	// Should be private
		
//		elem.addEventListener('contextmenu', this.contextMenuEvent);
//		elem.addEventListener("resize", this.display);	
	}
	
	clearImportantAddresses() {
		this.importantAddresses = null;
		this.displayedAddresses = null;	// Should be private
	}
	
	showB(addr) {
		this.addImportantAddress(addr);
	}

	showW(addr) {
		this.addImportantAddress(addr);
		this.addImportantAddress(addr+1);
	}

	showD(addr) {
		this.addImportantAddress(addr);
		this.addImportantAddress(addr+1);
		this.addImportantAddress(addr+2);
		this.addImportantAddress(addr+3);
	}
	
	showQ(addr) {
		for (let i = 0; i < 8; i++) 
			this.addImportantAddress(addr + i);
	}


	addImportantAddress(addr) {
		if (this.importantAddresses == null) {
			this.importantAddresses = [];
			this.displayedAddresses = [];
		}
 		
		this.importantAddresses.push(addr);
		let before = Math.trunc(Math.random() * 30);
		let after  = Math.trunc(Math.random() * 30);
		for (let i = 0; i <= before; i++)
			if (addr-i >= 0) this.displayedAddresses.push(addr-i);

		for (let i = 0; i <= after; i++)
			this.displayedAddresses.push(addr+i);
	
		this.displayedAddresses.sort( (function (a,b) {
			return a-b;
		})
		);
	}
	
//	contextMenuEvent(e) {
//		e.preventDefault();
//	}
	
	readValue(key) {
		switch (this.unit) {
		case 1:
			return this.ram.readB(key);
			
		case 2:
			return this.ram.readW(key);
		
		case 4:
			return this.ram.readD(key);

		case 8:
			return this.ram.readQ(key);
		}
	}
	
	display() {
		if (this.displayedAddresses == null)
			return;
			
		let eHtml = document.getElementsByTagName("html");
		eHtml = eHtml[0];
		let tDump, tSigned, tLtr,
				tByte, tWord, tDword, tQword,
				tBinary, tOctal, tDecimal, tHexa;
		if (eHtml.dir == 'rtl') {
			tDump = "צייר טבלה מחדש";
			tSigned = "עם סימן";
			tLtr = "כתיבה משמאל";
			tByte="בית";
			tWord="מילה";
			tDword="מילה כפולה";
			tQword="מילה מרובעת";
			tBinary = "בינרי";
			tOctal = "אוקטלי";
			tDecimal = "עשרוני";
			tHexa = "הקסה";
		} else {
			tDump = "Redraw table";
			tSigned = "Signed";
			tLtr = "ltr";
			tByte="Byte";
			tWord="Word";
			tDword="Double word";
			tQword="Quad word";
			tBinary = "Binary";
			tDecimal = "Decimal";
			tOctal = "Octdal";
			tHexa = "Hexa";
		}
		
		let cols = 128;
		let again = true;
		
		while (again) {
			let s = "";
			let row = "";
			
			let addrMax = 0;
			let prevAddrLine = -1;
			let rowNums = 0;
			let firstRow = true;
			
			s += "<div style='giid-auto-flow:row;'>";
			s += '<button id="displayDump">' + tDump + '</button>';
			s += '<input type="checkbox" id="displayRam.ltr">' + tLtr;
			s += '<input type="checkbox" id="displayRam.signed">' + tSigned;
			s += '<span style="border: 1px solid black; margin-inline-start: 2px; margin-top: 4px;	white-space: nowrap;">';
			s += '<input type="radio" id="displayRam.binary">' + tBinary;
			s += '<input type="radio" id="displayRam.octal">' + tOctal;
			s += '<input type="radio" id="displayRam.decimal">' + tDecimal;
			s += '<input type="radio" id="displayRam.hexa">' + tHexa;
			s += "</span>";
			s += '<span style="border: 1px solid black; margin-inline-start: 2px; margin-top: 4px; white-space: nowrap;">';
			s += '<input type="radio" id="displayRam.byte">' + tByte;
			s += '<input type="radio" id="displayRam.word">' + tWord;
			s += '<input type="radio" id="displayRam.dword">' + tDword;
			s += '<input type="radio" id="displayRam.qword">' + tQword;
			s += "</span>";
			//s += "</td></tr>";
			//s += "</table>";	
			s += "</div>";
			s += "<div dir='ltr'>";
			
			s += "<table id='table' style='text-align: center; font-family: monospace; margin-top: 10px;'>";
			for (let idx = 0; idx < this.displayedAddresses.length; idx++) {
				let addr = this.displayedAddresses[idx];
				if (addr < addrMax) continue;
				let m = cols * this.unit;
				let addrLine = addr - addr % m;

				if (addrLine != prevAddrLine + cols * this.unit ||  rowNums > 10) {
					if (firstRow) 
						firstRow = false;
					else {
						let emptyRow = "<tr style='background-color: white;'><td></td>";
						for (let i = 0; i < cols; i++)
							emptyRow += "<td></td>";
						emptyRow += "</tr>";
						s += emptyRow;
					}
					s += "<tr>";
					let b;
					if (this.rtl)
						b = "border-left: 1px black solid;";
					else
						b = "border-right: 1px black solid;";
					let row = "<td style='border-bottom: 1px solid black; border-top: 1px solid black; padding: 10px;" + b + "'></td>";
					for (let ii = 0; ii < cols; ii++) {
						let c = "<td style='text-align: center; border-bottom: 1px solid black; border-top:1px; padding: 10px; solid black;	'>";
						c += (ii * this.unit).toString(16).toUpperCase();
						c += "</td>";
						if (this.rtl) 
							row = c + row;
						else
							row = row + c;
					}
					s += "<tr>";
					s += row;
					s += "</tr>";
					rowNums = 0;
				}
				rowNums++;
				prevAddrLine = addrLine;

				s += "<tr>";

				let b;
				if (this.rtl)
					b = "border-left: 1px black solid;";
				else
					b = "border-right: 1px black solid;";
					
				let c = "<td style='" + b + "'>";
				let addr_s = addrLine.toString(this.radix).toUpperCase();
				if (this.addressDigits > 0) {
					addr_s = addr_s.padStart(this.addressDigits, "0");
				}
				c += addr_s;
				c += "</td>";
				row = c;	

				for (let off = 0; off < cols*this.unit; off += this.unit) {
					let toolTip = off.toString(this.radix).toUpperCase();
					let c = "<td title='" + toolTip + "'>";
					let v = this.readValue(addrLine + off);
					let vs = "";
					if (v != undefined) {
						if (this.signed) {
							if (v < 2**(this.unit*8-1))
								vs = v.toString(this.radix);
							else
								vs = "-" + (2**(this.unit*8)-v).toString(this.radix);
						} else {
							vs = v.toString(this.radix).toUpperCase();
							if (this.unitDigits > 0)
								vs = vs.padStart(this.unit * 2, "0");
						}
					}
					c += vs;
					c += "</td>";
					if (this.rtl)
						row = c + row;
					else 
						row = row + c;
				}
				addrMax = addrLine + cols * this.unit;
				s += row + "</tr>";
			}
			s += "</table></div>";
			this.elem.innerHTML = s;
		
			let t = document.getElementById('table');
			let cs = t.rows[0].cells;
			let parentRight = this.elem.offsetLeft + this.elem.offsetWidth;
			let tableRight = t.offsetLeft+t.offsetWidth;
			if (tableRight <= parentRight || cols < 4)
				again = false;
			else
				cols = cols / 2;
		}
		let eDisplayDump = document.getElementById("displayDump");
		let that = this;
		eDisplayDump.addEventListener("click",
				function() {that.display();});

		that = this;
		let eLtr = document.getElementById("displayRam.ltr");
		eLtr.addEventListener("click",
				function() {that.clickLtr();});
		eLtr.checked = !this.rtl;
			
		that = this;
		let eSigned = document.getElementById("displayRam.signed");
		eSigned.addEventListener("click",
				function() {that.clickSigned();});
		eSigned.checked = this.signed;

		that = this;
		let eBinary = document.getElementById("displayRam.binary");
		eBinary.addEventListener("click",
				function() {that.clickBinary();});
		eBinary.checked = (this.radix == 2);

		that = this;
		let eOctal = document.getElementById("displayRam.octal");
		eOctal.addEventListener("click",
				function() {that.clickOctal();});
		eOctal.checked = (this.radix == 8);

		that = this;
		let eDecimal = document.getElementById("displayRam.decimal");
		eDecimal.addEventListener("click",
				function() {that.clickDecimal();});
		eDecimal.checked = (this.radix == 10);

		that = this;
		let eHexa = document.getElementById("displayRam.hexa");
		eHexa.addEventListener("click",
				function() {that.clickHexa();});
		eHexa.checked = (this.radix == 16);

		that = this;
		let eByte = document.getElementById("displayRam.byte");
		eByte.addEventListener("click",
				function() {that.clickByte();});
		eByte.checked = (this.unit == 1);

		that = this;
		let eWord = document.getElementById("displayRam.word");
		eWord.addEventListener("click",
				function() {that.clickWord();});
		eWord.checked = (this.unit == 2);

		that = this;
		let eDword = document.getElementById("displayRam.dword");
		eDword.addEventListener("click",
				function() {that.clickDword();});
		eDword.checked = (this.unit == 4);

		that = this;
		let eQword = document.getElementById("displayRam.qword");
		eQword.addEventListener("click",
				function() {that.clickQword();});
		eQword.checked = (this.unit == 8);
	}
	
	clickLtr() {
		this.rtl = !this.rtl;
		this.display();
	}

	clickSigned() {
		if (this.radix == 10)
			this.signed = true;
		else
			this.signed = !this.signed;
		this.display();
	}

	clickBinary() {
		this.radix = 2;
		this.display();
	}

	clickOctal() {
		this.radix = 8;
		this.display();
	}

	clickDecimal() {
		this.radix = 10;
		this.signed = true;
		this.display();
	}

	clickHexa() {
		this.radix = 16;
		this.display();
	}

	clickByte() {
		this.unit = 1;
		this.display();
	}

	clickWord() {
		this.unit = 2;
		this.display();
	}

	clickDword() {
		this.unit = 4;
		this.display();
	}
	
	clickQword() {
		this.unit = 8;
		this.display();
	}	
}