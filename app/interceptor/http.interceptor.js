(function () {
	'use strict';
	// Intercepting HTTP calls with AngularJS.
	angular.module('AgendaApp')
		.config(Config);

	Config.$inject = ['$provide', '$httpProvider'];

	function Config($provide, $httpProvider) {
		// Add the interceptor to the $httpProvider.
		$httpProvider.interceptors.push('HttpInterceptor');

		// Intercept http calls.
		$provide.factory('HttpInterceptor', Interceptor);

		Interceptor.$inject = ['$q'];

		function Interceptor($q) {
			return {
				// On request success
				request: function (config) {
					Loading.show(config);
					// console.log(config); // Contains the data about the request before it is sent.

					// Return the config or wrap it in a promise if blank.
					return config || $q.when(config);
				},

				// On request failure
				requestError: function (rejection) {
					Loading.hide(rejection.config);
					// console.log(rejection); // Contains the data about the error on the request.

					// Return the promise rejection.
					return $q.reject(rejection);
				},

				// On response success
				response: function (response) {
					Loading.hide(response.config);
					// console.log(response); // Contains the data from the response.

					// Return the response or promise.
					return response || $q.when(response);
				},

				// On response failture
				responseError: function (rejection) {
					Loading.hide(rejection.config);
					// console.log(rejection); // Contains the data about the error.

					// Return the promise rejection.
					return $q.reject(rejection);
				}
			};
		}
	}
})();