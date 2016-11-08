let host = ''

if (location.protocol === 'http:') {
  host = 'ws:'
} else {
  host = 'wss:'
}

const ws = new WebSocket(`${host}//${window.location.host}/`)

ws.onmessage = function (evt) {
  const play = JSON.parse(evt.data)
  if (play.type === 'PLAY-BY-PLAY') {
    console.log(play)
    $('#plays > tbody:last-child').append(`<tr><td>${new Date(play.time).toLocaleString()} - ${play.message}</td></tr>`)
  }
}
