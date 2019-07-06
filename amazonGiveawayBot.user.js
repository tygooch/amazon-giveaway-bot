// This is a Greasemonkey script and must be run using a Greasemonkey-compatible browser.
//
// ==UserScript==
// @name         Amazon Giveaway Bot
// @version      2.2.0
// @author       Ty Gooch
// @updateURL    https://github.com/TyGooch/amazon-giveaway-bot/raw/master/amazonGiveawayBot.user.js
// @description  Automates Amazon giveaway entries
// @match        https://www.amazon.com/ga/*
// @match        https://www.amazon.com/ap/signin*
// @match        https://www.amazon.com/giveaway/*
// @include      https://www.amazon.com/ga/
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        unsafeWindow
// @run-at       document-start
// ==/UserScript==

;(function() {
  var giveaways
  var historyKey
  var botFrame
  var log = []
  var offset = 0
  GM_setValue("initialized", false)

  // if (GM_getValue("initialized")) {
  GM_addStyle(
    "#nav-upnav, header, #giveaway-confetti-header, #giveaway-result-info-bar, #skiplink , .giveaway-footer-container, #navFooter { display: none !important; }"
  )
  GM_addStyle("body::-webkit-scrollbar { width: 0 !important }")
  GM_addStyle(".content-wrapper { height: 100vh;}")
  GM_addStyle(
    ".listing-loading-container, .participation-loading-container { display: flex; flex-direction: column; justify-content: center; height: 100vh !important; border: none !important; background-color: #fff !important;}"
  )
  GM_addStyle(".spinner { transform: scale(2); margin-top: 0 !important; margin-bottom: 0 !important;}")
  GM_addStyle(".a-divider-normal {display: none;}")
  // }
  if (window.location.href.includes("/giveaway/")) {
    GM_setValue("initialized", false)
    window.addEventListener("load", init, { capture: false, once: true })
  } else {
  }

  function init() {
    if (GM_getValue("initialized")) {
      document.querySelector("#ga-subscribe a").href = "/ga/giveaways/bot"
      document.querySelector("#ga-subscribe a").innerText = "Go to bot"
      return
    }

    document.title = "Amazon Giveaway Bot"

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

    var controlsTemplate =
      '<div id="container"\n' +
      "  style=\"font-family: Roboto,\\'Helvetica Neue\\',Helvetica,Arial,sans-serif;position: relative; min-width: 600px; margin: auto auto; color: #212529; background-color: #fff; border: 1px solid transparent; border-radius: .28571429rem; overflow: none; z-index: 9999; text-align: left; display: flex; flex-direction: column; justify-content: center;\">\n" +
      "  <div>\n" +
      '    <div style="padding: 16px; margin-top: 0; text-align: center;"><img style="width: 200px;  margin-left: auto; margin-right: auto;" src="https://i.ibb.co/xgYpv6T/giveaway-Bot-Logo-Blue.png" /></div>\n' +
      "  </div>\n" +
      '  <div style="display:flex; padding: 0px 16px; padding-bottom: 7px; justify-content: space-between; border-bottom: 1px solid rgba(34,36,38,.15);">\n' +
      '    <span style="display: inline-block;" id="lifetimeEntries"><b>Giveaways Entered: </b><span style="" id="lifetimeEntriesValue"></span><span id="currentSessionEntries"> (<span style="" id="currentSessionEntriesValue"></span> this session)</span></span>\n' +
      '    <span style="display: inline-block;" id="totalWins"><b>Giveways Won: </b><span style="" id="totalWinsValue"></span><span id="currentSessionWins"> (<span style="" id="currentSessionWinsValue"></span> this session)</span></span>\n' +
      "  </div>\n" +
      '  <div id="botFrameContainer" style="background-color: #fff; width: 600px; height: 287.5px; padding: 0px;"></div>\n' +
      '  <div id="botOptions" style=" background-color: #fff; width: 100%; display: flex; padding: 16px; border-top: 1px solid rgba(34,36,38,.15); text-align: left; justify-content: space-between;">\n' +
      '	    <div style="">\n' +
      '      <div style="padding-bottom: 10px;"><label for="amazonEmail">Amazon Email</label><input id="amazonEmail" style="width: 250px; box-shadow: 0 0 0 100px #fff inset !important; border: 1px solid rgb(206, 212, 218) !important;" name="amazonEmail" type="text" placeholdertype="Amazon Email"></input></div>\n' +
      '      <div style="padding-bottom: 10px;"><label for="amazonPassword">Amazon Passsword</label><input id="amazonPassword" style="width: 250px; box-shadow: 0 0 0 100px #fff inset !important; border: 1px solid rgb(206, 212, 218) !important;" name="amazonPassword" type="password" placeholdertype="Amazon Password"></input></div>\n' +
      "	  	</div>\n" +
      '	    <div style="">\n' +
      '      <div style="padding-bottom: 10px;"><label for="twoCaptchaKey">2Captcha API Key</label><input id="twoCaptchaKey" style="width: 250px; box-shadow: 0 0 0 100px #fff inset !important;" name="twoCaptchaKey" type="text" placeholdertype="Enter your key here"></input></div>\n' +
      '	  	  <label id="">Disabled Giveaways</label>\n' +
      '	  	  <div style="padding-left: 7px;">\n' +
      '	  	    <div><input id="disableVideo" name="disableVideo" type="checkbox"></input><span> Requires Video</span></div>\n' +
      ' 	    <div><input id="disableFollow" name="disableFollow" type="checkbox"></input><span> Requires Follow on Amazon</span></div>\n' +
      ' 	    <div><input id="disableKindle" name="disableKindle" type="checkbox"></input><span> Kindle Books</span></div>\n' +
      "	  	  </div>\n" +
      "	  	</div>\n" +
      "  </div>\n" +
      '  <div id="" style="flex: 1; position: flex-end;">\n' +
      '  <div id="log" style="width: 600px; display: none; flex-direction: column; border-top: 1px solid rgba(34,36,38,.15); background-color: #fff; padding: 5px 16px 0px 16px; text-align: left; overflow: scroll; height: 157px;">\n' +
      "  </div>\n" +
      '  <div style="margin-top: 5px; border-top: 1px solid rgba(34,36,38,.15); background-color: #fff; display: flex; justify-content: space-between; padding: 16px; text-align: left;">\n' +
      '  <div style="display: flex;" >\n' +
      '  		<button id="showLog" style="display: flex; background-color: #e0e1e2; border: 0; border-radius: .28571429rem; color: rgba(0,0,0,0.6); padding: .78571429em 1.5em; min-height: 1em; line-height: 1em; font-size: 1rem;">Show Log</button>\n' +
      '  		<button id="showOptions" style="display: none; background-color: #e0e1e2; border: 0; border-radius: .28571429rem; color: rgba(0,0,0,0.6); padding: .78571429em 1.5em; min-height: 1em; line-height: 1em; font-size: 1rem;">Show Controls</button>\n' +
      '  		<button id="clearLog" style="margin-left: 5px; display: none; background-color: #e0e1e2; border: 0; border-radius: .28571429rem; color: rgba(0,0,0,0.6); padding: .78571429em 1.5em; min-height: 1em; line-height: 1em; font-size: 1rem;">Clear Log</button>\n' +
      "  </div>\n" +
      '  		<button id="run" style="background-color: #2185d0; border: 0; border-radius: .28571429rem; color: #fff; padding: .78571429em 1.5em; min-height: 1em; line-height: 1em; font-size: 1rem;">Start Bot</button>\n' +
      '  		<button id="stop" style="background-color: #d10919; border: 0; border-radius: .28571429rem; color: #fff;  padding: .78571429em 1.5em; min-height: 1em; line-height: 1em; font-size: 1rem;">Stop Bot</button>\n' +
      "  </div>\n" +
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
    botFrame.src = "https://www.amazon.com/ga/giveaways"
    document.querySelector("#botFrameContainer").appendChild(botFrame)

    let logHistory = GM_getValue("logHistory")
    if (logHistory) {
      logHistory.split("|").forEach(el => {
        let node = document.createElement("div")
        node.innerHTML = el
        document.querySelector("#log").appendChild(node)
      })

      logger("")
    }

    document.querySelector("#run").style.display = GM_getValue("running") ? "none" : "block"
    document.querySelector("#stop").style.display = GM_getValue("running") ? "block" : "none"
    document.querySelector("#disableVideo").checked = GM_getValue("disableVideo")
    document.querySelector("#disableFollow").checked = GM_getValue("disableFollow")
    document.querySelector("#disableKindle").checked = GM_getValue("disableKindle")

    if (GM_getValue("twoCaptchaKey")) {
      document.querySelector("#twoCaptchaKey").value = GM_getValue("twoCaptchaKey")
    }
    document.querySelector("#lifetimeEntriesValue").innerHTML = GM_getValue("lifetimeEntries")
    document.querySelector("#totalWinsValue").innerHTML = GM_getValue("totalWins")
    document.querySelector("#currentSessionEntries").style.visibility = "hidden"
    document.querySelector("#currentSessionWins").style.visibility = "hidden"
    document.querySelector("#twoCaptchaKey").style.border = "1px solid #ced4da"
    document.body.style.overflow = "hidden"

    document.querySelector("#showLog").onclick = function() {
      showLog()
    }
    document.querySelector("#showOptions").onclick = function() {
      showOptions()
    }
    document.querySelector("#clearLog").onclick = function() {
      GM_setValue("logHistory", "|")
      document.querySelector("#log").innerHTML = ""
    }

    document.querySelector("#run").onclick = function() {
      if (document.querySelector("#amazonEmail").value === "" || document.querySelector("#amazonEmail").value === "") {
        alert("Amazon email and password required to start the bot.")
        return
      }

      GM_setValue("running", true)
      GM_setValue("currentSessionEntries", 0)
      GM_setValue("currentSessionWins", 0)
      historyKey = document.querySelector("#amazonEmail").value + "history"
      logger("Bot started")

      document.querySelector("#run").style.display = "none"
      document.querySelector("#stop").style.display = "block"
      document.querySelector("#currentSessionEntries").style.visibility = "visible"
      document.querySelector("#currentSessionWins").style.visibility = "visible"
      document.querySelector("#botOptions").style.display = "none"
      document.querySelector("#showLog").click()
      if (!GM_getValue("currentAccount") || !GM_getValue("currentAccount").includes(document.querySelector("#amazonEmail").value)) {
        offset = 0
        botFrame.contentWindow.location.href = "https://www.amazon.com/gp/navigation/redirector.html/ref=sign-in-redirect"
      } else {
        logger(GM_getValue("currentAccount") + " already signed in")
        main()
      }

      let updateUI = setInterval(function() {
        if (!GM_getValue("running")) {
          clearInterval(updateUI)
          return
        }

        if (document.querySelector("#twoCaptchaKey").value.length > 0) {
          GM_setValue("twoCaptchaKey", document.querySelector("#twoCaptchaKey").value)
        }

        GM_setValue("disableVideo", document.querySelector("#disableVideo").checked)
        GM_setValue("disableFollow", document.querySelector("#disableFollow").checked)
        GM_setValue("disableKindle", document.querySelector("#disableKindle").checked)

        document.querySelector("#currentSessionEntriesValue").innerHTML = GM_getValue("currentSessionEntries")
        document.querySelector("#currentSessionWinsValue").innerHTML = GM_getValue("currentSessionWins")
        document.querySelector("#lifetimeEntriesValue").innerHTML = GM_getValue("lifetimeEntries")
        document.querySelector("#totalWinsValue").innerHTML = GM_getValue("totalWins")

        if (!botFrame) {
          clearInterval(updateUI)
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
      logger("Bot stopped")

      GM_setValue("running", false)
      document.querySelector("#currentSessionEntries").style.visibility = "hidden"
      document.querySelector("#currentSessionWins").style.visibility = "hidden"
      document.querySelector("#stop").style.display = "none"
      document.querySelector("#run").style.display = "block"
    }
  }

  function doSignIn() {
    let signIn = setInterval(() => {
      if (!GM_getValue("running")) {
        clearInterval(signIn)
      } else if (getEl("#auth-captcha-image") || getEl("#captchacharacters")) {
        clearInterval(signIn)
        solveCaptcha()
      } else if (getEl("body") && getEl("body").textContent.includes("Send OTP")) {
        clearInterval(signIn)
        logger("SIGN IN FAILED - NEED OTP")
        document.querySelector("#stop").click()
      } else if (getEl("#ap_password")) {
        if (
          getEl(".a-size-base.a-color-tertiary.auth-text-truncate") &&
          !getEl(".a-size-base.a-color-tertiary.auth-text-truncate").textContent.includes(document.querySelector("#amazonEmail").value)
        ) {
          clearInterval(signIn)
          logger(GM_getValue("currentAccount") + " signed out")
          getEl("#ap_switch_account_link").click()
        } else {
          clearInterval(signIn)
          if (getEl("#ap_email")) {
            getEl("#ap_email").value = document.querySelector("#amazonEmail").value
          }
          getEl("#ap_password").value = document.querySelector("#amazonPassword").value
          getEl("#signInSubmit").click()
          logger(document.querySelector("#amazonEmail").value + " signed in")
          GM_setValue("currentAccount", document.querySelector("#amazonEmail").value)
        }
      } else if (getEl(".cvf-account-switcher-spacing-base a")) {
        clearInterval(signIn)
        let accountAdded = false
        console.log(botFrame.contentDocument.querySelectorAll(".a-section.cvf-account-switcher-spacing-base a"))
        botFrame.contentDocument.querySelectorAll(".a-section.cvf-account-switcher-spacing-base a").forEach(el => {
          if (el.textContent.includes(document.querySelector("#amazonEmail").value)) {
            accountAdded = true
            el.click()
          } else if (el.textContent.includes("Add account") && !accountAdded) {
            logger("Adding account " + document.querySelector("#amazonEmail").value)
            el.click()
          }
        })
      }
    }, 1000)
  }

  function getGiveaways() {
    var allowedGiveaways = []

    fetch("https://www.amazon.com/gax/-/lex/api/v1/giveaways?offset=" + offset * 24, {
      credentials: "include",
      referrer: botFrame.contentWindow.location.href,
      referrerPolicy: "no-referrer-when-downgrade",
      body: null,
      method: "GET",
      mode: "cors"
    })
      .then(res => res.json())
      .then(data => {
        if (!GM_getValue("running")) {
          return
        }
        offset += 1
        let visited = GM_getValue(historyKey)
        data.giveaways.forEach(item => {
          let canAdd = !visited || !visited.includes(item.id)

          if (item.title.includes("Kindle Edition") && GM_getValue("disableKindle")) {
            canAdd = false
          }
          if (
            canAdd &&
            item.participationRequirement &&
            ((item.participationRequirement.includes("WATCH") && GM_getValue("disableVideo")) ||
              (item.participationRequirement.includes("FOLLOW") && GM_getValue("disableFollow")))
          ) {
            canAdd = false
          }
          if (canAdd) {
            allowedGiveaways.push("https://www.amazon.com/ga/p/" + item.id)
          }
        })
        if (allowedGiveaways.length > 0) {
          logger(allowedGiveaways.length + " found")
          giveaways = allowedGiveaways
          nextGiveaway()
        } else {
          if ((offset + 1) * 24 < data.totalGiveaways) {
            getGiveaways()
          } else {
            logger("All available giveaways have been entered for this account. Switch accounts or come back later to enter more.", "error")
            document.querySelector("#stop").click()
          }
        }
      })
  }

  function addToHistory(url) {
    let visited = GM_getValue(historyKey)
    if (!visited) {
      GM_setValue(historyKey, "|" + url.replace("https://www.amazon.com/ga/p/", ""))
    } else {
      GM_setValue(historyKey, visited + "|" + url.replace("https://www.amazon.com/ga/p/", ""))
    }
    visited = GM_getValue(historyKey)
    if (visited.length > 100000) {
      visited = visited.substr(visited.length - 100000)
    }
    GM_setValue(historyKey, visited)
  }

  function nextGiveaway() {
    if (giveaways && giveaways.length > 0) {
      let next = giveaways.pop()
      botFrame.contentWindow.location.href = next
    } else {
      logger("Searching for giveaways...")
      getGiveaways()
    }
  }

  function main() {
    var isSignIn =
      botFrame.contentWindow.location.href.includes("https://www.amazon.com/ap/signin") ||
      getEl(".cvf-account-switcher") ||
      botFrame.contentWindow.location.href.includes("https://www.amazon.com/ap/cvf")

    var isHomePage = botFrame.contentWindow.location.href.includes("home")
    var isMainPage = botFrame.contentWindow.location.href.includes("/ga/giveaways")
    var isGiveaway = botFrame.contentWindow.location.href.includes("/ga/p")

    if (GM_getValue("running")) {
      if (isSignIn) {
        doSignIn()
      } else if (getEl(".participation-need-login a")) {
        getEl(".participation-need-login a").click()
      } else if (isHomePage) {
        botFrame.contentWindow.location.href = "https://www.amazon.com/ga/giveaways"
      } else if (isMainPage) {
        logger("Searching for giveaways...")
        getGiveaways()
      } else if (isGiveaway) {
        lazyEnter()
      }
    }
  }

  function solveCaptcha() {
    if (!GM_getValue("twoCaptchaKey").length > 0) {
      logger("No 2Captcha API key was provided. Captcha cannot be solved without a key.")
      document.querySelector("#stop").click()
    } else {
      logger("Solving captcha...")
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
          logger(err)
        }
      )
    }
  }

  function sendCaptcha(imgUrl) {
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
                logger("Captcha solved: " + captchaAnswer.request)
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
                logger("Captcha unsolvable")
                clearInterval(decodeCaptcha)
              }
            })
        }, 5000)
      })
  }
  function getBase64Image(url, onSuccess, onError) {
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

  function showLog() {
    document.querySelector("#log").style.display = "flex"
    document.querySelector("#botOptions").style.display = "none"
    document.querySelector("#showOptions").style.display = "flex"
    document.querySelector("#clearLog").style.display = "flex"
    document.querySelector("#showLog").style.display = "none"
  }

  function showOptions() {
    document.querySelector("#showOptions").style.display = "none"
    document.querySelector("#clearLog").style.display = "none"
    document.querySelector("#log").style.display = "none"
    document.querySelector("#showLog").style.display = "flex"
    document.querySelector("#botOptions").style.display = "flex"
  }

  function getEl(selector) {
    return botFrame.contentDocument.querySelector(selector)
  }

  function claimWin(giveawayId) {
    logger("Giveaway won!", "success")
    var wins = GM_getValue("totalWins")
    GM_setValue("totalWins", wins + 1)
    currentSessionWins = GM_getValue("currentSessionWins")
    currentSessionWins += 1
    GM_setValue("currentSessionWins", currentSessionWins)

    var boxToClick = getEl("#box_click_target")
    if (!boxToClick) {
      boxToClick = getEl(".box-click-area")
    }
    if (boxToClick) {
      boxToClick.click()
    } else {
      if (getEl(".qa-amazon-follow-button")) {
        getEl(".qa-amazon-follow-button").click()
      }
      if (getEl(".follow-author-continue-button")) {
        getEl(".follow-author-continue-button").click()
      }
    }

    let winHistory = GM_getValue("winHistory")
    if (!winHistory) {
      GM_setValue("winHistory", "|" + giveawayId)
    } else {
      GM_setValue("winHistory", winHistory + "|" + giveawayId)
    }
    winHistory = GM_getValue("winHistory")
    if (winHistory.length > 100000) {
      winHistory = winHistory.substr(winHistory.length - 100000)
    }
    GM_setValue("winHistory", winHistory)

    let clickButton = setInterval(() => {
      if (getEl(".shipAddressId input")) {
        getEl(".shipAddressId input").click()
      }
      if (getEl('input[name="ShipMyPrize"]')) {
        // clearInterval(clickButton)
        getEl('input[name="ShipMyPrize"]').click()
      }
      if (getEl("#continue-button input")) {
        getEl("#continue-button input").click()
      }

      // if (getEl("#lu_co_ship_box")) {
      //   getEl("#lu_co_ship_box").click()
      // }
      if (getEl('input[name="ClaimMyPrize"]')) {
        // clearInterval(clickButton)
        getEl('input[name="ClaimMyPrize"]').click()
      }
    }, 1000)
    setTimeout(() => {
      clearInterval(clickButton)
      nextGiveaway()
    }, 30000)
  }

  function recordEntry() {
    let lifetimeEntries = GM_getValue("lifetimeEntries")
    lifetimeEntries += 1
    GM_setValue("lifetimeEntries", lifetimeEntries)
    currentSessionEntries = GM_getValue("currentSessionEntries")
    currentSessionEntries += 1
    GM_setValue("currentSessionEntries", currentSessionEntries)
  }

  function lazyEnter() {
    logger("Entering", "link", botFrame.contentWindow.location.href)
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
        if (data.success.status !== "notParticipated") {
          logger("Already entered")
          nextGiveaway()
          return
        }

        if (data.success.nextUserAction) {
          let needUnfollow = data.success.nextUserAction.name === "followAuthor"
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
                  logger("Giveaway " + data.success.status)
                  recordEntry()
                  if (data.success.status !== "won" && data.success.status !== "lucky") {
                    if (needUnfollow) {
                      unfollowAuthors()
                      return
                    } else {
                      nextGiveaway()
                    }
                  } else {
                    claimWin(giveawayToken)
                  }
                })
                .catch(err => {
                  logger(err)
                  nextGiveaway()
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
              logger("Giveaway " + data.success.status)
              recordEntry()

              if (data.success.status !== "won" && data.success.status !== "lucky") {
                nextGiveaway()
              } else {
                claimWin(giveawayToken)
              }
            })
            .catch(err => {
              logger(err)
              nextGiveaway()
            })
        }
      })
      .catch(err => {
        setTimeout(() => {
          logger(err)

          if (getEl(".participation-need-login a")) {
            getEl(".participation-need-login a").click()
          } else {
            nextGiveaway()
          }
        }, 1000)
      })
  }

  function unfollowAuthors() {
    logger("Unfollowing author...")
    botFrame.contentWindow.location.href = "https://www.amazon.com/preferences/subscriptions/your-subscriptions/current-subscriptions"

    let unfollowAll = setInterval(() => {
      if ((getEl("body") && getEl("body").textContent.includes("No current subscriptions")) || getEl("body").innerText.includes("We couldn't find that page")) {
        clearInterval(unfollowAll)
        clearTimeout(timeout)
        nextGiveaway()
      }
      if (getEl(".a-switch-row.a-active input")) {
        botFrame.contentDocument.querySelectorAll(".a-switch-row.a-active input").forEach(el => el.click())
        botFrame.contentWindow.location.reload()
      }
    }, 2000)
    let timeout = setTimeout(() => {
      if (unfollowAll) {
        clearInterval(unfollowAll)
      }
      nextGiveaway()
    }, 20000)
  }

  function logger(str, style = "info", url) {
    console.log(str)

    if (str.toString().includes("TypeError")) {
      str = "Entry not allowed"
    }
    let date = new Date().toString().split(" ")
    date = date
      .slice(1, 3)
      .concat(date[4])
      .join(" ")

    let logTime = document.createElement("span")
    logTime.textContent = "[" + date + "]"
    logTime.style.color = "#bbb"
    logTime.style.marginRight = "5px"

    let logInfo = document.createElement("span")
    logInfo.style.maxWidth = "465px"
    logInfo.style.wordWrap = "break-word"
    logInfo.textContent = str.toString()
    if (style === "success") {
      logInfo.style.color = "green"
      logInfo.style.fontWeight = "bold"
    }
    if (style === "error") {
      logInfo.style.color = "red"
      logInfo.style.fontWeight = "bold"
    }
    if (style === "link") {
      let link = document.createElement("a")
      link.textContent = url
      link.href = url
      link.style.color = "blue"
      link.style.marginLeft = "5px"
      logInfo.appendChild(link)
      link.onclick = e => {
        e.preventDefault()
        botFrame.contentWindow.location.href = url
      }
    }

    let logItem = document.createElement("div")
    logItem.style.display = "flex"
    logItem.appendChild(logTime)
    logItem.appendChild(logInfo)
    if (str === "") {
      logItem = document.createElement("div")
      logItem.appendChild(document.createElement("br"))
    }
    document.querySelector("#log").appendChild(logItem)
    logItem.scrollIntoView()

    let logHistory = GM_getValue("logHistory")
    if (!logHistory) {
      GM_setValue("logHistory", "|" + logItem.outerHTML)
    } else {
      GM_setValue("logHistory", logHistory + "|" + logItem.outerHTML)
    }
    logHistory = GM_getValue("logHistory")
    if (logHistory.length > 100000) {
      logHistory = logHistory.substr(logHistory.length - 100000)
    }
    GM_setValue("logHistory", logHistory)
  }
})()
