/* eslint-disable no-param-reassign */

angular // eslint-disable-line
.module('commentator')
.component('commentator', {
  templateUrl: '/templates/commentator-template.html',
  controller: ['$routeParams', '$http', '$scope',
    ($routeParams, $http, $scope) => {
      const gameId = $routeParams.gameId
      $http.get(`/game/find/${gameId}`)
    .success((data) => {
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
        console.log('Goal')
      }
      $scope.miss = () => {
        console.log('Miss')
      }
      $scope.block = () => {
        console.log('Block')
      }
      $scope.snitchAppeared = () => {
        console.log('Appeared')
      }
      $scope.end = function end() {
        console.log('End')
      }
    },
  ],
})
