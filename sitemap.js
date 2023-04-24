//
// Build sitemap
///
const sourceRoot = process.cwd().replace(/\\/g, "/");
const fs = require("fs");


if (sourceRoot != "C:/Users/carmi/OneDrive/carmi_working") {
    console.log(sourceRoot, "Not in carmi_working");
    process.exit();
}

const targetRoot = sourceRoot.replace("carmi_working",
                        "CarmiMerimovich/CarmiMerimovich.github.io") + "/";

let site = "https://carmimerimovich.github.io/";
let total = [];

build("");

let s = "";
for (fn of total) {
    s += `<url>\n<loc>${site + fn}</loc>\n</url>\n`;
}
s = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${s}
</urlset>`;
console.log("count", total.length);

fs.writeFileSync("sitemap.xml", s);


function build(dir) {
    let dirList = fs.readdirSync(targetRoot + dir);

    for (const fileName of dirList) {
        if (fileName.startsWith(".")) continue;
        if (fileName.startsWith("google")) continue;
        if (fileName.endsWith(".css")) continue;
        if (fileName.endsWith(".xml")) continue;
        if (fileName.endsWith(".inc")) continue;

        if (!fs.lstatSync(targetRoot + dir + fileName).isDirectory()) {
            total.push(dir +  fileName);
            continue;
        }
        build(dir + fileName + "/");
    }
} 

