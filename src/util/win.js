import { log } from './logger'
import { updateUI, addToHistory } from './giveaway'
import { fillAddressForm } from './address'

export function claimWin(giveawayId) {
  if (!GM_getValue('running')) {
    return
  } else if (GM_getValue('winHistory') && GM_getValue('winHistory').includes(giveawayId)) {
    botFrame.contentWindow.location.href = 'https://www.amazon.com/ga/giveaways'
  } else {
    if (botFrame.contentDocument.querySelector('.newAddress input')) {
      // log('click New Address')
      botFrame.contentDocument.querySelector('.newAddress input').click()
    } else if (botFrame.contentDocument.querySelector('.addAddressBox')) {
      // log('click add address')
      botFrame.contentDocument.querySelector('.addAddressBox').click()
    } else if (botFrame.contentDocument.querySelector('.enterAddressFormTable')) {
      // log('filling out address form')
    } else if (botFrame.contentDocument.querySelector('input[name="ShipMyPrize"]')) {
      // log('click ShipMyPrize')
      botFrame.contentDocument.querySelector('input[name="ShipMyPrize"]').click()
    } else if (botFrame.contentDocument.querySelector('#continue-button input')) {
      // log('click continue-button')
      botFrame.contentDocument.querySelector('#continue-button input').click()
    } else if (botFrame.contentDocument.querySelector('input[name="ClaimMyPrize"]')) {
      // log('click ClaimMyPrize')
      botFrame.contentDocument.querySelector('input[name="ClaimMyPrize"]').click()
    } else if (botFrame.contentDocument.querySelector('body') && botFrame.contentDocument.querySelector('body').textContent.includes('need your tax info')) {
      log('Tax info required to claim prize.', 'error')
      saveWin(giveawayId, { requiresTaxInfo: true })
    } else if (
      botFrame.contentDocument.querySelector('#redemption-success-message') ||
      (botFrame.contentDocument.body && botFrame.contentDocument.body.textContent.includes('you won!'))
    ) {
      log('Giveaway claimed!')
      saveWin(giveawayId)
    }
    setTimeout(() => {
      claimWin(giveawayId)
    }, 2500)
  }
}

export function saveWin(giveawayId, flags = { isOldWin: false, requiresTaxInfo: false }) {
  if (!giveawayId || giveawayId === '' || giveawayId.includes('?')) {
    return
  }
  addToHistory(giveawayId)
  let winHistory = GM_getValue('winHistory')
  if (!winHistory) {
    GM_setValue('winHistory', '|' + giveawayId)
  } else {
    if (winHistory.includes(giveawayId)) {
      return
    }
    GM_setValue('winHistory', winHistory + '|' + giveawayId)
  }

  winHistory = GM_getValue('winHistory')
  if (winHistory.length > 100000) {
    winHistory = winHistory.substr(winHistory.length - 100000)
  }
  GM_setValue('winHistory', winHistory)

  fetch('https://www.amazon.com/gax/-/pex/api/v1/giveaway/' + giveawayId, {
    credentials: 'include',
    headers: {
      'x-amzn-csrf': window.csrfToken,
    },
    body: null,
    method: 'GET',
    mode: 'cors',
  })
    .then(res => res.json())
    .then(data => {
      console.log(data)
      GM_notification({
        text: data.prize.name + ' (' + data.prize.priceValue + ')',
        title: 'Giveaway Won!',
        image: data.prize.imageUrl,
        highlight: true,
        timeout: 0,
        onclick: () => {
          window.focus()
          botFrame.contentWindow.location.href = 'https://www.amazon.com/ga/p/' + giveawayId
          document.querySelector('#showBotFrame').click()
        },
      })

      let winning = {
        giveawayId: giveawayId,
        name: data.prize.name,
        imageUrl: data.prize.imageUrl,
        priceValue: data.prize.priceValue,
        type: data.prize.type,
        endDateTime: flags.isOldWin ? new Date(data.endDateTime).toLocaleString() : new Date().toLocaleString(),
        account: flags.isOldWin ? 'No Account Info' : GM_getValue('currentAccount'),
      }

      if (flags.requiresTaxInfo) {
        winning.requiresTaxInfo = true
      }

      let allWinnings = GM_getValue('allWinnings')
      if (!allWinnings) {
        allWinnings = []
      } else {
        allWinnings = JSON.parse(allWinnings)
      }
      allWinnings.push(winning)
      GM_setValue('allWinnings', JSON.stringify(allWinnings))

      getListItem(winning)
      GM_setValue('totalWins', allWinnings.length)
      let currentSessionWins = GM_getValue('currentSessionWins')
      GM_setValue('currentSessionWins', currentSessionWins + 1)
    })
}

