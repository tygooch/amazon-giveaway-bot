// ==UserScript==
// @name         Amazon Giveaway Bot
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

    async function enterGiveaway(){
      // if giveaway has video requirement, click the continiue entry button first
      if((document.getElementById("giveaway-video-watch-text") || (document.getElementById("giveaway-youtube-video-watch-text") && document.querySelector(".continue_button_inner")))){
        document.querySelector(".continue_button_inner").click();
        handleGiveawayEntered()
      }
      // otherwise, enter giveaway immediately
      else {
        if(document.querySelector("#ts_en_enter")){
          document.querySelector("#ts_en_enter span input").click()
        }
        if(document.querySelector(".boxClickTarget")){
          document.querySelector(".boxClickTarget").click()
        }
        handleGiveawayEntered();
      }
    }

    // check page until results show up then continue to next giveaway in queue if not a winner
    function handleGiveawayEntered(){
      setInterval(() => {
        if(document.querySelector('.qa-giveaway-result-text') && !document.querySelector('.qa-giveaway-result-text').innerText.includes('won')){
          console.log("DONE");
          processGiveaways()
          return
        }
      }, 1000)
    }

    // run script on page load
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
        // if giveaway has already been entered, continue on to next giveaway in queue
        if(document.querySelector("#giveaway-ended-header") || (document.querySelector('.qa-giveaway-result-text') && !document.querySelector('.qa-giveaway-result-text').innerText.includes('won'))){
          processGiveaways()
        }
        // handle giveaways with video requirement
        else if (document.getElementById("giveaway-youtube-video-watch-text") || document.getElementById("giveaway-video-watch-text")){
          if(document.querySelector(".continue_button_inner")){
            if(document.querySelector(".airy-play-toggle-hint.airy-hint.airy-play-hint")){
              document.querySelector(".airy-play-toggle-hint.airy-hint.airy-play-hint").click()
            }
            setTimeout(enterGiveaway, 31000)
          }
        }
        // if giveaway has no requirements, process it after 3 seconds
        else{
          setTimeout(enterGiveaway, 3000)
        }
      }
    }, false);

})();
