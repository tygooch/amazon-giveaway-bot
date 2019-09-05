export function restoreLog() {
  let logHistory = GM_getValue('logHistory')
  if (logHistory) {
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
  if (style !== 'link') console.log(str)
  let date = new Date().toString().split(' ')[4]

  let logTime = document.createElement('span')
  logTime.textContent = date
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
    logInfo.style.color = '#D8000C'
  }
  if (style === 'link') {
    console.log(url)
    let link = document.createElement('a')
    link.textContent = url.split('/ga/p/')[1]
    link.href = url
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
  if (window.autoscroll) {
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

export function initLog() {
  window.autoscroll = true

  document.querySelector('#showLog').addEventListener('click', () => {
    if (document.querySelector('#logContent').childElementCount === 0) {
      restoreLog()
    }
  })

  document.querySelector('#clearLog').onclick = function() {
    GM_setValue('logHistory', '')
    document.querySelectorAll('#logContent div').forEach(el => el.remove())
    document.querySelector('#autoscroll').style.display = 'none'
    document.querySelector('#clearLog').style.display = 'none'
    window.autoscroll = true
  }

  document.querySelector('#logContent').onscroll = function(e) {
    if (document.querySelector('#logContent').innerHTML === '') {
      this.oldScroll = this.scrollTop
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
}
