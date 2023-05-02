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
	let s = `הכתובת הוירטואלית הנתונה היא 
		${va.toString(16).toUpperCase().padStart(8, "0")}.
		יש לפרק אותה למספר דף וירטואלי והיסט.
		כיון שההיסט הוא ברוחב 12 ביטים שזה בדיוק 3 ספרות הקסה אנו מקבלים שההיסט הוא
			${offset.toString(16).toUpperCase().padStart(3,"0")}
		ואילו מספר הדף הוירטואלי הוא 
		${vp.toString(16).toUpperCase().padStart(5, "0")}.<br/>
		בשלב זה עלינו לפצל את מספר הדף הוירטואלי לשלושת האינדקסים
		i0,&rlm; i1,&rlm; ו-i2&rlm;.
		רוחב השדות הוא 
		2b,&rlm;
		 9b,&rlm;
		  ו-9b&rlm;
		בהתאמה.
		הדרך הבטוחה לעבוד
		היא לתרגם את מספר הדף הוירטואלי לבינרי ואז לפצל לשדות.
		ובכן.
		בבינרי מספר הדף הוירטואלי הוא
		${vp.toString(2).padStart(20,"0")}.
		ולכן השדה i0 הוא
		${i0.toString(2).padStart(2, "0")},
		 השדה i1 הוא
		${i1.toString(2).padStart(9, "0")},
		ולסיום
		השדה i2 הוא
		${i2.toString(2).padStart(9, "0")}.
		השדות 
		i0,&rlm; i1,&rlm; ו-i2&rlm;
		 הינם אינדקסים
		ולכן חסרי שימוש.
		יש להפוך אותם להיסטים.
		כיון שכל כניסה בטבלת התרגום היא ברוחב
		 8B
		יש להכפיל את האינדקסים פי 8.
		בבינרי קל להכפיל פי 8 מוסיפים שלושה אפסים מימין.
		אז אנו מקבלים ש-i0 &times; 8
		הוא
		${(i0*8).toString(2).padStart(12, "0")},
		i1 &times; 8 הוא
		${(i1*8).toString(2).padStart(12, "0")},
		ולסיום i2  &times; 8 הוא
		${(i2*8).toString(2).padStart(12, "0")}.
		בהקסה נקבל ש-i0 &times; 8
		 הוא
		${(i0*8).toString(16).toUpperCase().padStart(3, "0")},
		i1 &times; 8 הוא
		${(i1*8).toString(16).toUpperCase().padStart(3, "0")},
		ולסיום
		i2 &times; 8 הוא
		${(i2*8).toString(16).toUpperCase().padStart(3, "0")}.
		<br/>
		אחרי ההכנה המפרכת הנ"ל אפשר לגשת לתמונת הזכרון.
		מספר הדף הפיזי בו נמצאת הטבלה החיצונית
		(הטבלה ברמה 0)
		נמצא ב-20 הביטים השמאליים של
		cr3,&rlm;
		 ${(lev0Tbl/4096).toString(16).toUpperCase().padStart(6, "0")}.
		(יש לשים לב למוזרות שאין מקום
			 ב-cr3
			 ל-6
				ספרות הקסה עבור מספר דף פיזי.)
		על ידי הצמדת ההיסט של כניסה 
		i0
		למספר זה נקבל את הכתובת הפיזית של כניסה
		 i0
		בטבלה החיצונית, משמע:
		${(lev0Entry).toString(16).toUpperCase().padStart(9,"0")}.
			מתמונת הזכרון נקבל שהתוכן (8 בתים) שנמצא בכתובת זו הוא
		${ram.readQ(lev0Entry).toString(16).toUpperCase().padStart(16,"0")}.
		התוכן הוא אי-זוגי כלומר הכניסה וולידית.
		28 
		הביטים השמאליים בכניסה הם מבזים!
		ולמזלנו הם אכן אפסים.
		כיון שהביטים השמאליים הם מבזים נרשום שוב רק את 9 הספרות הקסה הימניות של הכניסה:
		${ram.readQ(lev0Entry).toString(16).toUpperCase().padStart(9,"0")}.&rlm;
		12 
		הביטים הימניים הם דגלים.
		12 מתחלק יפה
		 ב-4
		ולכן ששת הספרות ההקסה השמאליות הן 
		מספר הדף הפיזי של הטבלה האמצעית (רמה 1)
		שאנו צריכים.
		כלומר:
		${Math.trunc(lev1Tbl/4096).toString(16).toUpperCase().padStart(6,"0")}.

		אנו צריכים לגשת לאינדקס 
		i1
		בטבלה האמצעית 
		(רמה 1).
		כלומר עלינו להצמיד למספר הדף ההאמצעי את 
		i1 &times; 8.
		נקבל
		${lev1Entry.toString(16).toUpperCase().padStart(9, "0")}.
		מקריאת תמונת הזכרון נקבל שהתוכן (8 בתים) בכתובת זו הוא
		${ram.readQ(lev1Entry).toString(16).toUpperCase().padStart(16,"0")}.&rlm;
		כיון שהתוכן אי-זוגי הכניסה וולידית.
		28 
		הביטים השמאליים בכניסה הם מבזים!
		ולמזלנו הם אכן אפסים.
		כיון שהביטים השמאליים הם מבזים נרשום שוב רק את 9 הספרות הקסה הימניות של הכניסה:
		${ram.readQ(lev1Entry).toString(16).toUpperCase().padStart(9,"0")}.&rlm;
		12 
		הביטים הימניים הם דגלים.
		12 מתחלק יפה
		 ב-4
		ולכן ששת הספרות ההקסה השמאליות הן 
		מספר הדף הפיזי של הטבלה הפנימית (רמה 2)
		שאנו צריכים:
		${Math.trunc(lev2Tbl/4096).toString(16).toUpperCase().padStart(6,"0")}.


		אנו צריכים לגשת לאינדקס 
		i2
		בטבלה הפנימית 
		(רמה 2).
		כלומר עלינו להצמיד למספר הדף הפנימי את 
		i2 &times; 8.
		נקבל
		${lev2Entry.toString(16).toUpperCase().padStart(9, "0")}.
		מקריאת תמונת הזכרון נקבל שהתוכן (8 בתים) בכתובת זו הוא
		${ram.readQ(lev2Entry).toString(16).toUpperCase().padStart(16,"0")}.&rlm;
		כיון שהתוכן אי-זוגי הכניסה וולידית.
		28 
		הביטים השמאליים בכניסה הם מבזים!
		ולמזלנו הם אכן אפסים.
		כיון שהביטים השמאליים הם מבזים נרשום שוב רק את 9 הספרות הקסה הימניות של הכניסה:
		${ram.readQ(lev2Entry).toString(16).toUpperCase().padStart(9,"0")}.&rlm;
		12 
		הביטים הימניים הם דגלים.
		12 מתחלק יפה
		 ב-4
		ולכן ששת הספרות ההקסה השמאליות הן 
		מספר הדף הפיזי 
		  המבוקש:
		${Math.trunc(pp/4096).toString(16).toUpperCase().padStart(6,"0")}.
		על ידי הצמדת שדה ההיסט של הכתובת הוירטואלית למספר זה
		נקבל את הכתובת הפיזית המבוקשת:
		${pa.toString(16).toUpperCase().padStart(9,"0")}.
		<br/>
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
