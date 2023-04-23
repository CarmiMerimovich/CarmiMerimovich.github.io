//
// For publishing
///
const sourceRoot = process.cwd().replace(/\\/g, "/");
const fs = require("fs");

const ejs = require("ejs");

const MarkdownIt = require('markdown-it');
const md = new MarkdownIt({html: true});

const bibtex = require('bibtex-parser-js');

const yamlFront = require('yaml-front-matter');

//
// Bitdield to SVG
//
const bitfield = require('bit-field/lib/render');
const onml = require('onml');
//
//

//
// For Web server
//
const express = require('express');
const app = express();
app.disable('view cache');

const portBase = 7000;
const http = require('http');
http.createServer(app).listen(portBase+80, () => {
    console.log('School server listening at http://localhost:' +
                    (portBase+80))
});



if (sourceRoot != "C:/Users/carmi/OneDrive/carmi_working") {
    console.log(sourceRoot, "Not in carmi_working");
    process.exit();
}

const targetRoot = sourceRoot.replace("carmi_working",
                        "CarmiMerimovich/CarmiMerimovich.github.io");

app.use("/", express.static(targetRoot));

let headerEJS = fs.readFileSync("header.ejs").toString();
let personalEJS = fs.readFileSync("personal.ejs").toString();
let publicationsEJS = fs.readFileSync("publications.ejs").toString();
let bitfieldEJS = fs.readFileSync("bit_field.ejs").toString();
                   
const atomicExtensions = [".png", ".pdf", ".css", ".doc", ".js", ".mjs",
                            ".bat", ".inc", ".asm", ".cpp", ".bat", ".xml"];
const semiAtomicExtensions = [".html", ".md"];

