import { firebase, db } from '~/plugins/firebase.js'
const drivers = db.ref('/driversAvailable');

export const state = () => ({
    driver: null,
})

export const getters = {
    driver: state => state.driver,
}

export const mutations = {
    setDriver(state, driver) {
        state.driver = driver
    },
}

export const actions = {
    async getDriver ({ commit }, uuid) {
        db.ref('driversAvailable/' + uuid).on('value', function(snapshot) {
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
    }
}