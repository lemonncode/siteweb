export const state = () => ({
})

export const actions = {
  async getTrips ({ rootState }) {
    return this.$axios.$get(`/accounts/${rootState.userAccount.currentAccountId}/trips`)
  },
  async getTrip ({ commit, rootState }, id) {
    return this.$axios.$get(`/accounts/${rootState.userAccount.currentAccountId}/trips/${id}`)
  },
  async addTrip ({ commit, rootState }, trip) {
    return this.$axios.$post(`/accounts/${rootState.userAccount.currentAccountId}/trips`, trip)
  },
  async cancelTrip ({ commit, rootState }, trip) {
    return this.$axios.$patch(`/accounts/${rootState.userAccount.currentAccountId}/trips/${trip.id}/cancel`)
  },
  async tripDetail ({ commit, rootState }, trip) {
      return this.$axios.$get(`/accounts/${rootState.userAccount.currentAccountId}/trips/detail`, trip)
  },
  async reassignTrip ({ commit, rootState }, trip) {
    return this.$axios.$patch(`/accounts/${rootState.userAccount.currentAccountId}/trips/${trip.id}/reassign`)
  },
}