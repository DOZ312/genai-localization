const awaitResponse = require("./ask");
const fs = require("fs");
const path = require("path");

(async () => {
	let language = process.argv[2];
	while (true) {
		if (language) break;
		language = await awaitResponse("ua");
		if (!language.length) continue;
		else break;
	}
	const languagePath = path.join(__dirname, language);
	if (!fs.existsSync(languagePath)) return console.log("%s language is not found", language);
	if (!fs.statSync(languagePath).isDirectory()) return console.log("%s is not a directory", languagePath);
	console.log("Reading directory of source language");
	const sourcePath = path.join(__dirname, "en");
	const sourceDir = fs.readdirSync(sourcePath);
	console.log("Reading directory of providen language");
	const checkDir = fs.readdirSync(languagePath);
	console.log("Checking for missing locales");
	for (let i = 0; i < sourceDir.length; i++) {
		if (!checkDir.includes(sourceDir[i])) console.log("! Missing %s locale", sourceDir[i]);
	}
	console.log("Checking for extra locales");
	for (let i = 0; i < checkDir.length; i++) {
		if (!sourceDir.includes(checkDir[i])) console.log("! %s locale is redundant", checkDir[i]);
	}
	console.log("Checking for missing strings");
	for (let i = 0; i < sourceDir.length; i++) {
		const source = Object.keys(require(path.join(sourcePath, sourceDir[i])));
		const check = Object.keys(require(path.join(languagePath, sourceDir[i])));
		for (let x = 0; x < source.length; x++) {
			if (check.indexOf(source[x]) === -1) console.log("[%s] Missing \"%s\" string", sourceDir[i], source[x]);
		}
	}
})();
