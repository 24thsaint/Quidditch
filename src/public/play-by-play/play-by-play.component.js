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
      const wsUri = uri.split('://')

      if (location.protocol === 'http:') {
        host = 'ws:'
      } else {
        host = 'wss:'
      }

      const ws = new WebSocket(`${host}//${wsUri[1]}/`)

      ws.onmessage = (evt) => {
        const play = JSON.parse(evt.data)
        if (play.type === 'PLAY-BY-PLAY') {
          switch (play.eventType) {
            case 'start' :
              $('#plays > tbody:last-child')
                .append(`<tr><td class="bg-danger"><span class="lead">${new Date(play.time).toLocaleString()}</span> - GAME HAS STARTED!</td></tr>`)
              break
            case 'end' :
              $('#plays > tbody:last-child')
                .append(`<tr><td class="bg-danger"><span class="lead">${new Date(play.time).toLocaleString()}</span> - Snitch caught by ${play.player.firstName} ${play.player.lastName}. GAME HAS ENDED!</td></tr>`)
              break
            case 'goal' :
              $('#plays > tbody:last-child')
                .append(`<tr><td class="bg-success"><span class="lead">${new Date(play.time).toLocaleString()}</span> - Goal made by ${play.player.firstName} ${play.player.lastName}</td></tr>`)
              break
            case 'miss' :
              $('#plays > tbody:last-child')
                .append(`<tr><td class="bg-warning"><span class="lead">${new Date(play.time).toLocaleString()}</span> - Goal missed by ${play.player.firstName} ${play.player.lastName}</td></tr>`)
              break
            case 'block' :
              $('#plays > tbody:last-child')
                .append(`<tr><td class="bg-info"><span class="lead">${new Date(play.time).toLocaleString()}</span> - Goal attempt blocked by ${play.player.firstName} ${play.player.lastName}</td></tr>`)
              break
            case 'snitchAppears' :
              $('#plays > tbody:last-child')
                .append(`<tr><td class="bg-primary"><span class="lead">${new Date(play.time).toLocaleString()}</span> - SNITCH HAS APPEARED!</td></tr>`)
              break
            default:
          }
          $scope.$apply()
        }
      }
    },
  ],
})
