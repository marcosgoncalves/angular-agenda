(function () {
	'use strict';
	angular
		.module('compsApp')
		.controller('TabsController', Controller);
	Controller.$inject = ['$http', '$scope', '$compile'];

	function Controller($http, $scope, $compile) {
		var vm = this;

		vm.activeTab = null;
		vm.tab = {};
		vm.url = null;

		vm.valor = 'tabs controller';

		vm.tabClickHandler = function (idx) {
			if (vm.activeTab === idx) {
				return;
			}
			vm.activeTab = idx;
			vm.config.active = idx;
			vm.tab = vm.config.tabs[idx];

			if (vm.tab.clickCallback) {
				vm.tab.clickCallback(idx);
			}

			vm.oldTabsBody = vm.tabsBody;

			vm.tabsBody = $('#' + vm.id + ' .tabs-body');
			if (vm.tab.target) {
				vm.tabsBody = $('#' + vm.tab.target);
			}

			if (vm.oldTabsBody && !vm.tabsBody.is(vm.oldTabsBody)) {
				vm.oldTabsBody.hide();
			}

			if (vm.tab.url) {
				vm.url = vm.tab.url;
				$http.get('' + vm.url)
					.then(function (response) {
						vm.tabsBody.html(responseDataHandle(response.data || response));
						if (vm.tab.scope) {
							vm.tabsBody.replaceWith($compile(vm.tabsBody)(vm.tab.scope));
						}
						vm.tabsBody.show();
					})
					.catch(function (response) {
						vm.tabsBody.html(responseDataHandle(response.data || response));
						vm.tabsBody.show();
					});
			} else {
				vm.tabsBody.hide();
				vm.tabsBody.html('');
			}
		};

		angular.element(document).ready(function () {

			vm.config.go = function (idx) {
				vm.tabClickHandler(idx);
			};
			vm.config.add = function (tab) {
				vm.config.tabs.push(tab);
			};

			vm.tab = vm.config.tabs[vm.config.active];
			vm.tabClickHandler(vm.config.active);
		});
	}

	function responseDataHandle(data) {
		if (typeof data === 'object') {
			return JSON.stringify(data);
		} else {
			return data;
		}
	}

})();