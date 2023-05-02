const vaWidth = Math.trunc(Math.random() * 49) + 16;
const vaSize = 2n ** BigInt(vaWidth);
const offsetWidth = Math.trunc(Math.random() * vaWidth);
const pageSize = 2n ** BigInt(offsetWidth);
const entryWidth = 2n ** BigInt(Math.trunc(Math.random() * 6));
const entriesPerPage = pageSize / entryWidth;
const indexWidth = entriesPerPage.toString(2).length - 1;

let e = document.getElementById("vaSize");
e.innerHTML = toSize(vaSize);

e = document.getElementById("pageSize");
e.innerHTML = toSize(pageSize);

e = document.getElementById("entryWidth");
e.innerHTML = toSize(entryWidth);

let a = [];
a.push(offsetWidth);
let remain = vaWidth - offsetWidth;
while (remain >= indexWidth) {
    a.push(indexWidth);
    remain -= indexWidth;
}
if (remain > 0)
    a.push(remain);

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
}

function toSize(bytes) {
    let names = ["B", "KB", "MB", "GB", "TB", "PB", "XB"];
    const units = Math.trunc((bytes.toString(2).length - 1) / 10);
    const prefix = bytes / (2n ** (BigInt(units) * 10n));
    return (prefix.toString() + names[units]);
}
