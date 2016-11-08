/* global angular */

angular
  .module('app')
  .config(['$locationProvider', '$routeProvider',
    function config($locationProvider, $routeProvider) {
      $locationProvider.html5Mode(true)

      $routeProvider
        .when('/', {
          template: '<home></home>',
        })
        .when('/game/:gameId', {
          template: '<commentator></commentator>',
        })
        .when('/game/:gameId/box-score', {
          template: '<box></box>',
        })
        .otherwise('/')
    },
  ])
