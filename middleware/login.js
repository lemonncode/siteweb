export default function ({ store, route, redirect }) {
  if (store.$auth.loggedIn && route.path === '/login') {
    redirect({ name: 'app' })
  }
}