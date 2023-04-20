import {regs} from "./riscv32_isa.js"

export function randomReg() {
	let reg = Math.trunc(Math.random() * 32);
	if (Math.random() < 0.5)
		return ({str:"x" + reg, code: reg});
	let v = regs[reg];
	if (v.length == 1)
		return ({str:v[0], code:reg});
	if (Math.random() < 0.5)
		return ({str: v[0], code: reg});
	return ({str: v[1], code: reg});
}
