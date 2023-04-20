//
//  x 8 6  -  6 4  P M L 5   m m u
//
let topLine = 10;
let bottomLine = 30;

let bitWidth = 10;

function drawField(ctx, field) {
	ctx.textAlign = "center";
	ctx.textBaseline = "bottom";
	

	let d = 31 - field.s;
	ctx.moveTo(d*bitWidth, topLine);
	ctx.lineTo(d*bitWidth, bottomLine);
	ctx.fillText(field.s.toString(),
		d*bitWidth + bitWidth/2, topLine);

	if (field.e == undefined) {
		ctx.moveTo((d+1)*bitWidth, topLine);
		ctx.lineTo((d+1)*bitWidth, bottomLine);
	} else {
		d = 31-field.e;
		ctx.moveTo((d+1)*bitWidth, topLine);
		ctx.lineTo((d+1)*bitWidth, bottomLine);
		ctx.fillText(field.e.toString(),
			d*bitWidth + bitWidth/2, topLine);
	}
	
	if (field.t != undefined) {
		let s = 31 - field.s;
		let e;
		if (field.e == undefined)
			e = s + 1;
		else
			e = 31 - field.e;
		let l = s + (e - s)/2;

		ctx.textBaseline = "middle";
		ctx.fillText(field.t, l*bitWidth, topLine + (bottomLine-topLine)/2);
	}
	ctx.stroke();
}


function drawField64(ctx, field) {
	ctx.textAlign = "center";
	ctx.textBaseline = "bottom";
	

	let d = 63 - field.s;
	ctx.moveTo(d*bitWidth, topLine);
	ctx.lineTo(d*bitWidth, bottomLine);
	ctx.fillText(field.s.toString(),
		d*bitWidth + bitWidth/2, topLine);

	if (field.e == undefined) {
		ctx.moveTo((d+1)*bitWidth, topLine);
		ctx.lineTo((d+1)*bitWidth, bottomLine);
	} else {
		d = 63-field.e;
		ctx.moveTo((d+1)*bitWidth, topLine);
		ctx.lineTo((d+1)*bitWidth, bottomLine);
		ctx.fillText(field.e.toString(),
			d*bitWidth + bitWidth/2, topLine);
	}
	
	if (field.t != undefined) {
		let s = 63 - field.s;
		let e;
		if (field.e == undefined)
			e = s + 1;
		else
			e = 63 - field.e;
		let l = s + (e - s)/2;

		ctx.textBaseline = "middle";
		ctx.fillText(field.t, l*bitWidth, topLine + (bottomLine-topLine)/2);
	}
	ctx.stroke();
}

function cr3oldDraw(id)
{
	let c = document.getElementById(id);
	let ctx = c.getContext("2d");

	ctx.moveTo(0, topLine);
	ctx.lineTo(64*bitWidth, topLine);

	ctx.moveTo(0, bottomLine);
	ctx.lineTo(64*bitWidth, bottomLine);
	
	let field={};
	field.s = 63;
	field.e = 12;
	field.t = "Level 0 Table ppn";
	drawField64(ctx,field);

	field={};
	field.s = 11;
	field.e = 5;
	field.t = "MBZ";
	drawField64(ctx,field);

	field={};
	field.s = 4;
	field.t = "";
	drawField64(ctx,field);

	field={};
	field.s = 3;
	field.t = "";
	drawField64(ctx,field);
	
	field={};
	field.s = 2;
	field.e = 0;
	field.t = "MBZ";
	drawField64(ctx, field);

	let x = (64-4) * bitWidth + bitWidth/2;
	let y = bottomLine;

	ctx.moveTo(x, y);
	y += 10;
	ctx.lineTo(x, y);
	x += 10;
	ctx.lineTo(x, y);
	ctx.textBaseline = "middle";
	ctx.textAlign = "left";
	ctx.fillText("PWT - Page level Write Through", x, y);


	x = (64-5) * bitWidth + bitWidth/2;
	y = bottomLine;

	ctx.moveTo(x, y);
	y += 20;
	ctx.lineTo(x, y);
	x += 10;
	ctx.lineTo(x, y);
	ctx.textBaseline = "middle";
	ctx.textAlign = "left";
	ctx.fillText("PCD - Page level Cache Disabled", x, y);



	ctx.stroke();
}



