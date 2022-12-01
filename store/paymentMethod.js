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
  async addPaymentMethod({commit, rootState}, setupIntent) {
    const data = await this.$axios.$post(`/accounts/${rootState.userAccount.currentAccountId}/payment-methods`, {setupIntentId: setupIntent.id})
    commit('addPaymentMethod', data.paymentMethod)
  },
  async deletePaymentMethod({dispatch, rootState}, paymentMethod) {
    return await this.$axios.$delete(`/accounts/${rootState.userAccount.currentAccountId}/payment-methods/${paymentMethod.id}`).then(() => {
      return dispatch('getPaymentMethods')
    })
  },
  async setDefaultPaymentMethod({dispatch, rootState}, paymentMethod) {
    await this.$axios.patch(`/accounts/${rootState.userAccount.currentAccountId}/payment-methods/${paymentMethod.id}/default`)
    await dispatch('getPaymentMethods')
  }
}
