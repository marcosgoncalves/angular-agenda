(function () {
	'use strict';

	angular.module('AgendaApp')
		.service('AgendaService', Service);

	Service.$inject = ['$http', '$q', 'AgendaApiConstants'];

	function Service($http, $q, AgendaApiConstants) {

		function getContato() {
			return $http.get(AgendaApiConstants.baseUrl + '/contato')
				.then(function (response) {
					return response.data;
				})
				.catch(function (e) {
					clog('AgendaService getContatos error response', e);
					throw e;
				});
		}

		function getContatos(listParams) {
			return $http.post(AgendaApiConstants.baseUrl + '/contatos', listParams)
				.then(function (response) {
					return response.data;
				})
				.catch(function (e) {
					clog('AgendaService getContatos error response', e);
					throw e;
				});
		}

		function saveContato(contato) {
			if (!contato.id) {
				return $http.post(AgendaApiConstants.baseUrl + '/contato', contato)
					.then(function (response) {
						return response.data;
					})
					.catch(function (e) {
						clog('AgendaService saveContato insert error', e);
						throw e;
					});
			} else {
				return $http.put(AgendaApiConstants.baseUrl + '/contato', contato)
					.then(function (response) {
						return response.data;
					})
					.catch(function (e) {
						clog('AgendaService saveContato update error', e);
						throw e;
					});
			}
		}

		function deleteContato(contato) {
			clog('deleteContato', contato);
			return $http.delete(AgendaApiConstants.baseUrl + '/contato/' + contato.id)
				.then(function (response) {
					return response.data;
				})
				.catch(function (e) {
					clog('AgendaService deleteContato error response', response);
					throw e;
				});
		}

		function getEstados() {
			return $http.get('assets/data-json/estados.json')
				.then(function (response) {
					return response.data;
				})
				.catch(function (e) {
					clog('AgendaService getEstados error response', response);
					throw e;
				});
		}

		return {
			getContatos: getContatos,
			getEstados: getEstados,
			saveContato: saveContato,
			deleteContato: deleteContato
		};
	}
})();