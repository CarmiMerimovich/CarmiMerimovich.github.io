//
//  r  v  3  2    v a   t o   p a
//
import {Ram} from "./Ram.mjs";
import {DisplayRam} from "./DisplayRam.mjs";

function fillGarbage(page) {// Garbage looking as legit
	let bits;
	if (Math.random() < 0.5)
		bits = 1;
	else
		bits = 15;
	
	for (let o = 0; o < 4096; o += 4) {
		let d = Math.trunc(Math.random()* (2**20) ) * 1024;
		ram.writeD(page + o, d + bits);
	}
}


let va = Math.trunc(Math.random() * (2**32));
let vp = Math.trunc(va / 4096);
let offset = va % 4096;
let pp = Math.trunc(Math.random() * (2**22)) * 4096;
let pa = pp + (va % 4096);

let i0 = Math.trunc(va / (2**22));
let i1 = Math.trunc(va / 4096) % 1024;

let eVa = document.getElementById("va");
eVa.innerHTML = va.toString(16).toUpperCase().padStart(8, "0");

let ram = new Ram;
ram.littleEndian = true;
ram.numPages = (2**22);  // Sign issue?!

let e = document.getElementById("displayArea");
let displayRam = new DisplayRam(e, ram);
displayRam.addressDigits = 9;
displayRam.unit = 4;
displayRam.unitDigits = 8;
displayRam.rtl = false;


let extTbl = ram.findUnusedPage();
let inrTbl = ram.findUnusedPage();
for (let o = 0; o < 4096; o += 4) {
	let d = Math.trunc(Math.random()* (2**20) ) * 1024;
	ram.writeD(extTbl + o, d + 1);
}
for (let o = 0; o < 4096; o += 4) {
	let d = Math.trunc(Math.random()* (2**20) ) * 1024;
	ram.writeD(inrTbl + o, d + 15);
}

let extEntry = extTbl + i0 * 4;
let inrEntry = inrTbl + i1 * 4;
ram.writeD(extEntry, Math.trunc(inrTbl/4) + 1);
ram.writeD(inrEntry, Math.trunc(pp/4) + 15);

for (let i = 0; i < 3; i++) {
	let addr;
	do {
		let o = Math.trunc(Math.random() * 1024) * 4;
		addr = extTbl + o;
	} while (addr == extEntry);
	let pp = ram.findUnusedPage();
	ram.writeD(addr, Math.trunc(pp/4));
	fillGarbage(pp);
	displayRam.showD(pp + Math.trunc(Math.random() * (4096-4)));
}

for (let i = 0; i < 3; i++) {
	let addr;
	do {
		let o = Math.trunc(Math.random() * 1024) * 4;
		addr = inrTbl + o;
	} while (addr == inrEntry);
	let pp = ram.findUnusedPage();
	ram.writeD(addr, Math.trunc(pp/4) + 7);
	fillGarbage(pp);
	displayRam.showD(pp + Math.trunc(Math.random() * (4096-4)));
}

displayRam.showD(extEntry);
displayRam.showD(inrEntry);

let eSatp = document.getElementById("satp");
let satp = (2**31) +
			Math.trunc(Math.random() * 512) * (2**22) + 
			Math.trunc(extTbl / 4096);
eSatp.innerHTML = satp.toString(16).toUpperCase().padStart(8, "0");

displayRam.display();

