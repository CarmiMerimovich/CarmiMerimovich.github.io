//
//  x 8 6   -  3 2   m m u
//
import {Ram} from "./Ram.mjs";
import {DisplayRam} from "./DisplayRam.mjs";

function fillGarbage(page) {// Garbage looking as legit translation page
	for (let o = 0; o < 4096; o += 4) {
		let d = Math.trunc(Math.random() * (2**20)) * 4096 +
						7;
		ram.writeD(page + o, d);
	}
}

let va = Math.trunc(Math.random() * (2**32));
let vp = Math.trunc(va / 4096);
let offset = va % 4096;
let pp = Math.trunc(Math.random() * (2**20)) * 4096;
let pa = pp + (va % 4096);

let i0 = Math.trunc(va / (2**22));
let i1 = Math.trunc(va / 4096) % 1024;

let eVa = document.getElementById("va");
eVa.innerHTML = va.toString(16).toUpperCase().padStart(8, "0");

let ram = new Ram;
ram.littleEndian = true;
ram.numPages = Math.pow(2,20);  // Sign issue

let e = document.getElementById("displayArea");
let displayRam = new DisplayRam(e, ram);
displayRam.addressDigits = 8;
displayRam.unit = 4;
displayRam.unitDigits = 8;
displayRam.addressDigits = 8;
displayRam.rtl = false;


let extTbl = ram.findUnusedPage();
let inrTbl = ram.findUnusedPage();
fillGarbage(extTbl);
fillGarbage(inrTbl);

let extEntry = extTbl + i0 * 4;
let inrEntry = inrTbl + i1 * 4;
ram.writeD(extEntry, inrTbl + 7);
ram.writeD(inrEntry, pp + 7);

for (let i = 0; i < 3; i++) {
	let addr;
	do {
		let o = Math.trunc(Math.random() * 1024) * 4;
		addr = extTbl + o;
	} while (addr == extEntry);
	let pp = ram.findUnusedPage();
	ram.writeD(addr, pp + 7);
	fillGarbage(pp);
	displayRam.showD(pp + Math.trunc(Math.random() * 4096));
}

for (let i = 0; i < 3; i++) {
	let addr;
	do {
		let o = Math.trunc(Math.random() * 1024) * 4;
		addr = inrTbl + o;
	} while (addr == inrEntry);
	let pp = ram.findUnusedPage();
	ram.writeD(addr, pp + 7);
	fillGarbage(pp);
	displayRam.showD(pp + Math.trunc(Math.random() * 4096));
}

displayRam.showD(extEntry);
displayRam.showD(inrEntry);


let eCr3 = document.getElementById("cr3");
eCr3.innerHTML = extTbl.toString(16).toUpperCase().padStart(8, "0");

displayRam.display();

