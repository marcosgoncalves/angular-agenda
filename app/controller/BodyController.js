(function () {
    'use strict';

    angular
        .module('AgendaApp')
        .controller('BodyController', Controller);

    Controller.$inject = ['$scope', '$rootScope'];

    function Controller($scope, $rootScope) {
        clog('BodyController');
    }
})();