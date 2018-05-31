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
        /*
                INSERT INTO CONTATO(ID, NOME, TELEFONE, ENDERECO, ENDERECO_LIMPO) VALUES(
                    3, 'Thor', '11 94596-8797',
                    '{"tipoLogradouro":"Travessa","logradouro":"dos fundos","numero":"66","complemento":"bloco X",
                        "bairro":"Jardim Belo","cidade":"Uberlândia","estado":"MG","cep":"08985040"}',
                        ',"Uberlândia","MG","bloco X","66","dos fundos","Jardim Belo","Travessa","08985040",');
        */

        function stripKeys(jo) {
            var sb = '';
			for(var key in jo) {
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
            var m = [];
            for (var i = 0; i < vm.qtd; i++) {
                m.push('insert into contato(nome, telefone, endereco, endereco_limpo) values(' + getValuesContato() + ');' + '\n');
            }
            vm.insertsOut = m.join('');
        }

        angular.element(document).ready(function () {
            clog('InsertsController ready');
        });
    }
})();