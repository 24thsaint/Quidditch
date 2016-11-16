/* global angular */

angular
  .module('app')
  .config(['$locationProvider', '$routeProvider',
    function config($locationProvider, $routeProvider) {
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
        .when('/game/:gameId/play-by-play', {
          template: '<playbyplay></playbyplay>',
        })
        .when('/login', {
          template: '<login></login>',
        })
        .otherwise('/')
    },
  ])
