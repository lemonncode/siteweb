export default function ({ app, store, redirect }) {
  app.router.beforeEach((to, from, next) => {
    if (to.path === '/login') {
      redirect(from)
      store.commit('signin/dialog', true)
    } else {
      next()
    }
  })
}