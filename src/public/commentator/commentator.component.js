/* eslint-env browser */
/* global $, angular */
/* eslint-disable no-param-reassign */

angular // eslint-disable-line
.module('commentator')
.component('commentator', {
  templateUrl: 'templates/commentator-template.html',
  controller: ['$routeParams', '$http', '$scope',
    ($routeParams, $http, $scope) => {
      const gameId = $routeParams.gameId
      let currentPlayer
      $scope.selectedState = false

      let uri = ''

      if (window.cordova) {
        uri = process.env.DARK_MAGIC
      } else {
        uri = window.location.origin
      }

      $http.get(
        `${uri}/user/verify`,
      )
      .success((data) => {
        if (data.status === 'FAIL') {
          window.location.href = uri
        }
      })

      $http.get(`${uri}/game/find/${gameId}`)
        .success((data) => {
          if (data.snitch.caughtOn !== undefined) {
            data.snitch.caughtOn = new Date(data.snitch.caughtOn).toLocaleString()
          }
          $scope.game = data
          $scope.teams = []
          data.teams.forEach((team) => {
            $http.get(`${uri}/team/find/${team._id}`) // eslint-disable-line
            .success((teamData) => {
              $scope.teams.push(teamData)
            })
          })
        })

      $scope.goal = () => {
        $.ajax({
          url: `${uri}/game/${gameId}/chaser/goal/123`,
          type: 'POST',
          data: JSON.stringify({ chaser: currentPlayer }),
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          success(response) {
            if (response.status === 'OK') {
              $('#notification').removeClass().addClass('alert alert-success')
              $(`#${response.teamId}`).html(response.score)
              $('#notification').fadeIn()
              $('#notification').html(`<b>Goal!</b> <mark><b>${response.player}</b></mark> scored a goal for ${response.team}.`)
              $('#notification').delay(2000).slideUp()
            } else {
              $('#notification').removeClass().addClass('alert alert-danger')
              $('#notification').fadeIn()
              $('#notification').html(`<b>Warning!</b> ${response.message}.`)
              $('#notification').delay(2000).slideUp()
            }
          },
        })
      }

      $scope.miss = () => {
        $.ajax({
          url: `${uri}/game/${gameId}/chaser/miss/123`,
          type: 'POST',
          data: JSON.stringify({ chaser: currentPlayer }),
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          success(response) {
            if (response.status === 'OK') {
              $('#notification').removeClass().addClass('alert alert-warning')
              $('#notification').fadeIn()
              $('#notification').html(`<b>Missed!</b> <mark><b>${response.player}</b></mark> missed a goal.`)
              $('#notification').delay(2000).slideUp()
            } else {
              $('#notification').removeClass().addClass('alert alert-danger')
              $('#notification').fadeIn()
              $('#notification').html(`<b>Warning!</b> ${response.message}.`)
              $('#notification').delay(2000).slideUp()
            }
          },
        })
      }

      $scope.block = () => {
        $.ajax({
          url: `${uri}/game/${gameId}/keeper/block/123`,
          type: 'POST',
          data: JSON.stringify({ keeper: currentPlayer }),
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          success(response) {
            if (response.status === 'OK') {
              $('#notification').removeClass().addClass('alert alert-info')
              $('#notification').fadeIn()
              $('#notification').html(`<b>Blocked!</b> <mark><b>${response.player}</b></mark> blocked an attempted goal.`)
              $('#notification').delay(2000).slideUp()
            } else {
              $('#notification').removeClass().addClass('alert alert-danger')
              $('#notification').fadeIn()
              $('#notification').html(`<b>Warning!</b> ${response.message}.`)
              $('#notification').delay(2000).slideUp()
            }
          },
        })
      }

      $scope.end = () => {
        $.ajax({
          url: `${uri}/game/${gameId}/seeker/catchSnitch/123`,
          type: 'POST',
          data: JSON.stringify({ seeker: currentPlayer }),
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          success(response) {
            if (response.status === 'OK') {
              $(`#${response.teamId}`).html(response.score)
              $('#notification').removeClass().addClass('alert alert-success')
              $('#notification').fadeIn()
              $('#notification').html(`<b>GAME ENDED ON ${new Date(response.endTime).toLocaleString()}!</b> Snitch was caught by <mark><b>${response.player}</b></mark>.`)
            } else {
              $('#notification').removeClass().addClass('alert alert-danger')
              $('#notification').fadeIn()
              $('#notification').html(`<b>Warning!</b> ${response.message}.`)
              $('#notification').delay(2000).slideUp()
            }
          },
        })
      }

      $scope.snitchAppeared = () => {
        $.ajax({
          url: `${uri}/game/${gameId}/snitch/appeared/123`,
          type: 'POST',
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          success(response) {
            if (response.status === 'OK') {
              $('#notification').removeClass().addClass('alert alert-info')
              $('#notification').fadeIn()
              $('#notification').html(`<b>Snitch has appeared</b> on <br /> ${new Date(response.appearanceDate).toLocaleString()}`)
              $('#notification').delay(2000).slideUp()
            } else {
              $('#notification').removeClass().addClass('alert alert-danger')
              $('#notification').fadeIn()
              $('#notification').html(`<b>Warning!</b> ${response.message}.`)
              $('#notification').delay(2000).slideUp()
            }
          },
        })
      }

      $scope.select = (button, player) => {
        currentPlayer = player
        $scope.selectedState = button.$id
      }
    },
  ],
})
