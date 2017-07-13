angular.module('app')

.service('countriesService', function($http, apiHost,apiGoogle, $q){
	this.getList = function () {
		return $http.get(apiHost + 'countries');
	}
	this.getListContract = function(iso2){
		return $http.get(apiHost + 'countries/' + iso2 + '/contracts');
	}
	this.getListStation = function(idContract){
		return $http.get(apiHost + 'contracts/' + idContract + '/stations');
	};
	this.allStationsInCountry = function(iso2){
		return this.getListContract(iso2).then(contracts=>{
			const stationPromises = new Set()
			for (var i = 0; i < contracts.data.length; i++) {
					stationPromises.add(this.getListStation(contracts.data[i].id))
			}
			return $q.all(Array.from(stationPromises))
		}).then(stations=>{
			const returnStations = new Set()
			for (var i = 0; i < stations.length; i++) {
				for (var j = 0; j < stations[i].data.length; j++) {
					returnStations.add(stations[i].data[j])
				}
			}
			return Array.from(returnStations)
		})
	}
	this.getCloser = function (coord) {
		return $http.get(apiGoogle.baseUrl + 'latlng=' + coord.lat + ',' + coord.lng + "&result_type=country&key=" + apiGoogle.apiKey).then(locationInfo=>{
			const iso2 = locationInfo.data.results.pop().address_components.pop().short_name.toLowerCase()
			return this.getListContract(iso2).then(contracts=>{
				let minDist = 99999999
				let minDistValue
				for (var i = 0; i < contracts.data.length; i++) {
					dist= Math.sqrt(Math.pow(contracts.data[i].latitude - coord.lat,2) + Math.pow(contracts.data[i].longitude - coord.lng,2))
					if (dist<minDist) {
						minDist = dist
						minDistValue = contracts.data[i]
					}
				}
				return this.getListStation(minDistValue.id)
			}).then(stations=>{
				let minDist = 99999999
				let minDistValue
				for (var i = 0; i < stations.data.length; i++) {
					dist= Math.sqrt(Math.pow(stations.data[i].latitude - coord.lat,2) + Math.pow(stations.data[i].longitude - coord.lng,2))
					if (dist<minDist) {
						minDist = dist
						minDistValue = stations.data[i]
					}
				}
				return minDistValue
			})
		})
	}
})

.service('listenerService', function(){
	this.addListener =  (objectListener)=> {
		if (!this.listener) this.listener = []
		this.listener.push(objectListener)
		return true
	}
	this.get = (listener) => {
		let returnListener = false
		if (!this.listener) return false
		for (var i = 0; i < this.listener.length; i++) {
			if (this.listener[i].name === listener) returnListener = this.listener[i]
		}
		return returnListener
	}
	this.getListStation = function(idContract){
		return $http.get(apiHost + 'contracts/' + idContract + '/stations');
	};
});
