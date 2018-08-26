(function () {
	'use strict';
	var molude = angular.module('AgendaApp');

	// ***************************************************

	molude.directive('iptList', Directive);

	Directive.$inject = ['$compile', '$parse', '$timeout'];

	function Directive($compile, $parse, $timeout) {
		return {
			require: 'ngModel',
			restrict: 'A',
			link: Link,
			controller: Controller
		};

		function Link(scope, elem, attrs, ctrl) {
			var el, sIdList, elList, vmL;
			el = $(elem);
			sIdList = attrs.iptList;
			elList = $('#' + sIdList);

			if (!sIdList) {
				console.error('ipt-list: Passe o Id do elemento "ipt-list-drop" como parâmetro');
				return;
			}
			if (!elList.length) {
				console.error('ipt-list: Id de "ipt-list-drop" não encontrado');
				return;
			}
			if (elList[0].tagName !== 'IPT-LIST-DROP') {
				console.error('ipt-list: Id não é de um elemento "ipt-list-drop" válido');
				return;
			}

			// ----------------

			el.attr('autocomplete', 'off');

			if (!el.attr('recompiled')) {
				el.attr('recompiled', true);
				$compile(el)(scope);
				return;
			}

			// ----------------

			var initialised = false;

			function initList() {
				if (!initialised) {
					initialised = true;
					elList = $('#' + sIdList);
					vmL = elList.prop('vm');
					vmL.ipt = el;
					vmL.setIptVal = setIptVal;
				}
			}

			var iptData = null;

			function setIptVal(value, text) {
				iptData = {
					value: value,
					text: text
				};
				ctrl.$setViewValue(text);
				scope.$apply();
				$timeout(function () {
					el.removeClass('invalid-in-list ng-invalid ng-invalid-required');
					iptData = null;
				}, 1);
			}

			function dropList() {
				vmL.show();
			}

			// ******************************************************

			angular.element(document).ready(function () {});

			var preventFocus = false;
			el.on('focus', function (evt) {
				initList();
				if (!preventFocus) {
					dropList();
				}
				preventFocus = false;
			});
			el.on('blur', function (evt) {
				vmL.hide();
			});

			el.on('mousedown', function (evt) {
				if (inButtonArea(evt)) {
					preventFocus = true;
				} else {
					preventFocus = false;
				}
			});

			el.on('click', function (evt) {
				initList();
				if (inButtonArea(evt)) {
					if (!vmL.isOpen) {
						dropList();
					} else {
						vmL.hide();
					}
				}
			});

			el.on('blur', function (e) {
				var val = this.value || '';
				iptData = vmL.getTextValue(val);
				if (iptData) {
					$timeout(function () {
						ctrl.$setViewValue(iptData ? iptData.text || '' : '');
						el.removeClass('invalid-in-list ng-invalid ng-invalid-required');
						iptData = null;
					}, 1);
				} else {
					el.addClass('invalid-in-list ng-invalid ng-invalid-required');
				}
			});

			var searchTimeout = null;

			el.on('keydown', function (e) {
				var keyCode = e.keyCode;
				if (38 === keyCode) {
					vmL.keyUp();
				} else if (40 === keyCode) {
					vmL.show();
					vmL.keyDown();
				} else if (13 == keyCode) {
					vmL.keyEnter();
				}
			});

			el.on('input', function (e) {
				var val = this.value || '';
				$timeout.cancel(searchTimeout);
				searchTimeout = $timeout(function () {
					vmL.show();
					vmL.filterList(val);
				}, 550);
			});

			function inButtonArea(evt) {
				return evt.offsetX > el.outerWidth() - 20;
			}

			el.on('mousemove', function (evt) {
				if (inButtonArea(evt)) {
					el.css('cursor', 'pointer');
				} else {
					el.css('cursor', 'text');
				}
			});

			ctrl.$parsers.unshift(function (viewValue) {
				if (iptData) {
					var value = iptData.value,
						text = iptData.text;
					$timeout(function () {
						elem[0].value = text;
						iptData = null;
					}, 1);
					return value;
				} else {
					return null;
				}
			});
		}

		function Controller() {}
	}

	// ***************************************************

	molude.directive('iptListDrop', DirectiveDrop);

	DirectiveDrop.$inject = ['$compile', '$timeout'];

	function DirectiveDrop($compile, $timeout) {

		function Link(scope, elem, attrs) {
			var el = $(elem);
			var elScroll = el.find('.ipt-list-drop-scroll');
			var ipt;
			var vm = scope;
			scope.vm = vm;
			el.prop('vm', vm);

			var rowHeight = 30;
			var pageSize = 10;

			vm.dataFiltredList = [];
			vm.dataList = [];

			vm.cursorIndex = null;
			vm.listStart = 0;
			vm.listEnd = pageSize;

			vm.show = show;
			vm.hide = hide;
			vm.toggle = toggle;
			vm.keyUp = keyUp;
			vm.keyDown = keyDown;
			vm.keyEnter = keyEnter;
			vm.filterList = filterList;
			vm.getTextValue = getTextValue;

			function firstPage() {
				vm.listStart = 0;
				vm.listEnd = pageSize;
			}

			function keyUp() {
				if (vm.cursorIndex == null || vm.listStart + vm.cursorIndex == 0) {
					vm.cursorIndex = vm.dataList.length - 1;
					vm.listEnd = vm.dataFiltredList.length;
					vm.listStart = vm.listEnd - pageSize;
				} else {
					vm.cursorIndex--;
				}
				if (vm.cursorIndex == -1) {
					vm.cursorIndex++;
					vm.listStart--;
					vm.listEnd--;
				}
				pageList();
				markCursor();
			}

			function keyDown() {
				if (vm.cursorIndex == null) {
					vm.cursorIndex = 0;
					firstPage();
				} else {
					vm.cursorIndex++;
					if (vm.listStart + vm.cursorIndex >= vm.dataFiltredList.length) {
						vm.cursorIndex = 0;
						firstPage();
					} else if (vm.cursorIndex >= vm.dataList.length) {
						vm.cursorIndex--;
						vm.listStart++;
						vm.listEnd++;
					}
				}
				pageList();
				markCursor();
			}

			function keyEnter() {
				var elOption = elScroll.find('.ipt-list-option[data-index="' + vm.cursorIndex + '"]');
				if (elOption.length) {
					optionSelect(elOption);
				}
			}

			function optionSelect(elOption) {
				vm.setIptVal(elOption.attr('value'), elOption.text().trim());
				hide();
			}

			function clearCursor() {
				var opts = elScroll.find('.ipt-list-option');
				opts.removeClass('cursor');
				return opts;
			}

			function markCursor() {
				var opts = clearCursor();
				opts.filter('.ipt-list-option[data-index="' + vm.cursorIndex + '"]')
					.addClass('cursor');
				elScroll.scrollTop( vm.listStart * rowHeight );
			}

			function getTextValue(text) {
				for (var i = 0; i < vm.data.length; i++) {
					var item = vm.data[i];
					var searchIn = makeComp((item[vm.text] || item).toLowerCase());
					if (searchIn == makeComp(text.toLowerCase())) {
						return {
							value: item[vm.value] || item,
							text: item[vm.text] || item
						};
					}
				}
				return null;
			}

			vm.isOpen = false;

			function show() {
				function clickOutsideHandler(evt) {
					evt.stopPropagation();
					evt.preventDefault();
					if (isOutside(evt.target)) {
						hide();
					} else {
						$(document).one('click', clickOutsideHandler);
					}
				}

				function scrollHandler(evt) {
					hide();
				}

				if (!vm.isOpen) {
					vm.isOpen = true;
					ipt = vm.ipt;
					firstPage();

					el.addClass('open');
					ipt.addClass('open');
					elScroll.scrollTop(0);
					filterList(ipt.val());
					$(document).one('click', clickOutsideHandler);
					elScroll.parents().one('scroll', scrollHandler);
				}
			}

			function hide() {
				vm.isOpen = false;
				el.removeClass('open');
				ipt.removeClass('open');
			}

			function toggle() {
				if (!vm.isOpen) {
					show();
				} else {
					hide();
				}
			}

			function isOutside(e) {
				return !(
					el.is(e) ||
					$.contains(el[0], e) ||
					ipt.is(e) ||
					$.contains(ipt[0], e) ||
					false
				);
			}

			function doFilterList(search) {
				calcPageSize();
				vm.dataFiltredList = vm.data.filter(function (item) {
					var searchIn = makeComp((item[vm.text] || item).toLowerCase());
					return searchIn.contains(makeComp(search.toLowerCase()));
				});
			}

			function filterList(search) {
				el.find('.img-loading').show();
				(new Promise(function (resolve, reject) {
					doFilterList(search);
					resolve();
				})).then(function () {
					clearCursor();
					vm.cursorIndex = null;
					firstPage();
					pageList();
					scope.$apply();
					el.find('.img-loading').hide();
				});
			}

			function pageList() {
				vm.dataList = vm.dataFiltredList.slice(vm.listStart, vm.listEnd);
				scope.$apply();
				var boxHeight = rowHeight,
					ghostHeight = rowHeight;
				if (vm.dataList.length) {
					var elFirstOption = $(elScroll.find('.ipt-list-option')[0]);
					boxHeight = elFirstOption[0].offsetHeight * vm.dataList.length;
					ghostHeight = elFirstOption[0].offsetHeight * vm.dataFiltredList.length;
				}
				elScroll.css('height', boxHeight);
				elScroll.find('.ipt-list-drop-scroll-ghost').css('height', ghostHeight);
				scope.$apply();
				fitWindow();
			}

			function calcPageSize() {
				var elFooter = el.find('.ipt-list-drop-footer'),
					vpHeight = $(window).height(),
					iptHeight = vm.ipt.outerHeight(),
					iptTop = vm.ipt.offset().top,
					iptBottom = iptTop + iptHeight,
					footerHeight = elFooter.outerHeight();
				var distUp = iptTop - 5;
				var distDown = vpHeight - iptBottom - 5;
				if (distUp > distDown) {
					pageSize = Math.floor((distUp - footerHeight) / rowHeight);
				} else {
					pageSize = Math.floor((distDown - footerHeight) / rowHeight);
				}
			}

			function fitWindow() {
				var elInner = el.find('.ipt-list-drop-inner'),
					vpHeight = $(window).height(),
					iptWidth = vm.ipt.outerWidth(),
					iptHeight = vm.ipt.outerHeight(),
					iptOffset = vm.ipt.offset(),
					iptTop = iptOffset.top,
					iptBottom = iptTop + iptHeight,
					distUp = iptTop,
					distDown = vpHeight - iptBottom,
					top = 0,
					dropHeight = elInner.outerHeight();
				if (distUp > distDown) {
					top = iptTop - dropHeight;
				} else {
					top = iptTop + iptHeight;
				}
				el.css({
					'position': 'fixed',
					'width': iptWidth + 'px',
					'top': top + 'px'
				});
			}

			// -------------------------------

			function calcListStartEnd() {
				var thisEl = elScroll[0];
				var sTop = thisEl.scrollTop;

				vm.listStart = parseInt(sTop / rowHeight);
				vm.listEnd = vm.listStart + pageSize;
			}

			elScroll.on('scroll', function (evt) {
				evt.stopPropagation();
				evt.preventDefault();
				calcListStartEnd();
				pageList();
			});

			var scrollOptions = elScroll.find('.ipt-list-option');
			elScroll.on('mouseover', function (evt) {
				scrollOptions = elScroll.find('.ipt-list-option');
			});
			elScroll.on('mouseout', function (evt) {
				vm.indexEl = -1;
				vm.indexElHover = null;
				scrollOptions.removeClass('hover');
			});
			elScroll.on('mousedown', function (evt) {
				evt.preventDefault();
			});

			vm.indexRealEl = -1;
			vm.indexEl = -1;
			vm.indexElHover = null;
			elScroll.on('mousemove', function (evt) {
				vm.indexEl = parseInt(evt.offsetY / rowHeight);
				vm.indexRealEl = vm.listStart + vm.indexEl;
				if (vm.indexElHover !== vm.indexEl) {
					vm.indexElHover = vm.indexEl;
					scrollOptions.removeClass('hover');
					$(scrollOptions[vm.indexEl]).addClass('hover');
				}
			});
			elScroll.on('click', function (evt) {
				var elClick = elScroll.find('.ipt-list-option[data-index="' + vm.indexElHover + '"]');
				optionSelect(elClick);
			});
		}

		return {
			restrict: 'E',
			replace: true,
			templateUrl: '/directive/templates/ipt-list-drop.html',
			scope: {
				data: '=',
				value: '@',
				text: '@'
			},
			link: Link
		};

	}

	// ***************************************************

})();