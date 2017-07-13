angular.module('app', ['ionic', 'leaflet-directive'])


  .controller("mapCtrl", function($scope, countriesService) {

    angular.extend($scope, {
      center: {
        lat: 0,
        lng: 0,
        zoom: 2
      },
      markers: {},
      defaults: {
        scrollWheelZoom: true
      }
    })

    const geolocation = new Promise(function(resolve, reject) {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });

    countriesService.getList().then(countries => {
      $scope.countries = countries.data
    })

    $scope.markersInCountry = function() {
      $scope.markers = {}
      countriesService.allStationsInCountry(this.value.iso2).then(stations => {
        for (var i = 0; i < stations.length; i++) {
          $scope.markers[stations[i].id] = {
            lat: stations[i].latitude,
            lng: stations[i].longitude
          }
        }
        $scope.center = {
          lat: stations[0].latitude,
          lng: stations[0].longitude,
          zoom: 8
        }
      })
    }

    $scope.location = function() {
      geolocation.then(data => {
        countriesService.getCloser({
          lat: data.coords.latitude,
          lng: data.coords.longitude
        }).then(station => {
          $scope.center = {
            lat: station.latitude,
            lng: station.longitude,
            zoom: 18
          }
          let ouvert = station.open ? 'ouvert' : 'fermée'
          let message = ''
          message += `<h6> ${station.name} </h6>`
          message += `<div> ${station.address} </div>`
          message += `<div>Statut : ${ouvert} </div>`
          message += `<div>Vélos disponibles : ${station.availableBikes} </div>`
          message += `<div>Emplacements libres : ${station.availableFreeSpots} </div>`

          // ` </h5><h5>{{s.banking ? 'Possibilité d\'achat à la borne' : 'Achat à la borne indisponnible'}} </h5>`
          $scope.markers[station.id] = {
            lat: station.latitude,
            lng: station.longitude,
            focus: true,
            message
          }
        })
      }).catch(err => {
        console.log(err);
      })
    }
  })

  .controller('baseController', function(listenerService, countriesService, $interval) {
    this.listenerService = listenerService
    this.countriesService = countriesService
    $interval.cancel(listenerService.get('interval').interval)
  })

  .controller('countriesListCtrl', function($scope, $controller, $location) {
    angular.extend(this, $controller('baseController', {
      $scope: $scope
    }));
    this.countriesService.getList()
      .then(function(response) {
        $scope.countries = response.data;
      })
      .catch(function(error) {
        console.error(error.message);
      });
    $scope.map = function() {
      $location.path('/map')
    }
  })

  .controller('contractListCtrl', function($scope, $stateParams, $controller) {
    angular.extend(this, $controller('baseController', {
      $scope: $scope
    }));
    this.countriesService.getListContract($stateParams.iso2)
      .then(function(response) {
        $scope.contract = response.data;
      }).catch(function(error) {
        console.error(error.message);
      });
  })

  .controller('stationListCtrl', function($scope, $stateParams, $controller, $interval) {
    angular.extend(this, $controller('baseController', {
      $scope: $scope
    }));
    const interval = $interval(() => {
      this.countriesService.getListStation($stateParams.idContract)
        .then(function(response) {
          $scope.stations = response.data;
        }).catch(function(error) {
          console.error(error.message);
        });
    }, 50);
    this.interval = interval
    this.listenerService.addListener({
      name: 'interval',
      interval
    })
  });
