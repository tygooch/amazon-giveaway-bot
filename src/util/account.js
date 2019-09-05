import { getAddress } from './address'
import { log } from './logger'

export function getAccounts() {
  if (!GM_getValue('accounts')) {
    showNoSelection()
    return
  }
  let accounts = JSON.parse(GM_getValue('accounts'))
  Object.keys(accounts).forEach(key => {
    let optionEl = document.createElement('option')
    optionEl.textContent = key
    optionEl.value = key
    // optionEl.selected = GM_getValue('currentAccount') === key
    document.querySelector('#accountDropdown').prepend(optionEl)
  })
  if (GM_getValue('currentAccount')) {
    selectAccount(GM_getValue('currentAccount'))
  } else {
    showNoSelection()
  }
  // document.querySelector('#amazonEmail').value = GM_getValue('currentAccount')
}

export function selectAccount(email) {
  if (document.querySelector('#noSelection')) {
    document.querySelector('#noSelection').remove()
    document.querySelector('#deleteAccount').style.display = 'block'
    document.querySelector('#changePassword').style.display = 'block'
    document.querySelector('#editAddress').style.display = 'block'
  }
  GM_setValue('currentAccount', email)
  // document.querySelector('#accountAddressContainer').style.display = 'flex'
  // document.querySelector('#accountModal').style.display = 'none'
  // document.querySelector('#accountForm').style.display = 'none'
  document.querySelector('#amazonEmail').value = email
  document.querySelector('#amazonPassword').value = JSON.parse(GM_getValue('accounts'))[email].password
  document.querySelector("option[value='" + email + "']").selected = true
  getAddress()
}

export function saveAccount() {
  let missingFields = []
  document.querySelectorAll('#accountModal .required').forEach(el => {
    if (el.value === '') {
      missingFields.push(el.labels[0].textContent)
    }
  })
  if (missingFields.length > 0) {
    alert('Missing required values for:\n' + missingFields.join('\n') + '\n\nPlease provide them before saving.')
    return
  }

  let accounts = GM_getValue('accounts')
  if (!accounts) {
    accounts = {}
  } else {
    accounts = JSON.parse(accounts)
  }
  if (accounts[document.querySelector('#amazonEmail').value]) {
    accounts[document.querySelector('#amazonEmail').value].password = document.querySelector('#amazonPassword').value
  } else {
    accounts[document.querySelector('#amazonEmail').value] = {
      password: document.querySelector('#amazonPassword').value,
    }
  }
  GM_setValue('accounts', JSON.stringify(accounts))
  console.log(document.querySelector("option[value='" + document.querySelector('#amazonEmail').value + "']"))
  if (document.querySelector("option[value='" + document.querySelector('#amazonEmail').value + "']")) {
    document.querySelector('#modalOverlay').style.visibility = 'hidden'
    document.querySelector('#accountModal').style.display = 'none'
    selectAccount(document.querySelector('#amazonEmail').value)
  } else {
    let optionEl = document.createElement('option')
    optionEl.textContent = document.querySelector('#amazonEmail').value
    optionEl.value = document.querySelector('#amazonEmail').value

    // optionEl.selected = true
    document.querySelector('#accountDropdown').prepend(optionEl)
    selectAccount(document.querySelector('#amazonEmail').value)
    document.querySelector('#editAddress').click()
    // document.querySelector('#accountModal').style.display = 'none'
    // document.querySelector('#addressModal').style.display = 'flex'
    // document.querySelectorAll('#addressModal input').forEach(el => (el.value = ''))
    // document.querySelector('input#fullName').focus()
  }

  // document.querySelector('#accountDropdown').value = ''
  document.querySelector('#accountModal').style.display = 'none'
}

export function deleteAccount() {
  let accounts = JSON.parse(GM_getValue('accounts'))
  delete accounts[GM_getValue('currentAccount')]
  GM_setValue('accounts', JSON.stringify(accounts))

  document.querySelector("option[value='" + GM_getValue('currentAccount') + "']").remove()
  GM_setValue('currentAccount', '')
  showNoSelection()
}

