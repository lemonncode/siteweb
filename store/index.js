import moment from 'moment'
import { firestore } from '~/plugins/firebase.js'

export const state = () => ({
  activeTripsList: [],
})

export const mutations = {
  setActiveTripsList(state, trips) {
    state.activeTripsList = trips
  },
}

export const actions = {
  async nuxtServerInit ({ dispatch, commit }) {
    await dispatch('userAccount/load').then( (account) => {
      /*firestore.collection('trips').where("account_id", "==", account.id)
          .get()
          .then(function (querySnapshot) {
            let tripsList = [];
            querySnapshot.forEach(function(doc) {
              if (doc.data().status != 'done' && doc.data().status != 'finished' && doc.data().status != 'canceled') {
                tripsList.push(doc.data());
              }
            });

          commit('setActiveTripsList', tripsList);
      }).catch((error) => {console.log(error)})*/
    }).catch( () => {this.app.router.push('/login')})
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