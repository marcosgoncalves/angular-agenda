(function () {
    'use strict';

    var localhost = window.location.hostname;

    angular
        .module('AgendaApp')
        .constant('AgendaApiConstants', {
            baseUrl: 'http://' + localhost + ':58080/agenda'
        });

})();