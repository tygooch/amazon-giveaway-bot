export function getAddress() {
  if (!GM_getValue(document.querySelector('#amazonEmail').value + 'shippingAddress')) {
    return
  }
  Object.entries(JSON.parse(GM_getValue(document.querySelector('#amazonEmail').value + 'shippingAddress'))).forEach(el => {
    document.querySelector('#' + el[0]).value = el[1]
  })
}

export function saveAddress() {
  let address = {}
  document.querySelectorAll('#addressForm input').forEach(el => {
    address[el.id] = el.value
  })
  GM_setValue(document.querySelector('#amazonEmail').value + 'shippingAddress', JSON.stringify(address))
}

export function fillAddressForm() {
  let address = JSON.parse(GM_getValue(document.querySelector('#amazonEmail').value + 'shippingAddress'))
  botFrame.contentDocument.querySelector('#enterAddressFullName').value = address.fullName
  botFrame.contentDocument.querySelector('#enterAddressAddressLine1').value = address.street1
  botFrame.contentDocument.querySelector('#enterAddressAddressLine2').value = address.street2
  botFrame.contentDocument.querySelector('#enterAddressCity').value = address.city
  botFrame.contentDocument.querySelector('#enterAddressStateOrRegion').value = address.state
  botFrame.contentDocument.querySelector('#enterAddressPostalCode').value = address.zip
  botFrame.contentDocument.querySelector('#enterAddressPhoneNumber').value = address.phone
  botFrame.contentDocument.querySelector('#addAddressButton').click()
}
