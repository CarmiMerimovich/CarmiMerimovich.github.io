import {opCodes, regs, Utype, Itype, Btype, Rtype, Jtype,
			I2type, I3type, Stype} from "./riscv32_isa.js";

import {displayHelpBtype}  from "./displayHelpBtype.js";
import {displayHelpItype}  from "./displayHelpItype.js";
import {displayHelpI2type} from "./displayHelpI2type.js";
import {displayHelpI3type} from "./displayHelpI3type.js";
import {displayHelpJtype}  from "./displayHelpJtype.js";
import {displayHelpRtype}  from "./displayHelpRtype.js";
import {displayHelpUtype}  from "./displayHelpUtype.js";
import {displayHelpStype}  from "./displayHelpStype.js";

let iType = [];

iType[0] = "Unrecognized";
iType[Btype] = "Btype";
iType[Itype] = "Itype";
iType[I2type] = "i2type";
iType[Jtype] = "Jtype";
iType[Rtype] = "Rtype";
iType[Utype] = "Utype";
iType[Stype] = "Stype";

function getType(op) {
	let p = [];
	p[0] = Math.trunc(op % 128);
	p[1] = Math.trunc(Math.trunc(op / 4096) % 8);
	p[2] = Math.trunc(Math.trunc(op / (2**25)) % 128);
	for (let i = 0; i < opCodes.length; i++) {
		let v = opCodes[i];
		let j;
		for (j = 2; j < v.length; j++) {
			if (p[j-2] != v[j])
				break;
		}
		if (j == v.length)
			return (v[1]);
	}
	return (0);
}


export function displayHelp(ri) {
	let type = getType(ri.code);
	let s;
	switch (type) {
	case Btype:
		s = displayHelpBtype(ri);
		break;

	case Itype:
		s = displayHelpItype(ri);
		break;

	case I2type:
		s = displayHelpI2type(ri);
		break;

	case I3type:
		s = displayHelpI3type(ri);
		break;

	case Jtype:
		s = displayHelpJtype(ri);
		break;

	case Utype:
		s = displayHelpUtype(ri);
		break;
	
	case Rtype:
		s = displayHelpRtype(ri);
		break;
		
	case Stype:
		s = displayHelpStype(ri);
		break;
		
	default:
		s = "<table><tr><td>";
		s += iType[type];
		s += "</td></tr>";
		s += "</table>";
	}

	let eHelp = document.getElementById("helpMachineText");
	eHelp.innerHTML = s;
}
