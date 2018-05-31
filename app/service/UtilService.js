(function () {
    'use strict';

    angular.module('AgendaApp')
        .service('UtilService', Service);

    Service.$inject = ['$http', '$q', 'AgendaApiConstants'];

    function Service($http, $q, AgendaApiConstants) {
        function getBaseNomes() {
            return $http.get('assets/data-json/base-nomes.json')
                .then(function (response) {
                    return response.data;
                })
                .catch(function (e) {
                    clog('UtilService getBaseNomes error response', response);
                    throw e;
                });
        }

        function getCidades() {
            return $http.get('assets/data-json/base-cidades.json')
                .then(function (response) {
                    return response.data;
                })
                .catch(function (e) {
                    clog('UtilService getCidades error response', response);
                    throw e;
                });
        }

        return {
            getBaseNomes: getBaseNomes,
            getCidades: getCidades
        };
    }
})();