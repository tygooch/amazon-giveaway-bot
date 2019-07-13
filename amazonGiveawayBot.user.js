// This is a Greasemonkey script and must be run using a Greasemonkey-compatible browser.
//
// ==UserScript==
// @name         Amazon Giveaway Bot
// @version      3.0.0
// @author       Ty Gooch
// @updateURL    https://github.com/TyGooch/amazon-giveaway-bot/raw/master/amazonGiveawayBot.user.js
// @description  Automates Amazon giveaway entries
// @match        https://www.amazon.com/giveaway/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_notification
// @grant        unsafeWindow
// @grant        window.focus
// @run-at       document-start
// @noframes
// ==/UserScript==

;(function() {
  let giveaways
  let historyKey
  let botFrame
  let log = []
  let offset = 0
  let csrfToken
  let autoscroll = true

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

    let controlsTemplate =
      '<div id="container"\n' +
      "  style=\"font-family: Roboto,\\'Helvetica Neue\\',Helvetica,Arial,sans-serif;position: relative; min-width: 600px; margin: auto auto; color: #212529; background-color: #fff; border: 1px solid transparent; border-radius: .28571429rem; overflow: none; z-index: 9999; text-align: left; display: flex; flex-direction: column; justify-content: space-between;\">\n" +
      '    <div style="border-bottom: 1px solid #ddd; margin-top: 0; text-align: center;"><img style="width: 600px;" src="https://svgshare.com/i/Dwc.svg" /></div>\n' +
      '  <div style="display: flex; background-color: #fff; margin-bottom: 5px; border-bottom: 1px solid #ddd;" >\n' +
      '  		<button id="showLog" style="display: flex; outline: 0px !important; background-color: transparent; border: 0px; border-bottom: 0px solid #e47911; color: #212529; padding: .78571429em 1em; min-height: 1em; line-height: 1em; font-size: 1rem;">Activity Log</button>\n' +
      '  		<button id="showBotFrame" style="display: flex; outline: 0px !important; background-color: transparent; border: 0px; border-bottom: 0px solid #e47911; color: #212529; padding: .78571429em 1em; min-height: 1em; line-height: 1em; font-size: 1rem;">Browser View</button>\n' +
      '  		<span id="" style="display: flex; outline: 0px !important; background-color: transparent; border: 0px; color: rgba(0,0,0,0.6); flex: 1;"></span>\n' +
      '  		<button id="showOptions" style="display: flex; outline: 0px !important; background-color: transparent; border: 0px; border-bottom: 2px solid #e47911; color: #212529; padding: .78571429em 1em; min-height: 1em; line-height: 1em; font-size: 1rem; font-weight: bold;">Settings</button>\n' +
      "  </div>\n" +
      '  <div id="botOptions" style=" background-color: #fff; width: 100%; display: flex; flex-direction: column; padding: 7px 16px; height: 400px; width: 600px; text-align: left; overflow: scroll;">\n' +
      '     <div style="font-size: 17px; font-weight: 700; margin-bottom: 10px; border-bottom: 1px solid #eee;">Amazon Account</div>\n' +
      '	    <div style="display: flex; padding-bottom:10px;">\n' +
      '  	    <div style="display: flex; flex-direction: column;">\n' +
      '         <div style="padding-bottom: 10px;"><label for="amazonEmail">Email</label><input id="amazonEmail" style="width: 250px; box-shadow: 0 0 0 100px #fff inset !important; border: 1px solid rgb(206, 212, 218) !important;" name="amazonEmail" type="text" placeholdertype="Amazon Email"></input></div>\n' +
      " 	  	</div>\n" +
      '         <div style="padding-left: 10px;"><label for="amazonPassword">Passsword</label><input id="amazonPassword" style="width: 250px; box-shadow: 0 0 0 100px #fff inset !important; border: 1px solid rgb(206, 212, 218) !important;" name="amazonPassword" type="password" placeholdertype="Amazon Password"></input></div>\n' +
      "	  	</div>\n" +
      '     <div style="font-size: 17px; font-weight: 700; margin-bottom: 10px; border-bottom: 1px solid #eee;">Captcha Solving</div>\n' +
      '       <div style="padding-bottom: 20px;"><label for="twoCaptchaKey">2Captcha Key <a style="font-weight: 400;" href="https://2captcha.com?from=7493321">(referral link)</a></label><input id="twoCaptchaKey" style="width: 250px; box-shadow: 0 0 0 100px #fff inset !important;" name="twoCaptchaKey" type="text" placeholdertype="Enter your key here"></input></div>\n' +
      '     <div style="font-size: 17px; font-weight: 700; margin-bottom: 10px; border-bottom: 1px solid #eee;">Giveaway Filter</div>\n' +
      '	    <div style="display: flex; padding-bottom:10px;">\n' +
      '	      <div style="display: flex; flex-direction: column;">\n' +
      '	    	  <div style="padding-bottom: 10px;">\n' +
      ' 	        <div><input id="disableFollow" name="disableFollow" type="checkbox"></input><span> Requires Follow</span></div>\n' +
      '     	    <div><input id="disableKindle" name="disableKindle" type="checkbox"></input><span> Kindle Books</span></div>\n' +
      "	  	    </div>\n" +
      "	  	  </div>\n" +
      "	  	</div>\n" +
      '     <div style="font-size: 17px; font-weight: 700; border-bottom: 1px solid #eee;">Shipping Address</div>\n' +
      '	        <div id="addressForm" style="display: flex; flex-direction: column;">\n' +
      '             <div style="padding: 10px 0px;"><label for="fullName">Full Name</label><input id="fullName" style="width: 250px; box-shadow: 0 0 0 100px #fff inset !important; border: 1px solid rgb(206, 212, 218) !important;" name="fullName" type="text"></input></div>\n' +
      '             <div style="padding-bottom: 10px;"><label for="street1">Street Address</label><input id="street1" style="width: 250px; box-shadow: 0 0 0 100px #fff inset !important; border: 1px solid rgb(206, 212, 218) !important;" name="street1" type="text" placeholder="Street and number, P.O. box, c/o."></input></div>\n' +
      '             <input id="street2" style="width: 250px; box-shadow: 0 0 0 100px #fff inset !important; border: 1px solid rgb(206, 212, 218) !important;" name="street2" type="text" placeholder="Apartment, suite, unit, building, floor, etc."></input>\n' +
      '             <div style="padding: 10px 0px;"><label for="city">City</label><input id="city" style="width: 250px; box-shadow: 0 0 0 100px #fff inset !important; border: 1px solid rgb(206, 212, 218) !important;" name="city" type="text"></input></div>\n' +
      '             <div style="padding-bottom: 10px;"><label for="state">State / Province / Region</label><input id="state" style="width: 250px; box-shadow: 0 0 0 100px #fff inset !important; border: 1px solid rgb(206, 212, 218) !important;" name="state" type="text"></input></div>\n' +
      '             <div style="padding-bottom: 10px;"><label for="zip">Zip Code</label><input id="zip" style="width: 250px; box-shadow: 0 0 0 100px #fff inset !important; border: 1px solid rgb(206, 212, 218) !important;" name="zip" type="text"></input></div>\n' +
      '             <div style="padding-bottom: 10px;"><label for="phone">Phone number</label><input id="phone" style="width: 250px; box-shadow: 0 0 0 100px #fff inset !important; border: 1px solid rgb(206, 212, 218) !important;" name="phone" type="text"></input></div>\n' +
      "	  	  </div>\n" +
      "  </div>\n" +
      '  <div id="log" style="position: relative; width: 600px; display: none; flex-direction: column;  background-color: #fff; text-align: left; overflow: scroll; height: 400px; max-height: 400px;">\n' +
      '    <div id="logContent" style="position: relative; width: 600px; display: flex; flex-direction: column; background-color: #fff; padding: 5px 16px; text-align: left; overflow: scroll; height: 400px; max-height: 400px;"></div>\n' +
      '  	 <button id="clearLog" style="display: none; position: absolute; bottom: 5px; right: 10px; width: 50px;">Clear</button>\n' +
      '  	 <a><svg id="autoscroll" style="display: none; position: absolute; bottom: 5px; left: calc(50% - 25px);" class="a" xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25"><defs><style>.cls-1{fill:#2196f3;}.cls-2{fill:#fff;}</style></defs><title>Untitled-1</title><circle class="cls-1" cx="12.5" cy="12.5" r="12.5"/><path class="cls-2" d="M20.5,12.5l-1.4-1.41-5.6,5.58V4.5h-2V16.67L5.93,11.08,4.5,12.5l8,8Z" transform="translate(0 0)"/></svg></a>\n' +
      "  </div>\n" +
      '  <div id="botFrameContainer" style="display: none; background-color: #fff; border-bottom: 0px solid #ddd; width: 600px; height: 400px; max-height: 400px; padding: 0px; overflow: scroll;"></div>\n' +
      '  <div style=" border-top: 1px solid #ddd; background-color: #fff; display: flex; justify-content: space-between; padding: 16px; text-align: left;">\n' +
      '  <div style="display:flex; flex-direction: column; justify-content: space-apart; border-top: 0px solid #ddd; ">\n' +
      '    <span style="display: flex;" id="totalWins"><b>Giveways Won: </b><span style="margin: 0px 5px;" id="totalWinsValue"></span><span style="display: none;" id="currentSessionWins"> (<span style="" id="currentSessionWinsValue"></span> this session)</span></span>\n' +
      '    <span style="display: flex;" id="lifetimeEntries"><b>Giveaways Entered: </b><span style="margin: 0px 5px;" id="lifetimeEntriesValue"></span><span id="currentSessionEntries"> (<span style="" id="currentSessionEntriesValue"></span> this session)</span></span>\n' +
      "  </div>\n" +
      '  		<button id="run" style="background-color: #2185d0; border: 0; border-radius: .28571429rem; color: #fff; padding: .78571429em 1.5em; min-height: 1em; line-height: 1em; font-size: 1rem;">Start Bot</button>\n' +
      '  		<button id="stop" style="background-color: #d10919; border: 0; border-radius: .28571429rem; color: #fff;  padding: .78571429em 1.5em; min-height: 1em; line-height: 1em; font-size: 1rem;">Stop Bot</button>\n' +
      "  </div>\n" +
      "</div>\n"

    let controlsHTML = document.createElement("div")
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
    botFrame.style.width = "1200px"
    botFrame.style.height = "800px"
    botFrame.style.transform = "scale(0.5)"
    botFrame.style.transformOrigin = "top left"
    botFrame.style.border = "0"
    botFrame.src = "https://www.amazon.com/ga/giveaways"
    document.querySelector("#botFrameContainer").appendChild(botFrame)

    let logHistory = GM_getValue("logHistory")
    if (logHistory && logHistory !== "") {
      logHistory.split("|").forEach(el => {
        let node = document.createElement("div")
        node.innerHTML = el
        node.onclick = e => {
          e.preventDefault()
          if (node.querySelector("a")) {
            botFrame.contentWindow.location.href = node.querySelector("a").href
            document.querySelector("#showBotFrame").click()
          }
        }
        document.querySelector("#logContent").appendChild(node.firstChild)
        document.querySelector("#clearLog").style.display = "flex"
      })
    }

    document.querySelector("#run").style.display = GM_getValue("running") ? "none" : "block"
    document.querySelector("#stop").style.display = GM_getValue("running") ? "block" : "none"
    document.querySelector("#disableFollow").checked = GM_getValue("disableFollow")
    document.querySelector("#disableKindle").checked = GM_getValue("disableKindle")

    if (GM_getValue("twoCaptchaKey")) {
      document.querySelector("#twoCaptchaKey").value = GM_getValue("twoCaptchaKey")
    }
    document.querySelector("#lifetimeEntriesValue").innerHTML = GM_getValue("lifetimeEntries")
    document.querySelector("#totalWinsValue").innerHTML = GM_getValue("totalWins")
    document.querySelector("#currentSessionEntries").style.visibility = "hidden"
    document.querySelector("#twoCaptchaKey").style.border = "1px solid #ced4da"
    document.body.style.overflow = "hidden"

    if (GM_getValue("currentAccount")) {
      document.querySelector("#amazonEmail").value = GM_getValue("currentAccount")
      getAddress()
    }

    document.querySelector("#showBotFrame").onclick = function() {
      document.querySelector("#botFrameContainer").style.display = "block"
      document.querySelector("#botOptions").style.display = "none"
      document.querySelector("#log").style.display = "none"
      document.querySelector("#showBotFrame").style.fontWeight = "bold"
      document.querySelector("#showBotFrame").style.borderBottom = "2px solid #e47911"
      document.querySelector("#showOptions").style.fontWeight = "normal"
      document.querySelector("#showOptions").style.borderBottom = "0px"
      document.querySelector("#showLog").style.fontWeight = "normal"
      document.querySelector("#showLog").style.borderBottom = "0px"
    }

    document.querySelector("#showLog").onclick = function() {
      document.querySelector("#log").style.display = "flex"
      document.querySelector("#botOptions").style.display = "none"
      document.querySelector("#botFrameContainer").style.display = "none"
      document.querySelector("#showLog").style.fontWeight = "bold"
      document.querySelector("#showLog").style.borderBottom = "2px solid #e47911"
      document.querySelector("#showOptions").style.fontWeight = "normal"
      document.querySelector("#showOptions").style.borderBottom = "0px"
      document.querySelector("#showBotFrame").style.fontWeight = "normal"
      document.querySelector("#showBotFrame").style.borderBottom = "0px"
      document.querySelector("#logContent").lastElementChild.scrollIntoView()
    }

    document.querySelector("#showOptions").onclick = function() {
      document.querySelector("#botOptions").style.display = "flex"
      document.querySelector("#botFrameContainer").style.display = "none"
      document.querySelector("#log").style.display = "none"
      document.querySelector("#showOptions").style.fontWeight = "bold"
      document.querySelector("#showOptions").style.borderBottom = "2px solid #e47911"
      document.querySelector("#showLog").style.fontWeight = "normal"
      document.querySelector("#showLog").style.borderBottom = "0px"
      document.querySelector("#showBotFrame").style.fontWeight = "normal"
      document.querySelector("#showBotFrame").style.borderBottom = "0px"
    }

    document.querySelector("#clearLog").onclick = function() {
      GM_setValue("logHistory", "")
      document.querySelector("#logContent").innerHTML = ""
      document.querySelector("#autoscroll").style.display = "none"
      document.querySelector("#clearLog").style.display = "none"
    }

    document.querySelector("#logContent").onscroll = function(e) {
      if (document.querySelector("#logContent").innerHTML === "") {
        return
      }
      if (this.oldScroll > this.scrollTop) {
        autoscroll = false
        document.querySelector("#autoscroll").style.display = "block"
      } else if (this.scrollHeight - this.clientHeight === this.scrollTop) {
        document.querySelector("#autoscroll").onclick()
      }
      this.oldScroll = this.scrollTop
    }

    document.querySelector("#autoscroll").onclick = function() {
      document.querySelector("#autoscroll").style.display = "none"
      document.querySelector("#logContent").lastElementChild.scrollIntoView()
      autoscroll = true
    }

    document.querySelector("#disableFollow").onclick = function() {
      GM_setValue("disableFollow", document.querySelector("#disableFollow").checked)
    }
    document.querySelector("#disableKindle").onclick = function() {
      GM_setValue("disableKindle", document.querySelector("#disableKindle").checked)
    }
    document.querySelector("#amazonEmail").oninput = function() {
      getAddress()
    }

    document.querySelector("#run").onclick = function() {
      if (document.querySelector("#amazonEmail").value === "" || document.querySelector("#amazonEmail").value === "") {
        alert("Amazon email and password required to start the bot.")
        return
      }

      GM_setValue("running", true)
      GM_setValue("currentSessionEntries", 0)
      GM_setValue("currentSessionWins", 0)
      autoscroll = true
      let accountName = document.querySelector("#amazonEmail").value
      logger("Bot Started for " + accountName)
      let address = {}
      document.querySelectorAll("#addressForm input").forEach(el => {
        address[el.id] = el.value
      })
      GM_setValue(accountName + "shippingAddress", JSON.stringify(address))

      GM_setValue("twoCaptchaKey", document.querySelector("#twoCaptchaKey").value)

      document.querySelector("#run").style.display = "none"
      document.querySelector("#stop").style.display = "block"
      document.querySelector("#currentSessionEntries").style.visibility = "visible"
      document.querySelector("#currentSessionWins").style.display = "inline-block"
      document.querySelector("#currentSessionWinsValue").textContent = "0" + " "
      document.querySelector("#currentSessionEntriesValue").textContent = "0" + " "
      document.querySelector("#botOptions").style.display = "none"
      document.querySelector("#showLog").click()
      if (!GM_getValue("currentAccount") || !GM_getValue("currentAccount").includes(document.querySelector("#amazonEmail").value)) {
        offset = 0
        botFrame.contentWindow.location.href = "https://www.amazon.com/gp/navigation/redirector.html/ref=sign-in-redirect"
      } else {
        botFrame.contentWindow.location.href = "https://www.amazon.com/ga/giveaways"
      }

      window.addEventListener(
        "unload",
        () => {
          if (GM_getValue("running")) {
            logger("Bot stopped")
          }
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
      document.querySelector("#currentSessionWins").style.display = "none"
      document.querySelector("#stop").style.display = "none"
      document.querySelector("#run").style.display = "block"
    }
  }

  let getAddress = function() {
    if (!GM_getValue(document.querySelector("#amazonEmail").value + "shippingAddress")) {
      return
    }
    Object.entries(JSON.parse(GM_getValue(document.querySelector("#amazonEmail").value + "shippingAddress"))).forEach(el => {
      document.querySelector("#" + el[0]).value = el[1]
    })
  }

  let updateUI = function() {
    document.querySelector("#currentSessionEntriesValue").textContent = GM_getValue("currentSessionEntries")
    document.querySelector("#currentSessionWinsValue").textContent = GM_getValue("currentSessionWins")
    document.querySelector("#lifetimeEntriesValue").textContent = GM_getValue("lifetimeEntries")
    document.querySelector("#totalWinsValue").textContent = GM_getValue("totalWins")
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
    let allowedGiveaways = []
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
        if (document.querySelector("#logContent").lastElementChild.textContent.includes("Searching Giveaways")) {
          document.querySelector("#logContent").lastElementChild.lastElementChild.textContent =
            "Searching Giveaways... (page " + offset + "/" + Math.ceil(parseFloat(data.totalGiveaways / 24)) + ")"
        } else {
          logger("Searching Giveaways... (page " + offset + "/" + Math.ceil(parseFloat(data.totalGiveaways / 24)) + ")")
        }
        historyKey = document.querySelector("#amazonEmail").value + "history"
        let visited = GM_getValue(historyKey)
        data.giveaways.forEach(item => {
          let canAdd = !visited || !visited.includes(item.id)
          if (item.title.includes("Kindle Edition") && GM_getValue("disableKindle")) {
            canAdd = false
          }
          if (item.participationRequirement) {
            if (item.participationRequirement.includes("FOLLOW") && GM_getValue("disableFollow")) {
              canAdd = false
            }
          }
          if (canAdd) {
            allowedGiveaways.push("https://www.amazon.com/ga/p/" + item.id)
          }
        })
        if (allowedGiveaways.length > 0) {
          giveaways = allowedGiveaways
          nextGiveaway()
        } else {
          if (offset * 24 < data.totalGiveaways) {
            getGiveaways()
          } else {
            let audio = new Audio("https://www.myinstants.com/media/sounds/ding-sound-effect_2.mp3")
            audio.play()
            logger("All available giveaways have been entered for this account. Switch accounts or come back later to enter more.", "error")
            GM_notification(
              "All available giveaways have been entered for this account. Switch accounts or come back later to enter more.",
              "Giveaway Bot Stopped"
            )
            document.querySelector("#stop").click()
          }
        }
      })
  }

  function addToHistory(giveawayId) {
    historyKey = document.querySelector("#amazonEmail").value + "history"
    let visited = GM_getValue(historyKey)
    if (!visited) {
      GM_setValue(historyKey, "|" + giveawayId)
    } else {
      visited += "|" + giveawayId
      if (visited.length > 68000) {
        visited = visited.slice(visited.length - 68000)
      }
      GM_setValue(historyKey, visited)
    }
  }

  function nextGiveaway() {
    if (!GM_getValue("running")) {
      return
    } else if (giveaways && giveaways.length > 0) {
      let next = giveaways.pop()
      lazyEnter(next)
    } else {
      logger("Searching Giveaways...")
      getGiveaways()
    }
  }

  function main() {
    let isSignIn =
      botFrame.contentWindow.location.href.includes("https://www.amazon.com/ap/signin") ||
      getEl(".cvf-account-switcher") ||
      botFrame.contentWindow.location.href.includes("https://www.amazon.com/ap/cvf")

    let isHomePage = botFrame.contentWindow.location.href.includes("home")
    let isMainPage = botFrame.contentWindow.location.href.includes("/ga/giveaways")
    let isGiveaway = botFrame.contentWindow.location.href.includes("/ga/p")

    if (GM_getValue("running")) {
      if (isSignIn) {
        doSignIn()
      } else if (getEl(".participation-need-login a")) {
        getEl(".participation-need-login a").click()
      } else if (isHomePage) {
        botFrame.contentWindow.location.href = "https://www.amazon.com/ga/giveaways"
      } else if (isMainPage) {
        if (giveaways && giveaways.length > 0) {
          nextGiveaway()
        } else {
          logger("Searching Giveaways...")
          getGiveaways()
        }
      } else if (isGiveaway) {
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
    let apiKey = GM_getValue("twoCaptchaKey")
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
        let waitForDecodedCaptcha = setInterval(() => {
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
    let cors_api_host = "cors-anywhere.herokuapp.com"
    let cors_api_url = "https://" + cors_api_host + "/"
    let slice = [].slice
    let origin = window.location.protocol + "//" + window.location.host
    let xhr = new XMLHttpRequest()
    let open = XMLHttpRequest.prototype.open
    XMLHttpRequest.prototype.open = function() {
      let args = slice.call(arguments)
      let targetOrigin = /^https?:\/\/([^\/]+)/i.exec(args[1])
      if (targetOrigin && targetOrigin[0].toLowerCase() !== origin && targetOrigin[1] !== cors_api_host) {
        args[1] = cors_api_url + args[1]
      }
      return open.apply(this, args)
    }

    xhr.responseType = "arraybuffer"
    xhr.open("GET", url)

    xhr.onload = function() {
      let base64, binary, bytes, mediaType

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

  function getEl(selector) {
    return botFrame.contentDocument.querySelector(selector)
  }

  function claimWin(giveawayId) {
    logger("Giveaway won!", "success")
    let audio = new Audio("https://www.myinstants.com/media/sounds/cash-register-sound-fx_HgrEcyp.mp3")
    audio.play()
    botFrame.contentWindow.location.href = "https://www.amazon.com/ga/p/" + giveawayId
    fetch("https://www.amazon.com/gax/-/pex/api/v1/giveaway/" + giveawayId, {
      credentials: "include",
      headers: {
        "x-amzn-csrf": csrfToken
      },
      body: null,
      method: "GET",
      mode: "cors"
    })
      .then(res => res.json())
      .then(data => {
        console.log(data)
        GM_notification({
          text: data.prize.name + " (" + data.prize.priceValue + ")",
          title: "Giveaway Won!",
          image: data.prize.imageUrl,
          highlight: true,
          timeout: 0,
          onclick: () => {
            window.focus()
            botFrame.contentWindow.location.href = "https://www.amazon.com/ga/p/" + giveawayId
            document.querySelector("#showBotFrame").click()
          }
        })
      })
    let wins = GM_getValue("totalWins")
    GM_setValue("totalWins", wins + 1)
    let currentSessionWins = GM_getValue("currentSessionWins")
    GM_setValue("currentSessionWins", currentSessionWins + 1)
    updateUI()

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
      console.log(botFrame.contentWindow.location.href)
      if (!GM_getValue("running")) {
        return
      }
      if (getEl(".newAddress input")) {
        getEl(".newAddress input").click()
      }
      if (getEl(".addAddressBox")) {
        getEl(".addAddressBox").click()
      }
      if (getEl(".enterAddressFormTable")) {
        let address = JSON.parse(GM_getValue(document.querySelector("#amazonEmail").value + "shippingAddress"))
        getEl("#enterAddressFullName").value = address.fullName
        getEl("#enterAddressAddressLine1").value = address.street1
        getEl("#enterAddressAddressLine2").value = address.street2
        getEl("#enterAddressCity").value = address.city
        getEl("#enterAddressStateOrRegion").value = address.state
        getEl("#enterAddressPostalCode").value = address.zip
        getEl("#enterAddressPhoneNumber").value = address.phone
        getEl("#addAddressButton").click()
      }
      if (getEl('input[name="ShipMyPrize"]')) {
        getEl('input[name="ShipMyPrize"]').click()
      }
      if (getEl("#continue-button input")) {
        getEl("#continue-button input").click()
      }

      if (getEl('input[name="ClaimMyPrize"]')) {
        getEl('input[name="ClaimMyPrize"]').click()
      }
    }, 1000)
    setTimeout(() => {
      clearInterval(clickButton)
      botFrame.contentWindow.location.href = "https://www.amazon.com/ga/giveaways"
    }, 30000)
  }

  function recordEntry() {
    let lifetimeEntries = GM_getValue("lifetimeEntries")
    GM_setValue("lifetimeEntries", lifetimeEntries + 1)
    let currentSessionEntries = GM_getValue("currentSessionEntries")
    GM_setValue("currentSessionEntries", currentSessionEntries + 1)
    updateUI()
  }

  function lazyEnter(url) {
    if (!GM_getValue("running")) {
      return
    }
    logger("Loading", "link", url)
    csrfToken = botFrame.contentWindow.P.pageContext.csrfToken
    let giveawayId = url.split("/p/")[1].split("?")[0]

    fetch(`https://www.amazon.com/gax/-/pex/api/v1/giveaway/${giveawayId}/participation`, {
      credentials: "include",
      headers: {
        accept: "application/json, text/plain, */*",
        "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
        "content-type": "application/json;charset=UTF-8",
        "x-amzn-csrf": csrfToken
      },
      referrer: url,
      referrerPolicy: "no-referrer-when-downgrade",
      body: null,
      method: "GET",
      mode: "cors"
    })
      .then(res => res.json())
      .then(data => {
        console.log(data.success.status)
        if (data.success.status !== "notParticipated") {
          addToHistory(giveawayId)
          logger("Giveaway " + data.success.status)
          nextGiveaway()
          return
        }

        if (data.success.nextUserAction) {
          let needUnfollow = data.success.nextUserAction.name === "followAuthor"
          fetch(`https://www.amazon.com/gax/-/pex/api/v1/giveaway/${giveawayId}/participation/nextAction`, {
            credentials: "include",
            headers: {
              accept: "application/json, text/plain, */*",
              "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
              "content-type": "application/json;charset=UTF-8",
              "x-amzn-csrf": csrfToken
            },
            referrer: url,
            referrerPolicy: "no-referrer-when-downgrade",
            body: JSON.stringify({ submission: { name: data.success.nextUserAction.name } }),
            method: "PUT",
            mode: "cors"
          })
            .then(res => res.json())
            .then(data => {
              enterGiveaway(giveawayId, `{"encryptedState":"${data.success.encryptedState}"}`, needUnfollow)
            })
        } else {
          enterGiveaway(giveawayId)
        }
      })
      .catch(err => {
        logger(err)

        addToHistory(giveawayId)
        nextGiveaway()
      })
  }

  function enterGiveaway(giveawayId, payload = "{}", needUnfollow = false) {
    if (!GM_getValue("running")) {
      return
    }
    logger("Submitting entry... ")
    fetch(`https://www.amazon.com/gax/-/pex/api/v1/giveaway/${giveawayId}/participation`, {
      credentials: "include",
      headers: {
        accept: "application/json, text/plain, */*",
        "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
        "content-type": "application/json;charset=UTF-8",
        "x-amzn-csrf": csrfToken
      },
      referrer: `https://www.amazon.com/ga/p/${giveawayId}`,
      referrerPolicy: "no-referrer-when-downgrade",
      body: payload,
      method: "POST",
      mode: "cors"
    })
      .then(res => res.json())
      .then(data => {
        console.log(data.success.status)
        addToHistory(giveawayId)
        document.querySelector("#logContent").lastElementChild.lastElementChild.textContent = "Giveaway " + data.success.status
        let newHistory = GM_getValue("logHistory").split("|")
        newHistory[newHistory.length - 1] = newHistory[newHistory.length - 1].replace("Submitting entry...", "Giveaway " + data.success.status)

        GM_setValue("logHistory", newHistory.join("|"))
        recordEntry()
        if (data.success.status !== "lucky") {
          if (needUnfollow) {
            unfollowAuthors()
          } else {
            nextGiveaway()
          }
        } else {
          claimWin(giveawayId)
        }
      })
      .catch(err => {
        console.log("ERROR")
        logger(err)
        nextGiveaway()
      })
  }

  function unfollowAuthors() {
    logger("Unfollowing author...")
    botFrame.contentWindow.location.href = "https://www.amazon.com/preferences/subscriptions/your-subscriptions/current-subscriptions"

    let unfollowAll = setInterval(() => {
      if (
        (getEl("body").textContent && getEl("body").textContent.includes("No current subscriptions")) ||
        getEl("body").textContent.includes("We couldn't find that page")
      ) {
        clearInterval(unfollowAll)
        clearTimeout(timeout)
        botFrame.contentWindow.location.replace("https://www.amazon.com/ga/giveaways")
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
      botFrame.contentWindow.location.replace("https://www.amazon.com/ga/giveaways")
    }, 20000)
  }

  function logger(str, style = "info", url) {
    document.querySelector("#clearLog").style.display = "flex"
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
      link.style.marginLeft = "5px"
      logInfo.appendChild(link)
      link.onclick = e => {
        e.preventDefault()
        botFrame.contentWindow.location.href = link.href
        document.querySelector("#showBotFrame").click()
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
    if (document.querySelector("#logContent").childElementCount > 1000) {
      document.querySelector("#logContent").firstElementChild.remove()
    }
    document.querySelector("#logContent").appendChild(logItem)
    if (autoscroll) {
      logItem.scrollIntoView()
    }

    let logHistory = GM_getValue("logHistory")
    if (!logHistory) {
      GM_setValue("logHistory", logItem.outerHTML)
    } else {
      if (logHistory.split("|").length > 1000) {
        logHistory = logHistory
          .split("|")
          .slice(1)
          .join("|")
      }
      GM_setValue("logHistory", logHistory + "|" + logItem.outerHTML)
    }
  }
})()
