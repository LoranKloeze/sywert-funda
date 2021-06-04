
/*
  Copyright 2021 - Loran Kloeze
  License: MIT
  https://github.com/LoranKloeze/sywert-chrome

*/

(() => {
  // Change if some or all profits move to charity or otherwise are no longer in possession of Sywert.
  // If by any chance this number becomes zero, this will generate division-by-zero errors. At this moment
  // we don't see this bug floating to the top in the short term.
  const SYWERT_RATE = 9000000

  // Only activate the extension if Funda search results are in the DOM
  const searchContainer = document.getElementsByClassName('search-content-output')[0]
  if (searchContainer) {
    document.body.appendChild(createUi())
    const observer = new window.MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        if (mutation.target.classList.contains('search-content-output')) {
          setupPrices()
          syncConvertStatus()
        }
      })
    })
    observer.observe(searchContainer, { attributes: false, childList: true, subtree: true, characterData: true })

    setupPrices()
    syncConvertStatus()
    const switchOutline = document.querySelector('.switch-outline')
    if (getConvertMode() === 'sywert') {
      switchOutline.classList.add('on')
    } else {
      switchOutline.classList.remove('on')
    }
  }

  //  Create a container with nice toggler to switch between Euro and Sywert
  function createUi () {
    const sywertContainer = document.createElement('div')
    sywertContainer.id = 'sywert-container'

    const introP = document.createElement('p')
    introP.innerText = 'Sywert'
    sywertContainer.appendChild(introP)

    const switchOutline = document.createElement('div')
    switchOutline.className = 'switch-outline'
    sywertContainer.appendChild(switchOutline)
    switchOutline.addEventListener('click', () => {
      switchOutline.classList.toggle('on')
      const mode = switchOutline.classList.contains('on') ? 'sywert' : 'euro'
      setConvertMode(mode)
      syncConvertStatus()
    })

    const switchToggler = document.createElement('div')
    switchToggler.className = 'switch-toggler'
    switchOutline.appendChild(switchToggler)
    return sywertContainer
  }

  // Save Euro and Sywert modes in the dataset of the price <span>
  function setupPrices () {
    const priceEls = document.querySelectorAll('.search-result-price')
    for (let i = 0; i < priceEls.length; i++) {
      const priceEl = priceEls[i]

      // Make sure we not setting up already set up elements
      if (priceEl.dataset.sywertPrice) {
        return
      }

      priceEl.dataset.euroPrice = priceEl.innerText

      const euroPrice = parseInt(priceEl.innerText.replace(/\D/g, ''))
      if (euroPrice > 0) {
        const sywertPrice = Math.round(euroPrice / SYWERT_RATE * 1000) / 1000
        const qualifier = priceEl.innerText.match(/\d+\s(.+)/)[1]
        const newText = `${sywertPrice}`.replace('.', ',') + ' Sywert ' + qualifier
        priceEl.dataset.sywertPrice = newText
      } else {
      // Not a number, just show the original text
        priceEl.dataset.sywertPrice = priceEl.dataset.euroPrice
      }
    }
  }

  // Display Euro or Sywert according to convert mode
  function syncConvertStatus () {
    const priceEls = document.getElementsByClassName('search-result-price')
    for (let i = 0; i < priceEls.length; i++) {
      const priceEl = priceEls[i]
      if (getConvertMode() === 'sywert') {
        priceEl.innerText = priceEl.dataset.sywertPrice
      } else {
        priceEl.innerText = priceEl.dataset.euroPrice
      }
    }
  }

  // Save Euro/Sywert mode to persistent storage
  function setConvertMode (mode) {
    window.localStorage.setItem('sywertConvertMode', mode)
  }

  // Retrieve Euro/Sywert mode from persistent storage
  function getConvertMode () {
    return window.localStorage.getItem('sywertConvertMode')
  }
})()
