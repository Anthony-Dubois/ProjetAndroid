angular.module('app')

	.config(function($stateProvider, $urlRouterProvider) {
		$urlRouterProvider.otherwise('/');
		$stateProvider
			.state ( 'countriesList', {
				url : '/',
				controller: 'countriesListCtrl',
				templateUrl : '/templates/countries/list.html'
			})
			.state ( 'contractList', {
				url : '/contract/:iso2',
				controller: 'contractListCtrl',
				templateUrl : '/templates/contract/list.html'
			})
			.state ( 'stationsList', {
				url : 'contracts/stations/:idContract',
				controller: 'stationListCtrl',
				templateUrl : '/templates/stations/list.html'
			})
			.state ( 'map', {
				url : '/map',
				controller: 'mapCtrl',
				templateUrl : '/templates/map/map.html'
			})
	});
