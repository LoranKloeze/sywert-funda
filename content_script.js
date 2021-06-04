
/*
  Copyright 2021 - Loran Kloeze
  License: MIT
  https://github.com/LoranKloeze/sywert-chrome

*/

/* global chrome */
const scriptEl = document.createElement('script')
scriptEl.src = chrome.runtime.getURL('main.js')
scriptEl.onload = function () {
  this.remove()
};
(document.head || document.documentElement).appendChild(scriptEl)

const cssEl = document.createElement('link')
cssEl.type = 'text/css'
cssEl.rel = 'stylesheet'
cssEl.media = 'all'
cssEl.href = chrome.runtime.getURL('style.css');
(document.head || document.documentElement).appendChild(cssEl)
