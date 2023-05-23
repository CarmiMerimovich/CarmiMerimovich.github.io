    let cpuAddressWidth = 16 + Math.trunc(Math.random() * 49);
    let cpuAddressSpace = BigInt(2) ** BigInt(cpuAddressWidth);
    let logDataBusWidth = Math.trunc(Math.random() * 7);
    let dataBusWidth = (2 ** logDataBusWidth) * 8;
    let busAddressWidth = cpuAddressWidth - logDataBusWidth;

    let tlbSet = 2 ** Math.trunc(5 * Math.random());
    let indexWidth = 1 + Math.trunc(11 * Math.random());
    let tlbLines = 2 ** indexWidth;
    let tagWidth = Math.max(busAddressWidth - indexWidth, 0);
    let tlbEntries = tlbLines * tlbSet;

    let cpuReadAddress = 0n;
    for (i = 0; i < cpuAddressWidth; i++) {
        cpuReadAddress *= 2n;
        cpuReadAddress += BigInt(Math.trunc(Math.random() * 2));
    }
    let busReadAddress = cpuReadAddress / (2n ** BigInt(logDataBusWidth));
    let tlbIndex = busReadAddress & (2n ** BigInt(indexWidth) - 1n);
    let tlbTag = busReadAddress / (2n ** BigInt(indexWidth));

    let eCpuAddressWidth = document.getElementById("cpuAddressWidth");
    if (Math.random() < 0.5) {
        eCpuAddressWidth.innerHTML = `
            במערכת byte-addressable
            מבחינת המתכנת רוחב כתובת 
            ${cpuAddressWidth}b.`
    } else {
        eCpuAddressWidth.innerHTML = `
            במערכת byte-addressable
            מרחב הזכרון המקסימלי האפשרי למתכנת הוא 
            ${formattedSize(cpuAddressWidth)}.`;
    }

    let eCpuReadAddress = document.getElementById("cpuReadAddress");
    if (eCpuReadAddress) {
        eCpuReadAddress.innerHTML = "0x" +
             cpuReadAddress.toString(16).toUpperCase();
    }

    let eQuestion1 = document.getElementById("question1");
    let eAnswer1 = document.getElementById("answer1");
    if (eQuestion1) {
        if (Math.random() < 0.5) {
            eAnswer1.innerHTML = ((2 ** logDataBusWidth) * 8).toString() + "b";
            eQuestion1.innerHTML = "כמה קווים יהיו בבס הנתונים?"
        } else {
            eAnswer1.innerHTML = (2 ** logDataBusWidth).toString() + "B";
            eQuestion1.innerHTML = "כמה בתים יהיו בבס הנתונים?"
        }
    }

    let eDataBusWidth = document.getElementById("dataBusWidth");
    if (eDataBusWidth) {
        if (Math.random() < 0.5) {
            eDataBusWidth.innerHTML = `
                רוחב בס הנתונים 
                ${dataBusWidth}b.`;
        } else {
            eDataBusWidth.innerHTML = `
                רוחב בס הנתונים 
                ${dataBusWidth/8}B.`;
        }
    }


    let eAddressBusWidth = document.getElementById("addressBusWidth");
    if (eAddressBusWidth)
        eAddressBusWidth.innerHTML = busAddressWidth.toString() + "b";

    let eTlbLines = document.getElementById("tlbLines");
    if (eTlbLines) {
        let s = 'מאורגן בשיטת מפוי ישיר';
        if (tlbSet > 1)
            s = `הינו ${tlbSet}-קבוצתי אסוציאטיבי`;
        let t = `ומספר השורות בו
             הוא ${tlbLines}`;
        if (Math.random() < 0.5)
            t = `ומספר התרגומים בו הוא 
                ${tlbEntries}`;
        eTlbLines.innerHTML =
             `ה-TLB 
              ${s}
              ${t}.`;
    }


    let eAnswer0 = document.getElementById("answer0");
    if (eAnswer0)
        eAnswer0.innerHTML = (cpuAddressWidth - logDataBusWidth).toString() + "b";

    let eAnswer2 = document.getElementById("answer2");
    if (eAnswer2)
        eAnswer2.innerHTML = "0x" +
             (cpuReadAddress >>
             BigInt(logDataBusWidth))
                .toString(16).toUpperCase();

    let eAnswer3 = document.getElementById("answer3");
    if (eAnswer3)
        eAnswer3.innerHTML = `
        האינדקס הוא ברוחב 
        ${indexWidth}b
        וה-tag
        הוא ברוחב
        ${tagWidth}b.`;

    let eAnswer4 = document.getElementById("answer4");
    if (eAnswer4)
        eAnswer4.innerHTML = `
        צריך לבדוק את שורה
        0x${tlbIndex.toString(16).toUpperCase()}
        וה-tag
        שצריך למצוא הוא
        0x${tlbTag.toString(16).toUpperCase()}.`;

function showAnswer(field) {
    let eAnswer = document.getElementById(field);
    eAnswer.style.display = "inline";
}


function formattedSize(width) {
    let suffixSize = ["B", "KB", "MB", "GB", "TB", "PB", "EB"];
    let w = Math.trunc(width / 10);
    let s = 2n ** BigInt((width - w * 10));

    return (`${s}${suffixSize[w]}`)
}
