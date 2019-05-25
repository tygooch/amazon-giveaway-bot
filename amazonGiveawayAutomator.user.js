// This is a Greasemonkey script and must be run using a Greasemonkey-compatible browser.
//
// ==UserScript==
// @name         Amazon Giveaway Bot
// @version      2.0
// @author       Ty Gooch
// @updateURL    https://github.com/TyGooch/amazon-giveaway-automator/raw/master/amazonGiveawayBot.user.js
// @description  Automates Amazon giveaway entries
// @match        https://www.amazon.com/ga/*
// @match        https://www.amazon.com/ap/signin*
// @include        https://www.amazon.com/ga/
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        unsafeWindow
// @run-at        document-start
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js
// ==/UserScript==


(function() {
  // var document.querySelector = window.document.querySelector
  
  // console.log(window)
  // var document.querySelector
  
  var isSignIn = window.location.href.includes("https://www.amazon.com/ap/signin") || document.querySelector('.cvf-account-switcher')
  var isMainPage = window.location.href.includes('?pageId=')
  var isGiveaway = window.location.href.includes('/ga/p')
  
  // GM_getValue('running', false)
  
  unsafeWindow.addEventListener(
    "load",
    () => {
      var $ = unsafeWindow.$;
      if(GM_getValue('running')) {
        main()
      } else {
        init()
      }
    },
    false
  )

  async function init() { 
    console.log('init')   
    GM_setValue("running", false)
    
    if(!GM_getValue("lifetimeEntries")){
      GM_setValue("lifetimeEntries", 0)
    }

    var controlsTemplate =
      '<div id="container"\n' +
      "  style=\"font-family: Roboto,\\'Helvetica Neue\\',Helvetica,Arial,sans-serif;position: relative; min-width: 600px; margin: auto auto; color: #212529; background-color: #fff; border: 1px solid transparent; border-radius: .28571429rem; overflow: hidden; z-index: 9999; text-align: left; display: flex; flex-direction: column; justify-content: center;\">\n" +
      '  <div>\n' +
      '    <div style="padding: 16px; margin-top: 0; text-align: center;"><img style="width: 200px;  margin-left: auto; margin-right: auto;" src="https://i.ibb.co/xgYpv6T/giveaway-Bot-Logo-Blue.png" /></div>\n' +
      // '    <h1 class="textColor" style="padding: 16px 16px 0px 16px; margin-top: 0;">Amazon Giveaway Bot</h1>\n' +
      '    <button id="closeControls" style="margin-top: 8px; margin-right: 10px; border: 0; padding: 0; position: absolute; right: 0px; top: 0px; min-height: 1em; line-height: 1em; font-size: 2rem; color: rgba(0,0,0,.5)">×</button>\n' +
      '  </div>\n' +
      '  <div id="botFrameContainer" style="margin: auto auto; max-width: 600px; max-height: 384px;"></div>\n' +
      '  <div id="botOptions" style="display: flex; padding: 16px; border-top: 1px solid #e9ecef; border-bottom: 1px solid #e9ecef; text-align: left;">\n' +
      '    <div style="padding-bottom: 10px;"><label for="twoCaptchaKey">2Captcha API Key</label><input id="twoCaptchaKey" style="width: 250px;" name="twoCaptchaKey" type="text" placeholdertype="Enter your key here"></input></div>\n' +
      '	    <div style="margin-left: 50px;">\n' +
      '	  	  <label id="">Disabled Giveaways</label>\n' +
      '	  	  <div style="padding-left: 7px;">\n' +
      '       <div><input id="disableKindle" name="disableKindle" type="checkbox"></input><span> Kindle Books</span></div>\n' +
      '	  	    <div><input id="disableVideo" name="disableVideo" type="checkbox"></input><span> Entry Requires Video</span></div>\n' +
      ' 	    <div><input id="disableFollow" name="disableFollow" type="checkbox"></input><span> Entry Requires Follow on Amazon</span></div>\n' +
      '	  	  </div>\n' +
      '	  	</div>\n' +
      '  </div>\n' +
      '  <div style="border-top: 1px solid #e9ecef; background-color: rgb(249, 250, 251); display: flex; justify-content: space-between; padding: 16px; text-align: left;">\n' +
      '  <div style="padding-left: 10px;" id="lifetimeEntries"></div>\n' +
      '  <div style="padding-left: 10px;" id="currentSessionEntries"></div>\n' +
      // '		  <label id="">Statistics</label>\n' +
      '		<button id="run" style="background-color: #2185d0; border: 0; border-radius: .28571429rem; color: #fff; padding: .78571429em 1.5em; min-height: 1em; line-height: 1em; font-size: 1rem;">Start Bot</button>\n' +
      '		<button id="stop" style="background-color: #d10919; border: 0; border-radius: .28571429rem; color: #fff;  padding: .78571429em 1.5em; min-height: 1em; line-height: 1em; font-size: 1rem;">Stop Bot</button>\n' +
      '  </div>\n'
      '</div>\n'

    if(!isSignIn && !isGiveaway){
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
      controlsHTML.style.background = "rgba(0,0,0,0.85)"
      controlsHTML.style.zIndex = 9999
      controlsHTML.innerHTML = controlsTemplate
      document.body.appendChild(controlsHTML)
      
      document.querySelector("#run").style.display = GM_getValue("running") ? "none" : "block"
      document.querySelector("#stop").style.display = GM_getValue("running") ? "block" : "none"
      document.querySelector("#disableVideo").checked = GM_getValue("disableVideo")
      document.querySelector("#disableFollow").checked = GM_getValue("disableFollow")
      document.querySelector("#disableKindle").checked = GM_getValue("disableKindle")
      if (GM_getValue("twoCaptchaKey")) {
        document.querySelector("#twoCaptchaKey").value = GM_getValue("twoCaptchaKey")
      }
      document.querySelector("#lifetimeEntries").innerHTML = "Lifetime Entries: " + GM_getValue("lifetimeEntries")
      document.querySelector("#currentSessionEntries").style.display = "none"
      document.querySelector("#twoCaptchaKey").style.border = "1px solid #ced4da"


      var openControls = document.createElement("div")
      openControls.id = "openControls"
      openControls.style.width = "100vw"
      openControls.style.position = "absolute"
      openControls.style.top = "213px"
      openControls.style.left = "0px"
      openControls.style.textAlign = "center"
      // openControls.innerHTML = `<button id="openControlsLink" class="a-button a-button-primary"><span class="a-button-inner"><span class="a-button-text">Open Giveaway Bot</span></span></button>`
      // openControls.innerHTML = `<div id="openControlsLink"><img style="width: 200px;" src="https://i.ibb.co/8mxQ7wD/bot-copy-3x.png" /></div>`
      openControls.innerHTML = `<div id="openControlsLink"><img style="width: 200px;" src="https://i.ibb.co/xgYpv6T/giveaway-Bot-Logo-Blue.png" /></div>`
  
      var addOpenControlsToPage = setInterval(() => {
        if (document.querySelector("#giveaway-subscribe-container")){
          clearInterval(addOpenControlsToPage) 
          document.querySelector("#giveaway-numbers-container").classList.replace("a-span5", "a-span4")
          document.querySelector("#giveaway-numbers-container").style.marginRight = "0px"
          document.querySelector("#giveaway-subscribe-container").classList.replace("a-span7", "a-span4")
          // document.querySelector(".giveaway-result-info-bar .a-row").appendChild(openControls)
          document.body.prepend(openControls)
          document.querySelector("#openControlsLink").onclick = function() {
            document.body.style.overflow = "hidden"
            document.querySelector("#controlPanel").style.display = "flex"
          }
        }
      }, 100)
    }

    document.querySelector("#closeControls").onclick = function() {
      document.querySelector("#controlPanel").style.display = "none"
      document.body.style.overflow = "auto"
      if(GM_getValue("running")){
        GM_setValue("running", false)
        // GM_setValue("processingGiveaways", false)
        document.querySelector('#botFrame').remove()
      }

    }

    document.querySelector("#run").onclick = function() {
      GM_setValue("running", true)
      GM_setValue("processingGiveaways", false)
      GM_setValue("currentSessionEntries", 0)
      GM_setValue("currentIdx", 0)
      GM_setValue("mainPageUrl", window.location.href)
      if (document.querySelector("#twoCaptchaKey").value.length > 0) {
        GM_setValue("twoCaptchaKey", document.querySelector("#twoCaptchaKey").value)
      }
      GM_setValue("disableKindle", document.querySelector("#disableKindle").checked)
      GM_setValue("disableVideo", document.querySelector("#disableVideo").checked)
      GM_setValue("disableFollow", document.querySelector("#disableFollow").checked)

      document.querySelector("#run").style.display = "none"
      document.querySelector("#stop").style.display = "block"
      document.querySelector("#currentSessionEntries").style.display = "block"
          
      var iframe = document.createElement('iframe');
      iframe.id = "botFrame"
      iframe.style.width = "1200px"
      iframe.style.height = "768px"
      iframe.style.transform = "scale(0.5)"
      iframe.style.transformOrigin = "top left"
      iframe.style.border = "1px solid #e9ecef"
      iframe.src = GM_getValue("mainPageUrl")
      document.querySelector("#botFrameContainer").appendChild(iframe)      
      document.querySelector("#botOptions").style.display = "none"      
      // document.querySelector("#a-page").style.display = "none"

      setInterval(function() {
        document.querySelector("#currentSessionEntries").innerHTML = "Current Session Entries: " + GM_getValue("currentSessionEntries")
        document.querySelector("#lifetimeEntries").innerHTML = " Lifetime Entries: " + GM_getValue("lifetimeEntries")
        if (!GM_getValue("running")) {
          GM_setValue("running", false)
          GM_setValue("processingGiveaways", false)
          document.querySelector("#currentSessionEntries").style.display = "none"
          document.querySelector("#stop").style.display = "none"
          document.querySelector("#run").style.display = "block"
        }
      }, 100)
      window.addEventListener(
        "unload",
        () => {
          GM_setValue("running", false)
          GM_setValue("processingGiveaways", false)
        },
        false
      )
    }

    document.querySelector("#stop").onclick = function() {
      GM_setValue("running", false)
      // GM_setValue("nextGiveaway", false)
      document.querySelector("#currentSessionEntries").style.display = "none"
      document.querySelector("#stop").style.display = "none"
      document.querySelector("#run").style.display = "block"
      document.querySelector('#botFrame').remove()
      document.querySelector("#botOptions").style.display = "flex"
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
      // solveCaptcha()
    }, 1000)
  }

  async function getGiveaways() {
    var setGiveaways = setInterval(() => {
      console.log('GET')
      var giveawayItems = document.querySelectorAll(".a-link-normal.item-link")
      if(giveawayItems.length > 0){
        var allowedGiveaways = []
        giveawayItems.forEach(item => {
          if(!(
            GM_getValue("disableKindle") && item.innerText.includes('Kindle') ||
            GM_getValue("disableVideo") && item.innerText.includes('Watch a short video') ||
            GM_getValue("disableFollow") && item.innerText.includes('Follow'))
          ){
            allowedGiveaways.push(item.href.split('?')[0])
          }
        })
        GM_setValue('maxIdx', allowedGiveaways.length - 1)
        allowedGiveaways.forEach((url, idx) => {
          GM_setValue(`giveaway-${idx}`,url)
        })
        clearInterval(setGiveaways)
        nextGiveaway()
      }
    }, 100)
  }

  async function nextGiveaway() {
    console.log("next")
    GM_setValue("processingGiveaways", true)
    let idx = GM_getValue("currentIdx")
    let nextGiveaway = GM_getValue(`giveaway-${idx}`)
    idx += 1
    GM_setValue("currentIdx", idx)
    if (idx <= GM_getValue("maxIdx")) {
      window.location.href = nextGiveaway
    } else {
      window.location.href = GM_getValue("mainPageUrl")
    }
  }

  async function enterGiveaway() {
      // if giveaway has video requirement, watch the video then enter
    let video = document.querySelector(".video")
    if (video){
      if(GM_getValue("disableVideo")) {
        nextGiveaway()  
      }
      var continueButton
      if(document.querySelector('.amazon-video')){
        video.play()
        video.muted = true
        continueButton = document.querySelector(".amazon-video-continue-button")
      } else {
        document.querySelector(".youtube-video div").click()
        continueButton = document.querySelector(".youtube-continue-button")
      }
      var waitForEntry = setInterval(() => {
        console.log(!continueButton.classList.contains("a-button-disabled"))
        if (!continueButton.classList.contains("a-button-disabled")) {
          clearInterval(waitForEntry)
          continueButton.click()
          handleSubmit()
        }
      }, 3000)
    }
      // don't enter givaways with follow requirements
      else if (document.querySelector("#en_fo_follow-announce")) {
        nextGiveaway()
      }
      // otherwise, enter giveaway immediately
      else {
        console.log("submit")
        var submitEntry = setInterval(() => {
          // if (document.querySelector("#ts_en_enter")) {
          //   document.querySelector("#ts_en_enter span input").click()
          //   clearInterval(submitEntry)
          //   handleSubmit()
          // }
          if (document.querySelector(".box-click-area")) {
            document.querySelector(".box-click-area").click()
            clearInterval(submitEntry)
            handleSubmit()
          }
        }, 100)
      }
  }

  // check page until results show up then continue to next giveaway in queue if not a winner
  async function handleSubmit() {
    // sometimes the first try doesn't work. If no results are displayed after 10 seconds try again.
    var tryAgain = setTimeout(enterGiveaway, 10000)

    var getResults = setInterval(() => {
      if (document.querySelector(".participation-post-entry-container")) {
        clearTimeout(tryAgain)
        clearInterval(getResults)
        if (document.querySelector(".prize-title").innerHTML.includes("won")) {
          document.querySelector("#lu_co_ship_box-announce").click()
          alert('Winner!')
          // nextGiveaway()
        } else {
          nextGiveaway()
        }
        let lifetimeEntries = GM_getValue("lifetimeEntries")
        lifetimeEntries += 1
        GM_setValue("lifetimeEntries", lifetimeEntries)
        currentSessionEntries = GM_getValue("currentSessionEntries")
        currentSessionEntries += 1
        GM_setValue("currentSessionEntries", currentSessionEntries)
      }
    }, 100)
  }

  async function main() {
    console.log('MAIN')
    // var document.querySelector = window.document.querySelector
    if (GM_getValue("running")) {
      // submit login info if redirected to signin page
      if (isSignIn) {
        doSignIn()
      } else if (isMainPage) {
        if (GM_getValue("currentIdx") > GM_getValue("maxIdx")) {
          GM_setValue("currentIdx", 0)
          let nextPage = window.location.href.split("pageId=")
          nextPage[nextPage.length - 1] = parseInt(nextPage[nextPage.length - 1]) + 1
          nextPage = nextPage.join("pageId=")
          GM_setValue("mainPageUrl", nextPage)
          window.location.href = nextPage
          GM_setValue("processingGiveaways", false)
        } else {
          getGiveaways()
        }
      } else if (isGiveaway) {
        var waitForTitle = setInterval(() => {
          if(document.querySelector(".prize-title") || document.querySelector('.a-spacing-small.a-size-extra-large')){
            clearInterval(waitForTitle)
            // if giveaway has already been entered, continue on to next giveaway in queue
            if (
              document.querySelector('.a-spacing-small.a-size-extra-large') ||
              (document.querySelector(".prize-title") && document.querySelector(".prize-title").innerText.includes("didn't win"))
            ){
              console.log('already done')
              nextGiveaway()
            }
            // use 2captcha to solve captchas if present
            else if (document.querySelector("#giveaway-captcha-container")) {
              solveCaptcha()
            }
            // otherwise enter giveaway
            else if(document.querySelector('.participation-need-action')){
              console.log('enter')
              enterGiveaway()
            }
          }
        }, 100)
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

