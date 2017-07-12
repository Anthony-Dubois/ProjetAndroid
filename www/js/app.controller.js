angular.module('app', ['ionic'])

	.controller( 'countriesListCtrl', function ($scope, countriesService){
		countriesService.getList()
			.then(function(response){
				console.log(response.data);
				$scope.countries = response.data;
			})
			.catch(function (error){
				console.error(error.message);
			});		
	})

	.controller( 'contractListCtrl', function ($scope, countriesService, $stateParams){
		countriesService.getListContract($stateParams.iso2)
			.then(function(response){
				console.log(response.data);
				$scope.contract = response.data;
			})
			.catch(function (error){
				console.error(error.message);
			});	
	})

	.controller( 'stationListCtrl', function ($scope, countriesService,$stateParams){
		countriesService.getListStation($stateParams.idContract)
			.then(function(response){
				console.log(response.data);
				$scope.stations = response.data;
			})
			.catch(function (error){
				console.error(error.message);
			});	
	});


