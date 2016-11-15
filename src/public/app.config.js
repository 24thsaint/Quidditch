/* global angular */

angular
  .module('app')
  .config(['$locationProvider', '$routeProvider',
    function config($locationProvider, $routeProvider) {
      $routeProvider
        .when('/', {
          template: '<home>Loading...</home>',
        })
        .when('/game/:gameId', {
          template: '<commentator>Loading...</commentator>',
        })
        .when('/game/:gameId/box-score', {
          template: '<box>Loading...</box>',
        })
        .when('/game/:gameId/play-by-play', {
          template: '<playbyplay>Loading...</playbyplay>',
        })
        .when('/login', {
          template: '<login>Loading...</login>',
        })
        .otherwise('/')
    },
  ])
