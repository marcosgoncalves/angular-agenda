(function () {
    'use strict';

    angular
        .module('AgendaApp')
        .controller('TabsCallController', Controller);

    Controller.$inject = ['$q', '$scope', 'tabsService'];

    function Controller($q, $scope, tabsService) {
        var vm = this;

        function tab11ClickHandler(idx) {
            vm.valor = 'oi vm';
            $scope.valor = 'oi scope';
        }
        function tab12ClickHandler(idx) {
            vm.valor = 'oi vm - tab 2';
            $scope.valor = 'oi scope - tab 2';
        }


        vm.tabs1 = {
            id: 'tabsId1',
            active: 0,
            tabs: [{
                text: 'tab 1.1',
                clickCallback: tab11ClickHandler,
                url: 'views/tab1.1.html',
                scope: $scope
            }, {
                text: 'tab 1.2',
                clickCallback: tab12ClickHandler,
                url: 'views/tab1.2.html',
                scope: $scope
            }, {
                text: 'tab 1.3',
                clickCallback: tab12ClickHandler,
                url: 'views/tab1.3.html',
                scope: $scope
            }, {
                text: 'tab 1.4',
                clickCallback: tab12ClickHandler,
                url: 'views/tab1.4.html',
                scope: $scope
            }]
        };
        vm.tabs2 = {
            id: 'tabsId2',
            active: 1,
            tabs: [{
                text: 'tab 2.1',
                clickCallback: tab11ClickHandler,
                url: 'assets/data-json/estados.json'
            }, {
                text: 'tab 2.2',
                clickCallback: tab11ClickHandler,
                url: 'views/tab2.2.html',
                target: 'tabs2Body',
                scope: $scope
            }]
        };

        vm.addTab = function () {
            vm.tabs1.tabs.push({
                text: 'tab 1.' + (vm.tabs1.tabs.length+1),
                clickCallback: function(idx) {
                    clog('clickCallback', idx);
                },
                url: 'views/tab1.' + (vm.tabs1.tabs.length+1) + '.html',
                scope: $scope
            });
        };

        angular.element(document).ready(function () {
            for(var i=0; i < 20; i++) {
                vm.addTab();
            }
        });
    }
})();