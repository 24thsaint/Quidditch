/* eslint-env browser */
/* global $, angular */
/* eslint-disable no-param-reassign */

angular
.module('playbyplay')
.component('playbyplay', {
  templateUrl: 'templates/play-by-play.html',
  controller: ['$routeParams', '$http', '$scope',
    ($routeParams, $http, $scope) => {
      const gameId = $routeParams.gameId
      let uri = ''

      if (window.cordova) {
        uri = process.env.DARK_MAGIC
      } else {
        uri = window.location.origin
      }

      $http.get(`${uri}/game/find/${gameId}`)
        .success((data) => {
          data.playHistory.forEach((play) => {
            play.time = new Date(play.time).toLocaleString()
          })
          $scope.game = data
        })
        .error((data) => {
          console.log(`ERROR: ${data}`) // eslint-disable-line
        })

      let host = ''

      if (location.protocol === 'http:') {
        host = 'ws:'
      } else {
        host = 'wss:'
      }

      const ws = new WebSocket(`${host}//${window.location.host}/`)

      ws.onmessage = (evt) => {
        const play = JSON.parse(evt.data)
        if (play.type === 'PLAY-BY-PLAY') {
          switch (play.eventType) {
            case 'start' :
              $('#plays > tbody:last-child')
                .append(`<tr><td class="bg-danger">${new Date(play.time).toLocaleString()} - GAME HAS STARTED!</td></tr>`)
              break
            case 'end' :
              $('#plays > tbody:last-child')
                .append(`<tr><td class="bg-danger">${new Date(play.time).toLocaleString()} - Snitch caught by ${play.player.firstName} ${play.player.lastName}. GAME HAS ENDED!</td></tr>`)
              break
            case 'goal' :
              $('#plays > tbody:last-child')
                .append(`<tr><td class="bg-success">${new Date(play.time).toLocaleString()} - Goal made by ${play.player.firstName} ${play.player.lastName}</td></tr>`)
              break
            case 'miss' :
              $('#plays > tbody:last-child')
                .append(`<tr><td class="bg-warning">${new Date(play.time).toLocaleString()} - Goal missed by ${play.player.firstName} ${play.player.lastName}</td></tr>`)
              break
            case 'block' :
              $('#plays > tbody:last-child')
                .append(`<tr><td class="bg-info">${new Date(play.time).toLocaleString()} - Goal attempt blocked by ${play.player.firstName} ${play.player.lastName}</td></tr>`)
              break
            case 'snitchAppears' :
              $('#plays > tbody:last-child')
                .append(`<tr><td class="bg-primary">${new Date(play.time).toLocaleString()} - SNITCH HAS APPEARED!</td></tr>`)
              break
            default:
          }
        }
      }
    },
  ],
})
