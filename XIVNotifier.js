const jsdom = require("jsdom");
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

const delay = 30;	//loop delay in seconds.
let url = 'https://eu.finalfantasyxiv.com/lodestone/';	//FFXIV Lodestone URL.

// CSS selector elements for various different news sections on FFXIV Lodestone page.
let topics = '#toptabchanger_topicsarea > ul > li:nth-child(1) > header > p > a';	
let notices = '#toptabchanger_newsarea > div:nth-child(2) > ul:nth-child(2) > li:nth-child(1) > a';	
let maintenance = '#toptabchanger_newsarea > div:nth-child(3) > ul > li:nth-child(1) > a';	
let updates = '#toptabchanger_newsarea > div:nth-child(4) > ul > li:nth-child(1) > a';	

// Create variables to store the CSS Selector initial values.
let pValueTopics;	
let pValueNotices;	
let pValueMaintenance;	
let pValueUpdates;	

//invoke functions to check initial values for page elements.
checkValues();

//start invoking the function, *1000 because the delay should be in milliseconds
setInterval(checkValues, delay*1000);	

function checkValues() {
	
	//jsdom will get the page from the provided url and then run the fuction
	jsdom.env (	
		url, function (err, window) {

			// If an error occurs, send message to telegram and quit application
			if (err) {
				console.log(err);
				await telegramClient.sendMessage(telegramChat, err, {parse_mode: 'HTML'});
				process.exit();
			} 
		
			// Get the values for the monitored elements
			const nValueTopics = window.document.querySelector(topics).getAttribute('href');	
			const nValueNotices = window.document.querySelector(notices).getAttribute('href');
			const nValueMaintenance = window.document.querySelector(maintenance).getAttribute('href');
			const nValueUpdates = window.document.querySelector(updates).getAttribute('href');
			console.log("values grabbed");

			// Provide initial value to pValues and update pValue if different from nValues.
			// Check if the value has been set yet, and if it hasn't , then allocate a value.
			if (typeof pValueTopics === 'undefined' || 
				typeof pValueNotices === 'undefined' || 
				typeof pValueMaintenance === 'undefined' || 
				typeof pValueUpdates === 'undefined') {
					
					// set pValue to monitored value.
					console.log(`initialization for pValues = ${nValueTopics}, ${nValueNotices}, ${nValueMaintenance}, ${nValueUpdates}`);
					await telegramClient.sendMessage(telegramChat, `<b>Initializing</b>`, {parse_mode: 'HTML'});
					pValueTopics = nValueTopics;
					pValueNotices = nValueNotices;
					pValueMaintenance = nValueMaintenance;
					pValueUpdates = nValueUpdates;
			
			}; 
			
			// Run through checks to see if the value has changed since the last check
			// Send a message to telegram with the new value and update the old value.
			if (pValueTopics !== nValueTopics) {	
				console.log(`Topics value changed from ${pValueTopics} to ${nValueTopics}`);
				await telegramClient.sendMessage(telegramChat, `<b>Topics section news update</b>: https://eu.finalfantasyxiv.com${nValueTopics}`, {parse_mode: 'HTML'});
				pValueTopics = nValueTopics;	
			};

			if (pValueNotices !== nValueNotices) {	
				console.log(`Notices value changed from ${pValueNotices} to ${nValueNotices}`);
				await telegramClient.sendMessage(telegramChat, `<b>Notices section news update</b>: https://eu.finalfantasyxiv.com${nValueNotices}`, {parse_mode: 'HTML'});
				pValueNotices = nValueNotices;	
			};

			if (pValueMaintenance !== nValueMaintenance) {	
				console.log(`Maintenance value changed from ${pValueMaintenance} to ${nValueMaintenance}`);
				await telegramClient.sendMessage(telegramChat, `<b>Maintenance section news update</b>: https://eu.finalfantasyxiv.com${nValueMaintenance}`, {parse_mode: 'HTML'});
				pValueMaintenance = nValueMaintenance;	
			};

			if (pValueUpdates !== nValueUpdates) {	
				console.log(`Updates value changed from ${pValueUpdates} to ${nValueUpdates}`);
				await telegramClient.sendMessage(telegramChat, `<b>Update section news update</b>: https://eu.finalfantasyxiv.com${nValueUpdates}`, {parse_mode: 'HTML'});
				pValueUpdates = nValueUpdates;	
			};
		}
	);
};
