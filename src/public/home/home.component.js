/* eslint-env browser */
/* global $, angular */
/* eslint-disable no-param-reassign */

angular
  .module('home')
  .component('home', {
    templateUrl: '/templates/home-template.html',
    controller: ['$routeParams', '$http', '$scope',
      ($routeParams, $http, $scope) => {
        let uri = ''

        if (window.cordova) {
          uri = process.env.DARK_MAGIC
        } else {
          uri = window.location.origin
        }

        $http.get(`${uri}/games/list`)
          .success((data) => {
            $scope.games = data
          })
          .error((data) => {
            console.log(`ERROR: ${data}`) // eslint-disable-line
          })
      },
    ],
  })
