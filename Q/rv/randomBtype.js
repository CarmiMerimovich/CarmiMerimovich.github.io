import{randomReg} from "./randomReg.js";

import{randomImm12} from "./randomImm12.js";

export function randomBtype(v) {
	let	rs1 = randomReg();
	let	rs2 = randomReg();
	let	is = randomImm12();
	let	c = is.code;
	if (c > (2**11)) {
		c -= (2**12);
	}
	is.str = (c*2).toString(10);
		
	c = is.code;
	let b11  = Math.trunc(c / 2048) % 2;
	let b10  = Math.trunc(c / 1024) % 2;
	let b9_4 = Math.trunc(c / 16) % 64;
	let b3_0 = c % 16;
		
	let i0 = b11  * 64 + b9_4;
	let i1 = b3_0 * 2 + b10;
		
	c = v[2] + 
		i1 * (2**7) +
		v[3] * (2**12) +
		rs1.code * (2**15) + 
		rs2.code * (2**20) + 
		i0 * (2**25);
			
	return({str: v[0] + "\t" + rs1.str + ", " + 
				 rs2.str +", " + is.str,
					code: c, type: v[1]});
}
