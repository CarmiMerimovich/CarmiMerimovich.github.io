import {randomReg} from "./randomReg.js";
import {randomImm12} from "./randomImm12.js";

export function randomStype(v) {
	let rs1 = randomReg();
	let rs2 = randomReg();
	let is  = randomImm12();
		
	let ih = Math.trunc(is.code / 32) % 128;
	let il = is.code % 32;
		
	let c = v[2] + 
			il * (2**7) +
			v[3] * (2**12) +
			rs1.code * (2**15) + 
			rs2.code * (2**20) + 
			ih * (2**25);
			
	return({str: v[0] + "\t" + rs1.str + ", " + 
			 is.str + "(" + rs2.str +")",
				code: c, type: v[1]});
}