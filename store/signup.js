export const state = () => ({
  dialog: false
})

export const getters = {
  dialog: state => state.dialog,
}

export const mutations = {
  dialog: (state, boolean) => state.dialog = boolean
}

export const actions = {
  dialog: ({ commit }, boolean) => commit('dialog', boolean)
}