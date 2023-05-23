    let cpuAddressWidth = 16 + Math.trunc(Math.random() * 49);
    let cpuAddressSpace = BigInt(2) ** BigInt(cpuAddressWidth);
    let logDataBusWidth = Math.trunc(Math.random() * 7);
    logDataBusWidth = 1;
    let dataBusWidth = (2 ** logDataBusWidth) * 8;

    let cpuReadAddress = 0n;
    for (i = 0; i < cpuAddressWidth; i++) {
        cpuReadAddress *= 2n;
        cpuReadAddress += BigInt(Math.trunc(Math.random() * 2));
    }

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
        eCpuReadAddress.innerHTML = "0x" + cpuReadAddress.toString(16).toUpperCase();
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
    if (eDataBusWidth)
        eDataBusWidth.innerHTML = dataBusWidth.toString();

    let eAddressBusWidth = document.getElementById("addressBusWidth");
    if (eAddressBusWidth)
        eAddressBusWidth.innerHTML = (cpuAddressWidth - logDataBusWidth).toString() + "b";

    let eAnswer0 = document.getElementById("answer0");
    if (eAnswer0)
        eAnswer0.innerHTML = (cpuAddressWidth - logDataBusWidth).toString() + "b";

    let eAnswer2 = document.getElementById("answer2");
    if (eAnswer2)
        eAnswer2.innerHTML = "0x" +
             (cpuReadAddress >>
             BigInt(logDataBusWidth))
                .toString(16).toUpperCase();

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