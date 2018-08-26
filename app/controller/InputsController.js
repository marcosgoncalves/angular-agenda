/*jshint esversion: 6 */
(function () {
    'use strict';

    angular
        .module('AgendaApp')
        .controller('InputsController', Controller);

    Controller.$inject = ['$q', '$scope', 'resolveResult'];

    function Controller($q, $scope, resolveResult) {
        var vm = this;

        vm.nomesList = resolveResult.baseNomes;
        vm.estadoList = resolveResult.estados;
        vm.cidadesList = resolveResult.cidades;
        vm.bigList = resolveResult.bigList;

        vm.bigList = vm.bigList.sort(function(a, b) {
            if (a.name < b.name)
              return -1;
            if (a.name > b.name)
              return 1;
            return 0;
        });

        angular.element(document).ready(function () {
            // clog('InputsController ready');
        });
    }
})();