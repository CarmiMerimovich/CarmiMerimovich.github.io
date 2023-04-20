export function randomImm5() {
	let imm = Math.trunc(Math.random() * 32);
	return ({str: imm.toString(10), code: imm});
}
