(function () {
    'use strict';

    angular
        .module('AgendaApp')
        .controller('TabsController', Controller);

    Controller.$inject = ['$q', '$scope', 'AgendaService'];

    function Controller($q, $scope, AgendaService) {
        var vm = this;

        angular.element(document).ready(function () {
            clog('TabsController ready', vm);
        });
    }
})();