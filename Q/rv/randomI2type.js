import {randomReg} from "./randomReg.js";
import {randomImm5} from "./randomImm5.js";

export function randomI2type(v){
	let	rd = randomReg();
	let	rs1 = randomReg();
	let	is = randomImm5();
	let	c = v[2] + rd.code * 128 + v[3]*Math.pow(2,12) +
					is.code * Math.pow(2,20) +
					v[4] * Math.pow(2,25);
	return({str: v[0] + "\t" + rd.str + ", " + 
				 rs1.str +", " + is.str,
						code: c, type: v[1]});
}