(function () {
    'use strict';

    angular
        .module('AgendaApp')
        .controller('ContatoController', ContatoController);

    ContatoController.$inject = ['$scope', 'AgendaService'];

    function ContatoController($scope, AgendaService) {
        var vm = this;

        vm.filters = {
            id: "",
            nome: "",
            endereco_limpo: "",
            telefone: ""
        };
        vm.listParams = {
            filters: {},
            page: 1,
            size: 5,
            sort: [{
                orderColumn: "nome",
                orderDirection: "asc"
            }, {
                orderColumn: "id",
                orderDirection: "desc"
            }]
        };

        vm.contatoList = [];
        vm.estadoList = [];
        vm.editing = null;

        vm.goPage = goPage;
        vm.goSearch = goSearch;
        vm.novo = novo;
        vm.edit = edit;
        vm.save = save;
        vm.remove = remove;
        vm.cancel = cancel;

        function scrolToForm() {
            setTimeout(function () {
                clog($('#frmTitle').offset().top);
                clog($('#navBar').outerHeight());
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
                    mErrors = mErrors.sort(function (a, b) {
                        if (a.field < b.field) return -1;
                        if (a.field > b.field) return 1;
                        return 0;
                    });
                    for (var i = 0; i < mErrors.length; i++) {
                        var error = mErrors[i];
                        strMsg += error.field + ' ' + error.defaultMessage + '\n';
                    }
                    alert(strMsg);
                });
        }

        function remove(contato, idx) {
            clog('remove', contato);
            if (!contato) {
                return;
            }
            AgendaService.deleteContato(contato).then(function () {
                loadContatos();
            });
        }

        function cancel() {
            vm.editing = null;
        }

        function loadEstados() {
            AgendaService.getEstados().then(function (data) {
                vm.estadoList = data;
            });
        }

        function updateSortControlls() {
            $('.header-group.sortable')
                .removeClass('asc')
                .removeClass('desc')
                .each(function () {
                    var sortable = $(this);
                    for (var i = 0; i < vm.listParams.sort.length; i++) {
                        var sort = vm.listParams.sort[i];
                        if (sort.orderColumn === sortable.attr('data-sort-column')) {
                            sortable.addClass(sort.orderDirection);
                            sortable.find('span').attr('data-sort-order', i+1);
                        }
                    }
                });
        }

        function loadContatos() {
            vm.listParams.filters = vm.filters;
            AgendaService.getContatos(vm.listParams).then(function (data) {
                vm.contatoList = data.dataList;
                vm.listParams = data.listParams;
                vm.listParams.totalPages = Math.ceil((vm.listParams.totalRecords || 0) / vm.listParams.size);

                angular.element(document).ready(function () {
                    clog('getContatos ready');
                    $('[data-toggle="tooltip"]').tooltip();
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

        function goSearch() {
            vm.listParams.page = 1;
            loadContatos();
        }

        function goPage() {
            loadContatos();
        }

        angular.element(document).ready(function () {
            clog('ContatoController ready');
            $('[data-toggle="tooltip"]').tooltip();
            loadEstados();
            loadContatos();
            updateSortControlls();

            $('.header-group.sortable').click(function (e) {
                var sortable = $(this);
                var direction = null;
                for (var i = 0; i < vm.listParams.sort.length; i++) {
                    var sort = vm.listParams.sort[i];
                    if (sort.orderColumn === sortable.attr('data-sort-column')) {
                        direction = sort.orderDirection;
                        break;
                    }
                }

                if(direction != null) {
                    var directionRev = direction === 'asc' ? 'desc' : '';
                    sortable.removeClass(direction);
                    if(directionRev==='') {
                        vm.listParams.sort.splice(i, 1);
                    } else {
                        sortable.addClass(directionRev);
                        vm.listParams.sort[i].orderDirection = directionRev;
                    }
                } else {
                    sortable.removeClass('desc');
                    sortable.addClass('asc');
                    vm.listParams.sort.push({
                        orderColumn: sortable.attr('data-sort-column'),
                        orderDirection: 'asc'
                    });
                    sortable.find('span').attr('data-sort-order', vm.listParams.sort.length);
                }
                // updateSortControlls();
                // $scope.$apply();
                vm.goPage();
            });
        });
    }
})();