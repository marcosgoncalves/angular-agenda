/*jshint esversion: 6 */
(function () {
    'use strict';

    angular
        .module('AgendaApp')
        .controller('InputsController', Controller);

    Controller.$inject = ['$q', '$scope'];

    function Controller($q, $scope) {
        var vm = this;


        angular.element(document).ready(function () {
            clog('InputsController ready');
        });
    }
})();