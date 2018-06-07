(function () {
	'use strict';

	angular
		.module('AgendaApp')
		.controller('ContatoController', ContatoController);

	ContatoController.$inject = ['$scope', 'AgendaService', 'resolveResult'];

	function ContatoController($scope, AgendaService, resolveResult) {
		var vm = this;

		vm.nomesList = resolveResult.baseNomes;
		vm.estadoList = resolveResult.estados;
		vm.cidadesList = resolveResult.cidades;
		vm.cidadesArrayList = [];

		vm.filters = {};
		vm.listParams = {
			filters: vm.filters,
			page: 1,
			size: 5,
			sort: [{
				orderColumn: "nome",
				orderDirection: "asc"
			}]
		};

		vm.contatoList = [];
		vm.editing = null;

		vm.goPage = goPage;
		vm.goSearch = goSearch;
		vm.cleanSearch = cleanSearch;
		vm.novo = novo;
		vm.edit = edit;
		vm.save = save;
		vm.remove = remove;
		vm.cancel = cancel;

		vm.cidadesArrayList = [];
		vm.estadoChange = function () {
			vm.editing.endereco.cidade = '';
			cidadeChangeHandle();
		};

		var cidadeChangeTimeout = null;
		vm.cidadeChange = function () {
			clearTimeout(cidadeChangeTimeout);
			cidadeChangeTimeout = setTimeout(cidadeChangeHandle, 750);
		};

		function cidadeChangeHandle() {
			var limit = 100;
			vm.cidadesArrayList = angular.copy(vm.cidadesList[vm.editing.endereco.estado]);
			if (vm.editing.endereco.cidade) {
				vm.cidadesArrayList = vm.cidadesArrayList.filter(function (element, index, array) {
					var item = array[index].toString();
					var searched = item.toLowerCase(), //makeComp(item),
						search = vm.editing.endereco.cidade.toLowerCase(), //makeComp(vm.editing.endereco.cidade),
						result = searched.indexOf(search);
					// clog('comparacao', searched, search, result);
					return result > -1;
				});
			}
			vm.cidadesArrayList = vm.cidadesArrayList.slice(0, limit);
		}

		function scrolToForm() {
			setTimeout(function () {
				var left = 0;
				var top = $('#frmTitle').offset().top - $('#navBar').outerHeight() - 10;
				window.scrollTo(left, top);
				//$('#frmTitle')[0].scrollIntoView();
			}, 1);
		}

		function novo(contato, idx) {
			vm.editing = {
				idx: -1
			};
			setFrmUnTouched();
			scrolToForm();
		}

		function edit(contato, idx) {
			vm.editing = contato;
			vm.editing.idx = idx;
			setFrmUnTouched();
			scrolToForm();
		}

		function setFrmTouched() {
			angular.forEach(vm.frmContato.$error, function (field) {
				angular.forEach(field, function (errorField) {
					errorField.$setTouched();
				});
			});
		}

		function setFrmUnTouched() {
			angular.forEach(vm.frmContato.$error, function (field) {
				angular.forEach(field, function (errorField) {
					errorField.$setUntouched();
				});
			});
		}

		function save() {
			if (!vm.editing) {
				return;
			}
			if (!vm.frmContato.$valid) {
				setFrmTouched();
				return;
			}
			AgendaService.saveContato(vm.editing)
				.then(function () {
					clog('saveContato then', arguments);
					var idx = vm.editing.idx >= 0 ? vm.editing.idx : vm.contatoList.length;
					vm.contatoList[idx] = vm.editing;
					vm.editing = null;
					loadContatos();
				})
				.catch(function (e) {
					clog('saveContato catch', e);
					var mErrors = e.data.errors;
					var strMsg = '';
					if (mErrors) {
						mErrors = mErrors.sort(function (a, b) {
							if (a.field < b.field) return -1;
							if (a.field > b.field) return 1;
							return 0;
						});
						for (var i = 0; i < mErrors.length; i++) {
							var error = mErrors[i];
							strMsg += error.field + ' ' + error.defaultMessage + '\n';
						}
					} else {
						strMsg = 'Ocorreu um erro: ' + '\n' + e.data.message;
					}
					alert(strMsg);
				});
		}

		function remove(contato, idx) {
			clog('remove', contato);
			if (!contato || !confirm('Deseja excluir o contato?')) {
				return;
			}
			AgendaService.deleteContato(contato).then(function () {
				loadContatos();
			});
		}

		function cancel() {
			vm.editing = null;
		}

		function updateSortControlls() {
			$('.grid-table .sortable')
				.removeClass('asc')
				.removeClass('desc')
				.each(function () {
					var sortable = $(this);
					var span = sortable.find('span');
					span.attr('data-sort-order', '');
					if (!sortable.attr('data-sort-column')) {
						return;
					}
					for (var i = 0; i < vm.listParams.sort.length; i++) {
						var sort = vm.listParams.sort[i];
						if (sort.orderColumn === sortable.attr('data-sort-column')) {
							if (vm.listParams.sort.length > 1) {
								span.attr('data-sort-order', i + 1);
							}
							sortable.addClass(sort.orderDirection);
						}
					}
				});

			var handler = function (e) {
				var sortable = $(this);
				if (!sortable.attr('data-sort-column')) {
					return;
				}
				var direction = null;
				for (var i = 0; i < vm.listParams.sort.length; i++) {
					var sort = vm.listParams.sort[i];
					if (sort.orderColumn === sortable.attr('data-sort-column')) {
						direction = sort.orderDirection;
						break;
					}
				}
				if (direction != null) {
					var directionRev = direction === 'asc' ? 'desc' : '';
					sortable.attr('sort-direction', direction);
					if (directionRev === '') {
						vm.listParams.sort.splice(i, 1);
					} else {
						sortable.attr('sort-direction', directionRev);
						vm.listParams.sort[i].orderDirection = directionRev;
					}
				} else {
					sortable.attr('sort-direction', 'asc');
					vm.listParams.sort.push({
						orderColumn: sortable.attr('data-sort-column'),
						orderDirection: 'asc'
					});
				}
				vm.goPage();
			};
			var spanSortables = $('.grid-table .sortable');
			spanSortables.off('click');
			spanSortables.on('click', handler);
		}

		function loadContatos() {
			vm.listParams.filters = vm.filters;
			AgendaService.getContatos(vm.listParams).then(function (data) {
				vm.contatoList = data.dataList;
				vm.listParams = data.listParams;
				vm.listParams.totalPages = Math.ceil((vm.listParams.totalRecords || 0) / vm.listParams.size);

				angular.element(document).ready(function () {
					clog('getContatos ready');
					setupTooltips();
					setupEllipsis();
					updateSortControlls();
				});
			});
		}

		vm.mPages = function () {
			var size = Math.ceil((vm.listParams.totalRecords || 0) / vm.listParams.size);
			var mPages = new Array(size);
			for (var i = 0; i < mPages.length; i++) {
				mPages[i] = i + 1;
			}
			return mPages;
		};

		function setupTooltips() {
			$('[data-toggle="tooltip"]')
				.tooltip({
					trigger: "hover"
				})
				.click(function () {
					$(this).mouseleave();
				});
		}

		function cleanSearch() {
			vm.filters = {};
			goSearch();
		}

		function goSearch() {
			vm.listParams.page = 1;
			loadContatos();
		}

		function goPage() {
			loadContatos();
		}

		function setupEllipsis() {
			var columns = $('.grid-table .grid-row:not(.grid-header) .grid-column');
			var handler = function () {
				clog('click');
			};
			columns.off('click');
			columns.on('click', handler);
		}

		angular.element(document).ready(function () {
			clog('ContatoController ready');
			loadContatos();
			updateSortControlls();
			setupTooltips();
			setupEllipsis();
			vm.novo();

			vm.editing.endereco = {
				estado: 'SP'
			};
			vm.estadoChange();

			$('#cidadeDataList')[0].onSelect = function (e) {
				clog('cidadeDataList onselect', e);
			};

			for (var x in $('#cidadeDataList')[0]) {
				if (('/'+x).contains('/on')) {
					clog('for', x, $('#cidadeDataList')[0][x]);
				}
			}

			$('#cidadeDataList').on('scroll', function (e) {
				clog('cidadeDataList scroll', e);
			});
		});
	}
})();