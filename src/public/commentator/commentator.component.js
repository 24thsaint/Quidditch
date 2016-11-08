/* eslint-env browser */
/* global $, angular */
/* eslint-disable no-param-reassign */
/* eslint-disable no-console */

angular // eslint-disable-line
.module('commentator')
.component('commentator', {
  templateUrl: '/templates/commentator-template.html',
  controller: ['$routeParams', '$http', '$scope',
    ($routeParams, $http, $scope) => {
      const gameId = $routeParams.gameId
      let currentPlayer
      $scope.selectedState = false

      $http.get(`/game/find/${gameId}`)
        .success((data) => {
          data.snitch.caughtOn = new Date(data.snitch.caughtOn).toLocaleString()
          $scope.game = data
          $scope.teams = []
          for (const team of data.teams) {
            $http.get(`/team/${team._id}`) // eslint-disable-line
            .success((teamData) => {
              $scope.teams.push(teamData)
            })
          }
        })
        .error((data) => {
          console.log(`ERROR: ${data}`) // eslint-disable-line
        })

      $scope.goal = () => {
        $.ajax({
          url: `${location.protocol}//${window.location.host}/game/${gameId}/chaser/goal/123`,
          type: 'POST',
          data: JSON.stringify({ chaser: currentPlayer }),
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          success(response) {
            if (response.status === 'OK') {
              $('#notification').removeClass().addClass('alert alert-success')
              $(`#${response.teamId}`).html(response.score)
              $('#notification').fadeIn()
              $('#notification').html(`<b>Goal!</b> ${response.player} scored a goal for ${response.team}.`)
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
          url: `${location.protocol}//${window.location.host}/game/${gameId}/chaser/miss/123`,
          type: 'POST',
          data: JSON.stringify({ chaser: currentPlayer }),
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          success(response) {
            if (response.status === 'OK') {
              $('#notification').removeClass().addClass('alert alert-warning')
              $('#notification').fadeIn()
              $('#notification').html(`<b>Missed!</b> ${response.player} missed a goal.`)
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
          url: `${location.protocol}//${window.location.host}/game/${gameId}/keeper/block/123`,
          type: 'POST',
          data: JSON.stringify({ keeper: currentPlayer }),
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          success(response) {
            if (response.status === 'OK') {
              $('#notification').removeClass().addClass('alert alert-info')
              $('#notification').fadeIn()
              $('#notification').html(`<b>Blocked!</b> ${response.player} blocked an attempted goal.`)
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
          url: `${location.protocol}//${window.location.host}/game/${gameId}/seeker/catchSnitch/123`,
          type: 'POST',
          data: JSON.stringify({ seeker: currentPlayer }),
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          success(response) {
            console.log(response)
            if (response.status === 'OK') {
              $(`#${response.teamId}`).html(response.score)
              $('#notification').removeClass().addClass('alert alert-success')
              $('#notification').fadeIn()
              $('#notification').html(`<b>GAME ENDED ON ${new Date(response.endTime).toLocaleString()}!</b> Snitch was caught by ${response.player}.`)
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
          url: `${location.protocol}//${window.location.host}/game/${gameId}/snitch/appeared/123`,
          type: 'POST',
          contentType: 'application/json; charset=utf-8',
          dataType: 'json',
          success(response) {
            console.log(response)
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
