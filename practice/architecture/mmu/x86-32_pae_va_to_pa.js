//
//  x 8 6   -  3 2   m m u
//
import {Ram} from "./Ram.mjs";
import {DisplayRam} from "./DisplayRam.mjs";

function fillGarbage(page) {// Garbage looking as legit translation page
	for (let o = 0; o < 4096; o += 8) {
		let d = BigInt(Math.trunc(Math.random() * (2**24)) * 4096 +
						7);
		ram.writeQ(page + o, d);
	}
}

let va = Math.trunc(Math.random() * (2**32));
let vp = Math.trunc(va / 4096);
let offset = va % 4096;
let pp = Math.trunc(Math.random() * (2**24)) * 4096;
let pa = pp + (va % 4096);

let i0 = Math.trunc(va / (2**30)) % 4;
let i1 = Math.trunc(va / (2**21)) % 512;
let i2 = Math.trunc(va / (2**12)) % 512;

let eVa = document.getElementById("va");
eVa.innerHTML = va.toString(16).toUpperCase().padStart(8, "0");

let ram = new Ram;
ram.littleEndian = true;
ram.numPages = (2**22);  // Sign issue

let e = document.getElementById("displayArea");
let displayRam = new DisplayRam(e, ram);
displayRam.addressDigits = 8;
displayRam.unit = 4;
displayRam.unitDigits = 8;
displayRam.addressDigits=9;
displayRam.rtl = false;


// Ugly. Very ugly. Need another findUnusedPage routine.
// This is all due to Intel's CR3 bug in PAE
let lev0Tbl;
do {
	lev0Tbl = ram.findUnusedPage();
} while (lev0Tbl >= (2**32));

let lev1Tbl = ram.findUnusedPage();
let lev2Tbl = ram.findUnusedPage();
fillGarbage(lev0Tbl);
fillGarbage(lev1Tbl);
fillGarbage(lev2Tbl);

let lev0Entry = lev0Tbl + i0 * 8;
let lev1Entry = lev1Tbl + i1 * 8;
let lev2Entry = lev2Tbl + i2 * 8;
ram.writeQ(lev0Entry, BigInt(lev1Tbl + 7));
ram.writeQ(lev1Entry, BigInt(lev2Tbl + 7));
ram.writeQ(lev2Entry, BigInt(pp + 7));

for (let i = 0; i < 3; i++) {
	let addr;
	do {
		let o = Math.trunc(Math.random() * 512) * 8;
		addr = lev0Tbl + o;
	} while (addr == lev0Entry);
	let pp = ram.findUnusedPage();
	ram.writeQ(addr, BigInt(pp + 7));
	fillGarbage(pp);
	displayRam.showB(pp + Math.trunc(Math.random() * 4096));
}

for (let i = 0; i < 3; i++) {
	let addr;
	do {
		let o = Math.trunc(Math.random() * 512) * 8;
		addr = lev1Tbl + o;
	} while (addr == lev1Entry);
	let pp = ram.findUnusedPage();
	ram.writeQ(addr, BigInt(pp + 7));
	fillGarbage(pp);
	displayRam.showB(pp + Math.trunc(Math.random() * 4096));
}

for (let i = 0; i < 3; i++) {
	let addr;
	do {
		let o = Math.trunc(Math.random() * 512) * 8;
		addr = lev2Tbl + o;
	} while (addr == lev2Entry);
	let pp = ram.findUnusedPage();
	ram.writeQ(addr, BigInt(pp + 7));
	fillGarbage(pp);
	displayRam.showB(pp + Math.trunc(Math.random() * 4096));
}


displayRam.showQ(lev0Entry);
displayRam.showQ(lev1Entry);
displayRam.showQ(lev2Entry);


