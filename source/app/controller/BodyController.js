(function () {
    'use strict';

    angular.module('AgendaApp.controllers', []).controller('BodyController', controller);

    controller.$inject('$scope');

    function controller($scope) {
        clog('body controller');
    }
})();