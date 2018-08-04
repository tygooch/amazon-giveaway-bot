// ==UserScript==
// @name         Amazon Giveaway Bot
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Automates Amazon giveaway entries
// @author       Ty Gooch
// @match        https://www.amazon.com/ga/*
// @grant GM_setValue
// @grant GM_getValue
// @grant unsafeWindow
// ==/UserScript==

(function() {
    'use strict';


    var entries;
    var isMainPage = window.location.href === "https://www.amazon.com/ga/giveaways"
    var isGiveaway = window.location.href.indexOf('ga/p') !== -1;

    function getGiveaways() {
      var giveaways = [];
      var giveawayItems = document.querySelectorAll(".giveawayItemContainer a");
      giveawayItems.forEach((item, idx) => {
        giveaways.push(item.href)
        GM_setValue(`giveaway-${idx}`, JSON.stringify(item.href))
      })
    }

    async function processGiveaways() {
      GM_setValue("processingGiveaways", true)
      if(GM_getValue("currentIdx") > 23){
        GM_setValue("processingGiveaways", false)
        GM_setValue("currentIdx", 0)
      }
      let idx = GM_getValue("currentIdx");
      let currentGiveaway = JSON.parse(GM_getValue(`giveaway-${idx}`))
      GM_setValue(`giveaway-${idx}`, false)
      idx += 1
      GM_setValue("currentIdx", idx)
      window.location.href = currentGiveaway;
    }

    async function processGiveaway(){
      if(document.getElementById("giveaway-youtube-video-watch-text")){
        console.log("YOUTUBE");
        document.querySelector(".continue_button_inner").click();
      } else {
        document.querySelector(".boxClickTarget").click();
        setTimeout(() => {
          if(document.querySelector('.qa-giveaway-result-text') && document.querySelector('.qa-giveaway-result-text').innerText.includes('you didn\'t win')){
            window.location.href = "https://www.amazon.com/ga/giveaways"
          }
        }, 5000)
      }
    }

    window.addEventListener('load', function() {
      if(isMainPage){
        if(!GM_getValue("processingGiveaways")){
          getGiveaways();
        }
        console.log(JSON.parse(GM_getValue("giveaway-1")));
        processGiveaways();
      }

      if(isGiveaway){
        if(document.querySelector("#giveaway-ended-header") || (document.querySelector('.qa-giveaway-result-text') && !document.querySelector('.qa-giveaway-result-text').innerText.includes('won'))){
          window.location.href = "https://www.amazon.com/ga/giveaways"
        } else if (document.getElementById("giveaway-youtube-video-watch-text")){
          console.log("YT START");
          setTimeout(processGiveaway, 35000)
        } else{
          setTimeout(processGiveaway, 3000)
        }
      }
    }, false);

})();
