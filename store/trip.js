import { firestore } from '~/plugins/firebase.js'

export const state = () => ({
    trip: null,
})

export const getters = {
    trip: state => state.trip,
}

export const mutations = {
    setTrip(state, trip) {
        state.trip = trip
    },
}

export const actions = {
    async loadTrip ({ commit, dispatch }, id) {
        return dispatch('getTrip', id, { root: true })
            .then(response => {
                commit('setTrip', response)
                dispatch('getTripFromFirestore', id)
            })
    },
    async getTripFromFirestore ({ commit }, id) {
        firestore.collection('trips').doc(id.toString()).onSnapshot(docSnapshot  => {
            if (docSnapshot.exists) {
                commit('setTrip', docSnapshot.data())
            }
        })
    },
    resetTrip ({ commit }) {
        commit('setTrip', null)
    }
}