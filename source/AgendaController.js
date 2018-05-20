/**
 * This is an example controller.
 * It triggers the UserdataService and puts the returned value on the scope
 *
 * @see services
 */
var controllers = angular.module('AgendaApp.controllers', [])
    .controller('AgendaController', function ($scope, UserdataService) {

        UserdataService.getFirstUsername().then(function (firstUsername) {
            $scope.firstUsername = firstUsername;
        });

    });