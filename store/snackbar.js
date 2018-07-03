export const state = () => ({
  snack: {
    message: '',
    color: ''
  }
})

export const mutations = {
  setSnack (state, snack) {
    state.snack = snack
  }
}