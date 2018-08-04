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
    var isMainPage = window.location.href.includes("https://www.amazon.com/ga/giveaways")
    var isGiveaway = window.location.href.indexOf('ga/p') !== -1;

    function getGiveaways() {
      var giveawayItems = document.querySelectorAll(".giveawayItemContainer a");
      giveawayItems.forEach((item, idx) => {
        GM_setValue(`giveaway-${idx}`, JSON.stringify(item.href))
      })
      processGiveaways()
    }

    async function processGiveaways() {
      GM_setValue("processingGiveaways", true)
      let idx = GM_getValue("currentIdx");
      let currentGiveaway = JSON.parse(GM_getValue(`giveaway-${idx}`))
      GM_setValue(`giveaway-${idx}`, false)
      idx += 1
      GM_setValue("currentIdx", idx)
      if(idx <= 23){
        window.location.href = currentGiveaway;
      } else {
        window.location.href = GM_getValue("mainPageUrl")
      }
    }

    async function processGiveaway(){
      if((document.getElementById("giveaway-video-watch-text") || (document.getElementById("giveaway-youtube-video-watch-text") && document.querySelector(".continue_button_inner")))){
        console.log("YOUTUBE");
        document.querySelector(".continue_button_inner").click();
        console.log("CLICKED");
        // while(!document.querySelector('.qa-giveaway-result-text')){
        //   setTimeout(() => {}, 1000)
        // }
        // setInterval(() => {
        //   if(document.querySelector('.qa-giveaway-result-text') && !document.querySelector('.qa-giveaway-result-text').innerText.includes('won')){
        //     console.log("DONE");
        //     window.location.href = GM_getValue("mainPageUrl")
        //     return
        //   }
        // }, 1000)
        handleGiveawayEntered()
      } else {
        if(document.querySelector("#ts_en_enter")){
          document.querySelector("#ts_en_enter span input").click()
        }
        if(document.querySelector(".boxClickTarget")){
          document.querySelector(".boxClickTarget").click()
        }
        console.log("ELSE");
        // setTimeout(() => {
        //   if(document.querySelector('.qa-giveaway-result-text') && !document.querySelector('.qa-giveaway-result-text').innerText.includes('won')){
        //     window.location.href = GM_getValue("mainPageUrl")
        //   }
        // }, 5000)
        handleGiveawayEntered();
      }
    }

    function handleGiveawayEntered(){
      setInterval(() => {
        if(document.querySelector('.qa-giveaway-result-text') && !document.querySelector('.qa-giveaway-result-text').innerText.includes('won')){
          console.log("DONE");
          // window.location.href = GM_getValue("mainPageUrl")
          processGiveaways()
          return
        }
      }, 1000)
    }

    window.addEventListener('load', function() {
      console.log(GM_getValue("currentIdx"));
      if(isMainPage){
        GM_setValue("mainPageUrl", window.location.href)
        if(GM_getValue("currentIdx") > 23){
          GM_setValue("processingGiveaways", false)
          GM_setValue("currentIdx", 0)
          document.querySelector(".a-last a").click()
        } else if(!GM_getValue("processingGiveaways")){
          getGiveaways();
        } else {
          processGiveaways();
        }
      }

      if(isGiveaway){
        if(document.querySelector("#giveaway-ended-header") || (document.querySelector('.qa-giveaway-result-text') && !document.querySelector('.qa-giveaway-result-text').innerText.includes('won'))){
          // window.location.href = "https://www.amazon.com/ga/giveaways"
          // window.location.href = GM_getValue("mainPageUrl")
          processGiveaways()
        } else if (document.getElementById("giveaway-youtube-video-watch-text") || document.getElementById("giveaway-video-watch-text")){
          console.log("YT START");
          if(document.querySelector(".continue_button_inner")){
            if(document.querySelector(".airy-play-toggle-hint.airy-hint.airy-play-hint")){
              document.querySelector(".airy-play-toggle-hint.airy-hint.airy-play-hint").click()
            }
            setTimeout(processGiveaway, 31000)
          } else {
            setTimeout(processGiveaway, 3000)
          }
        } else{
          setTimeout(processGiveaway, 3000)
        }
      }
    }, false);

})();
