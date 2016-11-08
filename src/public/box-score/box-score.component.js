/* eslint-env browser */
/* global $, angular */
/* eslint-disable no-param-reassign */

angular
  .module('box')
  .component('box', {
    templateUrl: '/templates/test.html',
    controller: ['$routeParams', '$http', '$scope',
      ($routeParams, $http, $scope) => {
        alert('Box score route found')
      },
    ],
  })
