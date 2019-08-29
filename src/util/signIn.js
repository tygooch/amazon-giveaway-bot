import { log } from './logger'

export function doSignIn() {
  let signIn = setInterval(() => {
    if (!GM_getValue('running')) {
      clearInterval(signIn)
    } else if (botFrame.contentDocument.querySelector('#auth-captcha-image') || botFrame.contentDocument.querySelector('#captchacharacters')) {
      clearInterval(signIn)
      solveCaptcha()
    } else if (botFrame.contentDocument.querySelector('body') && botFrame.contentDocument.querySelector('body').textContent.includes('Send OTP')) {
      clearInterval(signIn)
      log('SIGN IN FAILED - NEED OTP')
      document.querySelector('#stop').click()
    } else if (botFrame.contentDocument.querySelector('#ap_password')) {
      if (
        botFrame.contentDocument.querySelector('.a-size-base.a-color-tertiary.auth-text-truncate') &&
        !botFrame.contentDocument
          .querySelector('.a-size-base.a-color-tertiary.auth-text-truncate')
          .textContent.includes(document.querySelector('#amazonEmail').value)
      ) {
        clearInterval(signIn)
        log(GM_getValue('currentAccount') + ' signed out')
        botFrame.contentDocument.querySelector('#ap_switch_account_link').click()
      } else {
        clearInterval(signIn)
        if (botFrame.contentDocument.querySelector('#ap_email')) {
          // log('Entering email')
          botFrame.contentDocument.querySelector('#ap_email').value = document.querySelector('#amazonEmail').value
        }
        log('Signing in ' + document.querySelector('#amazonEmail').value)
        botFrame.contentDocument.querySelector('#ap_password').value = document.querySelector('#amazonPassword').value
        botFrame.contentDocument.querySelector('#signInSubmit').click()
        // log(document.querySelector('#amazonEmail').value + ' signed in')
        GM_setValue('currentAccount', document.querySelector('#amazonEmail').value)
      }
    } else if (botFrame.contentDocument.querySelector('.cvf-account-switcher-spacing-base a')) {
      clearInterval(signIn)
      // log('Signing In ')
      let accountAdded = false
      botFrame.contentDocument.querySelectorAll('.a-section.cvf-account-switcher-spacing-base a').forEach(el => {
        if (el.textContent.includes(document.querySelector('#amazonEmail').value)) {
          accountAdded = true
          GM_setValue('currentAccount', document.querySelector('#amazonEmail').value)
          log('Signing in ' + document.querySelector('#amazonEmail').value)
          el.click()
        } else if (el.textContent.includes('Add account') && !accountAdded) {
          log('Adding account ' + document.querySelector('#amazonEmail').value)
          el.click()
        }
      })
    }
  }, 1000)
}
