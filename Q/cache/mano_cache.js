//
// m e m o r y _ c o n t e n t 
//

class ManoCache {
	
	constructor(memAddressWidth, cacheAddressWidth, setSize) {
		this.memAddressWidth = memAddressWidth;
		this.addressWidth = cacheAddressWidth;
		this.setSize = setSize;
		
		this.lines = [];
		
		for (let l = 0; l < 2 ** this.addressWidth; l++) {
			let v = [];
			for (let j = 0; j < this.setSize; j++) 
				v[j] = undefined;
			
			this.lines[l] = v;
		}
			
		this.replaceCount = 0;
		this.hitCount = 0;
		
	}
	
	read(address) {
		let n =  this.addressWidth;
		let idx = Math.trunc(address % (2**n));
		let tag = Math.trunc(address / (2**n));

		let v = this.lines[idx];
		for (let i = 0; i < v.length; i++) {
			if (v[i] == tag) {
				this.hitCount++;
				for (let j = 0; j < i-1; j++)
					v[j] = v[j+1];
				let t = v[i];
				for (let j = i; j < v.length; j++)
					v[j] = v[j+1];
					
				for (let j = 0; j < v.length; j++) {
					if (v[j] == undefined) {
						v[j - 1] = t;
						this.lines[idx] = v;
						return;
					}
				}		
				v[v.length-1] = t;
				this.lines[idx] = v;
				return;
			}
		}

		for (let j = 0; j < v.length; j++) {
			if (v[j] == undefined) {
				v[j] = tag;
				this.lines[idx] = v;
				return;
			}
		}
		
		for (let i = 0; i < v.length - 2; i++) {
			v[i] = v[i+1];
		}
		v[v.length-1] = tag;
		this.lines[idx] = v;
		this.replaceCount++;
	}
	
	getNotValid() {
		let nv = 0;
		for (let l = 0; l < 2 ** this.addressWidth; l++) {
			let v = this.lines[l];
			for (let j = 0; j < v.length; j++)
				if (v[j] == undefined) 	nv++;
		}
		return (nv);
	}

	show() {
	let s = '<hr/><table>';
	
	for (let l = 0; l < this.lines.length; l++) {
		s += "<tr>";
		s += "<td>";
		s += l.toString(16);
		s += "</td>";

		let v = this.lines[l];
		for (let j = 0; j < v.length; j++) {
			if (v[j] != undefined) {
				s += "<td>";
				s += v[j].toString(16);
				s += "</td>";
			}
		}
		s += "</tr>";
	}
	
	s += '</table>';

	let eDebug = document.getElementById("debug");
	eDebug.innerHTML = eDebug.innerHTML + s;
	}
}

let memAddressWidth = Math.trunc(Math.random() * 21) + 10;
// memAddressWidth = 8;  // Debug

let suffix, memSize;
if (memAddressWidth >= 30) {
	suffix = "G";
	memSize = memAddressWidth - 30;
} else if (memAddressWidth > 20) {
	suffix = "M";
	memSize = memAddressWidth - 20;
} else {
	suffix = "K";
	memSize = memAddressWidth - 10;
}
let memorySizeStr = (2** memSize) + suffix;

let eMemorySize = document.getElementById("memorySize");
eMemorySize.innerHTML = memorySizeStr;

let cacheAddressWidth = Math.trunc(Math.random()*5) + 4;
// cacheAddressWidth = 4; //Debug

let cacheSetSize = 2 ** Math.trunc(Math.random()*5);
// cacheSetSize = 2; //Debug

let eCacheSetSize = document.getElementById("cacheSetSize");
eCacheSetSize.innerHTML = cacheSetSize;
let eCacheSetSize2 = document.getElementById("cacheSetSize2");
if (eCacheSetSize2 != null) eCacheSetSize2.innerHTML = cacheSetSize;


let cacheSize = cacheSetSize * (2**cacheAddressWidth);
let eCacheSize = document.getElementById("cacheSize");
eCacheSize.innerHTML = cacheSize;

let memWordWidth = 2 ** Math.trunc(Math.random() * 4 + 3);

let eMemWordWidth = document.getElementById("memWordWidth");
eMemWordWidth.innerHTML = memWordWidth;

//
// I think the main point is to decide the number
// of hits and replaces
//
let replaceGuess = Math.trunc(Math.random() * 4) + 2;
let hitGuess     = Math.trunc(Math.random() * 4) + 2;

//replaceGuess = 0;
//hitGuess = 0;

let accessList = [];
let accessListLength = 12;
for (let i = 0; i < accessListLength; i++) {
	accessList.push(Math.trunc(Math.random() * 2 ** memAddressWidth));
}

//
// Yes, I know, bad random number generator might
// put me in an infinite loop
//
for (let i = 0; i < hitGuess; i++) {
	let copyIdx, replaceIdx;
	do {
		copyIdx = Math.trunc(Math.random() * accessList.length);
		replaceIdx = Math.trunc(Math.random() * accessList.length);
	} while (Math.abs(replaceIdx - copyIdx) < 3);
	accessList[replaceIdx] = accessList[copyIdx];
}

//
// Same issue as above. The replace count is OK
// for direct mapping.
//
for (let i = 0; i < replaceGuess* cacheSetSize; i++) {
	let copyIdx, replaceIdx;
	do {
		copyIdx = Math.trunc(Math.random() * accessList.length);
		replaceIdx = Math.trunc(Math.random() * accessList.length);
	} while (Math.abs(replaceIdx - copyIdx) < 3);

	let line = Math.trunc(accessList[copyIdx] % (2 ** cacheAddressWidth));
	accessList[replaceIdx] = 
		Math.trunc(accessList[replaceIdx] / (2** cacheAddressWidth)) *
			2 ** cacheAddressWidth + line;
}


let accessListStr = "";
for (let i = 0; i < accessList.length; i++) {
	if (i != 0) accessListStr += ", ";
	accessListStr += accessList[i].toString(16).padStart(Math.trunc((memAddressWidth+3)/4), '0');
}
let eAccessList = document.getElementById("accessList");
eAccessList.innerHTML = accessListStr;

let cache = new ManoCache(memAddressWidth, cacheAddressWidth, cacheSetSize);


	
for (let i = 0; i < accessList.length; i++) {
	cache.read(accessList[i]);
	//cache.show();
}

let eAnswerHit = document.getElementById("answerHit");
eAnswerHit.innerHTML = cache.hitCount;

let eAnswerReplace = document.getElementById("answerReplace");
eAnswerReplace.innerHTML = cache.replaceCount;

let eAnswerCacheLineWidth = document.getElementById("answerCacheLineWidth");
eAnswerCacheLineWidth.innerHTML =
 (memAddressWidth - cacheAddressWidth + 1 + memWordWidth) *
					cacheSetSize;

let eAnswerNotValid = document.getElementById("answerNotValid");
eAnswerNotValid.innerHTML = cache.getNotValid();



