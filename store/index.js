export const state = () => ({
})

export const actions = {
  async getTrips () {
    return await this.$axios.$get('/trips')
  },
  async getTrip ({ commit }, id) {
    return this.$axios.$get(`/trips/${id}`)
  },
  async addTrip ({ commit }, trip) {
    return this.$axios.$post('/trips', trip)
  },
  async cancelTrip ({ commit }, trip) {
    return this.$axios.$patch(`/trips/${trip.id}/cancel`)
  }
}