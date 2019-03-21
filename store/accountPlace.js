export const state = () => ({
  places: [],
})

export const getters = {
  places: state => state.places,
}

export const mutations = {
  setPlaces(state, places) {
    state.places = places
  },
}

export const actions = {
  async getPlaces({ commit, rootState }) {
    return this.$axios.$get(`/accounts/${rootState.userAccount.currentAccount.id}/places`).then(data => {
      commit('setPlaces', data)

      return data;
    })
  },
}