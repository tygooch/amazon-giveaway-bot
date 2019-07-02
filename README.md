# Amazon Giveaway Bot

<div align="center">
  <img src="/images/screenshot.png" style="width: 500px;" />
</div>
<!-- ![AmazonGiveawayBotLogo](/images/screenshot.png) -->

<p align="center">
  JS userscript to automate entry into <a href=https://www.amazon.com/ga/giveaways>Amazon Giveaways</a>.
</p>

## Requirements

This script requires [Google Chrome](https://chrome.google.com/) with the [Tampermonkey extension](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) installed.

## Installation

To install Amazon Giveaway Bot, click [here](https://github.com/TyGooch/amazon-giveaway-bot/raw/master/amazonGiveawayBot.user.js). If Tampermonkey is correctly installed, you will be asked to add the script to your dashboard. Confirm the installation and start winning some giveaways.

## Usage

Once installed, ensure Tampermonkey is enabled and navigate to [https://www.amazon.com/ga/giveaways/bot](https://www.amazon.com/ga/giveaways/bot). Configure the options to your prefences and click start. The bot will run inside of an iframe until you click stop or close the page.

## Features

### CAPTCHA Solving
Version 2.0 now has the ability to solve captchas using the 2captcha API. If you aren't a current customer please consider signing up using my [referral link](https://2captcha.com?from=7493321). Once you have a key, paste it into the 2Captcha API Key field in the control panel and you're good to go.

### Turbo Mode
This experimental feature works by sending requests to enter giveaways to Amazon's servers without interacting with page elements. This allows you to enter a giveaway with a video requirement without waiting 15 seconds to watch the video. I've entered over 2000 giveaways using this method however none of them were winners. Not sure if this is because Amazon can detect this or just because the chances of winning are so low. YMMV so use at your own risk.
