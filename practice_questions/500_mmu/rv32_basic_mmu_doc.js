//
//  r v 3 2     m m u  d o c
//

let topLine = 10;
let bottomLine = 30;

let bitWidth = 20;

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

function satpDraw (id)
{
	let c = document.getElementById(id);
	let ctx = c.getContext("2d");
	
	
	ctx.moveTo(0, topLine);
	ctx.lineTo(32*bitWidth, topLine);

	ctx.moveTo(0, bottomLine);
	ctx.lineTo(32*bitWidth, bottomLine);


	let field = {};
	field.s=31;
	field.t="M";
	drawField(ctx,field);


	field.s = 30;
	field.e = 22;
	field.t = "ASID";
	drawField(ctx,field);
	
	field.s = 21;
	field.e = 0;
	field.t = "external tbl ppn";
	drawField(ctx,field);	
	
	let x = bitWidth/2;
	let y = bottomLine;
	ctx.moveTo(x,y);
	y += 10;
	
	ctx.lineTo(x,y);
	x += 10
	ctx.lineTo(x,y);
	ctx.stroke();
	ctx.textAlign = "left";
	ctx.textBaseline = "middle";
	ctx.fillText("1 for virtual enabled; 0 for physical addressing",x, y);
	return;
}


function pteDraw (id)
{
	let c = document.getElementById(id);
	let ctx = c.getContext("2d");

	ctx.moveTo(0, topLine);
	ctx.lineTo(32*bitWidth, topLine);

	ctx.moveTo(0, bottomLine);
	ctx.lineTo(32*bitWidth, bottomLine);


	let field = {};
	field.s = 31;
	field.e = 10;
	field.t = "table/process ppn";
	drawField(ctx, field);

	field = {};
	field.s = 9;
	field.e = 8;
	field.t = "";
	drawField(ctx, field);
	ctx.stroke();
	
	let str = "VRWXUGAD";
	for (let i = 0; i < str.length; i++) {
		let field = {};
		field.s = i;
		field.t = str.substring(i,i+1);
		drawField(ctx,field);
	}
	
	let explain = ["1 for valid, 0 for not valid",
		"1 for readable page; 0 otherwise",
		"1 for writeable page; 0 otherwise",
		"1 for executable page; 0 otherwise",
		"1 for user mode accessible page; 0 otherwise",
		"1 for global page; 0 otherwise",
		"1 means page was accessed",
		"1 means page was written into"];
	let y = bottomLine;
	for (let i = 0; i < str.length; i++) {
		if (explain[i] == "") continue;
		let x = (31 - i) * bitWidth;
		
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
	
	let x = (31-8)*bitWidth;
	ctx.moveTo(x, bottomLine);
	y += 10;
	ctx.lineTo(x, y);
	x += 10;
	ctx.lineTo(x, y);
	ctx.stroke();
	ctx.fillText("Free for software",x, y);

	x = (31-20)*bitWidth;
	ctx.moveTo(x, bottomLine);
	y += 10;
	ctx.lineTo(x, y);
	x += 10;
	ctx.lineTo(x, y);
	ctx.stroke();
	ctx.fillText("Table ppn if WXR=000; Process ppn otherwise",x, y);

}


function vaDraw (id)
{
	let c = document.getElementById(id);
	let ctx = c.getContext("2d");

	ctx.moveTo(0, topLine);
	ctx.lineTo(32*bitWidth, topLine);

	ctx.moveTo(0, bottomLine);
	ctx.lineTo(32*bitWidth, bottomLine);


	let field = {};
	field.s=31;
	field.e=22;
	field.t="i0";
	drawField(ctx,field);

	field = {};
	field.s=21;
	field.e=12;
	field.t="i1";
	drawField(ctx,field);

	field = {};
	field.s=11;
	field.e=0;
	field.t="Offset";
	drawField(ctx,field);

}




satpDraw("satp");
pteDraw("pte");
vaDraw("va");