export function getListItem(winning) {
  let listItem = document.createElement('div')
  listItem.innerHTML = `
    <li class="a-section a-spacing-base listing-item">
      <div class="standard-card">
        <a class="a-link-normal item-link" href="/ga/p/${winning.giveawayId}">
        <div class="a-section a-spacing-none">
          <span class="a-text-bold a-text-center ellipse-1-line a-size-medium">
            ${winning.name}
          </span>
        </div>
        <div class="a-section a-spacing-base a-text-center"><span class="a-size-medium">${winning.priceValue}</span></div>
        <div class="a-section a-spacing-base a-text-center prize-image">
          <img class="a-dynamic-image" src="${winning.imageUrl}" alt="${winning.name}">
        </div>
        <div class="a-section a-spacing-none a-text-center"><span class="a-size-medium">${winning.endDateTime}</span></div>
        <div class="a-section a-spacing-none a-text-center"><span class="a-size-medium">${winning.account}</span></div>
          ${
            winning.requiresTaxInfo
              ? '<div class="a-section a-spacing-none a-text-center" style="margin-top:10px;"><span class="error a-size-medium a-text-bold">Tax Info Required!</span></div>'
              : ''
          }
        </a>
      </div>
    </li>
    `
  listItem.querySelector('a').onclick = e => {
    e.preventDefault()
    document.querySelector('#botFrame').contentWindow.location.href = `https://www.amazon.com/ga/p/${winning.giveawayId}`
    document.querySelector('#showBotFrame').click()
  }

  document.querySelector('#winningsListContainer').prepend(listItem.firstElementChild)
  updateStats()
}

export function displayWinnings() {
  let allWinnings = GM_getValue('allWinnings')

  document.querySelector('#winningsHeaderCount').innerText = GM_getValue('totalWins') + ' Giveaways Won'

  if (!allWinnings && GM_getValue('winHistory')) {
    convertWinHistory()
  } else if (allWinnings) {
    JSON.parse(allWinnings)
      .sort((a, b) => new Date(a.endDateTime) - new Date(b.endDateTime))
      .forEach(winning => {
        getListItem(winning)
      })
    updateStats()
  }
}

export function updateStats() {
  updateUI()
  document.querySelector('#winningsHeaderCount').innerText = GM_getValue('totalWins') + ' Giveaways Won'
  let totalValue = 0
  if (GM_getValue('allWinnings')) {
    JSON.parse(GM_getValue('allWinnings')).forEach(winning => {
      totalValue += parseFloat(winning.priceValue.slice(1))
      document.querySelector('#winningsHeaderValue').innerText = '$' + Math.round(totalValue * 100) / 100 + ' Total Value'
    })
  }
}

export function convertWinHistory() {
  let winHistory = GM_getValue('winHistory')
  if (!winHistory) return

  winHistory = winHistory
    .split('|')
    .filter(el => el !== 'undefined' && el !== '' && !el.includes('?'))
    .filter((el, idx, self) => self.indexOf(el) === idx)
    .join('|')
  GM_setValue('winHistory', winHistory)

  winHistory = winHistory.split('|').reverse()
  let convertWinHistory = setInterval(() => {
    console.log(winHistory)
    if (winHistory.length > 0) {
      saveWin(winHistory.pop(), { isOldWin: true })
    } else {
      clearInterval(convertWinHistory)
    }
  }, 500)
}

export function initWinnings() {
  if (!GM_getValue('totalWins')) {
    GM_setValue('totalWins', 0)
  }
  if (GM_getValue('allWinnings')) {
    let allWinnings = JSON.parse(GM_getValue('allWinnings'))
    GM_setValue('totalWins', allWinnings.length)
  }

  document.querySelector('#totalWinsValue').innerHTML = GM_getValue('totalWins')

  displayWinnings()
}
