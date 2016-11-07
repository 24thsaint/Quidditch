angular
  .module('app')
  .config(['$locationProvider', '$routeProvider',
    function config($locationProvider, $routeProvider) {
      $locationProvider.hashPrefix('!')

      $routeProvider
        .when('/', {
          template: '<home></home>',
        })
        .when('/game/:gameId', {
          template: '<game></game>',
        })
        .when('/phones/:phoneId', {
          template: '<phone-detail></phone-detail>',
        })
        .otherwise('/phones')
    },
  ])
