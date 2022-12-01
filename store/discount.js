export const state = () => ({
  discounts: []
})

export const getters = {
  discounts: state => state.discounts
}

export const mutations = {
  discounts(state, discounts) {
    state.discounts = discounts
  },
  addDiscount(state, discount) {
    state.discounts.push(discount)
  },
  removeDiscount(state, discount) {
    state.discounts.slice(discount)
  }
}

export const actions = {
  async getDiscounts({ commit, rootState }) {
    if (rootState.userAccount.currentAccountId != null) {
      return this.$axios.$get(`/accounts/${rootState.userAccount.currentAccountId}/discounts`).then(data => {
        commit('discounts', data)
        return data
      })
    }
  },
  async addDiscount({ commit, rootState }, discount) {
    return this.$axios.$post(`/accounts/${rootState.userAccount.currentAccountId}/discounts`, discount)
      .then(data => {
        return commit('addDiscount', data)
      })
  },
  async removeDiscount({ commit, rootState }, id) {
    return this.$axios.$post(`/accounts/${rootState.userAccount.currentAccountId}/discounts/delete`, id)
      .then(data => {
        return commit('addDiscount', data)
      })
  }
}
