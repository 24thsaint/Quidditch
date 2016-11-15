/* eslint-env browser */
/* global $, angular */
/* eslint-disable no-param-reassign */

angular
  .module('login')
  .component('login', {
    templateUrl: 'templates/login.html',
    controller: ['$routeParams', '$http', '$scope',
      ($routeParams, $http, $scope) => {
        $scope.credential = {}

        let uri = ''

        if (window.cordova) {
          uri = process.env.DARK_MAGIC
        } else {
          uri = window.location.origin
        }

        $scope.submit = () => {
          $http.post(
            `${uri}/user/login`,
            $scope.credential,
          )
          .success((data) => {
            console.log(data)
          })
          .error((data) => {
            console.log(data)
          })
        }
      },
    ],
  })
