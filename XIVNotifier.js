const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const telegram = require('telegraf/telegram');

const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
const telegramChat = process.env.TELEGRAM_CHAT_ID;
const telegramClient = new telegram(telegramToken);

//Check if variables are in use.
if (typeof telegramToken === 'undefined') {
	console.log("To use Telegram integration, please make sure you have TELEGRAM_BOT_TOKEN set as an environment variable.");
	process.exit();
};

if (typeof telegramChat === 'undefined') {
	console.log("To use Telegram integration, please make sure you have TELEGRAM_CHAT_ID set as an environment variable.");
	process.exit();
};

const resourceLoader = new jsdom.ResourceLoader({
	userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36"
});

const options = {
	resources: resourceLoader
};

// CSS selector elements for various different news sections on FFXIV Lodestone page.
let topics = "#toptabchanger_topicsarea > ul > li:nth-child(1) > header > p > a";
let notices = "#toptabchanger_newsarea > div:nth-child(2) > ul:nth-child(2) > li:nth-child(1) > a";
let maintenance = "#toptabchanger_newsarea > div:nth-child(3) > ul > li:nth-child(1) > a";
let updates = "#toptabchanger_newsarea > div:nth-child(4) > ul > li:nth-child(1) > a";

// Create variables to store the CSS Selector initial values.
let pValueTopics;
let pValueNotices;
let pValueMaintenance;
let pValueUpdates;

const delay = 30;					//loop delay in seconds.
let url = 'https://eu.finalfantasyxiv.com/lodestone/';	//FFXIV Lodestone URL.

//invoke functions to check initial values for page elements.
checkValues();

//start invoking the function, *1000 because the delay should be in milliseconds
setInterval(checkValues, delay * 1000);

function checkValues() {

	//jsdom will get the page from the provided url and then run the fuction
	JSDOM.fromURL(url, options).then(dom => {

		// Get the values for the monitored elements
		console.log('-----------------------------------------------')
		const nValueTopics = dom.window.document.querySelector(topics).getAttribute('href');
		console.log(`Topics: ${nValueTopics}`)

		const nValueNotices = dom.window.document.querySelector(notices).getAttribute('href');
		console.log(`"Notices: ${nValueNotices}`)

		const nValueMaintenance = dom.window.document.querySelector(maintenance).getAttribute('href');
		console.log(`"Maintenance: ${nValueMaintenance}`)

		const nValueUpdates = dom.window.document.querySelector(updates).getAttribute('href');
		console.log(`"Updates : ${nValueUpdates}`)

		// Provide initial value to pValues and update pValue if different from nValues.
		// Check if the value has been set yet, and if it hasn't , then allocate a value.
		if (typeof pValueTopics === 'undefined' ||
			typeof pValueNotices === 'undefined' ||
			typeof pValueMaintenance === 'undefined' ||
			typeof pValueUpdates === 'undefined') {

			// set pValue to monitored value.
			console.log(`initialization for pValues = ${nValueTopics}, ${nValueNotices}, ${nValueMaintenance}, ${nValueUpdates}`);
			telegramClient.sendMessage(telegramChat, `<b>Initializing</b>`, { parse_mode: 'HTML' });
			pValueTopics = nValueTopics;
			pValueNotices = nValueNotices;
			pValueMaintenance = nValueMaintenance;
			pValueUpdates = nValueUpdates;
		};

		// Run through checks to see if the value has changed since the last check
		// Send a message to telegram with the new value and update the old value.
		if (pValueTopics !== nValueTopics) {
			console.log(`Topics value changed from ${pValueTopics} to ${nValueTopics}`);
			telegramClient.sendMessage(telegramChat, `<b>Topics section news update</b>: \n https://eu.finalfantasyxiv.com${nValueTopics}`, { parse_mode: 'HTML' });
			pValueTopics = nValueTopics;
		};

		if (pValueNotices !== nValueNotices) {
			console.log(`Notices value changed from ${pValueNotices} to ${nValueNotices}`);
			telegramClient.sendMessage(telegramChat, `<b>Notices section news update</b>: \n https://eu.finalfantasyxiv.com${nValueNotices}`, { parse_mode: 'HTML' });
			pValueNotices = nValueNotices;
		};

		if (pValueMaintenance !== nValueMaintenance) {
			console.log(`Maintenance value changed from ${pValueMaintenance} to ${nValueMaintenance}`);
			telegramClient.sendMessage(telegramChat, `<b>Maintenance section news update</b>: \n https://eu.finalfantasyxiv.com${nValueMaintenance}`, { parse_mode: 'HTML' });
			pValueMaintenance = nValueMaintenance;
		};

		if (pValueUpdates !== nValueUpdates) {
			console.log(`Updates value changed from ${pValueUpdates} to ${nValueUpdates}`);
			telegramClient.sendMessage(telegramChat, `<b>Update section news update</b>: \n https://eu.finalfantasyxiv.com${nValueUpdates}`, { parse_mode: 'HTML' });
			pValueUpdates = nValueUpdates;
		};
	});
};
