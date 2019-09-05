import { log } from './logger'
import { unfollowAuthors } from './unfollow'
import { signIn, nextAccount } from './account'

let giveaways = []
let offset = 0
let historyKey
let csrfToken

export function initGiveaways() {
  if (!GM_getValue('lifetimeEntries')) {
    GM_setValue('lifetimeEntries', 0)
  }
  document.querySelector('#lifetimeEntriesValue').innerHTML = GM_getValue('lifetimeEntries')
}

export function getCsrf() {
  return csrfToken
}

export function getGiveaways() {
  let allowedGiveaways = []
  fetch('https://www.amazon.com/gax/-/lex/api/v1/giveaways?offset=' + offset * 24, {
    credentials: 'include',
    referrer: botFrame.contentWindow.location.href,
    referrerPolicy: 'no-referrer-when-downgrade',
    body: null,
    method: 'GET',
    mode: 'cors',
  })
    .then(res => res.json())
    .then(data => {
      if (!GM_getValue('running')) {
        return
      }
      offset += 1
      if (
        document.querySelector('#logContent').childElementCount !== 0 &&
        document.querySelector('#logContent').lastElementChild.textContent.includes('Searching Giveaways')
      ) {
        document.querySelector('#logContent').lastElementChild.lastElementChild.textContent =
          'Searching Giveaways... (page ' + offset + '/' + Math.ceil(parseFloat(data.totalGiveaways / 24)) + ')'
      } else {
        log('Searching Giveaways... (page ' + offset + '/' + Math.ceil(parseFloat(data.totalGiveaways / 24)) + ')')
      }
      historyKey = GM_getValue('currentAccount') + 'history'
      let visited = GM_getValue(historyKey)
      data.giveaways.forEach(item => {
        let canAdd = !visited || !visited.includes(item.id)
        if (item.title.includes('Kindle Edition') && GM_getValue('disableKindle')) {
          canAdd = false
        }
        if (item.participationRequirement) {
          if (item.participationRequirement.includes('FOLLOW') && GM_getValue('disableFollow')) {
            canAdd = false
          }
        }
        if (canAdd) {
          allowedGiveaways.push('https://www.amazon.com/ga/p/' + item.id)
        }
      })
      if (allowedGiveaways.length > 0) {
        giveaways = allowedGiveaways
        nextGiveaway()
      } else {
        if (offset * 24 < data.totalGiveaways) {
          getGiveaways()
        } else {
          log('No more active giveaways to enter for this account.')
          offset = 0
          nextAccount()
        }
      }
    })
}

export function nextGiveaway() {
  if (!GM_getValue('running')) {
    return
  } else if (botFrame.contentWindow.location.href.includes('/ga/p')) {
    console.log(botFrame.contentWindow.location.href)
    fetchGiveaway(giveaways[giveaways.length - 1])
  } else if (giveaways && giveaways.length > 0) {
    let next = giveaways.pop()
    fetchGiveaway(next)
  } else {
    log('Searching Giveaways...')
    getGiveaways()
  }
}

export function fetchGiveaway(url) {
  if (!GM_getValue('running')) {
    return
  }
  log('Loading ', 'link', url)
  if (!botFrame.contentWindow.P.pageContext) {
    botFrame.contentWindow.location = 'https://www.amazon.com/ga/giveaways'
    return
  }
  csrfToken = botFrame.contentWindow.P.pageContext.csrfToken
  let giveawayId = url.split('/p/')[1].split('?')[0]

  fetch(`https://www.amazon.com/gax/-/pex/api/v1/giveaway/${giveawayId}/participation`, {
    credentials: 'include',
    headers: {
      accept: 'application/json, text/plain, */*',
      'accept-language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7',
      'content-type': 'application/json;charset=UTF-8',
      'x-amzn-csrf': csrfToken,
    },
    referrer: url,
    referrerPolicy: 'no-referrer-when-downgrade',
    body: null,
    method: 'GET',
    mode: 'cors',
  })
    .then(res => res.json())
    .then(data => {
      console.log(data)
      if (data.loginUrl) {
        log('Sign in needed')

        botFrame.contentWindow.location = data.loginUrl
        signIn()
        return
      } else if (data.issue) {
        console.log(data)
        console.log(data.issue)
        log('Giveaway closed', 'error')
        nextGiveaway()
        return
      } else if (data.success && data.success.status !== 'notParticipated') {
        console.log(data.success.status)
        addToHistory(giveawayId)
        log('Already participated (' + data.success.status + ')')
        nextGiveaway()
        return
      } else if (data.success.nextUserAction) {
        let needUnfollow = data.success.nextUserAction.name === 'followAuthor'
        fetch(`https://www.amazon.com/gax/-/pex/api/v1/giveaway/${giveawayId}/participation/nextAction`, {
          credentials: 'include',
          headers: {
            accept: 'application/json, text/plain, */*',
            'accept-language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7',
            'content-type': 'application/json;charset=UTF-8',
            'x-amzn-csrf': csrfToken,
          },
          referrer: url,
          referrerPolicy: 'no-referrer-when-downgrade',
          body: JSON.stringify({ submission: { name: data.success.nextUserAction.name } }),
          method: 'PUT',
          mode: 'cors',
        })
          .then(res => res.json())
          .then(data => {
            enterGiveaway(giveawayId, `{"encryptedState":"${data.success.encryptedState}"}`, needUnfollow)
          })
          .catch(err => {
            log(err, 'error')
          })
      } else {
        enterGiveaway(giveawayId)
      }
    })
    .catch(err => {
      console.log('here')
      log(err, 'error')
      fetchGiveaway(url)
    })
}

