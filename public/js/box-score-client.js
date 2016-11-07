let host = ''

if (location.protocol === 'http:') {
  host = 'ws:'
} else {
  host = 'wss:'
}

const ws = new WebSocket(`${host}//${window.location.host}/`)

ws.onmessage = function (evt) {
  const data = JSON.parse(evt.data)
  if (data.type === 'BOX-SCORE') {
    document.getElementById(data.teamId).innerHTML = data.score
  }
}
