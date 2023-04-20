import {opCodes, regs, Utype, Itype,Btype,Rtype,Jtype,I2type, I3type, Stype} from "./riscv32_isa.js";

import{randomReg} from "./randomReg.js";
import{randomImm12} from "./randomImm12.js";

import{randomBtype} from "./randomBtype.js";
import{randomItype} from "./randomItype.js";
import{randomI2type} from "./randomI2type.js";
import{randomI3type} from "./randomI3type.js";
import{randomJtype} from "./randomJtype.js";
import{randomRtype} from "./randomRtype.js";
import{randomStype} from "./randomStype.js";
import{randomUtype} from "./randomUtype.js";



function randomImm11() {
	let imm = -1024 + Math.trunc(Math.random() * 2048);
	let immc = imm;
	if (immc < 0)
		immc = 2048 + immc;
	return ({str: imm.toString(10), code: immc});
}


export function randomInstruction() {
	let idx = Math.trunc(Math.random() * opCodes.length);
	let v = opCodes[idx];
	
	switch (v[1]) {
	case Btype:
		return (randomBtype(v));
	
	case Itype:
		return (randomItype(v));
						
	case I2type:
		return (randomI2type(v));

	case I3type:
		return (randomI3type(v));

	case Jtype:
		return (randomJtype(v));
						
	case Utype:
		return (randomUtype(v));

	case Rtype:
		return (randomRtype(v));

	case Stype:
		return(randomStype(v));
	}

	return (undefined);
}
