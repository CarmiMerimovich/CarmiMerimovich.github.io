    let cpuAddressWidth = 16 + Math.trunc(Math.random() * 49);
    let cpuAddressSpace = BigInt(2) ** BigInt(cpuAddressWidth);
    let logDataBusWidth = Math.trunc(Math.random() * 7);
    let dataBusWidth = (2 ** logDataBusWidth) * 8;
    let busAddressWidth = cpuAddressWidth - logDataBusWidth;

    let cacheSet = 2 ** Math.trunc(5 * Math.random());
    let indexWidth = 1 + Math.trunc(11 * Math.random());
    let cacheLines = 2 ** indexWidth;
    let tagWidth = Math.max(busAddressWidth - indexWidth, 0);
    let cacheEntries = cacheLines * cacheSet;

    let cpuReadAddress = 0n;
    for (i = 0; i < cpuAddressWidth; i++) {
        cpuReadAddress *= 2n;
        cpuReadAddress += BigInt(Math.trunc(Math.random() * 2));
    }
    let multiByte = 1;
    let eMultiByte = document.getElementById("multiByte");
    if (eMultiByte) {
        let logMultiByte = 1 + Math.trunc(4 * Math.random());
        multiByte = 2 ** logMultiByte;;
        eMultiByte.innerHTML = multiByte.toString();
    }

    let busReadAddress = [];
    for (let i = 0; i < multiByte; i++) {
        let a = (cpuReadAddress + BigInt(i)) / (2n ** BigInt(logDataBusWidth));
        if (!busReadAddress.includes(a))
            busReadAddress.push(a);
    }

    let cacheIndex = busReadAddress[0] & (2n ** BigInt(indexWidth) - 1n);
    let cacheTag = busReadAddress[0] / (2n ** BigInt(indexWidth));

    let eCpuAddressWidth = document.getElementById("cpuAddressWidth");
    if (Math.random() < 0.5) {
        eCpuAddressWidth.innerHTML = `
            נתונה מערכת בה הימ"מ הוא בית.
            מבחינת המתכנת רוחב כתובת 
            ${cpuAddressWidth}b.`
    } else {
        eCpuAddressWidth.innerHTML = `
            נתונה מערכת בה הימ"מ הוא בית.
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

    let ecacheLines = document.getElementById("cacheLines");
    if (ecacheLines) {
        let s = 'מאורגן בשיטת מפוי ישיר';
        if (cacheSet > 1)
            s = `הינו ${cacheSet}-קבוצתי אסוציאטיבי`;
        let t = `ומספר השורות בו
             הוא ${cacheLines}`;
        if (Math.random() < 0.5)
            t = `ומספר התרגומים בו הוא 
                ${cacheEntries}`;
        ecacheLines.innerHTML =
             `המטמון
              ${s}
              ${t}.`;
    }


    let eAnswer0 = document.getElementById("answer0");
    if (eAnswer0)
        eAnswer0.innerHTML = (cpuAddressWidth - logDataBusWidth).toString() + "b";

    let eAnswer2 = document.getElementById("answer2");
    if (eAnswer2) {
        if (!eMultiByte) {
            eAnswer2.innerHTML = "0x" +
                busReadAddress[0].toString(16).toUpperCase();
        } else {
            if (busReadAddress.length < 2) {
                eAnswer2.innerHTML = `
                0x${busReadAddress[0].toString(16).toUpperCase()}
                `; 
            } else {
                let s = ``;
                let t = "";
                for (a of busReadAddress) {
                    t += `<li>
                    0x${a.toString(16).toUpperCase()}
                    </li>`;
                }
                eAnswer2.innerHTML = `יהיו על הבס 
                        ${busReadAddress.length}
                        תנועות עם הערכים הבאים:
                        <ol>
                        ${t}
                        </ol>`;
            }
        }
    }

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
        0x${cacheIndex.toString(16).toUpperCase()}
        וה-tag
        שצריך למצוא הוא
        0x${cacheTag.toString(16).toUpperCase()}.`;

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
