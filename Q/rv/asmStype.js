import {regNum} from "./regNum.js";

export function asmStype(mnem, str) {
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
		if (s.charAt(i) == "(")
			break;
	if (i == s.length)
		return undefined;
	let offStr = s.substring(0,i);
	s = s.substring(i+1, s.length);
	let offInt = parseInt(offStr);
	if (offInt == undefined)
		return undefined;

	for (i = 0; i < s.length; i++)
		if (s.charAt(i) == ")")
			break;
	if (i == s.length)
		return undefined;
	regStr = s.substring(0,i);
	s = s.substring(i+1, s.length);
	let rs2 = regNum(regStr);
	if (rs2 == undefined)
		return undefined;

	if (s.trim() != "")
		return (false);

	return (mnem + "\t" + rs1 + "," + offInt + "(" + rs2+ ")");
}
