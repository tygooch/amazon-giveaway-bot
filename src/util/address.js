export function getAddress() {
  document.querySelector('#accountAddressContainer').style.display = 'flex'
  if (
    !GM_getValue('accounts') ||
    !JSON.parse(GM_getValue('accounts'))[document.querySelector('#accountDropdown').value] ||
    !JSON.parse(GM_getValue('accounts'))[document.querySelector('#accountDropdown').value].address
  ) {
    return
  }
  document.querySelector('#accountAddress').style.display = 'flex'
  Object.entries(JSON.parse(GM_getValue('accounts'))[document.querySelector('#accountDropdown').value].address).forEach(el => {
    document.querySelector('#accountAddress').querySelector('#' + el[0] + 'Span').textContent = el[1]
    document.querySelector('#addressForm').querySelector('#' + el[0]).value = el[1]
  })
  document.querySelector('#accountAddress').querySelector('#citySpan').textContent += ', '
  document.querySelector('#accountAddress').querySelector('#stateSpan').textContent += ' '
}

export function saveAddress() {
  let address = {}
  document.querySelectorAll('#addressForm input').forEach(el => {
    address[el.id] = el.value
  })
  let accounts = JSON.parse(GM_getValue('accounts'))
  accounts[document.querySelector('#accountDropdown').value].address = address
  GM_setValue('accounts', JSON.stringify(accounts))
  getAddress()
}

export function fillAddressForm() {
  console.log('Entering address')
  let address = JSON.parse(GM_getValue('accounts'))[document.querySelector('#accountDropdown').value].address
  botFrame.contentDocument.querySelector('#enterAddressFullName').value = address.fullName
  botFrame.contentDocument.querySelector('#enterAddressAddressLine1').value = address.street1
  botFrame.contentDocument.querySelector('#enterAddressAddressLine2').value = address.street2
  botFrame.contentDocument.querySelector('#enterAddressCity').value = address.city
  botFrame.contentDocument.querySelector('#enterAddressStateOrRegion').value = address.state
  botFrame.contentDocument.querySelector('#enterAddressPostalCode').value = address.zip
  botFrame.contentDocument.querySelector('#enterAddressPhoneNumber').value = address.phone
  botFrame.contentDocument.querySelector('#addAddressButton').click()
}
export function initAddress() {
  document.querySelector('#editAddress').onclick = function() {
    document.querySelector('#modalOverlay').onclick = document.querySelector('#cancelAddressButton').onclick
    document.querySelector('#addressForm').onclick = e => {
      e.stopPropagation()
    }
    document.querySelector('#modalOverlay').style.visibility = 'visible'
    document.querySelector('#addressModal').style.display = 'flex'
    setTimeout(() => {
      document.querySelector('#fullName').focus()
    }, 500)
  }

  document.querySelector('#cancelAddressButton').onclick = function() {
    document.querySelector('#modalOverlay').style.visibility = 'hidden'
    document.querySelector('#addressModal').style.display = 'none'
  }
  document.querySelector('#saveAddressButton').onclick = function() {
    let missingFields = []
    document.querySelectorAll('#addressModal .required').forEach(el => {
      if (el.value === '') {
        missingFields.push(el.labels[0].textContent)
      }
    })
    if (missingFields.length > 0) {
      alert('Missing required values for:\n' + missingFields.join('\n') + '\n\nPlease provide them before saving.')
      return
    }
    document.querySelector('#addressModal').style.display = 'none'
    saveAddress()
    document.querySelector('#modalOverlay').style.visibility = 'hidden'
  }
}
