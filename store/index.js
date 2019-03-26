import moment from 'moment'

export const state = () => ({
})

export const actions = {
  async nuxtServerInit ({ dispatch }) {
    await dispatch('userAccount/load')
  },

  async getTrips ({ rootState }) {
    if (rootState.userAccount.currentAccountId != null) {
      return this.$axios.$get(`/accounts/${rootState.userAccount.currentAccountId}/trips`)
    }
  },
  async getTrip ({ commit, rootState }, id) {
    if (rootState.userAccount.currentAccountId != null) {
      return this.$axios.$get(`/accounts/${rootState.userAccount.currentAccountId}/trips/${id}`)
    }
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
  async getTripsCsv ({ rootState }) {
    return this.$axios({
      url: `/accounts/${rootState.userAccount.currentAccountId}/trips.csv`,
      method: 'GET',
      responseType: 'blob',
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      const date = new Date();
      link.href = url;
      link.setAttribute('download', `viajes${moment().format('DDMMYYYYhhmm')}.csv`);
      document.body.appendChild(link);
      link.click();
    });
  },
  async printTrip ({ rootState }, id) {
    return this.$axios({
      url: `/accounts/${rootState.userAccount.currentAccountId}/trips/${id}/invoice`,
      method: 'GET',
      responseType: 'blob',
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `factura${id}.pdf`);
      document.body.appendChild(link);
      link.click();
    });
  },
}