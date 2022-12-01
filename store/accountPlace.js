export const state = () => ({
  places: [],
  addPlaceDialog: false,
  deletePlaceDialog: false,
  deletePlace: null,
})

export const getters = {
  places: state => state.places,
  addPlaceDialog: state => state.addPlaceDialog,
  deletePlaceDialog: state => state.deletePlaceDialog,
  deletePlace: state => state.deletePlace,
}

export const mutations = {
  setPlaces(state, places) {
    state.places = places
  },
  openAddPlaceDialog(state) {
    state.addPlaceDialog = true
  },
  closeAddPlaceDialog(state) {
    state.addPlaceDialog = false
  },
  openDeletePlaceDialog(state, place) {
    state.deletePlaceDialog = true;
    state.deletePlace = place;
  },
  closeDeletePlaceDialog(state) {
    state.deletePlaceDialog = false
  },
  removePlace(state, place) {
    state.places.splice(state.places.indexOf(place), 1)
  },
  addPlace(state, place) {
    state.places.push(place)
  },
}

export const actions = {
  async getPlaces({ commit, rootState }) {
    return this.$axios.$get(`/accounts/${rootState.userAccount.account.id}/places`).then(data => {
      commit('setPlaces', data)

      return data;
    })
  },
  async deletePlace({ commit, rootState }, {place}) {
    return this.$axios.$delete(`/accounts/${rootState.userAccount.account.id}/places/${place.id}`).then(() => {
      commit('removePlace', place)
    })
  },
  async addPlace({ commit, rootState }, {name, location}) {
    console.log(location)
    return this.$axios.$post(`/accounts/${rootState.userAccount.account.id}/places`, {name: name, location: location})
        .then((data) => {
          commit('addPlace', data)
        })
  },
}