/* eslint-env browser */
/* global $, angular */
/* eslint-disable no-param-reassign */

angular
  .module('home')
  .component('home', {
    templateUrl: 'templates/home-template.html',
    controller: ['$routeParams', '$http', '$scope',
      ($routeParams, $http, $scope) => {
        let uri = ''

        if (window.cordova) {
          uri = process.env.DARK_MAGIC
        } else {
          uri = window.location.origin
        }

        console.log(`22222222222222222 >>>>>>> ${uri}/games/list`)

        $http.get(`${uri}/games/list`)
          .success((data) => {
            console.log(`00000000000000000000000000000000000 >>> ${data}`)
            $scope.games = data
          })
          .error((data) => {
            console.log(`11111111111111111111111111111111111 >>> ${data}`) // eslint-disable-line
          })
      },
    ],
  })
