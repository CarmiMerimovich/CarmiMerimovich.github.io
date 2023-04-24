import {randomReg} from "./randomReg.js";
import {randomImm12} from "./randomImm12.js";

export function randomI3type(v){
	let	rd = randomReg();
	let	rs1 = randomReg();
	let	is = randomImm12();
	let	c = v[2] + rd.code * 128 + v[3]*Math.pow(2,12) +
					is.code * Math.pow(2,20);
	return({str: v[0] + "\t" + rd.str + ", " + 
				  is.str + "(" +  rs1.str +")",
						code: c, type: v[1]});
}