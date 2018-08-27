(function () {
    'use strict';
    angular
        .module('compsApp')
        .controller('TabsController', Controller);
    function Controller() {
        clog('TabsController');
        this.hero = {
            name: 'Spawn'
        };
    }
})();