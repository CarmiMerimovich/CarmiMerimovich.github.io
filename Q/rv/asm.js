import {opCodes, regs, Utype, Itype,Btype,Rtype,Jtype,I2type, Stype} from "./riscv32_isa.js";

import {asmBtype} from "./asmBtype.js";
import {asmItype} from "./asmItype.js";
import {asmRtype} from "./asmRtype.js";
import {asmStype} from "./asmStype.js";

export function asm(str) {
	let s = str.trim();
	let i;
	for (i = 0; i < s.length; i++) {
		let c = s.charAt(i);
		if (! ( 'a' <= c  && c <= 'z'  ||
				  'A' <= c  && c <= 'Z'))
			break;
	}
	let mnem = s.substring(0, i);
	s = s.substring(i, s.length);

	for (i = 0; i < opCodes.length; i++) {
		if (mnem == opCodes[i][0])
			break;
	}
	if (i == opCodes.length)
		return undefined;


	let v = opCodes[i];
	
	switch (v[1]) {

	case Btype:
		return asmBtype(s);

	case Itype:
		return asmItype(s);

	case Rtype:
		return asmRtype(s);
		
	case Stype:
		return asmStype(s);

	default:
		return (undefined);
	}
}
