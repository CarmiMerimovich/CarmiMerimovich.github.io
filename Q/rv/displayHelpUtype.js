import {regs} from "./riscv32_isa.js"

export function displayHelpUtype(ri) {
	let s = "<table>";
	s += '<tr style="border-bottom: solid 1px black;">';
	s += "<td>Utype</td>";
	s += "<td>imm</td>";
	s += "<td>rd</td>";
	s += "<td>op1</td>";
	s += "</tr>";
	for (let i = 0; i < 2; i++) {
		s += "<td></td>";
		s += "<td>";
		let v = Math.trunc(Math.trunc(ri.code / 4096) % (2**20));
		if (v >= (2**19))
			v = v - (2**20);
		s += v.toString(10);
		s += "</td>";

		let rd = Math.trunc(Math.trunc(ri.code / (2**7)) % 32);
		s += "<td>";
		if (i == 0)
			s += "x"+rd.toString();
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