export const state = () => ({
  dialog: false,
  paymentCards: []
})

export const getters = {
  dialog: state => state.dialog,
  paymentCards: state => state.paymentCards
}

export const mutations = {
  openDialog(state) {
    state.dialog = true
  },
  closeDialog(state) {
    state.dialog = false
  },
  setPaymentCards(state, paymentCards) {
    state.paymentCards = paymentCards
  },
  addPaymentCard(state, paymentCard) {
    state.paymentCards.push(paymentCard)
  },
  removePaymentCard(state, paymentCard) {
    state.paymentCards.splice(state.paymentCards.indexOf(paymentCard), 1)
  }
}

export const actions = {
  async getPaymentCards({ commit }) {
    return this.$axios.$get('/user/payment-cards').then(data => {
      commit('setPaymentCards', data)
    })
  },
  async getPaymentCard({ commit }, id) {
    return this.$axios.$get(`/user/payment-cards/${id}`)
  },
  async addPaymentCard({ commit, dispatch }, token) {
    return this.$axios.$post('/user/payment-cards', { token: token })
      .then(data => {
        return dispatch('getPaymentCard', data.id)
      })
      .then(data => {
        return commit('addPaymentCard', data)
      })
  },
  async deletePaymentCard({ commit }, paymentCard) {
    return this.$axios.$delete(`/user/payment-cards/${paymentCard.id}`).then(() => {
      commit('removePaymentCard', paymentCard)
    })
  }
}