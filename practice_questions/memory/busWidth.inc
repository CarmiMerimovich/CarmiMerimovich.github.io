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
    let tExplain1_1 = "";
    let tExplain0_1 = "";
    if (Math.random() < 0.5) {
        eCpuAddressWidth.innerHTML = `
            נתונה מערכת בה הימ"מ הוא בית.
            מבחינת המתכנת רוחב כתובת 
            ${cpuAddressWidth}b.`
    } else {
        eCpuAddressWidth.innerHTML = `
            נתונה מערכת בה הימ"מ הוא בית.
            מרחב הזכרון הפיזי  האפשרי  הוא 
            ${formattedSize(cpuAddressWidth)}.`;
        tExplain1_1 = `<li>
        2<sup>${cpuAddressWidth}</sup>B = ${formattedSize(cpuAddressWidth)}
        </li>`;
        tExplain0_1 = tExplain1_1;
    }

    let eCpuReadAddress = document.getElementById("cpuReadAddress");
    if (eCpuReadAddress) {
        eCpuReadAddress.innerHTML = "0x" +
             cpuReadAddress.toString(16).toUpperCase();
    }

    let eQuestion1 = document.getElementById("question1");
    let eAnswer1 = document.getElementById("answer1");
    let tExplain1_2 = "";
    if (eQuestion1) {
        if (Math.random() < 0.5) {
            eAnswer1.innerHTML = ((2 ** logDataBusWidth) * 8).toString() + "b";
            eQuestion1.innerHTML = "כמה קווים יהיו בבס הנתונים?"
            tExplain1_2=`<li>רוחב בס הנתונים
                ${dataBusWidth/8}b&times;8=${dataBusWidth}b</li>`;
        } else {
            eAnswer1.innerHTML = (2 ** logDataBusWidth).toString() + "B";
            eQuestion1.innerHTML = "כמה בתים יהיו בבס הנתונים?"
        }
    }

    let innerExplain1 = `${tExplain1_1}
        <li>
        רוחב כתובת במעבד
        ${cpuAddressWidth}b
        </li>
        <li>
        רוחב בס הכתובות
        ${busAddressWidth}b
        </li>
        <li>
        כלומר מספר הביטים מהכתובת שהמעבד לא מוציא
        ${cpuAddressWidth}b-${busAddressWidth}b=${logDataBusWidth}b
        </li>
        <li>
        מספר הבתים על בס הנתונים
        2<sup>${logDataBusWidth}</sup>=${dataBusWidth/8}
        </li>
        ${tExplain1_2}
    `;
    let eExplain1 = document.getElementById("explain1");
    if (eExplain1) {
        eExplain1.innerHTML = `<ol>
        ${innerExplain1}
        </ol>`;
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

    let eCacheLines = document.getElementById("cacheLines");
    if (eCacheLines) {
        let s = 'מאורגן בשיטת מפוי ישיר';
        if (cacheSet > 1)
            s = `הינו ${cacheSet}-קבוצתי אסוציאטיבי`;
        let t = `ומספר השורות בו
             הוא ${cacheLines}`;
        if (Math.random() < 0.5)
            t = `ומספר התרגומים בו הוא 
                ${cacheEntries}`;
        eCacheLines.innerHTML =
             `המטמון
              ${s}
              ${t}.`;
    }


    let eAnswer0 = document.getElementById("answer0");
    if (eAnswer0)
        eAnswer0.innerHTML = (cpuAddressWidth - logDataBusWidth).toString() + "b";

    let innerExplain0 = `        ${tExplain0_1}
        <li>
        רוחב כתובת במעבד
        ${cpuAddressWidth}b
        </li>
        <li>
        רוחב בס הכתובות
        ${cpuAddressWidth}b-${logDataBusWidth}b = ${cpuAddressWidth - logDataBusWidth}b
        </li>`;
    let eExplain0 = document.getElementById("explain0");
    if (eExplain0) {
        eExplain0.innerHTML = `<ol>
        ${innerExplain0}
        </ol>`
        ;
    }

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
                eAnswer2.innerHTML = `תהיינה על הבס 
                        ${busReadAddress.length}
                        תנועות עם הערכים הבאים:
                        <ol>
                        ${t}
                        </ol>`;
            }
        }
    }
    let eExplain2 = document.getElementById("explain2");
    if (eExplain2) {
        let t = "";
        if (multiByte > 1) {
            let c = cpuReadAddress;
            for (let i = 0; i < busReadAddress.length; i++) {
                let a = busReadAddress[i];
                let s = "";
                while (c < cpuReadAddress + BigInt(multiByte) &&
                    c / (2n ** BigInt(logDataBusWidth)) == a) {
                    s += `<li>0x${c.toString(16).toUpperCase()}</li>`;
                    c += 1n;
                }
                t += `<li>0x${a.toString(16).toUpperCase()} - 
                מהתנועה הזו מחלצים את הבתים בכתובות (המעבד) הבאות:
                <ul>${s}</ul>
                </li>`;
            }
        }
        eExplain2.innerHTML = `<ol>
        <li>
        רוחב בס הנתונים
        ${dataBusWidth}b = ${dataBusWidth/8}B
        </li>
        <li>
        2<sup>${logDataBusWidth}</sup> = ${dataBusWidth/8}
        </li>
        <li>
        צריך לסלק את 
        ${logDataBusWidth}
        הביטים הימנים מכתובת המעבד.
        </li>
        <li>
        0x${cpuReadAddress.toString(16).toUpperCase()} = 0b${cpuReadAddress.toString(2)}
        </li>
        <li>
        אחרי שסילקנו את 
        ${logDataBusWidth}
        הביטים הימניים
        0b${busReadAddress[0].toString(2)} = 0x${busReadAddress[0].toString(16).toUpperCase()} 
        </lI>
        ${t}
        </ol>`;
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

function showExplain(field) {
    let eExplain = document.getElementById(field);
    eExplain.style.display = "inline";
}


function formattedSize(width) {
    let suffixSize = ["B", "KB", "MB", "GB", "TB", "PB", "EB"];
    let w = Math.trunc(width / 10);
    let s = 2n ** BigInt((width - w * 10));

    return (`${s}${suffixSize[w]}`)
}
