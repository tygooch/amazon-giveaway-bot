import { UI_TEMPLATE } from './util/uiTemplate'
// // import { getAddress, saveAddress, fillAddressForm } from './util/address'
import { getAddress, saveAddress } from './util/address'
// // import { solveCaptcha, sendCaptcha, getBase64Image } from './util/captcha'
import { nextGiveaway } from './util/giveaway'
// // import { getGiveaways, nextGiveaway, loadGiveaway, enterGiveaway, addToHistory, updateUI, updateEntryCount } from './util/giveaways'
import { log, restoreLog } from './util/logger'
import { doSignIn } from './util/signIn'
import { claimWin, displayWinnings } from './util/win'

window.autoscroll = true
let botFrame
// let log = []
// let csrfToken

export function main() {
  if (!GM_getValue('running')) {
    return
  }
  let location = botFrame.contentWindow.location.href

  let isSignIn = location.includes('/ap/signin') || botFrame.contentDocument.querySelector('.cvf-account-switcher') || location.includes('/ap/cvf')

  if (isSignIn) {
    doSignIn()
  } else if (!GM_getValue('currentAccount') || !GM_getValue('currentAccount').includes(document.querySelector('#amazonEmail').value)) {
    botFrame.contentDocument.querySelector('#nav-item-switch-account').click()
    // botFrame.contentWindow.location.href = 'https://www.amazon.com/gp/navigation/redirector.html/ref=sign-in-redirect'
  } else if (location.includes('/home')) {
    log(GM_getValue('currentAccount') + ' signed in')
    botFrame.contentWindow.location.href = 'https://www.amazon.com/ga/giveaways'
  } else if (location.includes('/ga/giveaways')) {
    window.csrfToken = botFrame.contentWindow.P.pageContext.csrfToken
    nextGiveaway()
  } else if (location.includes('/ga/p')) {
    if (botFrame.contentDocument.querySelector('body').textContent.includes('Enter for a chance to win!')) {
      botFrame.contentWindow.location.href = 'https://www.amazon.com/ga/giveaways'
    }
  } else if (location.includes('/ga/won')) {
    claimWin(location.split('/won/')[1].split('#')[0])
  }
}

window.addEventListener(
  'load',
  () => {
    document.title = 'Amazon Giveaway Bot'

    GM_setValue('running', false)

    let newHTML = document.createElement('div')
    newHTML.innerHTML = UI_TEMPLATE
    document.body.appendChild(newHTML)

    if (!GM_getValue('lifetimeEntries')) {
      GM_setValue('lifetimeEntries', 0)
    }
    if (!GM_getValue('totalWins')) {
      GM_setValue('totalWins', 0)
    }

    document.querySelector('#disableFollow').checked = GM_getValue('disableFollow')
    document.querySelector('#disableKindle').checked = GM_getValue('disableKindle')
    document.querySelector('#lifetimeEntriesValue').innerHTML = GM_getValue('lifetimeEntries', 0)
    document.querySelector('#totalWinsValue').innerHTML = GM_getValue('totalWins', 0)
    document.querySelector('#amazonEmail').value = GM_getValue('currentAccount', '')
    if (GM_getValue('twoCaptchaKey')) {
      document.querySelector('#twoCaptchaKey').value = GM_getValue('twoCaptchaKey')
    }
    getAddress()

    document.querySelectorAll('.botNavLink').forEach(el => {
      el.onclick = function(e) {
        e.preventDefault()
        document.querySelector('.botNavLink.active').classList.remove('active')
        document.querySelector('.botPanel.active').classList.remove('active')
        this.classList.add('active')
        document.querySelector(this.target).classList.add('active')
      }
    })

    document.querySelector('#showWinnings').addEventListener('click', () => {
      displayWinnings()
    })

    document.querySelector('#showLog').addEventListener('click', () => {
      if (document.querySelector('#logContent').childElementCount === 0) {
        restoreLog()
      }
    })

    document.querySelector('#clearLog').onclick = function() {
      GM_setValue('logHistory', '')
      document.querySelector('#logContent').innerHTML = ''
      document.querySelector('#autoscroll').style.display = 'none'
      document.querySelector('#clearLog').style.display = 'none'
    }

    document.querySelector('#logContent').onscroll = function(e) {
      if (document.querySelector('#logContent').innerHTML === '') {
        return
      }
      if (this.oldScroll > this.scrollTop) {
        window.autoscroll = false
        document.querySelector('#autoscroll').style.display = 'block'
      } else if (this.scrollHeight - this.clientHeight === this.scrollTop) {
        document.querySelector('#autoscroll').onclick()
      }
      this.oldScroll = this.scrollTop
    }

    document.querySelector('#autoscroll').onclick = function() {
      document.querySelector('#autoscroll').style.display = 'none'
      document.querySelector('#logContent').lastElementChild.scrollIntoView()
      window.autoscroll = true
    }

    document.querySelector('#disableFollow').onclick = function() {
      GM_setValue('disableFollow', document.querySelector('#disableFollow').checked)
    }
    document.querySelector('#disableKindle').onclick = function() {
      GM_setValue('disableKindle', document.querySelector('#disableKindle').checked)
    }

    document.querySelector('#amazonEmail').oninput = function() {
      getAddress()
    }

    document.querySelectorAll('#addressForm input').forEach(el => {
      el.oninput = saveAddress
    })

    document.querySelector('#run').onclick = function() {
      let missingFields = []
      document.querySelectorAll('.required').forEach(el => {
        if (el.value === '') {
          missingFields.push(el.labels[0].textContent)
        }
      })
      if (missingFields.length > 0) {
        alert('Missing required values for:\n' + missingFields.join('\n') + '\n\nPlease provide them before starting bot.')
        return
      }

      GM_setValue('running', true)
      GM_setValue('currentSessionEntries', 0)
      GM_setValue('currentSessionWins', 0)
      GM_setValue('twoCaptchaKey', document.querySelector('#twoCaptchaKey').value)

      document.querySelector('#run').style.display = 'none'
      document.querySelector('#stop').style.display = 'block'

      window.autoscroll = true
      document.querySelector('#showLog').click()
      log('Bot Started')

      botFrame = document.querySelector('#botFrame')
      botFrame.onload = main
      // main()
      if (botFrame.contentDocument.querySelector('#nav-flyout-ya-signin a')) {
        botFrame.contentDocument.querySelector('#nav-flyout-ya-signin a').click()
      } else if (botFrame.contentDocument.querySelector('#nav-item-switch-account')) {
        botFrame.contentDocument.querySelector('#nav-item-switch-account').click()
      }
      // botFrame.contentWindow.location = 'https://www.amazon.com/ga/giveaways'
      // botFrame.contentDocument.querySelector('#nav-item-switch-account').click()

      window.addEventListener(
        'unload',
        () => {
          if (GM_getValue('running')) {
            setTimeout(() => {
              log('Bot stopped')
            }, 1000)
          }
          GM_setValue('running', false)
        },
        false
      )
    }

    document.querySelector('#stop').onclick = function() {
      log('Bot stopped')
      GM_setValue('running', false)
      botFrame.removeEventListener('load', main)
      document.querySelector('#currentSessionEntries').textContent = ''
      document.querySelector('#currentSessionWins').textContent = ''
      document.querySelector('#stop').style.display = 'none'
      document.querySelector('#run').style.display = 'block'
    }
  },
  { capture: false, once: true }
)