export function showNoSelection() {
  let noSelectionOption = document.createElement('option')
  noSelectionOption.textContent = 'Please select an account'
  noSelectionOption.value = ''
  noSelectionOption.selected = true
  noSelectionOption.disabled = true
  noSelectionOption.id = 'noSelection'
  document.querySelector('#accountDropdown').prepend(noSelectionOption)

  document.querySelector('#accountDropdown').value = ''
  document.querySelector('#accountAddressContainer').style.display = 'none'
  document.querySelector('#deleteAccount').style.display = 'none'
  document.querySelector('#changePassword').style.display = 'none'
  document.querySelector('#editAddress').style.display = 'none'
}

export async function switchAccount() {
  if (botFrame.contentDocument.querySelector('#nav-flyout-ya-signin a')) {
    botFrame.contentDocument.querySelector('#nav-flyout-ya-signin a').click()
  } else if (botFrame.contentDocument.querySelector('#nav-item-switch-account')) {
    botFrame.contentDocument.querySelector('#nav-item-switch-account').click()
  }
  await signIn()
}

export async function signIn() {
  let currentAccount = GM_getValue('currentAccount')
  // let password = JSON.parse(GM_getValue('accounts'))[currentAccount].password
  let signIn = setInterval(() => {
    if (!GM_getValue('running')) {
      clearInterval(signIn)
    } else if (botFrame.contentDocument.querySelector('#auth-captcha-image') || botFrame.contentDocument.querySelector('#captchacharacters')) {
      clearInterval(signIn)
      solveCaptcha()
    } else if (botFrame.contentDocument.querySelector('body') && botFrame.contentDocument.querySelector('body').textContent.includes('Send OTP')) {
      clearInterval(signIn)
      log('SIGN IN FAILED - NEED OTP')
      nextAccount()
      // document.querySelector('#stop').click()
    } else if (botFrame.contentDocument.querySelector('#ap_password')) {
      if (
        botFrame.contentDocument.querySelector('.a-size-base.a-color-tertiary.auth-text-truncate') &&
        !botFrame.contentDocument.querySelector('.a-size-base.a-color-tertiary.auth-text-truncate').textContent.includes(currentAccount)
      ) {
        clearInterval(signIn)
        log(currentAccount + ' signed out')
        botFrame.contentDocument.querySelector('#ap_switch_account_link').click()
      } else {
        clearInterval(signIn)
        if (botFrame.contentDocument.querySelector('#ap_email')) {
          // log('Entering email')
          botFrame.contentDocument.querySelector('#ap_email').value = currentAccount
        }
        log('Signing in ' + currentAccount)
        botFrame.contentDocument.querySelector('#ap_password').value = JSON.parse(GM_getValue('accounts'))[currentAccount].password
        botFrame.contentDocument.querySelector('#signInSubmit').click()
        // log(currentAccount + ' signed in')
        // GM_setValue('currentAccount', currentAccount)
      }
    } else if (botFrame.contentDocument.querySelector('.cvf-account-switcher-spacing-base a')) {
      clearInterval(signIn)
      // log('Signing In ')
      let accountAdded = false
      botFrame.contentDocument.querySelectorAll('.a-section.cvf-account-switcher-spacing-base a').forEach(el => {
        if (el.textContent.includes(currentAccount)) {
          accountAdded = true
          GM_setValue('currentAccount', currentAccount)
          log('Signing in ' + currentAccount)
          el.click()
        } else if (el.textContent.includes('Add account') && !accountAdded) {
          log('Adding account ' + currentAccount)
          el.click()
        }
      })
    }
  }, 5000)
}

