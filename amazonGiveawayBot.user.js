// This is a Greasemonkey script and must be run using a Greasemonkey-compatible browser.
//
// ==UserScript==
// @name         Amazon Giveaway Bot
// @version      2.0.1
// @author       Ty Gooch
// @updateURL    https://github.com/TyGooch/amazon-giveaway-bot/raw/master/amazonGiveawayBot.user.js
// @description  Automates Amazon giveaway entries
// @match        https://www.amazon.com/ga/*
// @match        https://www.amazon.com/ap/signin*
// @include      https://www.amazon.com/ga/
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        unsafeWindow
// @run-at       document-start
// @require      file:///Users/tygooch/Projects/amazon-giveaway-automator/amazonGiveawayBot.user.js
// ==/UserScript==

;(function() {
  var giveaways
  var historyKey
  var botFrame
  console.log(GM_getValue("winHistory"))
  // GM_addStyle("header { display: none !important; }")

  // hide navbar in iframe
  if (GM_getValue("initialized")) {
    GM_addStyle(
      "#nav-upnav, header, #giveaway-confetti-header, #giveaway-result-info-bar, #skiplink , .giveaway-footer-container, #navFooter { display: none !important; }"
    )
    GM_addStyle("body::-webkit-scrollbar { width: 0 !important }")
    GM_addStyle(".content-wrapper { height: 100vh;}")
    // GM_addStyle(".listing-info-container { background: #fff !important;}")
    GM_addStyle(
      ".listing-loading-container, .participation-loading-container { display: flex; flex-direction: column; justify-content: center; height: 100vh !important; border: none !important; background-color: #fff !important;}"
    )
    GM_addStyle(".spinner { transform: scale(2); margin-top: 0 !important; margin-bottom: 0 !important;}")
    GM_addStyle(".a-divider-normal {display: none;}")
    // GM_addStyle(
    //   ".input:-webkit-autofill, input:-webkit-autofill:hover, input:-webkit-autofill:focus, input:-webkit-autofill:active  {-webkit-box-shadow: 0 0 0 30px white inset !important;}"
    // )
  }
  if (window.location.href.includes("/ga/giveaways/bot")) {
    GM_setValue("initialized", false)
    window.addEventListener("load", init, { capture: false, once: true })
  } else {
  }

  async function init() {
    // GM_setValue("initialized", false)
    if (GM_getValue("initialized")) {
      document.querySelector("#ga-subscribe a").href = "/ga/giveaways/bot"
      document.querySelector("#ga-subscribe a").innerText = "Go to bot"
      return
    }

    GM_setValue("running", false)
    GM_setValue("initialized", true)
    window.onbeforeunload = () => {
      GM_setValue("initialized", false)
    }

    document.querySelector("#a-page").style.display = "none"

    if (!GM_getValue("lifetimeEntries")) {
      GM_setValue("lifetimeEntries", 0)
    }
    if (!GM_getValue("totalWins")) {
      GM_setValue("totalWins", 0)
    }
    // if (!GM_getValue("mainPageUrl")) {
    //   GM_setValue("mainPageUrl", "https://www.amazon.com/ga/giveaways/?pageId=1")
    // }

    var controlsTemplate =
      '<div id="container"\n' +
      "  style=\"font-family: Roboto,\\'Helvetica Neue\\',Helvetica,Arial,sans-serif;position: relative; min-width: 600px; margin: auto auto; color: #212529; background-color: #fff; border: 1px solid transparent; border-radius: .28571429rem; overflow: hidden; z-index: 9999; text-align: left; display: flex; flex-direction: column; justify-content: center;\">\n" +
      "  <div>\n" +
      '    <div style="padding: 16px; margin-top: 0; text-align: center;"><img style="width: 200px;  margin-left: auto; margin-right: auto;" src="https://i.ibb.co/xgYpv6T/giveaway-Bot-Logo-Blue.png" /></div>\n' +
      // '    <button id="closeControls" style="margin-top: 8px; margin-right: 10px; border: 0; padding: 0; position: absolute; right: 0px; top: 0px; min-height: 1em; line-height: 1em; font-size: 2rem; color: rgba(0,0,0,.5)">×</button>\n' +
      "  </div>\n" +
      '  <div style="display:flex; padding: 0px 16px; padding-bottom: 7px; justify-content: space-between; border-bottom: 1px solid rgba(34,36,38,.15);">\n' +
      '    <span style="display: inline-block;" id="lifetimeEntries"><b>Giveaways Entered: </b><span style="" id="lifetimeEntriesValue"></span><span id="currentSessionEntries"> (<span style="" id="currentSessionEntriesValue"></span> this session)</span></span>\n' +
      '    <span style="display: inline-block;" id="totalWins"><b>Giveways Won: </b><span style="" id="totalWinsValue"></span></span>\n' +
      "  </div>\n" +
      '  <div id="botFrameContainer" style="background-color: #fff; width: 600px; height: 287.5px; padding: 0px;"></div>\n' +
      '  <div id="botOptions" style=" background-color: #fff; width: 100%; display: flex; padding: 16px; border-top: 1px solid rgba(34,36,38,.15); text-align: left; justify-content: space-between;">\n' +
      '	    <div style="">\n' +
      // '      <input type="password" name="whatever" autocomplete="new-password" />\n' +
      // '      <input  autocomplete="off" style="display: none;" name="hiddenPassword" type="password" placeholdertype="Amazon Password"></input>\n' +
      '      <div style="padding-bottom: 10px;"><label for="amazonEmail">Amazon Email</label><input id="amazonEmail" autocomplete="off" style="width: 250px; box-shadow: 0 0 0 100px #fff inset !important;" name="amazonEmail" type="text" placeholdertype="Amazon Email"></input></div>\n' +
      '      <div style="padding-bottom: 10px;"><label for="amazonPassword">Amazon Passsword</label><input id="amazonPassword" autocomplete="off" style="width: 250px; box-shadow: 0 0 0 100px #fff inset !important;" name="amazonPassword" type="password" placeholdertype="Amazon Password"></input></div>\n' +
      // '       <div><input id="turboMode" name="turboMode" type="checkbox"></input><span> Enable Turbo Mode (Experimental)</span></div>\n' +
      "	  	</div>\n" +
      '	    <div style="">\n' +
      '      <div style="padding-bottom: 10px;"><label for="twoCaptchaKey">2Captcha API Key</label><input id="twoCaptchaKey" style="width: 250px;" name="twoCaptchaKey" type="text" placeholdertype="Enter your key here"></input></div>\n' +
      '	  	  <label id="">Filtered Giveaways</label>\n' +
      '	  	  <div style="padding-left: 7px;">\n' +
      '       <div><input id="disableKindle" name="disableKindle" type="checkbox"></input><span> Kindle Books</span></div>\n' +
      '	  	    <div><input id="disableVideo" name="disableVideo" type="checkbox"></input><span> Requires Video</span></div>\n' +
      ' 	    <div><input id="disableFollow" name="disableFollow" type="checkbox"></input><span> Requires Follow on Amazon</span></div>\n' +
      "	  	  </div>\n" +
      "	  	</div>\n" +
      "  </div>\n" +
      '  <div style="margin-top: 5px; border-top: 1px solid rgba(34,36,38,.15); background-color: #fff; display: flex; justify-content: space-between; padding: 16px; text-align: left;">\n' +
      '  		<button id="clearHistory" style="background-color: #e0e1e2; border: 0; border-radius: .28571429rem; color: rgba(0,0,0,0.6); padding: .78571429em 1.5em; min-height: 1em; line-height: 1em; font-size: 1rem;">Clear History</button>\n' +
      '  		<button id="run" style="background-color: #2185d0; border: 0; border-radius: .28571429rem; color: #fff; padding: .78571429em 1.5em; min-height: 1em; line-height: 1em; font-size: 1rem;">Start Bot</button>\n' +
      '  		<button id="stop" style="background-color: #d10919; border: 0; border-radius: .28571429rem; color: #fff;  padding: .78571429em 1.5em; min-height: 1em; line-height: 1em; font-size: 1rem;">Stop Bot</button>\n' +
      "  </div>\n" +
      "</div>\n"

    var controlsHTML = document.createElement("div")
    controlsHTML.id = "controlPanel"
    controlsHTML.style.position = "fixed"
    controlsHTML.style.top = "0px"
    controlsHTML.style.left = "0px"
    controlsHTML.style.width = "100vw"
    controlsHTML.style.height = "100vh"
    controlsHTML.style.display = "flex"
    controlsHTML.style.flexDirection = "column"
    controlsHTML.style.justifyContent = "center"
    controlsHTML.style.background = "rgba(0,0,0,0.95)"
    controlsHTML.style.zIndex = 9999
    controlsHTML.innerHTML = controlsTemplate
    document.body.appendChild(controlsHTML)

    botFrame = document.createElement("iframe")
    botFrame.onload = () => {
      main()
    }
    botFrame.id = "botFrame"
    botFrame.sandbox = "allow-same-origin allow-scripts allow-popups allow-forms"
    botFrame.style.width = "1200px"
    botFrame.style.height = "575px"
    botFrame.style.transform = "scale(0.5)"
    botFrame.style.transformOrigin = "top left"
    botFrame.style.border = "0"
    // botFrame.src = GM_getValue("mainPageUrl")
    botFrame.src = "https://www.amazon.com/ga/giveaways"
    document.querySelector("#botFrameContainer").appendChild(botFrame)

    document.querySelector("#run").style.display = GM_getValue("running") ? "none" : "block"
    document.querySelector("#stop").style.display = GM_getValue("running") ? "block" : "none"
    document.querySelector("#disableVideo").checked = GM_getValue("disableVideo")
    document.querySelector("#disableFollow").checked = GM_getValue("disableFollow")
    document.querySelector("#disableKindle").checked = GM_getValue("disableKindle")
    // document.querySelector("#turboMode").checked = GM_getValue("turboMode")
    if (GM_getValue("twoCaptchaKey")) {
      document.querySelector("#twoCaptchaKey").value = GM_getValue("twoCaptchaKey")
    }
    document.querySelector("#lifetimeEntriesValue").innerHTML = GM_getValue("lifetimeEntries")
    document.querySelector("#totalWinsValue").innerHTML = GM_getValue("totalWins")
    document.querySelector("#currentSessionEntries").style.visibility = "hidden"
    document.querySelector("#twoCaptchaKey").style.border = "1px solid #ced4da"
    document.body.style.overflow = "hidden"

    // document.querySelector("#closeControls").onclick = function() {
    //   document.querySelector("#controlPanel").style.display = "none"
    //   document.body.style.overflow = "auto"
    //   if (GM_getValue("running")) {
    //     GM_setValue("running", false)
    //     // document.querySelector("#botFrame").remove()
    //   }
    // }

    document.querySelector("#clearHistory").onclick = function() {
      clearHistory()
    }

    document.querySelector("#run").onclick = function() {
      GM_setValue("running", true)
      GM_setValue("currentSessionEntries", 0)

      document.querySelector("#run").style.display = "none"
      document.querySelector("#stop").style.display = "block"
      document.querySelector("#currentSessionEntries").style.visibility = "visible"
      document.querySelector("#botOptions").style.display = "none"

      botFrame.contentWindow.location.href = "https://www.amazon.com/gp/navigation/redirector.html/ref=sign-in-redirect"
      // main()

      setInterval(function() {
        historyKey = document.querySelector("#amazonEmail").value + "history"

        if (document.querySelector("#twoCaptchaKey").value.length > 0) {
          GM_setValue("twoCaptchaKey", document.querySelector("#twoCaptchaKey").value)
        }
        GM_setValue("disableKindle", document.querySelector("#disableKindle").checked)
        GM_setValue("disableVideo", document.querySelector("#disableVideo").checked)
        GM_setValue("disableFollow", document.querySelector("#disableFollow").checked)
        // GM_setValue("turboMode", document.querySelector("#turboMode").checked)

        document.querySelector("#currentSessionEntriesValue").innerHTML = GM_getValue("currentSessionEntries")
        document.querySelector("#lifetimeEntriesValue").innerHTML = GM_getValue("lifetimeEntries")
        document.querySelector("#totalWinsValue").innerHTML = GM_getValue("totalWins")

        if (!botFrame) {
          GM_setValue("running", false)
          document.querySelector("#currentSessionEntries").style.visibility = "hidden"
          document.querySelector("#stop").style.display = "none"
          document.querySelector("#run").style.display = "block"
        }
      }, 100)
      window.addEventListener(
        "unload",
        () => {
          GM_setValue("initialized", false)
          GM_setValue("running", false)
        },
        false
      )
    }

    document.querySelector("#stop").onclick = function() {
      GM_setValue("running", false)
      document.querySelector("#currentSessionEntries").style.visibility = "hidden"
      document.querySelector("#stop").style.display = "none"
      document.querySelector("#run").style.display = "block"
      document.querySelector("#botOptions").style.display = "flex"
    }
  }

  async function doSignIn() {
    console.log("Sign In")
    let signIn = setInterval(() => {
      if (!GM_getValue("running")) {
        clearInterval(signIn)
        // } else if (getEl("#cvf-account-switcher-add-accounts-link")) {
        //   clearInterval(signIn)
        //   getEl("#cvf-account-switcher-add-accounts-link").click()
      } else if (getEl("#auth-captcha-image") || getEl("#captchacharacters")) {
        clearInterval(signIn)
        solveCaptcha()
        // } else if (getEl("#cvf-account-switcher-add-accounts-link")) {
        //   clearInterval(signIn)
        //   getEl("#cvf-account-switcher-add-accounts-link").click()
      } else if (getEl("#ap_password")) {
        if (
          getEl(".a-size-base.a-color-tertiary.auth-text-truncate") &&
          !getEl(".a-size-base.a-color-tertiary.auth-text-truncate").textContent.includes(document.querySelector("#amazonEmail").value)
        ) {
          getEl("#ap_switch_account_link").click()
          // } else {
          // }
        } else {
          clearInterval(signIn)
          if (getEl("#ap_email")) {
            getEl("#ap_email").value = document.querySelector("#amazonEmail").value
          }
          getEl("#ap_password").value = document.querySelector("#amazonPassword").value
          getEl("#signInSubmit").click()
        }
      } else if (getEl(".cvf-account-switcher-spacing-base a")) {
        clearInterval(signIn)
        let accountAdded = false
        botFrame.contentDocument.querySelectorAll(".cvf-account-switcher-spacing-base a").forEach(el => {
          console.log(el.textContent)
          if (el.textContent.includes(document.querySelector("#amazonEmail").value)) {
            accountAdded = true
            el.click()
          } else if (el.textContent.includes("Add account") && !accountAdded) {
            el.click()
          }
        })
        // setTimeout(() => {
        // }, 1000)
      }
      // } else if (getEl(".cvf-account-switcher-profile-details")) {
      //   clearInterval(clickSignin)
      //   getEl(".cvf-account-switcher-profile-details").click()
      // } else if (getEl(".cvf-account-switcher-profile-details-after-account-removed")) {
      //   clearInterval(clickSignin)
      //   getEl(".cvf-account-switcher-profile-details-after-account-removed").click()
      // } else if (getEl("#signInSubmit")) {
      //   clearInterval(clickSignin)
      //   getEl("#signInSubmit").click()
      // }
    }, 1000)
  }

  var offset = 0

  async function getGiveaways() {
    let giveawayCount = ""
    var allowedGiveaways = []
    // while (offset < totalGiveaways / 24) {
    fetch("https://www.amazon.com/gax/-/lex/api/v1/giveaways?offset=" + offset * 24, {
      credentials: "include",
      headers: {
        accept: "application/json, text/plain, */*",
        "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
        "x-amzn-csrf": "86ZKiI1hVrTnAFCnPjmKcszcZfoj3D"
      },
      referrer: botFrame.contentWindow.location.href,
      referrerPolicy: "no-referrer-when-downgrade",
      body: null,
      method: "GET",
      mode: "cors"
    })
      .then(res => res.json())
      .then(data => {
        let visited = GM_getValue(historyKey)
        data.giveaways.forEach(item => {
          if (!visited || !visited.includes(item.id)) {
            allowedGiveaways.push("https://www.amazon.com/ga/p/" + item.id)
          }
        })
        console.log(data)
        offset += 1
        if (allowedGiveaways.length > 0) {
          giveaways = allowedGiveaways
          nextGiveaway()
        } else {
          console.log("NONE")
          getGiveaways()
        }
      })
    // }

    // var setGiveaways = setInterval(() => {
    //   // go to first page if no giveaways are shown
    //   if (getEl("#giveaway-listing-page-no-giveaway")) {
    //     clearInterval(setGiveaways)
    //     botFrame.contentWindow.location.href = "https://www.amazon.com/ga/giveaways/?pageId=1"
    //   }
    //   var giveawayItems = botFrame.contentDocument.querySelectorAll(".a-link-normal.item-link")
    //   if (giveawayItems.length > 0) {
    //     var allowedGiveaways = []
    //     giveawayItems.forEach(item => {
    //       if (
    //         !(
    //           (GM_getValue("disableKindle") && item.innerText.includes("Kindle")) ||
    //           (GM_getValue("disableVideo") && item.innerText.includes("Watch a short video")) ||
    //           (GM_getValue("disableFollow") && item.innerText.includes("Follow"))
    //         )
    //       ) {
    //         let visited = GM_getValue(historyKey)
    //         if (!visited || !visited.includes(item.href.split("?")[0].replace("https://www.amazon.com/ga/p/", ""))) {
    //           // allowedGiveaways.push(item.href.split("?")[0])
    //           allowedGiveaways.push(item.href)
    //         }
    //       }
    //     })
    //     if (allowedGiveaways.length > 0) {
    //       GM_setValue("maxIdx", allowedGiveaways.length - 1)
    //       giveaways = allowedGiveaways
    //       allowedGiveaways.forEach((url, idx) => {
    //         GM_setValue(`giveaway-${idx}`, url)
    //       })
    //       nextGiveaway()
    //     } else {
    //       console.log("NONE")
    //       goToNextPage()
    //     }
    //     clearInterval(setGiveaways)
    //   }
    // }, 100)
  }

  function addToHistory(url) {
    // let historyKey = document.querySelector("#amazonEmail").value + "history"
    let visited = GM_getValue(historyKey)
    if (!visited) {
      GM_setValue(historyKey, "|" + url.replace("https://www.amazon.com/ga/p/", ""))
    } else {
      GM_setValue(historyKey, visited + "|" + url.replace("https://www.amazon.com/ga/p/", ""))
    }
    visited = GM_getValue(historyKey)
    if (visited.length > 4000000) {
      visited = visited.substr(visited.length - 4000000)
    }
    GM_setValue(historyKey, visited)
  }

  async function nextGiveaway() {
    if (giveaways.length > 0) {
      let next = giveaways.pop()
      botFrame.contentWindow.location.href = next
    } else {
      getGiveaways()
    }
  }

  // async function enterGiveaway() {
  //   if (document.getElementsByName("ClaimMyPrize").length > 0) {
  //     document.getElementsByName("ClaimMyPrize")[0].click()
  //   }
  //   // if giveaway has video requirement, watch the video then enter
  //   let video = getEl(".video")
  //   if (video || getEl("#giveaway-youtube-video-watch-text") || getEl("#airy-container")) {
  //     // setInterval(() => {
  //     // }, 1000)
  //     if (GM_getValue("disableVideo")) {
  //       nextGiveaway()
  //     }
  //     var continueButton
  //     if (getEl(".amazon-video")) {
  //       video.play()
  //       video.muted = true
  //       continueButton = getEl(".amazon-video-continue-button")
  //     } else if (video) {
  //       getEl(".youtube-video div").click()
  //       continueButton = getEl(".youtube-continue-button")
  //     } else if (getEl("#airy-container")) {
  //       var playAiryVideo = setInterval(() => {
  //         if (getEl(".airy-play-hint")) {
  //           clearInterval(playAiryVideo)
  //           getEl(".airy-play-hint").click()
  //           getEl(".airy-audio-toggle").click()
  //           continueButton = getEl("#enter-video-button")
  //         }
  //       }, 100)
  //     } else {
  //       continueButton = getEl("#enter-youtube-video-button")
  //     }
  //     var waitForEntry = setInterval(() => {
  //       if (!continueButton.classList.contains("a-button-disabled")) {
  //         clearInterval(waitForEntry)
  //         if (continueButton.id.includes("-video-button")) {
  //           continueButton.querySelector("input").click()
  //         } else {
  //           continueButton.click()
  //         }
  //         handleSubmit()
  //       }
  //     }, 1000)
  //   } else {
  //     if (getEl(".follow-author-continue-button") || getEl(".qa-amazon-follow-button")) {
  //       if (GM_getValue("disableFollow")) {
  //         nextGiveaway()
  //       } else {
  //         if (getEl(".qa-amazon-follow-button")) {
  //           getEl(".qa-amazon-follow-button").click()
  //         } else {
  //           getEl(".follow-author-continue-button").click()
  //         }
  //       }
  //     }
  //     var submitEntry = setInterval(() => {
  //       var boxToClick = getEl("#box_click_target")
  //       if (!boxToClick) {
  //         boxToClick = getEl(".box-click-area")
  //       }
  //       if (boxToClick) {
  //         boxToClick.click()
  //         clearInterval(submitEntry)
  //         handleSubmit()
  //       }
  //     }, 100)
  //   }
  // }

  // check page until results show up then continue to next giveaway in queue if not a winner
  // async function handleSubmit() {
  //   // sometimes the first try doesn't work. If no results are displayed after 10 seconds try again.
  //   var tryAgain = setTimeout(() => {
  //     botFrame.contentWindow.reload()
  //   }, 10000)

  //   var getResults = setInterval(() => {
  //     if (
  //       document.getElementsByName("ClaimMyPrize").length > 0 ||
  //       getEl(".participation-post-entry-container") ||
  //       getEl(".add-to-cart-button") ||
  //       getEl("#giveaway-addToCart-btn") ||
  //       getEl("#free-sample-download-btn")
  //     ) {
  //       clearTimeout(tryAgain)
  //       clearInterval(getResults)
  //       if (
  //         document.getElementsByName("ClaimMyPrize").length > 0 ||
  //         (getEl("#title") && getEl("#title").innerHTML.includes("won!")) ||
  //         (getEl(".prize-title") && getEl(".prize-title").innerHTML.includes("won!")) ||
  //         (getEl(".prize-header-container") && getEl(".prize-header-container").innerHTML.includes("won!"))
  //       ) {
  //         var wins = GM_getValue("totalWins")
  //         GM_setValue("totalWins", wins + 1)
  //         if (getEl("#continue-button")) {
  //           getEl("#continue-button input").click()
  //         }
  //         if (getEl(".a-button-input")) {
  //           getEl(".a-button-input").click()
  //         }
  //         if (getEl("#lu_co_ship_box")) {
  //           getEl("#lu_co_ship_box").click()
  //         }
  //         if (document.getElementsByName("ClaimMyPrize").length > 0) {
  //           document.getElementsByName("ClaimMyPrize")[0].click()
  //         }
  //         if (botFrame.contentDocument.querySelectorAll(".shipAddressId input").length > 0) {
  //           botFrame.contentDocument
  //             .querySelectorAll(".shipAddressId input")
  //             [botFrame.contentDocument.querySelectorAll(".shipAddressId input").length - 1].click()
  //         }
  //         if (botFrame.contentDocument.querySelectorAll("input.shipMyPrizeButton").length > 0) {
  //           botFrame.contentDocument
  //             .querySelectorAll("input.shipMyPrizeButton")
  //             [botFrame.contentDocument.querySelectorAll("input.shipMyPrizeButton").length - 1].click()
  //         }
  //         if (GM_getValue("running")) {
  //           nextGiveaway()
  //         }
  //       } else {
  //         if (GM_getValue("running")) {
  //           nextGiveaway()
  //         }
  //       }
  //       addToHistory(botFrame.contentWindow.location.href)
  //       let lifetimeEntries = GM_getValue("lifetimeEntries")
  //       lifetimeEntries += 1
  //       GM_setValue("lifetimeEntries", lifetimeEntries)
  //       currentSessionEntries = GM_getValue("currentSessionEntries")
  //       currentSessionEntries += 1
  //       GM_setValue("currentSessionEntries", currentSessionEntries)
  //     }
  //   }, 100)
  // }

  async function main() {
    var isSignIn = botFrame.contentWindow.location.href.includes("https://www.amazon.com/ap/signin") || getEl(".cvf-account-switcher")
    // var isMainPage = botFrame.contentWindow.location.href.includes("?pageId=")
    var isGiveaway = botFrame.contentWindow.location.href.includes("/ga/p")
    if (GM_getValue("running")) {
      // submit login info if redirected to signin page
      if (isSignIn) {
        doSignIn()
      } else if (getEl(".participation-need-login a")) {
        getEl(".participation-need-login a").click()
      } else if (!isGiveaway) {
        // GM_setValue("mainPageUrl", botFrame.contentWindow.location.href)
        getGiveaways()
      } else if (isGiveaway) {
        // if (GM_getValue("turboMode")) {
        lazyEnter()
        // } else {
        //   var waitForTitle = setInterval(() => {
        //     if (getEl(".prize-title") || getEl(".prize-header-container") || getEl(".a-spacing-small.a-size-extra-large")) {
        //       clearInterval(waitForTitle)
        //       // if giveaway has already been entered, continue on to next giveaway in queue
        //       if (
        //         (!(getEl("#title") && getEl("#title").innerHTML.includes("won!")) && getEl(".a-spacing-small.a-size-extra-large")) ||
        //         (getEl(".prize-title") && getEl(".prize-title").innerText.includes("didn't win")) ||
        //         (getEl(".prize-header-container") && getEl(".prize-header-container").innerText.includes("didn't win"))
        //       ) {
        //         console.log("already entered")
        //         addToHistory(botFrame.contentWindow.location.href)
        //         nextGiveaway()
        //       }
        //       // use 2captcha to solve captchas if present
        //       else if (getEl("#giveaway-captcha-container")) {
        //         solveCaptcha()
        //       }
        //       // otherwise enter giveaway
        //       else if (getEl(".participation-need-action") || getEl(".participation-action-item")) {
        //         enterGiveaway()
        //       } else if (getEl(".participation-need-login")) {
        //         getEl(".a-button-inner a").click()
        //       }
        //     }
        //   }, 100)
        // }
      }
    }
  }

  async function solveCaptcha() {
    if (!GM_getValue("twoCaptchaKey").length > 0) {
      alert("No 2Captcha API key was provided. Captcha cannot be solved without a key.")
    } else {
      let captchaImgUrl
      if (getEl("#auth-captcha-image")) {
        captchaImgUrl = getEl("#auth-captcha-image").src
      } else if (getEl(".a-text-center img")) {
        captchaImgUrl = getEl(".a-text-center img").src
      }
      getBase64Image(
        captchaImgUrl,
        res => {
          sendCaptcha(res)
        },
        err => {
          console.log(err)
        }
      )
    }
  }

  async function sendCaptcha(imgUrl) {
    var apiKey = GM_getValue("twoCaptchaKey")
    fetch("https://2captcha.com/in.php", {
      method: "POST",
      body: JSON.stringify({
        key: apiKey,
        method: "base64",
        body: imgUrl,
        header_acao: 1,
        json: 1,
        soft_id: 7493321
      })
    })
      .then(res => res.json())
      .then(data => {
        let captchaId = data.request
        var waitForDecodedCaptcha = setInterval(() => {
          fetch("https://2captcha.com/res.php?key=" + apiKey + "&action=get&header_acao=1&json=1&id=" + captchaId, {
            method: "GET"
          })
            .then(res => res.json())
            .then(captchaAnswer => {
              if (captchaAnswer.status === 1) {
                clearInterval(waitForDecodedCaptcha)
                if (getEl("#image_captcha_input")) {
                  getEl("#image_captcha_input").value = captchaAnswer.request
                  getEl(".a-button-input").click()
                } else if (getEl("#captchacharacters")) {
                  getEl("#captchacharacters").value = captchaAnswer.request
                  getEl(".a-button-inner button").click()
                } else if (getEl("#auth-captcha-guess")) {
                  if (getEl("#ap_password")) {
                    getEl("#ap_password").value = document.querySelector("#amazonPassword").value
                    getEl("#auth-captcha-guess").value = captchaAnswer.request
                    getEl("#signInSubmit").click()
                  }
                }
                // check for validity, try again if invalid
                setTimeout(() => {
                  if (getEl("#ga-image-captcha-validation-error")) {
                    fetch("https://2captcha.com/res.php?key=" + apiKey + "&action=reportbad&header_acao=1&json=1&id=" + captchaId, {
                      method: "GET"
                    })
                    solveCaptcha()
                  } else {
                    main()
                  }
                }, 1000)
              } else if (captchaAnswer.request === "ERROR_CAPTCHA_UNSOLVABLE") {
                clearInterval(decodeCaptcha)
              }
            })
        }, 5000)
      })
  }
  async function getBase64Image(url, onSuccess, onError) {
    var cors_api_host = "cors-anywhere.herokuapp.com"
    var cors_api_url = "https://" + cors_api_host + "/"
    var slice = [].slice
    var origin = window.location.protocol + "//" + window.location.host
    var xhr = new XMLHttpRequest()
    var open = XMLHttpRequest.prototype.open
    XMLHttpRequest.prototype.open = function() {
      var args = slice.call(arguments)
      var targetOrigin = /^https?:\/\/([^\/]+)/i.exec(args[1])
      if (targetOrigin && targetOrigin[0].toLowerCase() !== origin && targetOrigin[1] !== cors_api_host) {
        args[1] = cors_api_url + args[1]
      }
      return open.apply(this, args)
    }

    xhr.responseType = "arraybuffer"
    xhr.open("GET", url)

    xhr.onload = function() {
      var base64, binary, bytes, mediaType

      bytes = new Uint8Array(xhr.response)
      binary = [].map
        .call(bytes, function(byte) {
          return String.fromCharCode(byte)
        })
        .join("")
      mediaType = xhr.getResponseHeader("content-type")
      base64 = [btoa(binary)].join("")
      onSuccess(base64)
    }
    xhr.onerror = onError
    xhr.send()
  }

  function clearHistory() {
    // let historyKey = document.querySelector("#amazonEmail").value + "history"
    // GM_setValue("mainPageUrl", "https://www.amazon.com/ga/giveaways/?pageId=1")
    GM_setValue(historyKey, "|")
  }

  function getEl(selector) {
    return botFrame.contentDocument.querySelector(selector)
  }

  // function goToNextPage() {
  //   let nextPage = GM_getValue("mainPageUrl").split("pageId=")
  //   nextPage[nextPage.length - 1] = parseInt(nextPage[nextPage.length - 1]) + 1
  //   nextPage = nextPage.join("pageId=")
  //   botFrame.contentWindow.location.href = nextPage
  // }

  function claimWin(giveawayId) {
    var wins = GM_getValue("totalWins")
    GM_setValue("totalWins", wins + 1)

    var boxToClick = getEl("#box_click_target")
    if (!boxToClick) {
      boxToClick = getEl(".box-click-area")
    }
    if (boxToClick) {
      boxToClick.click()
      // handleSubmit()
    } else {
      if (getEl(".follow-author-continue-button") || getEl(".qa-amazon-follow-button")) {
        if (GM_getValue("disableFollow")) {
          nextGiveaway()
        } else {
          if (getEl(".qa-amazon-follow-button")) {
            getEl(".qa-amazon-follow-button").click()
          } else {
            getEl(".follow-author-continue-button").click()
          }
        }
      }
    }

    let winHistory = GM_getValue("winHistory")
    if (!winHistory) {
      GM_setValue("winHistory", "|" + giveawayId)
    } else {
      GM_setValue("winHistory", winHistory + "|" + giveawayId)
    }
    winHistory = GM_getValue("winHistory")
    if (winHistory.length > 4000000) {
      winHistory = winHistory.substr(winHistory.length - 4000000)
    }
    GM_setValue("winHistory", winHistory)

    setInterval(() => {
      if (getEl(".shipAddressId input")) {
        getEl(".shipAddressId input").click()
      }
      if (getEl("input.shipMyPrizeButton")) {
        getEl("input.shipMyPrizeButton").click()
      }
      if (getEl("#continue-button")) {
        getEl("#continue-button input").click()
      }
      if (getEl(".a-button-input")) {
        getEl(".a-button-input").click()
      }
      if (getEl("#lu_co_ship_box")) {
        getEl("#lu_co_ship_box").click()
      }
      if (document.getElementsByName("ClaimMyPrize").length > 0) {
        document.getElementsByName("ClaimMyPrize")[0].click()
      }
      // if (botFrame.contentDocument.querySelectorAll(".shipAddressId input").length > 0) {
      //   botFrame.contentDocument.querySelectorAll(".shipAddressId input").click()
      // }
      if (botFrame.contentDocument.querySelectorAll("input.shipMyPrizeButton").length > 0) {
        botFrame.contentDocument
          .querySelectorAll("input.shipMyPrizeButton")
          [botFrame.contentDocument.querySelectorAll("input.shipMyPrizeButton").length - 1].click()
      }
    }, 1000)
    setTimeout(() => {
      nextGiveaway()
    }, 10000)
  }

  function recordEntry() {
    let lifetimeEntries = GM_getValue("lifetimeEntries")
    lifetimeEntries += 1
    GM_setValue("lifetimeEntries", lifetimeEntries)
    currentSessionEntries = GM_getValue("currentSessionEntries")
    currentSessionEntries += 1
    GM_setValue("currentSessionEntries", currentSessionEntries)
  }

  // Experimental functionality to enter giveaways without interacting with page elements.
  // I've tested this and it works however after entering >2000 giveaways with this method, none were won
  // Not sure if this is because Amazon can detect this.
  async function lazyEnter() {
    console.log(botFrame.contentWindow.location.href)
    var csrfToken = botFrame.contentWindow.P.pageContext.csrfToken
    var giveawayToken = botFrame.contentWindow.location.href.split("/p/")[1].split("?")[0]
    fetch(`https://www.amazon.com/gax/-/pex/api/v1/giveaway/${giveawayToken}/participation`, {
      credentials: "include",
      headers: {
        accept: "application/json, text/plain, */*",
        "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
        "content-type": "application/json;charset=UTF-8",
        "x-amzn-csrf": csrfToken
      },
      referrer: botFrame.contentWindow.location.href,
      referrerPolicy: "no-referrer-when-downgrade",
      body: null,
      method: "GET",
      mode: "cors"
    })
      .then(res => res.json())
      .then(data => {
        addToHistory(botFrame.contentWindow.location.href)
        console.log(data.success.status)
        if (data.success.status !== "notParticipated") {
          // console.log(data.success.status)
          nextGiveaway()
          return
        }

        if (data.success.nextUserAction) {
          // console.log("NEXT")
          fetch(`https://www.amazon.com/gax/-/pex/api/v1/giveaway/${giveawayToken}/participation/nextAction`, {
            credentials: "include",
            headers: {
              accept: "application/json, text/plain, */*",
              "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
              "content-type": "application/json;charset=UTF-8",
              "x-amzn-csrf": csrfToken
            },
            referrer: botFrame.contentWindow.location.href,
            referrerPolicy: "no-referrer-when-downgrade",
            body: JSON.stringify({ submission: { name: data.success.nextUserAction.name } }),
            method: "PUT",
            mode: "cors"
          })
            .then(res => res.json())
            .then(data => {
              let encryptedState = { encryptedState: data.success.encryptedState }

              fetch(`https://www.amazon.com/gax/-/pex/api/v1/giveaway/${giveawayToken}/participation`, {
                credentials: "include",
                headers: {
                  accept: "application/json, text/plain, */*",
                  "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
                  "content-type": "application/json;charset=UTF-8",
                  "x-amzn-csrf": csrfToken
                },
                referrer: botFrame.contentWindow.location.href,
                referrerPolicy: "no-referrer-when-downgrade",
                body: `{"encryptedState":"${data.success.encryptedState}"}`,
                method: "POST",
                mode: "cors"
              })
                .then(res => res.json())
                .then(data => {
                  console.log(data.success.status)
                  recordEntry()
                  if (data.success.status !== "won" && data.success.status !== "lucky") {
                    nextGiveaway()
                  } else {
                    claimWin(giveawayToken)
                  }
                })
                .catch(err => {
                  console.log(err)
                  nextGiveaway()
                  // console.log(err)
                })
            })
        } else {
          fetch(`https://www.amazon.com/gax/-/pex/api/v1/giveaway/${giveawayToken}/participation`, {
            credentials: "include",
            headers: {
              accept: "application/json, text/plain, */*",
              "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
              "content-type": "application/json;charset=UTF-8",
              "x-amzn-csrf": csrfToken
            },
            referrer: botFrame.contentWindow.location.href,
            referrerPolicy: "no-referrer-when-downgrade",
            body: JSON.stringify({}),
            method: "POST",
            mode: "cors"
          })
            .then(res => res.json())
            .then(data => {
              console.log(data.success.status)
              recordEntry()
              if (data.success.status !== "won" && data.success.status !== "lucky") {
                nextGiveaway()
              } else {
                claimWin(giveawayToken)
              }
            })
            .catch(err => {
              console.log(err)
              nextGiveaway()
            })
        }
      })
      .catch(err => {
        setTimeout(() => {
          console.log(err)
          console.log(getEl(".participation-need-login a"))
          if (getEl(".participation-need-login a")) {
            getEl(".participation-need-login a").click()
          } else {
            nextGiveaway()
          }
        }, 1000)
      })
  }
})()
