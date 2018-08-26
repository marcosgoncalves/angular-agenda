(function () {
    'use strict';

    angular
        .module('AgendaApp')
        .controller('BodyController', Controller);

    Controller.$inject = ['$scope', '$rootScope'];

    function Controller($scope, $rootScope) {
        angular.element(document).ready(function () {
            // clog('BodyController ready');

            // $('#dropUltimos').click().blur();

            $('#navBar a:not([data-toggle="dropdown"])').on('click', function () {
                $('.navbar-collapse').collapse('hide');
            });

        });
    }
})();