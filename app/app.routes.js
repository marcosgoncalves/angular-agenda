(function () {
    'use strict';

    angular
        .module('AgendaApp')
        .config(Routes);

    Routes.$inject = ['$stateProvider', '$urlRouterProvider'];

    function Routes($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/');

        $stateProvider
            .state('index', {
                url: '/',
                templateUrl: './views/main.html'
            })
            .state('contatos', {
                url: '/contatos',
                templateUrl: './views/contatos.html'
            });
    }

})();