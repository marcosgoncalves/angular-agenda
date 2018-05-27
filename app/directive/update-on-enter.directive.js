(function () {
    'use strict';

    angular.module('AgendaApp').directive('updateOnEnter', Directive);

    Directive.$inject = ['$timeout'];

    function Directive($timeout) {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {},
            link: function (scope, element, attrs, ctrl) {

                element.bind("keyup", function (ev) {
                    if (parseInt(ctrl.$viewValue) > parseInt(attrs.updateMaxValue)) {
                        ctrl.$setViewValue(attrs.updateMaxValue);
                        ctrl.$render();
                    }
                    if (ev.keyCode == 13) {
                        ctrl.$commitViewValue();
                        scope.$apply(ctrl.$setTouched());
                        element[0].select();
                    }
                });
            }
        };
    }

})();