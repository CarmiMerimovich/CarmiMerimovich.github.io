import {regNum} from "./regNum.js";

export function asmItype(mnem, str) {
	let s = str.trim();
	let i;
	
	for (i = 0; i < s.length; i++)
		if (s.charAt(i) == ",")
			break;
	if (i == s.length)
		return undefined;
	let regStr = s.substring(0,i);
	s = s.substring(i+1, s.length);
	let rd = regNum(regStr);
	if (rd == undefined)
		return undefined;
	
	for (i = 0; i < s.length; i++)
		if (s.charAt(i) == ",")
			break;
	if (i == s.length)
		return undefined;
	regStr = s.substring(0,i);
	s = s.substring(i+1, s.length);
	let rs1 = regNum(regStr);
	if (rs1 == undefined)
		return undefined;

	
	let offStr = s;
	let offInt = parseInt(offStr);
	if (offInt == undefined)
		return undefined;

	if (offInt < 0) offInt += 2**12;
	
	let ih = Math.trunc(offInt / 32) % 128;
	let il = Math.trunc(offInt % 32);
		
	let c = il * (2**7) +
			rs1 * (2**15) + 
			rs2 * (2**20) + 
			ih * (2**25);

	return (c);
}
