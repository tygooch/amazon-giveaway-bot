import { log } from './logger'
import { updateUI, addToHistory } from './giveaway'
import { fillAddressForm } from './address'

export function claimWin(giveawayId, needUnfollow = false) {
  notifyWin(giveawayId)

  let clickButton = setInterval(() => {
    console.log(botFrame.contentWindow.location.href)
    if (!GM_getValue('running')) {
      return
    } else if (botFrame.contentDocument.querySelector('.newAddress input')) {
      log('click New Address')
      botFrame.contentDocument.querySelector('.newAddress input').click()
    } else if (botFrame.contentDocument.querySelector('.addAddressBox')) {
      log('click add address')
      botFrame.contentDocument.querySelector('.addAddressBox').click()
    } else if (botFrame.contentDocument.querySelector('.enterAddressFormTable')) {
      log('filling out address form')
      fillAddressForm()
    } else if (botFrame.contentDocument.querySelector('input[name="ShipMyPrize"]')) {
      log('click ShipMyPrize')
      botFrame.contentDocument.querySelector('input[name="ShipMyPrize"]').click()
    } else if (botFrame.contentDocument.querySelector('#continue-button input')) {
      log('click continue-button')
      botFrame.contentDocument.querySelector('#continue-button input').click()
    } else if (botFrame.contentDocument.querySelector('input[name="ClaimMyPrize"]')) {
      log('click ClaimMyPrize')
      botFrame.contentDocument.querySelector('input[name="ClaimMyPrize"]').click()
    } else if (botFrame.contentDocument.querySelector('body').textContent.includes('You will receive a confirmation')) {
      log('Giveaway claimed!')
      clearInterval(clickButton)
      recordWin(giveawayId)
      addToHistory(giveawayId)
      botFrame.contentWindow.location.href = 'https://www.amazon.com/ga/giveaways'
      // nextGiveaway()
      // if (needUnfollow) {
      //   unfollowAuthors()
      // } else {
      // }
    } else if (botFrame.contentDocument.querySelector('body').textContent.includes('we need your tax info')) {
      clearInterval(clickButton)
      log('Tax info required to claim', 'error')
      botFrame.contentWindow.location.href = 'https://www.amazon.com/ga/giveaways'
    }
  }, 2000)
  // setTimeout(() => {
  //   clearInterval(clickButton)
  //   botFrame.contentWindow.location.href = 'https://www.amazon.com/ga/giveaways'
  // }, 30000)
}

export function notifyWin(giveawayId) {
  log('Giveaway won!', 'success')
  let audio = new Audio('https://www.myinstants.com/media/sounds/cash-register-sound-fx_HgrEcyp.mp3')
  audio.play()
  // botFrame.contentWindow.location.href = 'https://www.amazon.com/ga/p/' + giveawayId
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
    })
    .catch(err => {
      console.log(err)
    })
}

export function recordWin(giveawayId) {
  if (!giveawayId) return

  let wins = GM_getValue('totalWins')
  GM_setValue('totalWins', wins + 1)
  let currentSessionWins = GM_getValue('currentSessionWins')
  GM_setValue('currentSessionWins', currentSessionWins + 1)
  updateUI()

  let winHistory = GM_getValue('winHistory')
  if (!winHistory) {
    GM_setValue('winHistory', '|' + giveawayId)
  } else {
    GM_setValue('winHistory', winHistory + '|' + giveawayId)
  }
  winHistory = GM_getValue('winHistory')
  if (winHistory.length > 100000) {
    winHistory = winHistory.substr(winHistory.length - 100000)
  }
  GM_setValue('winHistory', winHistory)

  saveWin(giveawayId)
}

// export function displayWinnings() {
//   let winnings = getWinnings()
//   console.log(winnings)
// }

export function saveWin(giveawayId, isOldWin = false) {
  if (!giveawayId || giveawayId === '' || giveawayId.includes('?')) {
    return
  }
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
      let winning = {
        giveawayId: giveawayId,
        name: data.prize.name,
        imageUrl: data.prize.imageUrl,
        priceValue: data.prize.priceValue,
        type: data.prize.type,
        endDateTime: isOldWin ? new Date(data.endDateTime).toLocaleString() : new Date().toLocaleString(),
        account: isOldWin ? 'No Account Info' : GM_getValue('currentAccount'),
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
      updateStats()
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
}

export function displayWinnings() {
  let allWinnings = GM_getValue('allWinnings')
  if (document.querySelector('#winningsListContainer').childElementCount !== 0) {
    return
  }

  document.querySelector('#winningsHeaderCount').innerText = GM_getValue('totalWins') + ' Giveaways Won'

  if (!allWinnings) {
    let winHistory = GM_getValue('winHistory')
    if (!winHistory) {
      return
    }
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
        saveWin(winHistory.pop(), true)
      } else {
        clearInterval(convertWinHistory)
      }
    }, 500)
  } else {
    JSON.parse(allWinnings)
      .sort((a, b) => new Date(a.endDateTime) - new Date(b.endDateTime))
      .forEach(winning => {
        getListItem(winning)
      })
    updateStats()
  }
}

export function updateStats() {
  let totalValue = 0
  JSON.parse(GM_getValue('allWinnings')).forEach(winning => {
    totalValue += parseFloat(winning.priceValue.slice(1))
    document.querySelector('#winningsHeaderValue').innerText = '$' + Math.round(totalValue * 100) / 100 + ' Total Value'
  })
}
