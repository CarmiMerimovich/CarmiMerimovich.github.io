import{randomReg} from "./randomReg.js";

import{randomImm20} from "./randomImm20.js";

export function randomUtype(v) {
	let	rd = randomReg();
	let	is = randomImm20();
	let	c = v[2] + rd.code * 128 + is.code * (2**12);

	return({str: v[0] + "\t" + rd.str + ", " + is.str,
						code: c, type: v[1]});
}