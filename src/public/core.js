/* eslint-disable no-param-reassign */
const app = angular.module('app', []) // eslint-disable-line

app.controller('mainController', ($scope, $http) => {
  $scope.formData = {}

  $http.get('/games/list')
    .success((data) => {
      $scope.games = data
      console.log(data)
    })
    .error((data) => {
      console.log(`ERROR: ${data}`)
    })
})

