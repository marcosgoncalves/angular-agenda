(function () {
    'use strict';
    angular
        .module('compsApp')
        .component('tabs', {
            templateUrl: 'assets-bower/comps/src/tabs/tabs.html',
            controller: 'TabsController as vm',
            bindings: {
                id: '@',
                config: '='
            }
        });
})();