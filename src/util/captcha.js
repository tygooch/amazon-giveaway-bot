import { log } from './logger'
import main from '../index'

export function solveCaptcha() {
  if (!GM_getValue('twoCaptchaKey').length > 0) {
    log('No 2Captcha API key was provided. Captcha cannot be solved without a key.')
    document.querySelector('#stop').click()
  } else {
    log('Solving captcha...')
    let captchaImgUrl
    if (botFrame.contentDocument.querySelector('#auth-captcha-image')) {
      captchaImgUrl = botFrame.contentDocument.querySelector('#auth-captcha-image').src
    } else if (botFrame.contentDocument.querySelector('.a-text-center img')) {
      captchaImgUrl = botFrame.contentDocument.querySelector('.a-text-center img').src
    }
    getBase64Image(
      captchaImgUrl,
      res => {
        sendCaptcha(res)
      },
      err => {
        log(err)
      }
    )
  }
}

export function sendCaptcha(imgUrl) {
  let apiKey = GM_getValue('twoCaptchaKey')
  fetch('https://2captcha.com/in.php', {
    method: 'POST',
    body: JSON.stringify({
      key: apiKey,
      method: 'base64',
      body: imgUrl,
      header_acao: 1,
      json: 1,
      soft_id: 7493321,
    }),
  })
    .then(res => res.json())
    .then(data => {
      let captchaId = data.request
      let waitForDecodedCaptcha = setInterval(() => {
        fetch('https://2captcha.com/res.php?key=' + apiKey + '&action=get&header_acao=1&json=1&id=' + captchaId, {
          method: 'GET',
        })
          .then(res => res.json())
          .then(captchaAnswer => {
            if (captchaAnswer.status === 1) {
              clearInterval(waitForDecodedCaptcha)
              log('Captcha solved: ' + captchaAnswer.request)
              if (botFrame.contentDocument.querySelector('#image_captcha_input')) {
                botFrame.contentDocument.querySelector('#image_captcha_input').value = captchaAnswer.request
                botFrame.contentDocument.querySelector('.a-button-input').click()
              } else if (botFrame.contentDocument.querySelector('#captchacharacters')) {
                botFrame.contentDocument.querySelector('#captchacharacters').value = captchaAnswer.request
                botFrame.contentDocument.querySelector('.a-button-inner button').click()
              } else if (botFrame.contentDocument.querySelector('#auth-captcha-guess')) {
                if (botFrame.contentDocument.querySelector('#ap_password')) {
                  botFrame.contentDocument.querySelector('#ap_password').value = document.querySelector('#amazonPassword').value
                  botFrame.contentDocument.querySelector('#auth-captcha-guess').value = captchaAnswer.request
                  botFrame.contentDocument.querySelector('#signInSubmit').click()
                }
              }

              setTimeout(() => {
                if (botFrame.contentDocument.querySelector('#ga-image-captcha-validation-error')) {
                  fetch('https://2captcha.com/res.php?key=' + apiKey + '&action=reportbad&header_acao=1&json=1&id=' + captchaId, {
                    method: 'GET',
                  })
                  solveCaptcha()
                } else {
                  main()
                }
              }, 5000)
            } else if (captchaAnswer.request === 'ERROR_CAPTCHA_UNSOLVABLE') {
              log('Captcha unsolvable')
              clearInterval(decodeCaptcha)
            }
          })
      }, 5000)
    })
}
export function getBase64Image(url, onSuccess, onError) {
  let cors_api_host = 'cors-anywhere.herokuapp.com'
  let cors_api_url = 'https://' + cors_api_host + '/'
  let slice = [].slice
  let origin = window.location.protocol + '//' + window.location.host
  let xhr = new XMLHttpRequest()
  let open = XMLHttpRequest.prototype.open
  XMLHttpRequest.prototype.open = function() {
    let args = slice.call(arguments)
    let targetOrigin = /^https?:\/\/([^\/]+)/i.exec(args[1])
    if (targetOrigin && targetOrigin[0].toLowerCase() !== origin && targetOrigin[1] !== cors_api_host) {
      args[1] = cors_api_url + args[1]
    }
    return open.apply(this, args)
  }

  xhr.responseType = 'arraybuffer'
  xhr.open('GET', url)

  xhr.onload = function() {
    let base64, binary, bytes, mediaType

    bytes = new Uint8Array(xhr.response)
    binary = [].map
      .call(bytes, function(byte) {
        return String.fromCharCode(byte)
      })
      .join('')
    mediaType = xhr.getResponseHeader('content-type')
    base64 = [btoa(binary)].join('')
    onSuccess(base64)
  }
  xhr.onerror = onError
  xhr.send()
}