function displayAnswer() {
	let eAnswer = document.getElementById("answer");
	eAnswer.innerHTML = pa.toString(16).toUpperCase().padStart(9, "0");

	let s = `<ol>
		<li>
		הכתובת הוירטואלית הנתונה היא 
		0x${va.toString(16).toUpperCase().padStart(8, "0")}.
		</li>
		<li>
		יש לפרק אותה למספר דף וירטואלי והיסט.
		כיון שההיסט הוא ברוחב 12 ביטים שזה בדיוק 3 ספרות הקסה. מקבלים:
		<ol>
		<li>
			היסט: 
			0x${offset.toString(16).toUpperCase().padStart(3,"0")}
		</li>
		<li>
			 מספר דף וירטואלי: 
			0x${vp.toString(16).toUpperCase().padStart(5, "0")}.
		</li>
		</ol>
		<li>
		בשלב זה עלינו לפצל את
		 מספר הדף הוירטואלי לשני האינדקסים
		i0 ו-i1.
		כל אחד מהשדות הוא ברוחב 10 ביטים
		 והדרך הבטוחה לעבוד
		היא לתרגם את מספר הדף הוירטואלי לבינרי ואז לפצל לשדות.
		ובכן.
		בבינרי מספר הדף הוירטואלי הוא
		0b${vp.toString(2).padStart(20,"0")}.
		ולכן:
		<ol>
		<li>
		i0 = 
		0b${i0.toString(2).padStart(10, "0")}.
		</li>
		<li>
		i1 =
		0b${i1.toString(2).padStart(10, "0")}.
		</li>
		</ol>
		<li>
		השדות 
			i0 ו-i1	
			 הינם אינדקסים
				ולכן חסרי שימוש.
		יש להפוך אותם להיסטים.
		כיון שכל כניסה בטבלת התרגום היא ברוחב
		 4B
		יש להכפיל את האינדקסים פי 4.
		בבינרי קל להכפיל פי 
			4,
			 מוסיפים שני אפסים מימין.
		<ol>
		<li>
		i0 &times; 4 = 
		0b${(i0*4).toString(2).padStart(12, "0")}.
		</li>
		<li>
		i1 &times; 4  = 
		0b${(i1*4).toString(2).padStart(12, "0")}.
		</li>
		</ol>
		</li>
		<li>
		נתרגם להקסה:
		<ol>
		<li>
		i0 &times; 4 = 
		0x${(i0*4).toString(16).toUpperCase().padStart(3, "0")}.
		</li>
		<li>
		i1 &times; 4 =
		0x${(i1*4).toString(16).toUpperCase().padStart(3, "0")}.
		</li>
		</ol>
		</li>
		<li>
			ב-satp
			 יש
			 0x${satp.toString(16).toUpperCase().padStart(8, "0")}.
		</li>
		<li>
		מספר הדף הפיזי בו נמצאת הטבלה החיצונית
		(הטבלה ברמה 0)
		נמצא ב-22 הביטים הימניים של האוגר
		 satp.&rlm;
		 22
		  לא מתחלק טוב ב-4
		 	אז יש ספרה הקסה שנשברת באמצע.
			אפשר להסתבך.
			ואפשר לתרגם את 
			satp
			לבינרי שזה יוצא
			0b${satp.toString(2).padStart(32,"0")}.
		</li>
		<li>
			ואז לקחת את 22 הביטים הימניים
			 בלבד שזה יוצא
			0b${(satp % (2**22)).toString(2).padStart(22,"0")}.
		</li>
		<li>
			נתרגם להקסה:
			0x${(satp % (2**22)).toString(16).toUpperCase().padStart(6,"0")}.
		</li>
		<li>
		ולכן כתובת ההתחלה של הטבלה החיצונית:
		0x${extTbl.toString(16).toUpperCase().padStart(9, "0")}
		</li>
		<li>
		צריך לקרוא את כניסה
		i0
		של הטבלה החיצונית.
		לשם כך נחשב את הכתובת של הכניסה בטבלה החיצונית על-ידי
		הוספת ההיסט
		i0 &times; 4
		לכתובת ההתחלה של הטבלה החיצונית:
		0x${(extEntry).toString(16).toUpperCase().padStart(9,"0")}.
		</li>
		<li>
			מתמונת הזכרון נקבל שהתוכן (4 בתים) שנמצא בכתובת זו הוא
		0x${ram.readD(extEntry).toString(16).toUpperCase().padStart(8,"0")}.
		</li>
		<li>
		התוכן הוא אי-זוגי כלומר הכניסה וולידית.
		</li>
		<li>
		10
		 הביטים הימניים הם דגלים.
		10
		לא מתחלק יפה ב-4.
		לכן נתרגם את הכניסה לבינרי
		0b${ram.readD(extEntry).toString(2).padStart(32,"0")}.
		</li>
		<li>
			ניקח את 
			22
		 הביטים השמאליים בלבד:
		 0b${Math.trunc(ram.readD(extEntry) / 1024).toString(2).padStart(22,"0")}.
		</li>
		<li>
		 נתרגם להקסה:
		 0x${Math.trunc(ram.readD(extEntry) / 1024).toString(16).toUpperCase().padStart(6,"0")}.
		ובזאת קיבלנו בהקסה את מספר הדף הפיזי
		 של הטבלה הפנימית 
		 (רמה 1)
		 המתאימה.
		 </li>
		 <li>
		 לכן הכתובת הפיזית בה מתחילה הטבלה הפנימית היא
		 0x${inrTbl.toString(16).toUpperCase().padStart(9, "0")},
		 </li>
		 <li>
		אנו צריכים לקרוא את כניסה  
		i1
		בטבלה הפנימית.
		לשם כך יש לחשב את כתובת הכניסה בטבלה הפנימית
		על ידי הוספת ההיסט
		i1 &times; 4
		לכתובת ההתחלה של הטבלה:
		0x${inrEntry.toString(16).toUpperCase().padStart(8, "0")}.
		</li>
		<li>
		מקריאת תמונת הזכרון נקבל שהתוכן (4 בתים) בכתובת זו הוא
		0x${ram.readD(inrEntry).toString(16).toUpperCase().padStart(8,"0")}.
		</li>
		<li>
		כיון שהתוכן אי-זוגי הכניסה וולידית.
		</li>
		<li>
		10
		 הביטים הימניים הם דגלים.
		10
		לא מתחלק יפה ב-4.
		לכן נתרגם את הכניסה לבינרי
		0b${ram.readD(inrEntry).toString(2).padStart(32,"0")}.
		</li>
		<li>
			ניקח את 
			22
		 הביטים השמאליים בלבד:
		 0b${Math.trunc(ram.readD(inrEntry) / 1024).toString(2).padStart(22,"0")}.
		</li>
		<li>
		 את זה נתרגם להקסה:
		 0x${Math.trunc(ram.readD(inrEntry) / 1024).toString(16).toUpperCase().padStart(6,"0")}.
		 ובזאת קיבלנו בהקסה את מספר הדף הפיזי
		 </li>
		<li>
		לכן כתובת תחילת הדף הפיזי היא
		0x${Math.trunc(pp).toString(16).toUpperCase().padStart(6,"0")}.
		</li>
		<li>
		נקבל את הכתובת הפיזית המבוקשת על-ידי הוספת 
		ההיסט מהכתובת הוירטואלית
		לכתובת תחילת הדף הפיזי:
		0x${pa.toString(16).toUpperCase().padStart(9,"0")}.
		</li>
		</ol>
		<hr>`;

	let eExplanation = document.getElementById("explanation");
	eExplanation.innerHTML = s;
}

