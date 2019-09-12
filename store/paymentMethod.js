export const state = () => ({
  paymentMethods: []
})

export const getters = {
  paymentMethods: state => state.paymentMethods
}

export const mutations = {
  setPaymentMethods(state, paymentMethods) {
    state.paymentMethods = paymentMethods
  },
  addPaymentMethod(state, paymentMethod) {
    state.paymentMethods.push(paymentMethod)
  },
  removePaymentMethod(state, paymentMethod) {
    state.paymentMethods.splice(state.paymentMethods.indexOf(paymentMethod), 1)
  }
}

export const actions = {
  async getSetupIntent({rootState}) {
    const data = await this.$axios.$get(`/accounts/${rootState.userAccount.currentAccountId}/payment-methods/setup-intent`)

    return data.setupIntent
  },
  async getPaymentMethods({commit, rootState}) {
    const data = await this.$axios.$get(`/accounts/${rootState.userAccount.currentAccountId}/payment-methods`)
    commit('setPaymentMethods', data.paymentMethods)
  },
  async addPaymentMethod({commit, dispatch, state, rootState}, setupIntent) {
    const data = await this.$axios.$post(`/accounts/${rootState.userAccount.currentAccountId}/payment-methods`, {setupIntentId: setupIntent.id})
    commit('addPaymentMethod', data.paymentMethod)
  },
  async deletePaymentMethod({commit, rootState}, paymentMethod) {
    return await this.$axios.$delete(`/accounts/${rootState.userAccount.currentAccountId}/payment-methods/${paymentMethod.id}`)
      .then(() => commit('removePaymentMethod', paymentMethod))
  },
  async setDefaultPaymentMethod({commit, dispatch, rootState}, paymentMethod) {
    await this.$axios.patch(`/accounts/${rootState.userAccount.currentAccountId}/payment-methods/${paymentMethod.id}/default`)
    commit('userAccount/setDefaultPaymentMethod', paymentMethod, { root: true })
  }
}
