/* eslint-env browser */
/* global $, angular */
/* eslint-disable no-param-reassign */

angular
.module('box')
.component('box', {
  templateUrl: 'templates/box-score-template.html',
  controller: ['$routeParams', '$http', '$scope',
    ($routeParams, $http, $scope) => {
      const gameId = $routeParams.gameId
      $scope.teams = []

      let uri = ''

      if (window.cordova) {
        uri = process.env.DARK_MAGIC
      } else {
        uri = window.location.origin
      }

      $http.get(`${uri}/game/find/${gameId}`)
        .success((data) => {
          data.teams.forEach((team) => {
            $http.get(`${uri}/team/find/${team._id}`) // eslint-disable-line
            .success((teamData) => {
              $scope.teams.push(teamData)
            })
          })
        })

      let host = ''

      if (location.protocol === 'http:') {
        host = 'ws:'
      } else {
        host = 'wss:'
      }

      const ws = new WebSocket(`${host}//${window.location.host}/`)

      ws.onmessage = (evt) => {
        const data = JSON.parse(evt.data)
        if (data.type === 'BOX-SCORE') {
          $scope.teams = data.teams
          $scope.$apply()
        }
      }
    },
  ],
})
