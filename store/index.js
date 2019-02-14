export const state = () => ({
})

export const actions = {
  async getTrips ({ rootState }) {
    return this.$axios.$get(`/accounts/${rootState.user.current_account.id}/trips`)
  },
  async getTrip ({ commit, rootState }, id) {
    return this.$axios.$get(`/accounts/${rootState.user.current_account.id}/trips/${id}`)
  },
  async addTrip ({ commit, rootState }, trip) {
    return this.$axios.$post(`/accounts/${rootState.user.current_account.id}/trips`, trip)
  },
  async cancelTrip ({ commit, rootState }, trip) {
    return this.$axios.$patch(`/accounts/${rootState.user.current_account.id}/trips/${trip.id}/cancel`)
  },
  async tripDetail ({ commit, rootState }, trip) {
      return this.$axios.$get(`/accounts/${rootState.user.current_account.id}/trips/detail`, trip)
  },
  async reassignTrip ({ commit, rootState }, trip) {
    return this.$axios.$patch(`/accounts/${rootState.user.current_account.id}/trips/${trip.id}/reassign`)
  },
}