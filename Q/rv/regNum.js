import {regs} from "./riscv32_isa.js"

export function regNum(str) {
	str = str.trim();
	for (let i = 0; i < regs.length; i++) {
		if (str == "x"+i)
				return(i);	
		for (let j = 0; j < regs[i].length; j++) {
			if (str == regs[i][j]) {
				console.log(i);
				return (i);
			}
		}
	}
	return undefined;
}
