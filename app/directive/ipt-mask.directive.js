(function () {
	'use strict';

	var defaultMaxValue = 9999999999999.99;
	var defaultDecimalPlaces = 2;

	var molude = angular.module('AgendaApp');

	// ***************************************************

	molude.directive('iptMask', Directive);

	Directive.$inject = ['$compile', 'moedaFilter', 'telefoneFilter', 'cepFilter'];

	function Directive($compile, moedaFilter, telefoneFilter, cepFilter) {

		return {
			require: '?ngModel',
			link: function (scope, elem, attrs, ctrl) {
				if (!ctrl) return;

				scope.isInvalid = function (element) {
					var el = $(element.$$element);
					return applyMaskValidation(element.$viewValue, el);
				};

				// setando o ng-class
				var invalidClass = elem.attr('invalid-class');
				if (invalidClass) {
					var condition = '{\'' + invalidClass + '\' : isInvalid(' + elem[0].form.name + '.' + elem[0].name + ')}';
					elem.attr('ng-class', condition);
				}

				// setando a mensagem de inválido
				var invalidMsg = elem.attr('invalid-msg');
				if (invalidMsg) {
					$(elem).find('+span').attr('invalid-msg', invalidMsg);
				}

				// *****************************************

				function applyMaskPattern() {
					var mask = elem.attr('ipt-mask');
					if (mask) {
						var maskMethod = masksPattern[mask] || masksValidation.default;
						maskMethod.apply(null, arguments);
					}
				}

				var masksPattern = {};

				masksPattern.moeda = function () {
					var decimalPlaces = elem.attr('decimal-places');
					decimalPlaces = parseInt(decimalPlaces !== 0 && !decimalPlaces ? defaultDecimalPlaces : decimalPlaces);
					elem.attr('pattern', '^([0-9]{1,3})?(\\.[0-9]{3})*([,0-9]{' + (decimalPlaces+1) + '})?$');
				};

				masksPattern.telefone = function () {
					elem.attr('pattern', '^(\\([0-9]{2}\\)\\s\)([0-9]\-)?([0-9]{4}\-)([0-9]{4})');
				};
				masksPattern.tel = masksPattern.telefone;

				masksPattern.cep = function () {
					elem.attr('pattern', '[0-9]{5}\-[0-9]{3}');
				};

				masksPattern.default = function () {
					elem.attr('pattern', '');
				};

				applyMaskPattern();

				// *****************************************

				function applyMaskValidation(val, el) {
					if (val.toString().length == 0) {
						return false;
					}
					var mask = el.attr('ipt-mask');
					if (mask) {
						var maskMethod = masksValidation[mask] || masksValidation.default;
						return maskMethod.apply(null, arguments);
					}
				}

				var masksValidation = {};

				masksValidation.moeda = function (v) {
					var decimalPlaces = elem.attr('decimal-places');
					decimalPlaces = parseInt(decimalPlaces !== 0 && !decimalPlaces ? defaultDecimalPlaces : decimalPlaces);
					var regex = new RegExp('^([0-9]{1,3})?(\\.[0-9]{3})*([,0-9]{' + (decimalPlaces+1) + '})?$');
					return !regex.test(v);
				};

				masksValidation.telefone = function (v) {
					var regex = new RegExp(/^(\(\d{2}\)\s)(\d-)?(\d{4}-)(\d{4})/);
					return !regex.test(v);
				};
				masksValidation.tel = masksValidation.telefone;

				masksValidation.cep = function (v) {
					var regex = new RegExp(/\d{5}\-\d{3}/);
					return !regex.test(v);
				};

				masksValidation.default = function (v) {
					return true;
				};

				// **********************

				function applyMask(val, bExternalValue) {
					var mask = attrs.iptMask;
					if (mask) {
						var maskMethod = masks[mask] || masks.default;
						return maskMethod.apply(null, arguments);
					}
				}

				var masks = {};

				masks.moeda = function (v, bExternalValue) {

					// Tranforma em numérico
					v = v.replace(/[^0-9.,-]/g, ""); // Remove tudo o que não é [.], [,], [-] e dígito
					v = v.replace(/\,/g, "."); // transforma [,] em [.]
					v = v.replace(/\.(?=.*\.)/g, ""); // Remove todos os [.] exceto o último

					if (v.length === 0 || v == 0) {
						return {
							value: '',
							masked: ''
						};
					}
					if (isNaN(v)) {
						return {
							value: v,
							masked: v
						};
					}

					// Casas decimais
					var decimalPlaces = elem.attr('decimal-places');
					decimalPlaces = Number(decimalPlaces !== 0 && !decimalPlaces ? defaultDecimalPlaces : decimalPlaces);
					if (v.length > 0 && v.indexOf('.') > -1) {
						if (bExternalValue) {
							v = Number(v).toFixed(decimalPlaces); // Converte em duas cadas decimais
						} else {
							v = v.replace(/\./g, ""); // Remove todos os [.]
							v = v.replace(new RegExp('(\\d*)(\\d{' + decimalPlaces + '})'), "$1.$2"); // Coloca o [.] antes das duas últimas
							v = v.replace(/\.$/, ""); // Remove o [.] se for o último char
						}
					}
					if (v.length > 0 && v.length < (decimalPlaces + 1)) {
						v = ('0').repeat((decimalPlaces + 1) - v.length) + v;
						v = v.replace(new RegExp('(\\d*)(\\d{' + decimalPlaces + '})'), "$1.$2"); // Coloca o [.] antes das duas últimas
						v = Number(v).toFixed(decimalPlaces); // Converte em duas cadas decimais
					}

					// Valor máximo
					var maxVal = Number(elem.attr('max-val') || defaultMaxValue) || defaultMaxValue;
					if (maxVal && maxVal > 0 && v >= maxVal) {
						v = maxVal.toFixed(decimalPlaces);
					}

					// Mascarando
					var masked = moedaFilter(v, decimalPlaces);
					return {
						value: v,
						masked: masked
					};
				};

				masks.telefone = function (v) {
					var masked = telefoneFilter(v);
					v = v.replace(/\D/g, ""); // Remove tudo o que não é dígito
					return {
						value: v,
						masked: masked
					};
				};
				masks.tel = masks.telefone;

				masks.cep = function (v) {
					var masked = cepFilter(v);
					v = v.replace(/\D/g, ""); // Remove tudo o que não é dígito
					return {
						value: v,
						masked: masked
					};
				};

				masks.default = function (v) {
					return {
						value: v,
						masked: v
					};
				};

				// Recompilando o elemento
				if (!elem.attr('replaced')) {
					elem.attr('replaced', true);
					elem.replaceWith($compile(elem)(scope));
				}

				// LISTENERS
				ctrl.$formatters.unshift(function (modelValue) {
					var val = modelValue || '';
					var masked = applyMask(val, true);
					return masked.masked;
				});

				ctrl.$parsers.unshift(function (viewValue) {
					var val = (viewValue || '').toString();
					var masked = applyMask(val);
					elem[0].value = masked.masked;
					return masked.value;
				});

				elem.on('input', function (e) {
					var val = this.value || '';
					var masked = applyMask(val);
					ctrl.$setViewValue(masked.masked);
					this.value = masked.masked;
				});

				elem.on('paste', function (e) {
					e.preventDefault();
					var text = (e.originalEvent || e).clipboardData.getData('text/plain');
					window.document.execCommand('insertText', false, text);
					var val = text || '';
					var masked = applyMask(val, true);
					ctrl.$setViewValue(masked.masked);
				});

				elem.on('drop', function (e) {
					e.preventDefault();
					var val = e.dataTransfer.getData("Text") || '';
					var masked = applyMask(val, true);
					ctrl.$setViewValue(masked.masked);
					this.value = masked.masked;
				});
			}
		};

	}

	// ***************************************************

	molude.filter('moeda', function () {
		return function (val, decimalPlaces) {
			if (isNaN(val) || val === '') {
				return '';
			}
			decimalPlaces = Number(decimalPlaces !== 0 && !decimalPlaces ? defaultDecimalPlaces : decimalPlaces);
			var v = val.toString();
			v = Number(v).toFixed(decimalPlaces); // Converte em duas cadas decimais
			v = v.replace(/\./g, ""); // Remove todos os [.]
			v = v.replace(/^(.{16})(.*)/, '$1'); // Remove o excesso
			v = v.replace(new RegExp('(\\d*)(\\d{' + decimalPlaces + '})'), "$1.$2"); // Coloca o [.] antes das duas últimas
			v = Number(v).toFixed(decimalPlaces); // Converte em duas cadas decimais
			var m = v.toString().split('.');
			var masked = '';
			masked += m[0].split(/(?=(?:\d{3})+(?:\.|$))/g).join(".");
			if (decimalPlaces > 0 && m[1]) {
				masked += ',' + m[1];
			}
			return masked;
		};
	});

	molude.filter('telefone', function () {
		return function (val) {
			if (val === '' || !val) {
				return '';
			}
			var v = val.toString();
			v = v.replace(/\D/g, ""); // Remove tudo o que não é dígito
			v = v.replace(/^(.{11})(.*)/, '$1'); // Remove o excesso
			var masked = v.replace(/^(\d{2})(\d)/g, "($1) $2"); // Coloca parênteses em volta dos dois primeiros dígitos
			masked = masked.replace(/(\d{1})(\d{8})$/, "$1-$2"); // Coloca hífen entre o novo e o oitavo dígitos
			masked = masked.replace(/(\d)(\d{4})$/, "$1-$2"); // Coloca hífen entre o quarto e o quinto dígitos
			return masked;
		};
	});

	molude.filter('cep', function () {
		return function (val) {
			if (val === '' || !val) {
				return '';
			}
			var v = val.toString();
			v = v.replace(/\D/g, ""); // Remove tudo o que não é dígito
			v = v.replace(/^(.{8})(.*)/, '$1'); // Remove o excesso
			var masked = v.replace(/^(\d{5})(\d)/, "$1-$2"); // Coloca hífen entre o quinto e o sexto
			return masked;
		};
	});

})();