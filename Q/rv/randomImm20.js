export function randomImm20() {
	let imm = (-(2**19)) + 
		Math.trunc(Math.random() * Math.pow(2,20));
	let immc = imm;
	if (immc < 0)
		immc = (2**20) + immc;
	return ({str: imm.toString(10), code: immc});
}