removeAll("/");
fs.writeFileSync(targetRoot + "/.nojekyll", "");
let siteMap = {};
build("/");
console.log("Built");
let s = "";
let site = "https://carmimerimovich.github.io";
let totalCnt = 0;
for (fn in siteMap) {
    s += `<url>\n<loc>${site + fn}</loc>\n<lastmod>${siteMap[fn]}</lastmod>\n</url>\n`;
    totalCnt++;
}
s = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${s}</urlset>`;
console.log("count", totalCnt);

fs.writeFileSync(targetRoot + "/sitemap.xml", s);


fs.watch(sourceRoot, {recursive: true}, (event, fileName) => {
    invoke(event, fileName);
})



function invoke(event, fileName) {
    console.log(new Date().toTimeString(), "Rebuild", event, fileName);
    if (typeof fileName != "undefined" && fileName != null) {
        let fn = fileName.replace(/\\/g, "/");
        if (fn.startsWith(".") || fn.startsWith("node_modules")) {
            console.log("           ", new Date().toTimeString(), "Done");
            return;
        }

        let isFile;
        try {
            isFile = !fs.lstatSync(sourceRoot + "/" + fn).isDirectory();
        } catch  {
            isFile = false;
        }
        if (isFile) {
            buildFile(fn);
            console.log("           ", new Date().toTimeString(), "Done");
            return;
        }
    }
    personalEJS = fs.readFileSync("personal.ejs").toString();
    publicationsEJS = fs.readFileSync("publications.ejs").toString();
    bitfieldEJS = fs.readFileSync("bit_field.ejs").toString();
    removeAll("/");
    fs.writeFileSync(targetRoot + "/.nojekyll", "");
    build("/");
       
    console.log("           ", new Date().toTimeString(), "Done");
}

function build(dir) {
    let dirList = fs.readdirSync(sourceRoot + dir);

    for (const fileName of dirList) {
        if (fileName.startsWith(".") || fileName.startsWith("node_modules")) continue;

        if (!fs.lstatSync(sourceRoot + dir + fileName).isDirectory()) {
            buildFile(dir +  fileName);
            continue;
        }
        fs.mkdirSync(targetRoot + dir + fileName);
        build(dir + fileName + "/");
    }
} 

function buildFile(fileName) {
    if (isAtomic(fileName)) {
        buildAtomic(fileName);
        return;
    }
    if (isSemiAtomic(fileName)) {
        buildSemiAtomic(fileName);
        return;
    }
    if (fileName.endsWith(".bib")) {
        buildBib(fileName);
        return;
    }
    if (fileName.endsWith(".field")) {
        buildField(fileName);
        return;
    }
}


function isAtomic(fileName) {
    if (!fileName)
        return false;

    let fnv = fileName.split("/");
    if (fnv.length > 0) {
        if (fnv[fnv.length-1].startsWith("google")) {
                return true;
            }
    }

    for (const ext of atomicExtensions) {
        if (fileName.endsWith(ext))
            return true;
    }

    return false;
}

function isSemiAtomic(fileName) {
    if (!fileName)
        return false;

    for (const ext of semiAtomicExtensions) {
        if (fileName.endsWith(ext))
            return true;
    }

    return false;
}

function siteMapUpdate(srcFileName, dstFileName) {
    if (srcFileName.startsWith(".")) return;
    if (srcFileName.startsWith("/google")) return;
    if (srcFileName.endsWith(".css")) return;
    if (srcFileName.endsWith(".xml")) return;
    if (srcFileName.endsWith(".inc")) return;

    
    let stat = fs.statSync(sourceRoot + "/" + srcFileName);
    let m = stat.mtime;
    let d = m.getFullYear() + "-" +
                (m.getMonth()+1).toString().padStart(2, "0") + "-" +
                m.getDate().toString().padStart(2, "0");

    siteMap[dstFileName] = d;
}

function buildAtomic(fileName) {
    try {
        fs.copyFileSync(sourceRoot + "/" + fileName, targetRoot + "/" + fileName);
        siteMapUpdate(fileName, fileName);
    } catch {

    }
}

function buildSemiAtomic(fileName) {

    const html = ejs.render(personalEJS, {
        fs: fs,
        md: md,
        help: {findUp: findUp, findUp2: findUp2},
        yamlFront: yamlFront,
        sourceRoot: sourceRoot,
        req: {path: fileName}
        },
        {
            root: sourceRoot,
            views: [sourceRoot + "/" + getDir(fileName)]
        });

    const fn = fileName.replace(/.md$/, ".html");
    fs.writeFileSync(targetRoot + "/" + fn, html);
    siteMapUpdate(fileName, fn);
}

function buildBib(fileName) {
    const fn = fileName.replace(/.bib$/, ".html");
    const html = ejs.render(publicationsEJS, {
                    fs: fs,
                    help: {findUp: findUp, findUp2: findUp2},
                    sourceRoot: sourceRoot,
                    bibtex: bibtex,
                    yamlFront: yamlFront,
                    req: {path: fn}
                },
                {
                    root: sourceRoot,
                    views: [sourceRoot + "/" + getDir(fileName)]
                });
    fs.writeFileSync(targetRoot + fn, html);
    siteMapUpdate(fileName, fn);
}

function buildField(fileName) {
    let EJS = fs.readFileSync(sourceRoot + "/" + fileName).toString();

    const fn = fileName.replace(/.field$/, ".svg");
    const html = ejs.render(EJS, {
                    fs: fs,
                    bitfield: bitfield,
                    onml: onml,
                    help: {findUp: findUp, findUp2: findUp2},
                    sourceRoot: sourceRoot,
                    req: {path: fn}
                },
                {
                    root: sourceRoot,
                    views: [sourceRoot + "/" + getDir(fileName)]
                });
    fs.writeFileSync(targetRoot + "/" + fn, html);
    siteMapUpdate(fileName, fn);
}


function removeAll(dir) {
    let dirList = fs.readdirSync(targetRoot + dir);

    for (const fileName of dirList) {
        if (fileName.startsWith(".")) continue;

        if (fs.lstatSync(targetRoot + dir + fileName).isDirectory()) {
            removeAll(dir + fileName + "/");
            rmdir(targetRoot + dir + fileName);
        } else {
            unlink(targetRoot + dir + fileName);
        }
    }
}

function unlink(fileName) {
    for (let tryCount = 0; tryCount < 20; tryCount++) {
        try {
            fs.unlinkSync(fileName);
            break;
        } catch {
            if (tryCount >= 20) {
                console.log("unlinking failed: ",
                        targetRoot + dir + fileName);
                process.exit();
            }
        }
    }
}

function rmdir(fileName) {
    for (let tryCount = 0; tryCount < 20; tryCount++) {
        try {
            fs.rmdirSync(fileName);
            break;
        } catch {
            if (tryCount >= 20) {
                console.log("rmdiring failed: ",
                        fileName);
                process.exit();
            }
        }
    }
}

function findUp(fn, req) {

    let p = req.path.split("/").filter(item => item);
    while (p.length > 0) {
        p.pop();
        let tryName = p.join("/") + "/" + fn;
        if (fs.existsSync(sourceRoot + "/" + tryName)) 
            return (tryName);
    }
}

function findUp2(field, req) {

    let path = req.path;
    path = path.replace(/\\/g, "/");
    let p = path.split("/").filter(item => item);
    let fn = p.join("/");
    try {
        let yaml = fs.readFileSync(sourceRoot + "/" + fn, "utf8").toString();
        yaml = yamlFront.loadFront(yaml);
        if (typeof yaml[field] != "undefined") {
            return (yaml[ffield]);
        }
    } catch {};
    p.pop();

    while (p.length > 0) {
        p.pop();
        let fn = p.join("/") + "/index.md";
        let yaml;
        try {
            yaml = fs.readFileSync(sourceRoot + "/" + fn, "utf8").toString();
        } catch {
            fn = p.join("/") + "/index.html";
            try {
                yaml = fs.readFileSync(sourceRoot + "/" + fn, "utf8").toString();
            } catch {
                continue;
            }
        }
        try {
            yaml = yamlFront.loadFront(yaml);
            if (typeof yaml[field] != "undefined") {
                return (yaml[field]);
            }
        } catch {
        }
    }
    return (undefined);
}

function getDir(fn) {
    let f = fn.split("/");
    f.pop();
    return (f.join("/"));
}