export function enterGiveaway(giveawayId, payload = '{}', needUnfollow = false) {
  if (!GM_getValue('running')) {
    return
  }
  log('Status: ' + 'submitting entry')
  fetch(`https://www.amazon.com/gax/-/pex/api/v1/giveaway/${giveawayId}/participation`, {
    credentials: 'include',
    headers: {
      accept: 'application/json, text/plain, */*',
      'accept-language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7',
      'content-type': 'application/json;charset=UTF-8',
      'x-amzn-csrf': csrfToken,
    },
    referrer: `https://www.amazon.com/ga/p/${giveawayId}`,
    referrerPolicy: 'no-referrer-when-downgrade',
    body: payload,
    method: 'POST',
    mode: 'cors',
  })
    .then(res => res.json())
    .then(data => {
      console.log(data.success.status)
      let logItems = Array.from(document.querySelector('#logContent').childNodes).filter(el => el.textContent.includes('Status: '))
      logItems[logItems.length - 1].lastElementChild.textContent = 'Status: ' + data.success.status
      let newHistory = GM_getValue('logHistory').split('|')
      newHistory[newHistory.length - 1] = newHistory[newHistory.length - 1].replace('submitting entry', data.success.status)
      GM_setValue('logHistory', newHistory.join('|'))

      updateEntryCount()

      if (data.success.status !== 'lucky' && data.success.status !== 'won') {
        addToHistory(giveawayId)
        if (needUnfollow) {
          unfollowAuthors()
        } else {
          nextGiveaway()
        }
      } else {
        botFrame.contentWindow.location = 'https://www.amazon.com/ga/won/' + giveawayId
      }
    })
    .catch(err => {
      console.log('ERROR')
      log(err, 'error')
      nextGiveaway()
    })
}

export function addToHistory(giveawayId) {
  let historyKey = GM_getValue('currentAccount') + 'history'
  let visited = GM_getValue(historyKey, '')
  visited += '|' + giveawayId
  if (visited.length > 100000) {
    visited = visited.slice(visited.length - 100000)
  }
  GM_setValue(historyKey, visited)
}

export function updateUI() {
  if (!GM_getValue('running')) {
    return
  }
  if (GM_getValue('currentSessionEntries') > 0) {
    document.querySelector('#currentSessionEntries').textContent = '(' + GM_getValue('currentSessionEntries') + ' this run)'
  }
  if (GM_getValue('currentSessionWins') > 0) {
    document.querySelector('#currentSessionWins').textContent = '(' + GM_getValue('currentSessionWins') + ' this run)'
  }
  document.querySelector('#lifetimeEntriesValue').textContent = GM_getValue('lifetimeEntries')
  document.querySelector('#totalWinsValue').textContent = GM_getValue('totalWins')
}

export function updateEntryCount() {
  let lifetimeEntries = GM_getValue('lifetimeEntries')
  GM_setValue('lifetimeEntries', lifetimeEntries + 1)
  let currentSessionEntries = GM_getValue('currentSessionEntries')
  GM_setValue('currentSessionEntries', currentSessionEntries + 1)
  updateUI()
}
