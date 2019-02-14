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
  },
  updateDefaultPaymentCard(state, paymentCard) {
    this.$auth.user.current_account.default_payment_card = paymentCard
  }
}

export const actions = {
  async getPaymentCards({ commit, rootState }) {
    return this.$axios.$get(`/accounts/${rootState.user.current_account.id}/payment-cards`).then(data => {
      commit('setPaymentCards', data)
    })
  },
  async getPaymentCard({ commit, rootState }, id) {
    return this.$axios.$get(`/accounts/${rootState.user.current_account.id}/payment-cards/${id}`)
  },
  async updateDefaultPaymentCard({ commit, dispatch, rootState }, paymentCard) {
    return this.$axios.patch(`/accounts/${rootState.user.current_account.id}/payment-cards/${paymentCard.id}/default`).then(() => {
      return commit('updateDefaultPaymentCard', paymentCard)
    })
  },
  async addPaymentCard({ commit, dispatch, rootState }, token) {
    return this.$axios.$post(`/accounts/${rootState.user.current_account.id}/payment-cards`, { token: token })
      .then(data => {
        return dispatch('getPaymentCard', data.id)
      })
      .then(data => {
        return commit('addPaymentCard', data)
      })
  },
  async deletePaymentCard({ commit, rootState }, paymentCard) {
    return this.$axios.$delete(`/accounts/${rootState.user.current_account.id}/payment-cards/${paymentCard.id}`).then(() => {
      commit('removePaymentCard', paymentCard)
    })
  }
}