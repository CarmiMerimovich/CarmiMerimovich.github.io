import {regNum} from "./regNum.js";

export function asmBtype(mnem, str) {
	let s = str.trim();
	let i;

	for (i = 0; i < s.length; i++)
		if (s.charAt(i) == ",")
			break;
	if (i == s.length)
		return undefined;
	let regStr = s.substring(0,i);
	s = s.substring(i+1, s.length);
	let rs1 = regNum(regStr);
	if (rs1 == undefined)
		return undefined;
	
	for (i = 0; i < s.length; i++)
		if (s.charAt(i) == ",")
			break;
	if (i == s.length)
		return undefined;
	regStr = s.substring(0,i);
	s = s.substring(i+1, s.length);
	let rs2 = regNum(regStr);
	if (rs2 == undefined)
		return undefined;	


	let offInt = parseInt(s);
	if (offInt == undefined)
		return undefined;

	if (offInt < 0)
		offInt += 2**12;
	
	let b11  = Math.trunc(offInt / 2048) % 2;
	let b10  = Math.trunc(offInt / 1024) % 2;
	let b9_4 = Math.trunc(offInt / 16) % 64;
	let b3_0 = Math.trunc(offInt % 16);
		
	let i0 = b11  * 64 + b9_4;
	let i1 = b3_0 * 2 + b10;
		
	c = i1 * (2**7) +
		rs1 * (2**15) + 
		rs2 * (2**20) + 
		i0 * (2**25);


	return (c);
}
