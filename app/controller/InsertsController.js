/*jshint esversion: 6 */
(function () {
    'use strict';

    angular
        .module('AgendaApp')
        .controller('InsertsController', Controller);

    Controller.$inject = ['$q', '$scope', 'AgendaService', 'resolveResult'];

    function Controller($q, $scope, AgendaService, resolveResult) {
        var vm = this;

        vm.qtd = 100;

        vm.nomesList = resolveResult.baseNomes;
        vm.estadoList = resolveResult.estados;
        vm.cidadesList = resolveResult.cidades;
        

		vm.cidadesArrayList = [];
		vm.estadoChange = function () {
			vm.editing.endereco.cidade = '';
			vm.cidadeChange();
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

        vm.editing = {};

        vm.gerar = gerar;
        vm.fillForm = fillForm;

        function getRandon(min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min);
        }

        function rndArray(array) {
            return array[getRandon(0, array.length - 1)];
        }

        function rndCombo(cbo, start) {
            var n = getRandon(start || 0, cbo.options.length - 1);
            return cbo.options[n].value;
        }

        function loopRand(times, fnRand) {
            var s = '';
            while (times > 0) {
                times--;
                s += fnRand();
            }
            return s;
        }

        function getRandonChar() {
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            return possible.charAt(Math.floor(Math.random() * possible.length));
        }

        function getRandonNum() {
            var possible = "0123456789";
            return possible.charAt(Math.floor(Math.random() * possible.length));
        }

        function getRandonNome() {
            return vm.nomesList[getRandon(0, vm.nomesList.length)];
        }

        function getNome(n) {
            var spc = '',
                str = '';
            for (var i = 0; i < n; i++) {
                str += spc + getRandonNome();
                spc = ' ';
            }
            return str;
        }

        function getTipoLogradouro() {
            return rndCombo(vm.frmContato.tipoLogradouro.$$element[0], 1);
        }

        function getTelefone() {
            return "(" + loopRand(2, getRandonNum) + ") " + parseInt(loopRand(getRandon(4, 5), getRandonNum)) + "-" + loopRand(4, getRandonNum);
        }

        function getComplemento() {
            var opt = [
                'Apto ' + getRandon(1, 500),
                'Bloco ' + getRandonChar().toUpperCase(),
                'fundos', '', ''
            ];
            return rndArray(opt);
        }

        function getBairro() {
            var opt = ['Vila ', 'Jardim ', 'Chácara '];
            return rndArray(opt) + getNome(getRandon(1, 2));
        }

        function getEstado() {
            return rndCombo(vm.frmContato.estado.$$element[0], 1);
        }

        function getCidade(UF) {
            return rndArray(vm.cidadesList[UF]);
        }

        function getCep() {
            return loopRand(5, getRandonNum) + "-" + loopRand(3, getRandonNum);
        }

        function getRandonContato() {
            var estado = getEstado();
            return {
                nome: getNome(getRandon(2, 4)),
                telefone: getTelefone(),
                endereco: {
                    tipoLogradouro: getTipoLogradouro(),
                    logradouro: getNome(getRandon(1, 4)),
                    numero: getRandon(1, 9000),
                    complemento: getComplemento(),
                    bairro: getBairro(),
                    estado: estado,
                    cidade: getCidade(estado),
                    cep: getCep()
                }
            };
        }

        function fillForm() {
            vm.editing = getRandonContato();
        }

        function stripKeys(jo) {
            var sb = '';
            for (var key in jo) {
                sb += ',\"' + jo[key] + '\"';
            }
            sb += ',';
            return sb;
        }

        function safe(s) {
            return s.replace(/\'/gi, "''");
        }

        function getValuesContato() {
            var contato = getRandonContato();
            var s = '';

            s += "'" + safe(contato.nome) + "', ";
            s += "'" + safe(contato.telefone) + "', ";
            s += "'" + safe(JSON.stringify(contato.endereco)) + "', ";
            s += "'" + safe(stripKeys(contato.endereco)) + "'";

            return s;
        }

        function gerar() {
            var start = new Date();
            vm.insertsOut = '';
            var m = [];

            function thenHandler() {
                return function () {
                    //vm.insertsOut += 'contato inserido\n';
                };
            }
            
            function catchHandler() {
                return function (e) {
                    var mErrors = e.data.errors;
                    var strMsg = '';
                    mErrors = mErrors.sort(function (a, b) {
                        if (a.field < b.field)
                            return -1;
                        if (a.field > b.field)
                            return 1;
                        return 0;
                    });
                    for (var i = 0; i < mErrors.length; i++) {
                        var error = mErrors[i];
                        strMsg += error.field + ' ' + error.defaultMessage + '\n';
                    }
                    vm.insertsOut += 'erro\n' + strMsg;
                };
            }

            for (var i = 0; i < vm.qtd; i++) {
                if (vm.flExecutar) {
                    AgendaService.saveContato(getRandonContato())
                        .then(thenHandler())
                        .catch(catchHandler());
                } else {
                    m.push('insert into contato(nome, telefone, endereco, endereco_limpo) values(' + getValuesContato() + ');' + '\n');
                }
            }
            vm.insertsOut = m.join('');
        }

        angular.element(document).ready(function () {
            clog('InsertsController ready');
        });
    }
})();