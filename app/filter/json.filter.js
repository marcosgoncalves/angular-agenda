(function () {
	'use strict';

	angular
		.module('AgendaApp')
		.filter('json', Filter);

	function Filter() {
        return function (val) {
			if (val === '' || !val) {
				return '';
            }
			// return JSON.stringify(val);
		};
	}

})();