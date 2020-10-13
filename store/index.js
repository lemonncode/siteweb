import moment from 'moment'

export const actions = {
  async nuxtServerInit ({ dispatch, commit }) {
    await dispatch('userAccount/load')
        .catch( () => {
          this.app.router.push('/login')
        })
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

  async tripRequest ({}, data) {
    return this.$axios.$post(`/trip-requests`, data, { headers: { 'X-Device': 'website' }})
  },
  async addTripFromRequest ({ }, data) {
    return this.$axios.$post(`/trips`, data)
  },

  async tripDetail ({ commit, rootState }, data) {
    return this.$axios.$post(`/trips/price`, {
      account: rootState.userAccount.currentAccountId,
      origin: data.origin,
      destination: data.destination,
      //coupon: 'SUMMER2019',
    })
  },
  async reassignTrip ({ commit, rootState }, trip) {
    return this.$axios.$patch(`/accounts/${rootState.userAccount.currentAccountId}/trips/${trip.id}/reassign`)
  },
  async getTripsCsv ({ rootState }) {
    return this.$axios({
      url: `/company-accounts/${rootState.userAccount.currentAccountId}/trips.csv`,
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
