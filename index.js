const express = require('express');
const app = express();
const redirect = express();
app.disable('view cache');

const session = require('express-session');
const MemoryStore = require('memorystore')(session);

const bcrypt = require('bcrypt');

const fs = require('fs');
const bibtex = require('bibtex-parser-js');
const YAML = require('js-yaml');
const yamlFront = require('yaml-front-matter');

const ejs = require('ejs');

const MarkdownIt = require('markdown-it');
const md = new MarkdownIt({html: true});

const morgan = require("morgan");
const path = require('path');
const rfs = require('rotating-file-stream')

const XLSX = require('xlsx');

//
// All this is logging initializing
//
let accessLogStream;
let httpLogStream;
if (process.platform != "win32") {
	app.use(session({
		secret: 'keyboard cat',
		store: new MemoryStore({
			checkPeriod: 86400000 // prune expired entries every 24h
		  }),
		resave: false,
		saveUninitialized: false,
		cookie: { secure: true, httpOnly: true, sameSite: "strict"
		  }
	  }));
	
	accessLogStream = rfs.createStream('access.log', {
		interval: '1d', // rotate daily
		path: path.join(__dirname, 'log')
	})
		httpLogStream = rfs.createStream('http.log', {
		interval: '1d', // rotate daily
		path: path.join(__dirname, 'log')
	})
} else {
	app.use(session({
		secret: 'bubububu',
		store: new MemoryStore({
			checkPeriod: 86400000 // prune expired entries every 24h
		  }),
		resave: false,
		saveUninitialized: false,
		cookie: { secure: false, httpOnly: false, sameSite: "strict"
			  }
	  }));

}


function getLang(req) {
	if (req.path.startsWith("/he/")) return("he");
	if (req.query.lang == "he") return ("he");
	return ('en');
}




