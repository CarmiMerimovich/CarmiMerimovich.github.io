import{randomReg} from "./randomReg.js";

export function randomRtype (v) {
	let	rd = randomReg();
	let	rs1 = randomReg();
	let	rs2 = randomReg();
	let	c = v[2] + rd.code * 128 + 
			v[3] * 4096 + 
			rs1.code * 2**15 +
			rs2.code * 2**20 +
			v[4] * 2**25;
	return({str: v[0] + "\t" + rd.str + ", " + 
				 rs1.str +", " + rs2.str,
						code: c, type:v[1]});
}