import { log } from './logger'

export function unfollowAuthors() {
  log('Unfollowing author...')
  botFrame.contentWindow.location.href = 'https://www.amazon.com/preferences/subscriptions/your-subscriptions/current-subscriptions'

  let unfollowAll = setInterval(() => {
    if (
      (botFrame.contentDocument.querySelector('body').textContent &&
        botFrame.contentDocument.querySelector('body').textContent.includes('No current subscriptions')) ||
      botFrame.contentDocument.querySelector('body').textContent.includes("We couldn't find that page")
    ) {
      clearInterval(unfollowAll)
      clearTimeout(timeout)
      botFrame.contentWindow.location.replace('https://www.amazon.com/ga/giveaways')
    }
    if (botFrame.contentDocument.querySelector('.a-switch-row.a-active input')) {
      botFrame.contentDocument.querySelectorAll('.a-switch-row.a-active input').forEach(el => el.click())
      botFrame.contentWindow.location.reload()
    }
  }, 2000)
  let timeout = setTimeout(() => {
    if (unfollowAll) {
      clearInterval(unfollowAll)
    }
    botFrame.contentWindow.location.replace('https://www.amazon.com/ga/giveaways')
  }, 20000)
}
