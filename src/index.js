import { UI_TEMPLATE } from './util/uiTemplate'
import { initAccounts, signIn, switchAccount } from './util/account'
import { initAddress, fillAddressForm } from './util/address'
import { initGiveaways, nextGiveaway } from './util/giveaway'
import { log, initLog } from './util/logger'
import { claimWin, initWinnings } from './util/win'

let botFrame

async function main() {
  if (!GM_getValue('running')) {
    return
  }
  let location = botFrame.contentWindow.location.href

  let isSignIn = location.includes('/ap/signin') || botFrame.contentDocument.querySelector('.cvf-account-switcher') || location.includes('/ap/cvf')

  if (isSignIn) {
    await signIn()
  } else if (location.includes('/home')) {
    log(GM_getValue('currentAccount') + ' signed in')
    botFrame.contentWindow.location.href = 'https://www.amazon.com/ga/giveaways'
    // botFrame.contentWindow.location.reload()
  } else if (location.includes('/ga/giveaways')) {
    if (botFrame.contentWindow.P && botFrame.contentWindow.P.pageContext) {
      window.csrfToken = botFrame.contentWindow.P.pageContext.csrfToken
    }
    nextGiveaway()
  } else if (location.includes('/ga/p') && !window.csrfToken) {
    botFrame.contentWindow.location.href = 'https://www.amazon.com/ga/giveaways'
  } else if (location.includes('/ga/won')) {
    claimWin(location.split('/won/')[1].split('#')[0])
  } else if (location.includes('/addaddress')) {
    fillAddressForm()
  } else if (location.includes('/ga/p/tax')) {
    console.log('tax')
    botFrame.contentWindow.location.href = decodeURIComponent(botFrame.contentWindow.location.href.split('redirectSuccessUrl=')[1])
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
  GM_setValue('startingAccount', GM_getValue('currentAccount'))

  GM_setValue('running', true)
  GM_setValue('currentSessionEntries', 0)
  GM_setValue('currentSessionWins', 0)
  GM_setValue('twoCaptchaKey', document.querySelector('#twoCaptchaKey').value)

  document.querySelector('#run').style.display = 'none'
  document.querySelector('#stop').style.display = 'block'

  window.autoscroll = true
  document.querySelector('#showLog').click()
  log('Bot Started')
  if (botFrame.contentWindow.P && botFrame.contentWindow.P.pageContext.csrfToken) {
    window.csrfToken = botFrame.contentWindow.P.pageContext.csrfToken
  }
}

async function stopBot() {
  GM_setValue('running', false)
  setTimeout(() => {
    log('Bot stopped')
  }, 1000)

  botFrame.removeEventListener('load', main)
  document.querySelector('#currentSessionEntries').textContent = ''
  document.querySelector('#currentSessionWins').textContent = ''
  document.querySelector('#stop').style.display = 'none'
  document.querySelector('#run').style.display = 'block'
}

document.open()
document.write('')
document.close()

window.addEventListener(
  'load',
  async () => {
    window.stop()
    await setup()
  },
  { capture: true, once: true }
)

window.addEventListener(
  'unload',
  async () => {
    if (GM_getValue('running')) {
      log('Bot stopped')
    }
    GM_setValue('running', false)
  },
  false
)
