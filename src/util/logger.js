export function restoreLog() {
  let logHistory = GM_getValue('logHistory')
  if (logHistory !== '') {
    document.querySelector('#clearLog').style.display = 'flex'
    logHistory.split('|').forEach(el => {
      let node = document.createElement('div')
      node.innerHTML = el
      document.querySelector('#logContent').appendChild(node.firstChild)
    })
    document.querySelectorAll('#logContent a').forEach(el => {
      el.onclick = e => {
        e.preventDefault()
        document.querySelector('#botFrame').contentWindow.location.href = el.href
        document.querySelector('#showBotFrame').click()
      }
    })
    document.querySelector('#logContent').lastElementChild.scrollIntoView()
  }
}

export function log(str, style = 'info', url) {
  document.querySelector('#clearLog').style.display = 'flex'
  console.log(str)
  if (str.toString().includes('TypeError')) {
    str = 'Entry not allowed'
  }
  let date = new Date().toString().split(' ')
  date = date
    .slice(1, 3)
    .concat(date[4])
    .join(' ')

  let logTime = document.createElement('span')
  logTime.textContent = '[' + date + ']'
  logTime.style.color = '#bbb'
  logTime.style.marginRight = '5px'

  let logInfo = document.createElement('span')
  logInfo.style.maxWidth = '465px'
  logInfo.style.wordWrap = 'break-word'
  logInfo.textContent = str.toString()
  if (style === 'success') {
    logInfo.style.color = 'green'
    logInfo.style.fontWeight = 'bold'
  }
  if (style === 'error') {
    logInfo.style.color = 'red'
    logInfo.style.fontWeight = 'bold'
  }
  if (style === 'link') {
    let link = document.createElement('a')
    link.textContent = url
    link.href = url
    link.style.marginLeft = '5px'
    logInfo.appendChild(link)
    link.onclick = e => {
      e.preventDefault()
      botFrame.contentWindow.location.href = link.href
      document.querySelector('#showBotFrame').click()
    }
  }

  let logItem = document.createElement('div')
  logItem.style.display = 'flex'
  logItem.appendChild(logTime)
  logItem.appendChild(logInfo)
  if (str === '') {
    logItem = document.createElement('div')
    logItem.appendChild(document.createElement('br'))
  }
  if (document.querySelector('#logContent').childElementCount > 1000) {
    document.querySelector('#logContent').firstElementChild.remove()
  }
  document.querySelector('#logContent').appendChild(logItem)
  if (autoscroll) {
    logItem.scrollIntoView()
  }

  let logHistory = GM_getValue('logHistory')
  if (!logHistory) {
    GM_setValue('logHistory', logItem.outerHTML)
  } else {
    if (logHistory.split('|').length > 1000) {
      logHistory = logHistory
        .split('|')
        .slice(1)
        .join('|')
    }
    GM_setValue('logHistory', logHistory + '|' + logItem.outerHTML)
  }
}
