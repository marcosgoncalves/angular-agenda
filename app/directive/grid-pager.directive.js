(function () {
	'use strict';

	angular.module('AgendaApp')
		.directive('gridPager', Directive);

	Directive.$inject = ['$http', '$q', 'AgendaApiConstants'];

	function Directive($http, $q, AgendaApiConstants) {
		return {
			restrict: 'E',
			scope: {},
			link: function (scope, element, attrs) {
				scope.vm = scope.$parent.vm;
				angular.forEach(attrs.$attr, function (attr) {
					var attrCamel = camelCase(attr);
					scope[attrCamel] = attrs[attrCamel];
				});

				scope.pagerPosition = scope.pagerPosition || 'top';
			},
			templateUrl: '/directive/templates/grid-pager.html',
			controller: Controller
		};
	}

	var Controller = function ($scope) {
		angular.element(document).ready(function () {
			$('[data-toggle="tooltip"]').tooltip();
		});
	};
})();