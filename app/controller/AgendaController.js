(function () {
    'use strict';

    angular
        .module('AgendaApp')
        .controller('AgendaController', Controller);

    Controller.$inject = ['$scope', 'UserdataService'];

    function Controller($scope, UserdataService) {
        clog('AgendaController');

        UserdataService.getFirstUsername().then(function (firstUsername) {
            $scope.firstUsername = firstUsername;
        });

    }
})();