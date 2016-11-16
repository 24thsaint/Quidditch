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
        $scope.hasUser = false
        $scope.error = ''
        $scope.isLoginFailed = false

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
            document.cookie = `token=${data.token}`
            if (data.status === 'OK') {
              $scope.hasUser = true
            } else {
              $scope.error = data.message
              $scope.isLoginFailed = true
            }
          })
          .error((error) => {
            $scope.error = error.message
            $scope.loginFailed = true
          })
        }
      },
    ],
  })
