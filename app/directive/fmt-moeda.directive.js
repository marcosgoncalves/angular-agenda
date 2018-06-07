(function () {
	'use strict';

	angular
		.module('AgendaApp')
		.directive('fmtMoeda', Directive);

	function Directive() {
		var defaultMaxValue = 9999999999999.99;
		return {
			require: '?ngModel',
			link: function (scope, elem, attrs, ctrl) {
				if (!ctrl) return;

				elem.on('input', function (e) {
					var val = this.value || '';
					var pure = toPure(val);
					var moeda = fmtMoeda(pure);
					ctrl.$setViewValue(moeda);

					var maxVal = Number(elem.attr('max-val') || defaultMaxValue) || defaultMaxValue;
					if (maxVal && maxVal > 0 && pure >= maxVal) {
						pure = maxVal;
						moeda = fmtMoeda(pure);
						this.value = moeda;
					}

					this.value = this.value
						.replace(/[^0-9.,]/g, '')
						.replace(/(\,.*)\,/g, '$1')
						.replace(/\.$/g, '');
				});

				elem.on('paste', function (e) {
					e.preventDefault();
					var text = (e.originalEvent || e).clipboardData.getData('text/plain');
					window.document.execCommand('insertText', false, text);
					var val = text || '';
					var pure = toPure(val);
					var moeda = fmtMoeda(pure);
					ctrl.$setViewValue(moeda);
				});


				ctrl.$formatters.unshift(function (a) {
					var val = ctrl.$modelValue || '';
					var pure = toPure(val);
					var moeda = fmtMoeda(pure);
					return moeda;
				});

				ctrl.$parsers.unshift(function (viewValue) {
					var val = (viewValue || '').toString();
					var stripped = strip(val);
					var pure = null,
						moeda = '';
					if (stripped.length > 0) {
						if (stripped.length <= 3) {
							stripped = ('0').repeat(3 - stripped.length) + stripped;
						}
						stripped = [stripped.slice(0, stripped.length - 2), '.', stripped.slice(stripped.length - 2)].join('');
						pure = Number(stripped);
						moeda = fmtMoeda(pure);
					}
					var maxVal = Number(elem.attr('max-val') || defaultMaxValue) || defaultMaxValue;
					if (maxVal && maxVal > 0 && pure >= maxVal) {
						pure = maxVal;
						moeda = fmtMoeda(pure);
					}

					if (pure < 0.01) {
						elem[0].value = '';
						return null;
					} else {
						elem[0].value = moeda;
						return pure;
					}
				});

			}
		};

		function toPure(val) {
			var pure = isNaN(val) ?
				val.toString()
				.replace(/\./g, '')
				.replace(/\,/g, '.')
				.replace(/[^0-9.]/g, '') :
				val;
			if (pure.toString().length === 0) return '';
			var fixed = Number(pure).toFixed(2);
			return fixed;
		}

		function strip(val) {
			var stripped = val.replace(/\D/g, '');
			if (isNaN(parseInt(stripped))) return '';
			return parseInt(stripped).toString();
		}

		function fmtMoeda(number) {
			if (
				number === null || number === undefined ||
				isNaN(number) || number.toString().length === 0
			) {
				return '';
			}
			var fixed = Number(number).toFixed(2);
			var m = fixed.toString().split('.');
			var sInt = m[0].split(/(?=(?:\d{3})+(?:\.|$))/g).join(".");
			var sFra = m[1];
			return sInt + ',' + sFra;
		}
		
	}

})();