export function nextAccount() {
  let accounts = Object.keys(JSON.parse(GM_getValue('accounts')))
  if (accounts.length > 1) {
    log('Switching accounts...')
    let nextIdx = accounts.indexOf(GM_getValue('currentAccount')) + 1
    if (nextIdx >= accounts.length) {
      nextIdx = 0
    }
    GM_setValue('currentAccount', accounts[nextIdx])
    document.querySelector('#accountDropdown').value = accounts[nextIdx]

    botFrame.contentWindow.location =
      'https://www.amazon.com/gp/navigation/redirector.html/ref=sign-in-redirect?ie=UTF8&associationHandle=usflex&currentPageURL=https%3A%2F%2Fwww.amazon.com%2Fgp%2Fyourstore%2Fhome%3Fie%3DUTF8%26ref_%3Dnav_youraccount_switchacct&pageType=&switchAccount=picker&yshURL=https%3A%2F%2Fwww.amazon.com%2Fgp%2Fyourstore%2Fhome%3Fie%3DUTF8%26ref_%3Dnav_youraccount_switchacct'
  } else {
    let audio = new Audio('https://www.myinstants.com/media/sounds/ding-sound-effect_2.mp3')
    audio.play()
    log('No more accounts to use. Add more in the settings tab or come back later for new giveaways.')
    GM_notification('All available giveaways have been entered for this account. Switch accounts or come back later to enter more.', 'Giveaway Bot Stopped')
    document.querySelector('#stop').click()
  }
}

export function initAccounts() {
  getAccounts()
  document.querySelector('#accountDropdown').onchange = function() {
    // if (document.querySelector('#accountDropdown').value === '') {
    // document.querySelector('#noSelection').style.display = 'block'
    // }
    // console.log(document.querySelector('#accountDropdown').value === 'Add New Account')
    if (document.querySelector('#accountDropdown').value === 'Add New Account') {
      // document.querySelector('#accountDropdown').style.display = 'none'
      document.querySelector('#modalOverlay').onclick = document.querySelector('#cancelAccountButton').onclick
      document.querySelector('#accountForm').onclick = e => {
        e.stopPropagation()
      }
      document.querySelector('#modalOverlay').style.visibility = 'visible'
      document.querySelector('#accountModal').style.display = 'flex'
      document.querySelectorAll('#accountModal input').forEach(el => (el.value = ''))
      document.querySelector('#amazonEmail').focus()

      // document.querySelector('#amazonEmail').value = ''
      // document.querySelector('#amazonPassword').value = ''
    } else if (document.querySelector('#accountDropdown').value !== '') {
      selectAccount(document.querySelector('#accountDropdown').value)
    }
  }

  document.querySelector('#changePassword').onclick = function() {
    document.querySelector('#modalOverlay').onclick = document.querySelector('#cancelAccountButton').onclick
    document.querySelector('#accountForm').onclick = e => {
      e.stopPropagation()
    }
    document.querySelector('#modalOverlay').style.visibility = 'visible'
    document.querySelector('#accountModal').style.display = 'flex'
    document.querySelector('#amazonEmail').disabled = true
    setTimeout(() => {
      document.querySelector('#amazonPassword').focus()
    }, 100)
  }
  document.querySelector('#deleteAccount').onclick = function() {
    document.querySelector('#modalOverlay').onclick = document.querySelector('#cancelDeleteAccountButton').onclick
    document.querySelector('#deleteAccountDiv').onclick = e => {
      e.stopPropagation()
    }
    document.querySelector('#modalOverlay').style.visibility = 'visible'
    document.querySelector('#deleteAccountModal').style.display = 'flex'
  }

  document.querySelector('#cancelAccountButton').onclick = function() {
    document.querySelector('#amazonEmail').disabled = false
    document.querySelector('#modalOverlay').style.visibility = 'hidden'
    document.querySelector('#accountModal').style.display = 'none'
    document.querySelector('#accountDropdown').value = GM_getValue('currentAccount')
  }
  document.querySelector('#cancelDeleteAccountButton').onclick = function() {
    document.querySelector('#modalOverlay').style.visibility = 'hidden'
    document.querySelector('#deleteAccountModal').style.display = 'none'
  }

  document.querySelector('#confirmDeleteAccountButton').onclick = function() {
    document.querySelector('#modalOverlay').style.visibility = 'hidden'
    document.querySelector('#deleteAccountModal').style.display = 'none'
    deleteAccount()
  }

  document.querySelector('#saveAccountButton').onclick = function() {
    document.querySelector('#amazonEmail').disabled = false
    saveAccount()
    // document.querySelector('#modalOverlay').style.visibility = 'hidden'
  }
}