let eCr3 = document.getElementById("cr3");
eCr3.innerHTML = lev0Tbl.toString(16).toUpperCase().padStart(8, "0");

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
		נפרק אותה למספר דף וירטואלי והיסט.
		כיון שההיסט הוא ברוחב 12 ביטים
		 שזה בדיוק 3 ספרות הקסה מקבלים:
		 <ol>
		 <li>
		 	היסט:
			0x${offset.toString(16).toUpperCase().padStart(3,"0")}.
		</li>
		<li>
		מספר דף וירטואלי:
		0x${vp.toString(16).toUpperCase().padStart(5, "0")}.
		</li>
		</ol>
		<li>
		בשלב זה עלינו לפצל
		 את מספר הדף הוירטואלי לשלושת האינדקסים
		i0,&rlm; i1,&rlm; ו-i2&rlm;.
		רוחב השדות הוא 
		2b,&rlm;
		 9b,&rlm;
		  ו-9b&rlm;
		בהתאמה.
		הדרך הבטוחה לעבוד
		היא לתרגם את מספר הדף הוירטואלי לבינרי ואז לפצל לשדות.
		בבינרי מספר הדף הוירטואלי הוא
		0b${vp.toString(2).padStart(20,"0")}.
		<ol>
		<li>
		i0 = 0b${i0.toString(2).padStart(2, "0")}.
		</li>
		<li>
		i1 = 0b${i1.toString(2).padStart(9, "0")}.
		</li>
		<li>
		i2 = 0b${i2.toString(2).padStart(9, "0")}.
		</li>
		</ol>
		</li>
		<li>
		השדות 
		i0,&rlm; i1,&rlm; ו-i2&rlm;
		 הינם אינדקסים
		ולכן חסרי שימוש.
		יש להפוך אותם להיסטים.
		כיון שכל כניסה בטבלת התרגום היא ברוחב
		 8B
		יש להכפיל את האינדקסים פי 8.
		בבינרי קל להכפיל פי 8 מוסיפים שלושה אפסים מימין.
		<ol>
		<li>
		i0 &times; 8 =
		0b${(i0*8).toString(2).padStart(12, "0")}.
		</li>
		<li>
		i1 &times; 8 = 
		0b${(i1*8).toString(2).padStart(12, "0")}.
		</li>
		<li>
		i2  &times; 8 =
		0b${(i2*8).toString(2).padStart(12, "0")}.
		</li>
		</ol>
		</li>
		<li>
		נתרגם להקסה עבור הנוחות.
		<ol>
		<li>
		i0 &times; 8 = 
		0x${(i0*8).toString(16).toUpperCase().padStart(3, "0")},
		</li>
		<li>
		i1 &times; 8 =
		0x${(i1*8).toString(16).toUpperCase().padStart(3, "0")},
		</li>
		<li>
		i2 &times; 8 =
		0x${(i2*8).toString(16).toUpperCase().padStart(3, "0")}.
		</li>
		</ol>
		<li>
		cr3 
		מכיל
		0x${lev0Tbl.toString(16).toUpperCase().padStart(8, "0")}.
		</li>
		<li>
		מספר הדף הפיזי בו נמצאת הטבלה החיצונית
		(הטבלה ברמה 0)
		נמצא ב-20 הביטים השמאליים של
		cr3&rlm;:
		 0x${(lev0Tbl/4096).toString(16).toUpperCase().padStart(6, "0")}.
		(יש לשים לב למוזרות שאין מקום
			 ב-cr3
			 ל-6
				ספרות הקסה עבור מספר דף פיזי.)
		</li>
		<li>
		לכן כתובת ההתחלה של הטבלה החיצונית היא
		0x${lev0Tbl.toString(16).toUpperCase().padStart(9, "0")}.
		</li>
		<li>
		צריך לקרוא את כניסה
		 i0
		 של הטבלה החיצונית.
		 לשם כך צריך לחשב את כתובת הכניסה.
		 זו מושגת על-ידי הוספת ההיסט
		 i0 &times; 8
		 לכתובת ההתחלה של הטבלה החיצונית:
		0x${(lev0Entry).toString(16).toUpperCase().padStart(9,"0")}.
		</li>
		<li>
			מתמונת הזכרון נקבל שהתוכן (8 בתים) שנמצא בכתובת זו הוא
		0x${ram.readQ(lev0Entry).toString(16).toUpperCase().padStart(16,"0")}.
		</li>
		<li>
		התוכן הוא אי-זוגי כלומר הכניסה וולידית.
		</li>
		<li>
		28 
		הביטים השמאליים בכניסה הם מבזים!
		ולמזלנו הם אכן אפסים.
		כיון שהביטים השמאליים הם מבזים נרשום שוב
		 רק את 9 הספרות הקסה הימניות של הכניסה:
		0x${ram.readQ(lev0Entry).toString(16).toUpperCase().padStart(9,"0")}.&rlm;
		</li>
		<li>
		12 
		הביטים הימניים הם דגלים.
		12 מתחלק יפה
		 ב-4
		ולכן ששת הספרות ההקסה השמאליות הן 
		מספר הדף הפיזי של הטבלה האמצעית (רמה 1)
		שאנו צריכים:
		0x${Math.trunc(lev1Tbl/4096).toString(16).toUpperCase().padStart(6,"0")}.
		</li>
		<li>
		ולכן כתובת ההתחלה של הטבלה האמצעית היא
		0x${lev1Tbl.toString(16).toUpperCase().padStart(6,"0")}.
		</li>
		<li>
		אנו צריכים לקרוא את כניסה  
		i1
		בטבלה האמצעית 
		(רמה 1).
		לכן יש לחשב את הכתובת של כניסה זו.
		לשם כך נוסיף אם ההיסט
		i1 &times 8
		לכתובת ההתחלה של הטבלה הפנימית:
		0x${lev1Entry.toString(16).toUpperCase().padStart(9, "0")}.
		</li>
		<li>
		מקריאת תמונת הזכרון
		 נקבל שהתוכן (8 בתים) בכתובת זו הוא
		0x${ram.readQ(lev1Entry).toString(16).toUpperCase().padStart(16,"0")}.&rlm;
		</li>
		<li>
		כיון שהתוכן אי-זוגי הכניסה וולידית.
		</li>
		<li>
		28 
		הביטים השמאליים בכניסה הם מבזים!
		ולמזלנו הם אכן אפסים.
		כיון שהביטים השמאליים הם מבזים נרשום שוב רק את 9 הספרות הקסה הימניות של הכניסה:
		0x${ram.readQ(lev1Entry).toString(16).toUpperCase().padStart(9,"0")}.&rlm;
		</li>
		<li>
		12 
		הביטים הימניים הם דגלים.
		12 
		מתחלק יפה
		 ב-4
		ולכן ששת הספרות ההקסה השמאליות הן 
		מספר הדף הפיזי של הטבלה הפנימית (רמה 2)
		שאנו צריכים:
		0x${Math.trunc(lev2Tbl/4096).toString(16).toUpperCase().padStart(6,"0")}.
		</li>
		<li>
		לכן כתובת ההתחלה של הטבלה הפנימית היא
		0x${Math.trunc(lev2Tbl/4096).toString(16).toUpperCase().padStart(6,"0")}.
		</li>
		<li>
		 צריך לקרוא את כניסה  
		i2
		בטבלה הפנימית 
		(רמה 2).
		לשם כך צריך לחשב את הכתובת של הכניסה.
		צריך להוסיף את היסט הכניסה
		i2 &times 8
		לכתובת ההתחלה של הטבלה הפנימית:
		0x${lev2Entry.toString(16).toUpperCase().padStart(9, "0")}.
		</li>
		<li>
		מקריאת תמונת 
		הזכרון נקבל שהתוכן (8 בתים) בכתובת זו הוא
		0x${ram.readQ(lev2Entry).toString(16).toUpperCase().padStart(16,"0")}.&rlm;
		</li>
		<li>
		כיון שהתוכן אי-זוגי הכניסה וולידית.
		</li>
		<li>
		28 
		הביטים השמאליים בכניסה הם מבזים!
		ולמזלנו הם אכן אפסים.
		כיון שהביטים השמאליים הם מבזים נרשום שוב רק את 9 הספרות הקסה הימניות של הכניסה:
		0x${ram.readQ(lev2Entry).toString(16).toUpperCase().padStart(9,"0")}.&rlm;
		</li>
		<li>
		12 
		הביטים הימניים הם דגלים.
		12 
		מתחלק יפה
		 ב-4
		ולכן ששת הספרות ההקסה השמאליות הן 
		מספר הדף הפיזי 
		  המבוקש:
		0x${Math.trunc(pp/4096).toString(16).toUpperCase().padStart(6,"0")}.
		</li>
		<li>
		כלומר כתובת תחילת הדף הפיזי המבוקש היא
		0x${pp.toString(16).toUpperCase().padStart(9,"0")}.
		</li>
		<li>
		נקבל את הכתובת הפיזית המבוקשת על-ידי
		הוספת  ההיסט 
		מהכתובת הוירטואלית לכתובת תחילת הדף הפיזי:
		0x${pa.toString(16).toUpperCase().padStart(9,"0")}.
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
		let pfn = lev0Tbl;
		e.title = "tbl=" + pfn.toString(16);
	}

	e = document.getElementById("va");
	e.title = "";
	if (helpMode) {
		let i0 = Math.trunc(va / (2**30)) % 4;
		let i1 = Math.trunc(Math.trunc(va / (2**21)) % 512);
		let i2 = Math.trunc(Math.trunc(va / (2**12)) % 512);
		let off = Math.trunc(va % 4096);
		e.title="i0=" + i0.toString(16).toUpperCase() + "; " +
				"i1=" + i1.toString(16).toUpperCase() + "; " +
				"i2=" + i2.toString(16).toUpperCase() + "; " +
				"off=" + off.toString(16).toUpperCase();
	}

}

let eAnswerButton = document.getElementById("answerButton");
eAnswerButton.addEventListener("click", displayAnswer); 

let eHelp = document.getElementById("help");
eHelp.addEventListener("click", setHelpMode); 
