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
                let trip = docSnapshot.data()
                if (trip.client_literal_origin) {
                    trip.origin_location = trip.client_literal_origin
                }
                if (trip.client_literal_destination) {
                    trip.destination_location = trip.client_literal_destination
                }
                commit('setTrip', trip)
            }
        })
    },
    resetTrip ({ commit }) {
        commit('setTrip', null)
    }
}