function cr3newDraw(id)
{
	let c = document.getElementById(id);
	let ctx = c.getContext("2d");

	ctx.moveTo(0, topLine);
	ctx.lineTo(64*bitWidth, topLine);

	ctx.moveTo(0, bottomLine);
	ctx.lineTo(64*bitWidth, bottomLine);
	
	let field={};
	field.s = 63;
	field.e = 12;
	field.t = "Level 0 Table ppn";
	drawField64(ctx,field);

	field={};
	field.s = 11;
	field.e = 0;
	field.t = "ASID";
	drawField64(ctx,field);


	ctx.stroke();
}

function pml5Draw (id)
{
	console.log(id);
	let c = document.getElementById(id);
	let ctx = c.getContext("2d");

	ctx.moveTo(0, topLine);
	ctx.lineTo(64*bitWidth, topLine);

	ctx.moveTo(0, bottomLine);
	ctx.lineTo(64*bitWidth, bottomLine);


	let field = {};
	field.s = 63;
	field.t = "";
	drawField64(ctx, field);

	field = {};
	field.s = 62;
	field.e = 52;
	field.t = "ignored";
	drawField64(ctx, field);


	field={};
	field.s = 51;
	field.e = 12;
	field.t = "Level 1 ppn";
	drawField64(ctx, field);

	field = {};
	field.s = 11;
	field.e = 9;
	field.t = "avl";
	drawField64(ctx, field);
	ctx.stroke();
	
	let str = "GS0ADWURP";
	for (let i = 0; i < str.length; i++) {
		let field = {};
		field.s = str.length - i - 1;
		field.t = str.substring(i,i+1);
		drawField64(ctx,field);
	}
	
	let explain = ["1 for valid, 0 for not valid",
		"1 for read/write, 0 for read",
		"1 for user mode can access; 0 otherwise",
		"1 for write-through cache; 0 for write-back cache",
		"1 for cache disable; 0 for cache enable",
		"1 means page was read/written; 0 was not",
		"",
		"1 for page size 4MB; 0 for page size 4KB",
		"Ignored"];
	let y = bottomLine;
	for (let i = 0; i < str.length; i++) {
		if (explain[i] == "") continue;
		let x = (63 - i) * bitWidth;
		
		x += bitWidth/2;
		ctx.moveTo(x, bottomLine);
		y += 10;
		ctx.lineTo(x, y);
		x += 10;
		ctx.lineTo(x, y);
		ctx.stroke();
		ctx.textAlign = "left";
		ctx.textBaseline = "middle";
		ctx.fillText(explain[i], x, y);
	}
}



function peeDraw (id)
{
	let c = document.getElementById(id);
	let ctx = c.getContext("2d");

	ctx.moveTo(0, topLine);
	ctx.lineTo(64*bitWidth, topLine);

	ctx.moveTo(0, bottomLine);
	ctx.lineTo(64*bitWidth, bottomLine);


	let field = {};
	field.s = 63;
	field.e = 36;
	field.t = "MBZ";
	drawField64(ctx, field);
	
	field={};
	field.s = 35;
	field.e = 12;
	field.t = "Middle table ppn";
	drawField64(ctx, field);

	field = {};
	field.s = 11;
	field.e = 9;
	field.t = "avl";
	drawField64(ctx, field);
	ctx.stroke();
	
	let str = "GS0ADWURP";
	for (let i = 0; i < str.length; i++) {
		let field = {};
		field.s = str.length - i - 1;
		field.t = str.substring(i,i+1);
		drawField64(ctx,field);
	}
	
	let explain = ["1 for valid, 0 for not valid",
		"1 for read/write, 0 for read",
		"1 for user mode can access; 0 otherwise",
		"1 for write-through cache; 0 for write-back cache",
		"1 for cache disable; 0 for cache enable",
		"1 means page was read/written; 0 was not",
		"",
		"1 for page size 4MB; 0 for page size 4KB",
		"Ignored"];
	let y = bottomLine;
	for (let i = 0; i < str.length; i++) {
		if (explain[i] == "") continue;
		let x = (63 - i) * bitWidth;
		
		x += bitWidth/2;
		ctx.moveTo(x, bottomLine);
		y += 10;
		ctx.lineTo(x, y);
		x += 10;
		ctx.lineTo(x, y);
		ctx.stroke();
		ctx.textAlign = "left";
		ctx.textBaseline = "middle";
		ctx.fillText(explain[i], x, y);
	}
}


