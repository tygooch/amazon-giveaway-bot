import { log } from './logger'

export function claimWin(giveawayId, needUnfollow = false) {
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

  let clickButton = setInterval(() => {
    console.log(botFrame.contentWindow.location.href)
    if (!GM_getValue('running')) {
      return
    }
    if (botFrame.contentDocument.querySelector('.newAddress input')) {
      botFrame.contentDocument.querySelector('.newAddress input').click()
    }
    if (botFrame.contentDocument.querySelector('.addAddressBox')) {
      botFrame.contentDocument.querySelector('.addAddressBox').click()
    }
    if (botFrame.contentDocument.querySelector('.enterAddressFormTable')) {
      fillAddressForm()
    }
    if (botFrame.contentDocument.querySelector('input[name="ShipMyPrize"]')) {
      botFrame.contentDocument.querySelector('input[name="ShipMyPrize"]').click()
    }
    if (botFrame.contentDocument.querySelector('#continue-button input')) {
      botFrame.contentDocument.querySelector('#continue-button input').click()
    }

    if (botFrame.contentDocument.querySelector('input[name="ClaimMyPrize"]')) {
      botFrame.contentDocument.querySelector('input[name="ClaimMyPrize"]').click()
    }

    if (botFrame.contentDocument.querySelector('body').textContent.includes('You will receive a confirmation')) {
      clearInterval(clickButton)
      addToHistory(giveawayId)
      // nextGiveaway()
      // if (needUnfollow) {
      //   unfollowAuthors()
      // } else {
      botFrame.contentWindow.location.href = 'https://www.amazon.com/ga/giveaways'
      // }
    }
  }, 1000)
  // setTimeout(() => {
  //   clearInterval(clickButton)
  //   botFrame.contentWindow.location.href = 'https://www.amazon.com/ga/giveaways'
  // }, 30000)
}

// export function displayWinnings() {
//   let winnings = getWinnings()
//   console.log(winnings)
// }

export function displayWinnings() {
  let winHistory = GM_getValue('winHistory')
  let winnings = []

  winHistory.split('|').forEach(giveawayId => {
    console.log(giveawayId)
    if (giveawayId === 'undefined') {
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
        console.log(data)
        let winningsListItem = document.createElement('div')
        winningsListItem.innerHTML = `
          <div style="display: flex; flex-direction: column; background-color: #fff; width: 160px; height: 160px; justify-content: center; text-align: center; background: margin-left: 14px;"> 
            <div style="display: flex; justify-content: center;"><img src="${data.prize.imageUrl}" style="max-width: 80px;"/></div>
            <a href="/ga/p/${giveawayId}" style="text-decoration: none !important; color: #111;">${data.prize.name}</a>
          </div>
          `
        winningsListItem.onclick = e => {
          e.preventDefault()
          document.querySelector('#botFrame').contentWindow.location.href = winningsListItem.href
          document.querySelector('#showBotFrame').click()
        }

        document.querySelector('#winningsList').appendChild(winningsListItem.firstElementChild)

        winnings.push({
          text: data.prize.name + ' (' + data.prize.priceValue + ')',
          image: data.prize.imageUrl,
        })
      })
      .catch(err => {
        console.log(err)
      })
  })

  // return winnings
}