function displayDump() {
	displayRam.display();
}

let helpMode = false;
function setHelpMode() {
	helpMode = !helpMode;
	let e = document.getElementById("help");
	e.checked = helpMode;
	
	e = document.getElementById("satp");
	e.title = "";
	if (helpMode) {
		let m = Math.trunc(satp / Math.pow(2,31));
		let asid = Math.trunc(satp/ Math.pow(2,22)) % 512;
		let pfn = Math.trunc(satp % Math.pow(2, 22))* 4096;
		e.title="mode=" + m.toString(16)+ "; " +
				"asid=" + asid.toString(16) + "; " +
				"tbl=" + pfn.toString(16);
	}

	e = document.getElementById("va");
	e.title = "";
	if (helpMode) {
		let i0 = Math.trunc(Math.trunc(va / Math.pow(2, 22)) % 1024);
		let i1 = Math.trunc(Math.trunc(va / 4096) % 1024);
		let off = Math.trunc(va % 4096);
		e.title="i0=" + i0.toString(16)+ "; " +
				"i1=" + i1.toString(16) + "; " +
				"off=" + off.toString(16);
	}

}

let eAnswerButton = document.getElementById("answerButton");
eAnswerButton.addEventListener("click", displayAnswer); 

let eHelp = document.getElementById("help");
eHelp.addEventListener("click", setHelpMode);
