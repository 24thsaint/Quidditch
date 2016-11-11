angular
  .module('playbyplay')
  .component('playbyplay', {
    templateUrl: '/templates/test.html',
    controller: ['$routeParams', '$http', '$scope',
      function HomeController($routeParams, $http, $scope) {
        alert('Route found')
        // $http.get('/games/list')
        //   .success((data) => {
        //     $scope.games = data
        //   })
        //   .error((data) => {
        //     console.log(`ERROR: ${data}`)
        //   })
      },
    ],
  })
