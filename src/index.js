import { UI_TEMPLATE } from './util/uiTemplate'
// // import { getAddress, saveAddress, fillAddressForm } from './util/address'
import { initAccounts, signIn, switchAccount } from './util/account'
import { initAddress } from './util/address'
// // import { solveCaptcha, sendCaptcha, getBase64Image } from './util/captcha'
import { initGiveaways, nextGiveaway } from './util/giveaway'
// // import { getGiveaways, nextGiveaway, loadGiveaway, enterGiveaway, addToHistory, updateUI, updateEntryCount } from './util/giveaways'
import { log, initLog } from './util/logger'
// import { signIn } from './util/signIn'
import { claimWin, initWinnings } from './util/win'

// window.autoscroll = true
let botFrame
let timer

async function main() {
  if (!GM_getValue('running')) {
    return
  }
  let location = botFrame.contentWindow.location.href

  let isSignIn = location.includes('/ap/signin') || botFrame.contentDocument.querySelector('.cvf-account-switcher') || location.includes('/ap/cvf')

  if (isSignIn) {
    signIn()
    // } else if (!GM_getValue('currentAccount') || !GM_getValue('currentAccount').includes(document.querySelector('#amazonEmail').value)) {
    //   botFrame.contentDocument.querySelector('#nav-item-switch-account').click()
    // botFrame.contentWindow.location.href = 'https://www.amazon.com/gp/navigation/redirector.html/ref=sign-in-redirect'
  } else if (location.includes('/home')) {
    log(GM_getValue('currentAccount') + ' signed in')
    botFrame.contentWindow.location.href = 'https://www.amazon.com/ga/giveaways'
  } else if (location.includes('/ga/giveaways')) {
    window.csrfToken = botFrame.contentWindow.P.pageContext.csrfToken
    nextGiveaway()
  } else if (location.includes('/ga/p') && !window.csrfToken) {
    // if (GM_getValue('winHistory').includes(location.split('/won/')[1].split('#')[0]) || GM_getValue('winHistory').includes(location.split('/ga/p/')[1])) {
    botFrame.contentWindow.location.href = 'https://www.amazon.com/ga/giveaways'
    // } else {
    // }
    // if (!botFrame.contentDocument.querySelector('body').textContent.includes('You will receive an email')) {
    // }
  } else if (location.includes('/ga/won')) {
    claimWin(location.split('/won/')[1].split('#')[0])
    //   claimWin(location.split('/won/')[1].split('#')[0])
  }
}

async function setup() {
  document.title = 'Amazon Giveaway Bot'

  let newHTML = document.createElement('body')
  newHTML.innerHTML = UI_TEMPLATE
  newHTML.style.overflow = 'hidden'
  document.body = newHTML

  botFrame = document.querySelector('#botFrame')
  botFrame.onload = main
  window.botFrame = botFrame

  document.querySelectorAll('.botNavLink').forEach(el => {
    el.onclick = function(e) {
      e.preventDefault()
      document.querySelector('.botNavLink.active').classList.remove('active')
      document.querySelector('.botPanel.active').classList.remove('active')
      this.classList.add('active')
      document.querySelector(this.target).classList.add('active')
    }
  })

  initAccounts()
  initAddress()
  initGiveaways()
  initLog()
  initWinnings()

  document.querySelector('#disableFollow').checked = GM_getValue('disableFollow')
  document.querySelector('#disableKindle').checked = GM_getValue('disableKindle')

  if (GM_getValue('twoCaptchaKey')) {
    document.querySelector('#twoCaptchaKey').value = GM_getValue('twoCaptchaKey')
  }

  document.querySelectorAll('#giveawayFilter div').forEach(div => {
    div.onclick = function() {
      div.querySelector('input').click()
    }
  })

  document.querySelector('#disableFollow').onclick = function(e) {
    e.stopPropagation()
    GM_setValue('disableFollow', document.querySelector('#disableFollow').checked)
  }
  document.querySelector('#disableKindle').onclick = function(e) {
    e.stopPropagation()
    GM_setValue('disableKindle', document.querySelector('#disableKindle').checked)
  }

  document.querySelector('#bugReport').onclick = function() {
    var win = window.open('https://github.com/TyGooch/amazon-giveaway-bot/issues/new', '_blank')
    win.focus()
  }

  document.querySelector('#run').onclick = startBot
  document.querySelector('#stop').onclick = stopBot
}

async function startBot() {
  if (!GM_getValue('currentAccount')) {
    alert('Please select an account to use.')
    return
  }
  await switchAccount()

  GM_setValue('running', true)
  GM_setValue('currentSessionEntries', 0)
  GM_setValue('currentSessionWins', 0)
  GM_setValue('twoCaptchaKey', document.querySelector('#twoCaptchaKey').value)

  document.querySelector('#run').style.display = 'none'
  document.querySelector('#stop').style.display = 'block'
  // document.querySelector('#logStatus').innerText = 'Status: Running'
  // let startTime = Date.now()
  // timer = setInterval(() => {
  //   let runTime = new Date(Date.now() - startTime).toUTCString().split(' ')[4]
  //   document.querySelector('#logStatus').innerText = 'Status: Running ' + runTime + ''
  // }, 1000)

  window.autoscroll = true
  document.querySelector('#showLog').click()
  log('Bot Started')
}

async function stopBot() {
  GM_setValue('running', false)
  setTimeout(() => {
    log('Bot stopped')
  }, 1000)

  clearInterval(timer)
  botFrame.removeEventListener('load', main)
  document.querySelector('#currentSessionEntries').textContent = ''
  document.querySelector('#currentSessionWins').textContent = ''
  document.querySelector('#stop').style.display = 'none'
  document.querySelector('#run').style.display = 'block'
}

// async function attachBotFrame() {
//   // main()
//   if (botFrame.contentDocument.querySelector('#nav-flyout-ya-signin a')) {
//     botFrame.contentDocument.querySelector('#nav-flyout-ya-signin a').click()
//   } else if (botFrame.contentDocument.querySelector('#nav-item-switch-account')) {
//     botFrame.contentDocument.querySelector('#nav-item-switch-account').click()
//   }
// }
document.open()
document.write('')
document.close()

window.addEventListener(
  'load',
  async () => {
    console.log('load')
    window.stop()
    // GM_setValue('running', false)
    await setup()
    // setTimeout(() => {
    document.querySelectorAll('script').forEach(el => {
      el.remove()
    })
    // }, 5000)
  },
  { capture: false, once: true }
)

window.addEventListener(
  'unload',
  async () => {
    if (GM_getValue('running')) {
      // setTimeout(() => {
      log('Bot stopped')
      // }, 1000)
    }
    GM_setValue('running', false)
  },
  false
)
