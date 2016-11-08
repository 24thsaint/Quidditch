/* eslint-disable no-param-reassign */

angular // eslint-disable-line
  .module('commentator')
  .component('commentator', {
    templateUrl: '/templates/test.html',
    controller: ['$routeParams', '$http', '$scope',
      function CommentatorController($routeParams, $http, $scope) {
        const gameId = $routeParams.gameId
        $http.get(`/game/find/${gameId}`)
          .success((data) => {
            $scope.game = data
          })
          .error((data) => {
            console.log(`ERROR: ${data}`) // eslint-disable-line
          })
      },
    ],
  })
