import {regs} from "./riscv32_isa.js"

export function displayHelpItype(ri) {
	let s = "<table>";
	s += '<tr style="border-bottom: solid 1px black;">';
	s += "<td>Itype</td>";
	s += "<td>imm</td>";
	s += "<td>rs1</td>";
	s += "<td>op2</td>";
	s += "<td>rd</td>";
	s += "<td>op1</td>";
	s += "</tr>";

	for (let i = 0; i < 2; i++) {
		s += "<td></td>";
		s += "<td>";
		let v = Math.trunc(Math.trunc(ri.code / (2**20)) % 4096)
		if (v >= 2048)
			v -= 4096;
		s += v.toString(10);
		s += "</td>";

		let rs1 = Math.trunc(Math.trunc(ri.code / (2**15)) % 32);
		s += "<td>";
		if (i == 0)
			s += "x"+rs1.toString();
		else
			s += regs[rs1];
		s += "</td>";
		
		s += "<td>";
		s += Math.trunc(Math.trunc(ri.code /4096 ) % 8)
				.toString(2).padStart(3,"0");
		s += "</td>";

		let rd = Math.trunc(Math.trunc(ri.code / 128) % 32);
		s += "<td>";
		if (i == 0)
			s += "x" + rd.toString(10);
		else
			s += regs[rd];
		s += "</td>";
		
		s += "<td>";
		s += Math.trunc(ri.code % 128).toString(2).padStart(7,"0");
		s += "</td>";
		s += "</tr>";
	}
	s += "</table>";
	return(s);
}