function serverRules() {

app.use(express.urlencoded()); // seems to be important for session package

//
// Logging initializing for the Linux machine
// (No loggin for the Windows machine)
//
if (process.platform != "win32") {
	app.use(morgan(':remote-addr :date[iso] :method :url :status', { stream: accessLogStream }));
	redirect.use(morgan(':remote-addr :date[iso] :method :url :status', { stream: httpLogStream }));

	redirect.get(/^\/robots.txt$/, (req, res) => {
		res.sendFile("robots_80.txt", {root: "."});
	})
	
	redirect.use((req, res) => {
		res.redirect(301, 'https://' + req.headers.host + req.url);
	});

	app.use(function (req, res, next) {
		if (req.hostname != "www.cs.mta.ac.il") {
			res.connection.destroy();
			return;
		}
		next();
	});
}
//
// session timeout
//
app.use((req, res, next) => {
	if (typeof req.session != "undefined" && 
	    typeof req.session.perm != "undefined") {
		if ((Date.now() - req.session.time) > 10 * 60 * 1000) {
			req.session.destroy();
			res.clearCookie("connect.sid");
		} else {
			req.session.time = Date.now();
		}
	}
	next();
});
//
// This is for Certbot
//
app.use("/.well-known/acme-challenge", express.static("/.well-known/acme-challenge"));
/*
 * Remove comment on next certbot succes
 *
redirect.use("/.well-known/acme-challenge", express.static("/.well-known/acme-challenge"));
redirect.use("*", (req, res) => {
	res.connection.destroy();
});
*/

app.get(/^\/robots.txt$/, (req, res)=>{
	res.sendFile("robots_443.txt", {root: "."});
})

//
// Static sites
//
app.use("/static", express.static("public/lectures")); // Trick!

//
// /personal from the outside are rejected.
//
app.use("/personal", (req, res, next) => {
	res.status(404).send("Sorry can't find that!")
})

app.set('view engine', 'ejs');


//
// Experimental lecture
//  
app.get(/^\/lectures\/.*\/$/, (req, res, next) => {
	let s = req.path;
	s = s.replace(/^\/lectures\//, "");
	let fn = "public/lectures/" + s + "index.md";
	if (fs.existsSync(fn)) {
	  	res.render("lectures.ejs", {fs: fs, md: md, req: req});
		return;
	}
	next();
  })
//
// Experimental static
//  
app.get(/^\/static\/.*\/$/, (req, res, next) => {
	let s = req.path;
	s = s.replace(/^\/static\//, "");
	let fn = "public/lectures/" + s + "index.md";
	if (fs.existsSync(fn)) {
	  	res.render("static.ejs", {fs: fs, md: md, req: req});
		return;
	}
	next();
  	//res.render('cantor/index.ejs', {fs: fs, md: md});
  })
  

app.get(/^(\/he)?\/eventGallery\/.*\/index.html$/, (req, res, next) => {
	lang = getLang(req);
	let p = req.path.replace(/^\/he/, "");
	p = p.split("/");
	if (p.length != 4) {
		next();
		return;
	}
	let folder = p[2];
	try {
		const photoDir = "views/events/";
		if (fs.lstatSync(photoDir +  folder + "/photosAll").isDirectory()) {
			res.render("eventGallery.ejs", {pageUrl: req.path, req: req,
				  lang: lang, bibtex: bibtex, fs: fs, yaml: YAML,
				md: md});
			return;
		}
	} catch {};
	next();
  })
 

app.get(/^\/limonchelo\/agadi\/?$/, (req,res)=>{
	res.sendFile("log.txt", {root: "../../logs"});
});

app.get(/secretlogin/, (req, res, next) => {
	res.redirect(301, "/secret/login.html");
});

app.post(/^(\/he)?\/secret\/loginTry\.html$/,  (req,res)=>{
	let lang = getLang(req);

	const usersFile = fs.readFileSync("users.json");
	const usersJSON = JSON.parse(usersFile);
	const u = usersJSON.u;
	for (let i = 0; i < u.length; i++) {
		if (u[i].name == req.body.uname) {
			if (!bcrypt.compareSync(req.body.password, u[i].passHash))
				break;

			req.session.perm = u[i].perm;
			req.session.time = Date.now();
			let home = "/";
			if (lang == "he") home = "/he/";
			res.redirect(home);
			return;
		}
	}
	
	let home = "/secret/login.html";
	if (lang == "he") home = "/he/" + home;
	res.redirect(home);
});

app.get(/^(\/he)?\/logout(\.html)?$/,  (req, res, next)=>{
	let lang = getLang(req);
	let session = req.session;
	if (typeof session == "undefined") { 
		next();
		return;
	}
	session.destroy();
	res.clearCookie("connect.sid");

	let home = "/";
	if (lang == "he") home = "/he/";
	res.redirect(home);
});



//
// The general case.
//
let labelDic = {};
app.use((req, res, next) => {
	let u = req.path;
	if (!u.startsWith("/") ||
		u.includes("/_") ||
		u.endsWith(".perm") ||
		u.endsWith(".ejs")) {
			res.status(404).send("Sorry can't find that!")
			return;
	}

	if (u.includes("/.")) {
			next();
			return;
	}

	if (u.endsWith("/"))
		u = u + "index.html";

	u = u.replace(/^\//, "");

	if (u.startsWith("~")) {
		if (u.startsWith("~/")) {
			res.status(404).send("Sorry can't find that!")
			return;
		}
		u = u.replace(/^~/, "personal/");
		req.url = "/" + u;
		if (!u.endsWith(".html")) {
			let uv = u.split("/");
			let s = uv[uv.length-1];
			if (s.startsWith("$")) {
				uv.shift();
				uv.length = 2;
				let u2 = uv.join("/");
				let label = u2 + "/" + s;
				let target = labelDic[label];
				if (typeof target != "undefined") {

				}
			}
			next();
			return;
		}
		let u1 = u.replace(/.html$/, ".ejs");
		if (fs.existsSync(u1)) {
			res.render("../" + u1, {fs: fs, md: md, req: req, yamlFront: yamlFront});
			return;
		}
		u1 = u.replace(/.html$/, ".md");
		if (fs.existsSync(u1)) {
			res.render("personal.ejs", {fs: fs, md: md, req: req, yamlFront: yamlFront});
			return;
		}
		next();
		return;
	}

	u = u.replace(/^he\//, "");

	if (u.endsWith(".html")) {
		let f =  u.replace(/\.html$/, ".ejs");
//		const l = f.lastIndexOf("/");
//		f = f.substring(0, l + 1) + "_" + f.substring(l + 1); 
		if (fs.existsSync("views/" + f) &&
			!fs.lstatSync("views/" + f).isDirectory()) {
			u = f;
		}
	}

	const permFile = u + ".perm";
	let perm;
	try {
		perm = fs.readFileSync("views/" + permFile, {encoding: "utf8"});
		try {
			perm = JSON.parse(perm); 
		} catch {
			res.status(404).send("Sorry can't find that!");
			return;
		}
		let s = req.session;
		if (typeof s == "undefined" || typeof s.perm == "undefined") {
			res.status(404).send("Sorry can't find that!");
			return;
		}
		s = s.perm;			
		if (!s[perm.perm]) {
			res.status(404).send("Sorry can't find that!")
			return;
		}
	} catch {
	}

	if (u.endsWith(".ejs")) {

		let lang = getLang(req);
		res.render(u, {pageUrl: req.path, req: req,
			lang: lang, bibtex: bibtex, fs: fs, yaml: YAML,
		  md: md});
		return;

	}
	next();
	return;
});


/*
app.use("/staff", express.static("views/staff"));
app.use("/msc/theses", express.static("views/msc/theses"));
app.use("/msc/projects", express.static("views/msc/projects"));
app.use("/msc/forms", express.static("views/msc/forms"));
app.use("/gatherings", express.static("views/gatherings"));
app.use("/events", express.static("views/events"));
*/
app.use("/personal",express.static('personal'));
app.use(express.static('public/global'));
app.use(express.static('public'));


app.use((req, res, next) => {
	res.status(404).send("Sorry can't find that!")
  })
}


serverRules();

const http = require('http');
const portBase = 7000;

createServer();


function createServer() {
	let a = redirect;
	if (process.platform == "win32") a = app;
	http.createServer(a).listen(portBase+80, () => {
 		console.log('School server listening at http://localhost:' +
						 (portBase+80))
	});
}

const https = require('https');
if (process.platform != "win32") {
	let sslServer;
	createSslServer();
	/*
	let timeDelay = 7*24*60*60*1000;
	setInterval(() => {
		let tmp = sslServer;
		tmp.close(() => {
			createSslServer();
		});
	}, timeDelay);
	*/
}

function createSslServer() {
	let key, cer
	
		let all = 
		[
		{
		key:  "/etc/letsencrypt/live/www.cs.mta.ac.il/privkey.pem",
		cert: "/etc/letsencrypt/live/www.cs.mta.ac.il/fullchain.pem"
		},
		{
		key: './key.pem',
		cert: "./cert.pem"
		},
		{
		key:  "/etc/letsencrypt/live/vmedu220.mtacloud.co.il/privkey.pem",
		cert: "/etc/letsencrypt/live/vmedu220.mtacloud.co.il/fullchain.pem"
		}
		];

	for (let i = 0; i < all.length; i++) {
		try {
			sslServer = https.createServer({
				key: fs.readFileSync(all[i].key),
				cert: fs.readFileSync(all[i].cert),
				passphrase: 'CarmiMichalOfer'
			}, app);
			sslServer.listen(portBase + 443, () => {
				console.log('Example app listening at http://localhost:' + (portBase+443))
			});
			return;
		}  catch {
			console.log(i, "FAIL");
			continue;
		}
	}
	
	console.log("No SSL listener");
}
