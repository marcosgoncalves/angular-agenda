(function () {
    'use strict';
    // clog('tabsService declare');
    angular
        .module('compsApp')
        .service('tabsService', Service);

    function Service() {
        function getTabs(tabsId) {

        }

        return {
            getTabs: getTabs,
            controller: 'TabsController as vm'
        };
    }
})();