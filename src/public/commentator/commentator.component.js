/* eslint-disable no-param-reassign */

angular // eslint-disable-line
  .module('commentator')
  .component('commentator', {
    templateUrl: '/templates/commentator-template.html',
    controller: ['$routeParams', '$http', '$scope',
      function CommentatorController($routeParams, $http, $scope) {
        const gameId = $routeParams.gameId
        $http.get(`/game/find/${gameId}`)
          .success((data) => {
            $scope.game = data
            console.log(data)
          })
          .error((data) => {
            console.log(`ERROR: ${data}`) // eslint-disable-line
          })
        $scope.goal = function goal() {
          alert('Goal')
        }
        $scope.miss = function miss() {
          alert('Miss')
        }
        $scope.block = function block() {
          alert('Block')
        }
        $scope.snitchAppeared = function snitchAppeared() {
          alert('Appeared')
        }
        $scope.end = function end() {
          alert('End')
        }
      },
    ],
  })
