(function () {
	'use strict';

	angular
		.module('AgendaApp')
		.config(Routes);

	Routes.$inject = ['$stateProvider', '$urlRouterProvider'];

	function Routes($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/');

		$stateProvider
			.state('index', {
				url: '/',
				templateUrl: './views/main.html'
			})
			.state('contatos', {
				url: '/contatos',
				templateUrl: './views/contatos.html',
				controller: 'ContatoController as vm',
				resolve:{
					resolveResult: ['$q', 'UtilService', 'AgendaService', function ($q, UtilService, AgendaService) {
						return $q.all([
							UtilService.getBaseNomes(),
							AgendaService.getEstados(),
							UtilService.getCidades()
						]).then(function (resp) {
							return {
								baseNomes: resp[0],
								estados: resp[1],
								cidades: resp[2]
							};
						}).catch(function () {
							return {
								baseNomes: [],
								estados: [],
								cidades: {}
							};
						});
					}]
				}
			})
			.state('inserts', {
				url: '/inserts',
				templateUrl: './views/inserts.html',
				controller: 'InsertsController as vm',
				resolve: {
					resolveResult: ['$q', 'UtilService', 'AgendaService', function ($q, UtilService, AgendaService) {
						return $q.all([
							UtilService.getBaseNomes(),
							AgendaService.getEstados(),
							UtilService.getCidades()
						]).then(function (resp) {
							return {
								baseNomes: resp[0],
								estados: resp[1],
								cidades: resp[2]
							};
						}).catch(function () {
							return {
								baseNomes: [],
								estados: [],
								cidades: {}
							};
						});
					}]
				}
			})
			.state('inputs', {
				url: '/inputs',
				templateUrl: './views/inputs.html',
				controller: 'InputsController as vm',
				resolve: {
					resolveResult: ['$q', 'UtilService', 'AgendaService', function ($q, UtilService, AgendaService) {
						return $q.all([
							UtilService.getBaseNomes(),
							AgendaService.getEstados(),
							UtilService.getCidades(),
							UtilService.getBigNomes()
						]).then(function (resp) {
							return {
								baseNomes: resp[0],
								estados: resp[1],
								cidades: resp[2],
								bigList: resp[3].items
							};
						}).catch(function () {
							return {
								baseNomes: [],
								estados: [],
								cidades: {},
								bigList: []
							};
						});
					}]
				}
			})
			.state('tabs', {
				url: '/tabs',
				templateUrl: './views/tabs-call.html',
				controller: 'TabsCallController as vm'
			});
	}

})();