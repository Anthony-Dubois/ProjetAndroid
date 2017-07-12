angular.module('app')

	.service('countriesService', function($http, apiHost){
		this.getList = function () {
			return $http.get(apiHost + 'countries');
		}
		this.getListContract = function(iso2){
			return $http.get(apiHost + 'countries/' + iso2 + '/contracts');
		};
	});

	