function displayAnswer() {
	let eAnswer = document.getElementById("answer");
	eAnswer.innerHTML = pa.toString(16).toUpperCase().padStart(8, "0");

	let s = `<ol>
		<li>
		הכתובת הוירטואלית הנתונה היא 
		0x${va.toString(16).toUpperCase().padStart(8, "0")}.
		</li>
		<li>
		יש לפרק אותה למספר דף וירטואלי והיסט.
		כיון ש-12 הביטים הם ההיסט 
		וזה בדיוק 3 ספרות הקסה
		 אנו מקבלים את הפירוק הבא:
		<ol>
		<li>
		 ההיסט הוא
			ox${offset.toString(16).toUpperCase().padStart(3,"0")}.
		</li>
		<li>
			מספר הדף הוירטואלי הוא 
		ox${vp.toString(16).toUpperCase().padStart(5, "0")}.<br/>
		</li>
		</ol>
		</li>
		<li>
		בשלב זה עלינו לפצל את מספר הדף 
		הוירטואלי לשני האינדקסים
		i0 ו-i1.
		כל אחד מהשדות הוא ברוחב 10 ביטים
		 והדרך הבטוחה לעבוד
		היא לתרגם את מספר הדף הוירטואלי לבינרי ואז לפצל לשדות.
		נקבל
		0b${vp.toString(2).padStart(20,"0")} ואז:
		<ol>
		<li>
		i0 = 0b${i0.toString(2).padStart(10, "0")}.
		</li>
		<li>
		i1 = 0b${i1.toString(2).padStart(10, "0")}.
		</li>
		</ol>
		</li>
		<li>
		השדות i0 ו-i1 הינם אינדקסים
		ולכן חסרי שימוש.
		יש להפוך אותם להיסטים.
		כיון שכל כניסה בטבלת התרגום היא ברוחב 4B
		יש להכפיל את האינדקסים פי 4.
		בבינרי קל להכפיל פי 4 מוסיפים שני אפסים מימין.
		<ol>
		<li>
		i0 &times; 4 = 
		0b${(i0*4).toString(2).padStart(12, "0")}
		</li>
		<li>
		i1 &times; 4 =
		0b${(i1*4).toString(2).padStart(12, "0")}.
		</li>
		</ol>
		<li>
		נתרגם את 
		i0 ו-i1
		להקסה.
		<ol>
		<li>
		i0 &times 4 = 
		0x${(i0*4).toString(16).toUpperCase().padStart(3, "0")}
		</li>
		<li>
		i1 &times; 4 =
		0x${(i1*4).toString(16).toUpperCase().padStart(3, "0")}.
		</li>
		</ol>
		</li>
		<li>
		נתון 
		cr3 =
		0x${extTbl.toString(16).toUpperCase().padStart(5, "0")}.
		</li>
		<li>
		מספר הדף הפיזי בו נמצאת הטבלה החיצונית
		(הטבלה ברמה 0)
		נמצא ב-20 הביטים השמאליים של
		cr3.
		כלומר:
		0x${Math.trunc(extTbl/4096).toString(16).toUpperCase().padStart(5, "0")}.
		</li>
		<li>
		הטבלה החיצונית מצחילה בכתובת
		0x${extTbl.toString(16).toUpperCase().padStart(5, "0")}.
		</li>
		<li>
		צריך לקרוא את כניסה 
		i0
		של הטבלה החיצונית.
		לשם כך צריך לחשב את הכתובת  הפיזית של כניסה זו.
		לשם כך צריך להוסיף את ההיסט של כניסה 
			i0
		לכתובת ההתחלה של הטבלה החיצונית:
		0x${(extEntry).toString(16).toUpperCase().padStart(8,"0")}.
		</li>
		<li>
			מתמונת הזכרון נקבל שהתוכן (4 בתים)
			 שנמצא בכתובת זו הוא
		0x${ram.readD(extEntry).toString(16).toUpperCase().padStart(8,"0")}.
		</li>
		<li>
		התוכן הוא אי-זוגי כלומר הכניסה וולידית.
		</li>
		<li>
		12 
		הביטים הימניים הם דגלים.
		12
		 מתחלק יפה ב-4
		ולכן חמשת הספרות ההקסה השמאליות הן
		 מספר הדף הפיזי של הטבלה הפנימית (רמה 1)
		שאנו צריכים:
		0x${Math.trunc(ram.readD(extEntry)/4096).toString(16).toUpperCase().padStart(5,"0")}.
		</li>
		<li>
		כתובת ההתחלה של הטבלה הפנימית היא
		0x${Math.trunc(ram.readD(extEntry)/4096).toString(16).toUpperCase().padStart(5,"0")}000.
			</li>
		<li>
		אנו צריכים לקרוא את כניסה 
		 i1
		בטבלה הפנימית.
		לשם כך יש לחשב את הכתובת של כניסה זו.
		הכתובת מתקבלת על ידי
		 הוספת ההיסט
		 i1 &times; 4
		 לכתובת התחלה של הדף הפנימי:
		0x${inrEntry.toString(16).toUpperCase().padStart(8, "0")}.
		</li>
		<li>
		מקריאת תמונת הזכרון נקבל שהתוכן (4 בתים)
		 בכתובת זו הוא
		0x${ram.readD(inrEntry).toString(16).toUpperCase().padStart(8,"0")}.
		</li>
		<li>
		כיון שהתוכן אי-זוגי הכניסה וולידית.
		</li>
		<li>
		 ולכן מספר הדף הפיזי המבוקש הוא
		0x${Math.trunc(pp/4096).toString(16).toUpperCase().padStart(5,"0")}.
		</li>
		<li>
		 ולכן כתובת ההתחלה של  הדף הפיזי המבוקש היא
		0x${pp.toString(16).toUpperCase().padStart(5,"0")}.
		</li>
		<li>
		על ידי הוספת ההיסט מהתוכבת הוירטואלית
		  לכתובת תחילת הדף הפיזי
		  נקבל את הדרוש:
		0x${pa.toString(16).toUpperCase().padStart(8,"0")}.
		</li>
		</ol>
		<hr>`;

	let eExplanation = document.getElementById("explanation");
	eExplanation.innerHTML = s;

}


let helpMode = false;
function setHelpMode() {
	helpMode = !helpMode;
	let e = document.getElementById("help");
	e.checked = helpMode;
	
	e = document.getElementById("cr3");
	e.title = "";
	if (helpMode) {
		let pfn = extTbl;
		e.title="tbl=" + pfn.toString(16);
	}

	e = document.getElementById("va");
	e.title = "";
	if (helpMode) {
		let i0 = Math.trunc(Math.trunc(va / Math.pow(2, 22)) % 1024);
		let i1 = Math.trunc(Math.trunc(va / 4096) % 1024);
		let off = Math.trunc(va % 4096);
		e.title="i0=" + i0.toString(16).toUpperCase()+ "; " +
				"i1=" + i1.toString(16).toUpperCase() + "; " +
				"off=" + off.toString(16).toUpperCase();
	}

}

let eAnswerButton = document.getElementById("answerButton");
eAnswerButton.addEventListener("click", displayAnswer); 

let eHelp = document.getElementById("help");
eHelp.addEventListener("click", setHelpMode); 
