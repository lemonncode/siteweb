import { firebase, db } from '~/plugins/firebase.js'

export const state = () => ({
    driver: null,
    waitTime: null,
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

    estimatedTime({ commit, rootState }, id) {
        return this.$axios.$get(`/pickuptime/${rootState.userAccount.currentAccountId}/trips/${id}`).then(data => {
            commit('setWaitTime', data.remaining_time);
            return true;
        });
    },

    resetDriver ({ commit }) {
        commit('setDriver', null);
        commit('setWaitTime', null);
    }
}