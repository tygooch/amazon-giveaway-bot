# Amazon Giveaway Bot

JS userscript that automates entry into <a href=https://www.amazon.com/ga/giveaways>Amazon Giveaways</a>

<img src="/images/winnings.png" width="400" />

## Requirements

This script requires [Google Chrome](https://chrome.google.com/) with the [Tampermonkey extension](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) installed.

## Installation

To install Amazon Giveaway Bot, click [here](https://github.com/TyGooch/amazon-giveaway-bot/raw/master/amazonGiveawayBot.user.js). If Tampermonkey is correctly installed, you will be asked to add the script to your dashboard. Confirm the installation and start winning some giveaways.

## Usage

Once installed, ensure Tampermonkey is enabled and navigate to [https://www.amazon.com/giveaway/](https://www.amazon.com/giveaway/). Configure the options to your prefences and click start. The bot will run inside of an iframe until you click stop or close the page.

## Features

### CAPTCHA Solving

Support for solving captchas using the 2captcha API is now available. If you aren't a current customer please consider signing up using my [referral link](https://2captcha.com?from=7493321). Once you have a key, paste it into the 2Captcha API Key field in the settings panel and you're good to go.

### Multiple Accounts

Users can use different Amazon accounts on the same machine. History of entered giveaways is stored locally for each account to avoid revisiting giveaways previously entered. If you have more than one account added, the bot will automatically switch to another account after all giveaways are entered.

### Notifications

When you win a giveaway or all the current giveaways are entered you will be notified via a desktop notification.

## Development

After cloning this repo, start the dev server by running `npm start`

Webpack dev server will now watch for any changes and serve the updated script at https://localhost:8080/amazonGiveawayBot.user.js. Install the script by visiting https://localhost:8080/amazonGiveawayBot.user.js and be sure to disable any other versions of the script you have installed in the Tampermonkey dashboard.

Once installed, the script will automatically update whenever changes are made. If you're having issues, try forcing an update in the Tampermonkey dashboard.

When you're ready for a production build run `npm build` and webpack will output a minified version in the root directory of this project