function pdeDraw (id)
{
	let c = document.getElementById(id);
	let ctx = c.getContext("2d");

	ctx.moveTo(0, topLine);
	ctx.lineTo(64*bitWidth, topLine);

	ctx.moveTo(0, bottomLine);
	ctx.lineTo(64*bitWidth, bottomLine);


	let field = {};
	field.s = 63;
	field.e = 36;
	field.t = "MBZ";
	drawField64(ctx, field);
	
	field={};
	field.s = 35;
	field.e = 12;
	field.t = "Internal table ppn";
	drawField64(ctx, field);

	field = {};
	field.s = 11;
	field.e = 9;
	field.t = "avl";
	drawField64(ctx, field);
	ctx.stroke();
	
	let str = "GS0ADWURP";
	for (let i = 0; i < str.length; i++) {
		let field = {};
		field.s = str.length - i - 1;
		field.t = str.substring(i,i+1);
		drawField64(ctx,field);
	}
	
	let explain = ["1 for valid, 0 for not valid",
		"1 for read/write, 0 for read",
		"1 for user mode can access; 0 otherwise",
		"1 for write-through cache; 0 for write-back cache",
		"1 for cache disable; 0 for cache enable",
		"1 means page was read/written; 0 was not",
		"",
		"1 for page size 4MB; 0 for page size 4KB",
		"Ignored"];
	let y = bottomLine;
	for (let i = 0; i < str.length; i++) {
		if (explain[i] == "") continue;
		let x = (63 - i) * bitWidth;
		
		x += bitWidth/2;
		ctx.moveTo(x, bottomLine);
		y += 10;
		ctx.lineTo(x, y);
		x += 10;
		ctx.lineTo(x, y);
		ctx.stroke();
		ctx.textAlign = "left";
		ctx.textBaseline = "middle";
		ctx.fillText(explain[i], x, y);
	}
}

function pteDraw (id)
{
	let c = document.getElementById(id);
	let ctx = c.getContext("2d");

	ctx.moveTo(0, topLine);
	ctx.lineTo(64*bitWidth, topLine);

	ctx.moveTo(0, bottomLine);
	ctx.lineTo(64*bitWidth, bottomLine);


	let field = {};
	field.s = 63;
	field.e = 36;
	field.t = "MBZ";
	drawField64(ctx, field);
	
	field = {};
	field.s = 35;
	field.e = 12;
	field.t = "process ppn";
	drawField64(ctx, field);

	field = {};
	field.s = 11;
	field.e = 9;
	field.t = "avl";
	drawField64(ctx, field);
	ctx.stroke();
	
	let str = "G0DACWURP";
	for (let i = 0; i < str.length; i++) {
		let field = {};
		field.s = str.length - i - 1;
		field.t = str.substring(i,i+1);
		drawField64(ctx,field);
	}
	
	let explain = ["1 for valid, 0 for not valid",
		"1 for read/write, 0 for read",
		"1 for user mode can access; 0 otherwise",
		"1 for write-through cache; 0 for write-back cache",
		"1 for cache disable; 0 for cache enable",
		"1 means page was read/written; 0 was not",
		"1 means write was done; 0 was not",
		"",
		"1 will not puge tlb etry on CR3 load;"];
	let y = bottomLine;
	for (let i = 0; i < str.length; i++) {
		if (explain[i] == "") continue;
		let x = (63 - i) * bitWidth;
		
		x += bitWidth/2;
		ctx.moveTo(x, bottomLine);
		y += 10;
		ctx.lineTo(x, y);
		x += 10;
		ctx.lineTo(x, y);
		ctx.stroke();
		ctx.textAlign = "left";
		ctx.textBaseline = "middle";
		ctx.fillText(explain[i], x, y);
	}
}


function vaDraw (id)
{
	let c = document.getElementById(id);
	let ctx = c.getContext("2d");

	ctx.moveTo(0, topLine);
	ctx.lineTo(64*bitWidth, topLine);

	ctx.moveTo(0, bottomLine);
	ctx.lineTo(64*bitWidth, bottomLine);


	let field = {};
	field.s=11;
	field.e=0;
	field.t="Offset";
	drawField64(ctx,field);


	let j = 4;
	for (let i = 12; i < 57; i += 9) {
		field = {};
		field.s=i+8;
		field.e=i;
		field.t="i" + j;
		j--;
		drawField64(ctx,field);
	}

	field = {};
	field.s=63;
	field.e=57;
	field.t="sext";
	drawField64(ctx,field);


}




cr3oldDraw("cr3old");
cr3newDraw("cr3new");
pml5Draw("pml5e");
peeDraw("pml4e");
pdeDraw("pde");
pteDraw("pte");
vaDraw("va");
