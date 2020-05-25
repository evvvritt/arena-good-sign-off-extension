'use strict';

let total, latest;
const apiURL = 'https://api.are.na/v2';
const signOff = document.getElementById('signoff');
const randomBtn = document.getElementById('random-btn');
const latestBtn = document.getElementById('latest-btn');

// update sign off text
function setSignOff (block) {
  signOff.style.color = ''
  signOff.style.borderColor = ''
  signOff.innerText = block.content
}

// loading state 
function loading (loading = true) {
  document.body.style.cursor = loading ? 'wait' : 'default'
  randomBtn.disabled = loading
  signOff.style.opacity = loading ? '0.5' : '1'
  signOff.style.cursor = loading ? 'wait' : 'pointer'
}

function error (msg = 'Oops! Try again :$,') {
  signOff.style.color = 'red'
  signOff.style.borderColor = 'red'
  signOff.innerText = msg
}

// get block/sign-off
async function fetchSignOff (page = 1) {
  // page = block number
  return fetch(apiURL + `/channels/good-sign-offs?per=1&page=${page}`)
    .then(resp => resp.json())
    .then(data => {
      total = data.length // total blocks in channel
      const block = data.contents[0]
      if (!block) {
        error()
        return
      }
      return block
    })
}

// get random sign off
async function fetchRandomSignOff () {
  const randomPage = getRandomInt(total - 1) + 1
  const block = await fetchSignOff(randomPage)
  if (block.class !== 'Text') return fetchRandomSignOff() // retry if not Text block
  return block
}

// on load
document.addEventListener('DOMContentLoaded', function () {
  // get latest
  fetchSignOff().then(async function () {
    latest = await fetchSignOff(total) // latest = last page/block
    setSignOff(latest)
  })
})

// latest btn click
latestBtn.addEventListener('click', function () {
  setSignOff(latest)
})

// random btn click
randomBtn.addEventListener('click', async function () {
  loading()
  const block = await fetchRandomSignOff()
  setSignOff(block)
  loading(false)
})

// sign-off click > copy to clipboard
signOff.addEventListener('click', function () {
  const text = signOff.innerText
  navigator.clipboard.writeText(signOff.innerText).then(function () {
    /* clipboard successfully set */
    signOff.innerText = 'Copied!'
    setTimeout(() => { signOff.innerText = text }, 1000)
  }, function () {
    /* clipboard write failed */
  })
})

// helpers
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max))
}
