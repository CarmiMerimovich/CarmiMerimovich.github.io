import {randomReg}   from "./randomReg.js";
import {randomImm12} from "./randomImm12.js";

export function randomItype(v) {
	let rd = randomReg();
	let rs1 = randomReg();
	let is = randomImm12();
	let c = v[2] + rd.code * 128 + v[3]*Math.pow(2,12) +
				 + rs1.code * (2**15) +
					is.code * Math.pow(2,20);
	let str;
	if (v[2] == 0b1100111)
		str = v[0] + "\t" + rd.str + ", " + 
				 is.str + "(" + rs1.str + ")";
	else if (v[2] == 0b0000011  && 
			(v[3]==0  ||  v[3]==1  ||  v[3]==2 ||
			 v[3]==4  ||  v[3]==5))
		str = v[0] + "\t" + rd.str + ", " + 
				 is.str + "(" + rs1.str + ")";
	else
		str = v[0] + "\t" + rd.str + ", " + 
				 rs1.str +", " + is.str;
	return({str: str,
				code: c, type: v[1]});
}