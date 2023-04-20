import {regNum} from "./regNum.js";

export function asmRtype(mnem, str) {
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

	
	regStr = s;
	let rs2 = regNum(regStr);
	if (rs2 == undefined)
		return undefined;
	
	return (mnem + "\t" + rd + "," + rs1 + "," + rs2);
}
