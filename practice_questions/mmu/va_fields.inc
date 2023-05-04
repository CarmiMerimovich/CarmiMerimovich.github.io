const vaWidth = Math.trunc(Math.random() * 49) + 16;
const vaSize = 2n ** BigInt(vaWidth);
const offsetWidth = Math.trunc(Math.random() * vaWidth);
const vpWidth = vaWidth - offsetWidth;
const pageSize = 2n ** BigInt(offsetWidth);
const entryWidth = 2n ** BigInt(Math.trunc(Math.random() * 6));
const entriesPerPage = pageSize / entryWidth;
const indexWidth = entriesPerPage.toString(2).length - 1;

let e = document.getElementById("vaSize");
e.innerHTML = `${toSize(vaSize)}B`;

e = document.getElementById("pageSize");
e.innerHTML = `${toSize(pageSize)}B`;

e = document.getElementById("entryWidth");
e.innerHTML = `${toSize(entryWidth)}B`;

let a = [];
a.push(offsetWidth);
let remain = vaWidth - offsetWidth;
while (remain >= indexWidth) {
    a.push(indexWidth);
    remain -= indexWidth;
}
if (remain > 0)
    a.push(remain);

let explanation =`<ol>
נבנה את התשובה מימין לשמאל.
<li>
מרחב הכתובות הוירטואלי בגודל
2<sup>${vaWidth}</sup>B = ${toSize(vaSize)}B
ולכן רוחב כתובת וירטואלית 
${vaWidth}b.
</li>
<li>
גודל דף
2<sup>${offsetWidth}</sup>B = ${toSize(pageSize)}B
ולכן רוחב שדה ההיסט 
${offsetWidth}b.
</li>
<li>
ולכן בינתיים התשובה היא
    (${offsetWidth}.
</li>
<li>
רוחב כתובת וירטואלית
    ${vaWidth}b
     ורוחב ההיסט
    ${offsetWidth}b.
לכן רוחב המספר דף הוירטואלי 
    ${vaWidth}b - ${offsetWidth}b = ${vaWidth - offsetWidth}b.
</li>
<li>
גודל דף
${toSize(pageSize)}B
וגודל כניסה בטבלה 
${entryWidth}B.
לכן מספר הכניסות המקסימלי בדף
${toSize(pageSize)}B/${entryWidth}B = ${toSize(entriesPerPage)}.
</li>
<li>
2<sup>${indexWidth}</sup> = ${toSize(entriesPerPage)}
    ולכן מספר הדף הוירטואלי יתפצל לשדות אינדקסים
    בגודל
    ${indexWidth}.
</li>
`;

if (vpWidth < indexWidth) {
    explanation +=`
    <li>
    רוחב השדה מספר דף וירטואלי 
    קטן
    מרוחב אינדקס מקסימלי
    ולכן מבנה כתובת וירטואלית
    (${vpWidth},${offsetWidth}).
    `
} else if ((vpWidth % indexWidth) == 0) {
    explanation +=`
    <li>
    רוחב השדה מספר דף וירטואלי 
    ${vpWidth}b
    הוא כפולה שלמה של רוחב אינדקס מקסימלי
    ${vpWidth}b = ${vpWidth/indexWidth} &times; ${indexWidth}b
    ולכן מבנה כתובת וירטואלית
    (${(indexWidth.toString() + "&lrm;,").repeat(vpWidth/indexWidth)}${offsetWidth}).
    </li>
    `
} else
    explanation +=`
    <li>
    הערך השלם של
    ${vpWidth}b/${indexWidth}b
        הוא
        ${Math.trunc(vpWidth / indexWidth)}.
    לכן 
    ${indexWidth}
        יופיע 
        ${Math.trunc(vpWidth / indexWidth)}
        פעמים במבנה כתובת וירטואלית.
         כלומר בינתיים יש לנו
         (&lrm;${(indexWidth.toString() + "&lrm;,").repeat(Math.trunc(vpWidth/indexWidth))}&lrm;${offsetWidth}.
    </li>
    <li>
    השארית של
    ${vpWidth}b/${indexWidth}b
        היא
        ${vpWidth % indexWidth}.
    לכן 
        ${vpWidth % indexWidth}
        יהיה המספר השמאלי ומבנה כתובת וירטואלית יהיה         
        (${vpWidth % indexWidth},${(indexWidth.toString() + "&lrm;,").repeat(Math.trunc(vpWidth/indexWidth))}&lrm;${offsetWidth}&lrm;).
    </li>
    `

explanation += "</ol>";

function showAnswer() {
    let e = document.getElementById("vaFields");
    if (e != null)
        e.innerHTML = `(${a.toReversed().join(",")})`; 

    e = document.getElementById("vpFields");
    if (e != null) {
        e.innerHTML = `(${a.toReversed().slice(0,-1).join(",")})`;
    }

    e = document.getElementById("tblHeight");
    if (e != null) {
        e.innerHTML = `${a.length - 1}`;
    }

    e = document.getElementById("explanation");
    if (e != null) {
        e.innerHTML = explanation;
    }
}

function toSize(bytes) {
    let names = ["", "K", "M", "G", "T", "P", "E"];
    const units = Math.trunc((bytes.toString(2).length - 1) / 10);
    const prefix = bytes / (2n ** (BigInt(units) * 10n));
    return (prefix.toString() + names[units]);
}
