// This is a Greasemonkey script and must be run using a Greasemonkey-compatible browser.
//
// ==UserScript==
// @name         Amazon Giveaway Bot
// @version      2.0
// @author       Ty Gooch
// @updateURL    https://github.com/TyGooch/amazon-giveaway-automator/raw/master/amazonGiveawayAutomator.user.js
// @description  Automates Amazon giveaway entries
// @match        https://www.amazon.com/ga/*
// @match        https://www.amazon.com/ap/signin*
// @include        https://www.amazon.com/ga/
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at        document-end
// ==/UserScript==

(function() {
  var isSignIn = window.location.href.includes("https://www.amazon.com/ap/signin") || document.querySelector('.cvf-account-switcher')
  var isMainPage = window.location.href === GM_getValue("mainPageUrl")
  var isGiveaway = window.location.href.includes('/ga/p')

  // GM_setValue("running", false)

  window.addEventListener(
    "DOMContentLoaded",
    () => {
      if(GM_getValue('running')) {
        main()
      } else {
        init()
      }
    },
    false
  )
  // run script on page load

  async function init() {    
    if(!GM_getValue("lifetimeEntries")){
      GM_setValue("lifetimeEntries", 0)
    }
    if (!GM_getValue("running")) {
      GM_setValue("running", false)
    }

    var controlsTemplate = {}

    controlsTemplate["controls.html"] =
      '<div id="container"\n' +
      "	style=\"font-family: Roboto,\\'Helvetica Neue\\',Helvetica,Arial,sans-serif;font-size: 100%;padding: 5px; overflow: hidden; width: 400px; color: white; background-color: #232f3e; border-color: #232f3e; border-width: 2px; border-style: solid; z-index: 9999; text-align: center; display: flex; flex-direction: column; justify-content: center;\">\n" +
      '	<h3 class="textColor" style="padding-top: 0; margin-top: 0;">Amazon Giveaway Automator</h3>\n' +
      "\n" +
      '		<div><span for="allowVideos">Allow Videos: </span><input id="allowVideos" name="allowVideos" type="checkbox"></input></div>\n' +
      '		<div><label for="twoCaptchaKey">2Captcha API Key for captcha evasion:</label><input id="twoCaptchaKey" name="twoCaptchaKey" type="text" placeholdertype="Enter your key here"></input></div>\n' +
      '		<span id="lifetimeEntries"></span>\n' +
      '		<span id="currentSessionEntries"></span>\n' +
      '		<button id="run">Start Automator (opens in new window)</button>\n' +
      '		<button id="disable">Stop Automator</button>\n' +
      "\n" +
      "</div>\n" +
      ""

    if(!isSignIn){
      var controlsHTML = document.createElement("div")
      controlsHTML.style.position = "absolute"
      controlsHTML.style.left = "calc(50% - 200px)"
      controlsHTML.style.top = 99 + "px"
      controlsHTML.style.left = 0 + "px"
      controlsHTML.style.zIndex = 9999
      controlsHTML.innerHTML = controlsTemplate["controls.html"]
      document.body.appendChild(controlsHTML)
      document.getElementById("run").style.display = GM_getValue("running") ? "none" : "block"
      document.getElementById("disable").style.display = GM_getValue("running") ? "block" : "none"
      document.getElementById("currentSessionEntries").style.display = GM_getValue("running") ? "block" : "none"
      document.getElementById("allowVideos").checked = GM_getValue("allowVideos")
      if (GM_getValue("twoCaptchaKey")) {
        document.getElementById("twoCaptchaKey").value = GM_getValue("twoCaptchaKey")
      }
      document.getElementById("lifetimeEntries").innerHTML = GM_getValue("lifetimeEntries") + " Total Giveaways Entered"
      document.getElementById("currentSessionEntries").style.display = "none"
      document.getElementById("twoCaptchaKey").style.width = "100%"
      document.getElementById("twoCaptchaKey").style.textAlign = "center"
    }
    var automatorWindow

    document.getElementById("run").onclick = function() {
      GM_setValue("running", true)
      GM_setValue("processingGiveaways", false)
      GM_setValue("currentSessionEntries", 0)
      GM_setValue("currentIdx", 0)
      GM_setValue("mainPageUrl", window.location.href)
      if (document.getElementById("twoCaptchaKey").value.length > 0) {
        GM_setValue("twoCaptchaKey", document.getElementById("twoCaptchaKey").value)
      }
      GM_setValue("allowVideos", document.getElementById("allowVideos").checked)

      document.getElementById("run").style.display = "none"
      document.getElementById("disable").style.display = "block"
      document.getElementById("currentSessionEntries").style.display = "block"
      automatorWindow = window.open(
        GM_getValue("mainPageUrl"),
        "_blank",
        "toolbar=yes,scrollbars=yes,resizable=yes,height=1000,width=1000"
      )
      setInterval(function() {
        document.getElementById("currentSessionEntries").innerHTML =
          GM_getValue("currentSessionEntries") + " Giveaways Entered This Session"
        document.getElementById("lifetimeEntries").innerHTML = GM_getValue("lifetimeEntries") + " Total Giveaways Entered"
        if (automatorWindow.closed && GM_getValue("running")) {
          GM_setValue("running", false)
          GM_setValue("processingGiveaways", false)
          document.getElementById("currentSessionEntries").style.display = "none"
          document.getElementById("disable").style.display = "none"
          document.getElementById("run").style.display = "block"
        }
      }, 1000)
      window.addEventListener(
        "unload",
        () => {
          if (!automatorWindow.closed) {
            automatorWindow.close()
          }
          GM_setValue("running", false)
          GM_setValue("processingGiveaways", false)
          GM_setValue("currentIdx", 0)
        },
        false
      )
    }

    document.getElementById("disable").onclick = function() {
      GM_setValue("running", false)
      GM_setValue("processGiveaways", false)
      document.getElementById("currentSessionEntries").style.display = "none"
      document.getElementById("disable").style.display = "none"
      document.getElementById("run").style.display = "block"
      automatorWindow.close()
    }
  }

  async function doSignIn() {
    setInterval(() => {
      if(document.querySelector('.cvf-account-switcher-profile-details-after-account-removed')){
        document.querySelector('.cvf-account-switcher-profile-details-after-account-removed').click()
      }
      if(document.querySelector("#signInSubmit")){
        document.querySelector("#signInSubmit").click()
      }
    }, 5000)
  }

  async function getGiveaways() {
    GM_setValue("mainPageUrl", window.location.href)
    var setGiveaways = setInterval(() => {
      var giveawayItems = document.querySelectorAll(".a-link-normal.item-link")
      if(giveawayItems.length > 0){
        giveawayItems.forEach((item, idx) => {
          GM_setValue(
            `giveaway-${idx}`,
            item.href.split('?')[0]
          )
        })
      }
      clearInterval(setGiveaways)
      processGiveaways()
    }, 1000)
    // processGiveaways()
  }

  async function processGiveaways() {
    GM_setValue("processingGiveaways", true)
    let idx = GM_getValue("currentIdx")
    let currentGiveaway = GM_getValue(`giveaway-${idx}`)
    // GM_setValue(`giveaway-${idx}`, false)
    idx += 1
    GM_setValue("currentIdx", idx)
    if (idx <= 23) {
      window.location.href = currentGiveaway
    } else {
      window.location.href = GM_getValue("mainPageUrl")
    }
  }

  async function enterGiveaway() {
      // if giveaway has video requirement, click the continiue entry button first
      if (
        document.querySelector("#giveaway-video-watch-text") ||
        document.querySelector("#giveaway-youtube-video-watch-text") ||
        document.querySelector("#giveaway-video-short-title")
      ) {
        if(!GM_getValue("allowVideos")) {
          processGiveaways()  
        }
        // start watching video if it's not embedded from youtube
        if(!document.querySelector("#giveaway-youtube-video-watch-text")){
          var waitForVideoLoad = setInterval(() => {
            if (document.querySelector(".airy-play-toggle-hint.airy-hint.airy-play-hint")) {
              clearInterval(waitForVideoLoad)
              document.querySelector(".airy-play-toggle-hint.airy-hint.airy-play-hint").click()
              document.querySelector(".airy-audio-toggle.airy-on").click()
            }
          }, 1000)
        }

        var waitForEntry = setInterval(() => {
          if (
            document.querySelector(".continue_button_inner") &&
            !document.querySelector(".continue_button_inner").disabled
          ) {
            clearInterval(waitForEntry)
            document.querySelector(".continue_button_inner").click()
            handleSubmit()
          }
        }, 3000)
      }
      // don't enter givaways with follow requirements
      else if (document.getElementById("en_fo_follow-announce")) {
        processGiveaways()
      }
      // otherwise, enter giveaway immediately
      else {
        var submitEntry = setInterval(() => {
          if (document.querySelector("#ts_en_enter")) {
            document.querySelector("#ts_en_enter span input").click()
            clearInterval(submitEntry)
            handleSubmit()
          }
          if (document.querySelector(".boxClickTarget")) {
            document.querySelector(".boxClickTarget").click()
            clearInterval(submitEntry)
            handleSubmit()
          }
        }, 500)
      }
  }

  // check page until results show up then continue to next giveaway in queue if not a winner
  async function handleSubmit() {
    let lifetimeEntries = GM_getValue("lifetimeEntries")
    lifetimeEntries += 1
    GM_setValue("lifetimeEntries", lifetimeEntries)
    currentSessionEntries = GM_getValue("currentSessionEntries")
    currentSessionEntries += 1
    GM_setValue("currentSessionEntries", currentSessionEntries)

    var getResults = setInterval(() => {
      if (document.getElementById("title")) {
        if (document.getElementById("title").innerHTML.includes("won")) {
          document.getElementById("lu_co_ship_box-announce").click()
          processGiveaways()
        } else {
          processGiveaways()
        }
        clearInterval(getResults)
      }
    }, 1000)
  }

  async function main() {
    if (GM_getValue("running")) {
      // submit login info if redirected to signin page
      if (isSignIn) {
        doSignIn()
      } else if (isMainPage) {
        if (GM_getValue("currentIdx") > 23) {
          GM_setValue("processingGiveaways", false)
          GM_setValue("currentIdx", 0)
          // var getNextPage = setInterval(() => {
            //   if(document.querySelector('.a-pagination')){
              //     clearInterval(getNextPage)
              //     document.querySelector('.a-pagination').lastChild.firstChild.click()
              //     getGiveaways()
              //   }
              // }, 1000);
              let nextPage = window.location.href.split("pageId=")
              nextPage[nextPage.length - 1] = parseInt(nextPage[nextPage.length - 1]) + 1
              nextPage = nextPage.join("pageId=")
              GM_setValue("mainPageUrl", nextPage)
              window.location.href = nextPage
            } else {
              getGiveaways()
          // processGiveaways()
        } 
      } else if (isGiveaway) {
        // if giveaway has already been entered, continue on to next giveaway in queue
        if (
          document.querySelector("#giveaway-ended-header") ||
          (document.getElementById("title") && !document.getElementById("title").innerText.includes("won"))
        ) {
          processGiveaways()
        }
        // use 2captcha to solve captchas if present
        else if (document.querySelector("#giveaway-captcha-container")) {
          solveCaptcha()
        }
        // if giveaway has no requirements, enter it
        else {
          enterGiveaway()
        }
      }
    } else {
      init()
    }
  }

  async function solveCaptcha() {
    let base64Img = getBase64Image(
      document.querySelector("#image_captcha img").src,
      res => {
        sendCaptcha(res)
      },
      () => {
      }
    )
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
        var decodeCaptcha = setInterval(() => {
          fetch("https://2captcha.com/res.php?key=" + apiKey + "&action=get&header_acao=1&json=1&id=" + captchaId, {
            method: "GET"
          })
            .then(res => res.json())
            .then(captchaAnswer => {
              if (captchaAnswer.status === 1) {
                clearInterval(decodeCaptcha)
                document.querySelector("#image_captcha_input").value = captchaAnswer.request
                document.querySelector(".a-button-input").click()
                // check for validity, try again if invalid
                setTimeout(() => {
                  if(document.querySelector("#ga-image-captcha-validation-error")){
                    fetch("https://2captcha.com/res.php?key=" + apiKey + "&action=reportbad&header_acao=1&json=1&id=" + captchaId, {
                      method: "GET"
                    })
                    solveCaptcha()
                  } else {
                    enterGiveaway()
                  }
                }, 1000);
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
})()

