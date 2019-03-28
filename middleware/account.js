export default function ({ store }) {
  if (store.getters['userAccount/currentAccount'] == null) {
    store.dispatch('userAccount/load')
  }
}