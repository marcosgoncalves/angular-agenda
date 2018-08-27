(function () {
    'use strict';
    angular
        .module('compsApp')
        .service('tabsService', Service);

    function Service() {
        var vm = this;

        function getTabs(tabsId) {
            clog('getTabs', tabsId);
            return {
                tabsId: tabsId,
                init: initTabs
            };
        }

        return {
            getTabs: getTabs
        };

        function initTabs (tabs) {
            vm.tabs = tabs;
        }
    }

})();