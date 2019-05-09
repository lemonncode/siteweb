import { firebase, db } from '~/plugins/firebase.js'

export const state = () => ({
    driver: null,
    waitTime: null
})

export const getters = {
    driver: state => state.driver,
    waitTime: state => state.waitTime
}

export const mutations = {
    setDriver(state, driver) {
        state.driver = driver
    },
    setWaitTime(state, waitTime) {
        state.waitTime = waitTime
    },
}

export const actions = {
    async getDriver ({ commit }, data) {
        db.ref('driversAvailable/' + data.driver).once('value').then(function(snapshot) {
            let driver = snapshot.val();
            let smileIcon = "L_26.png";

            var position = {
                lat: driver.latitude,
                lng: driver.longitude,
            };

            driver.position = position;
            driver.icon = smileIcon;

            commit('setDriver', driver);
        });
    },

    estimatedTime({ commit, dispatch }, data) {
        debugger;
        var driverPosition = new google.maps.LatLng(data.driver.latitude, data.driver.longitude);
        var destinationPosition = new google.maps.LatLng(data.trip.origin.location.latitude, data.trip.origin.location.longitude);
        var directionsService = new google.maps.DirectionsService

        directionsService.route({
            origin: driverPosition,
            destination: destinationPosition,
            travelMode: google.maps.TravelMode['DRIVING'],
            optimizeWaypoints: true
        }, function(response, status) {
            if (status === 'OK') {
                var waitTime = response.routes[0].legs[0].duration.text;
                commit('setWaitTime', waitTime);
            } else {
                // === if we were sending the requests to fast, try this one again and increase the delay
                if (status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
                    dispatch('estimatedTime', data);
                }
            }
        });
    }
}