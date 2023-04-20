export function randomImm12() {
	let imm = -2048 + Math.trunc(Math.random() * 4096);
	let immc = imm;
	if (immc < 0)
		immc = (2**12) + immc;
	return ({str: imm.toString(10), code: immc});
}