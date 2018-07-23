export const state = () => ({
})

export const actions = {
  async getTrips () {
    return this.$axios.$get('/user/trips')
  },
  async getTrip ({ commit }, id) {
    return this.$axios.$get(`/user/trips/${id}`)
  },
  async addTrip ({ commit }, trip) {
    return this.$axios.$post('/user/trips', trip)
  },
  async cancelTrip ({ commit }, trip) {
    return this.$axios.$patch(`/user/trips/${trip.id}/cancel`)
  }
}