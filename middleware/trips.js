export default function ({ store, redirect }) {
  if (store.getters['userAccount/currentAccount'] == null) {
    store.dispatch('userAccount/load')
  }

  if (store.getters['userAccount/activeTripsList'].length > 0) {
    redirect({ name: 'app-trips-id', params: { id: store.getters['userAccount/activeTripsList'][0].id }})
  } else {
    redirect({ name: 'app-trips-new' })
  }
}