angular
  .module('home')
  .component('home', {
    templateUrl: '/templates/home-template.html',
    controller: ['$routeParams', '$http', '$scope',
      function HomeController($routeParams, $http, $scope) {
        $http.get('/games/list')
          .success((data) => {
            $scope.games = data
          })
          .error((data) => {
            console.log(`ERROR: ${data}`)
          })
      },
    ],
  })
