const pkg = require('./package')
const nodeExternals = require('webpack-node-externals')
require('dotenv').config()

module.exports = {
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.png' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' }
    ],
    script: [
      { src: 'https://js.stripe.com/v3' }
    ],
  },

  /*
  ** Customize the progress-bar color
  */
  loading: {
    name: 'chasing-dots',
    color: '#ff5638',
    //color: '#000000'
    background: 'white',
    height: '4px'
 },  

  /*
  ** Global CSS
  */
  css: [
    'vuetify/src/stylus/main.styl',
    '~/assets/styles/main.styl'
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '@plugins/vue-notifications.js', ssr: false },
    '@plugins/vuetify',
    '@plugins/map',
    '@plugins/firebase'
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    '@nuxtjs/toast',
    '@nuxtjs/dotenv'
  ],

  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    baseURL: process.env.API_URL
  },

  /*
   ** Auth module configuration
   */
  auth: {
    // See https://auth.nuxtjs.org/options.html
    redirect: {
      home: '/app'
    },
    strategies: {
      local: {
        endpoints: {
          login: { url: '/login', method: 'post', propertyName: 'token' },
          logout: false,
          user: { url: '/user', method: 'get', propertyName: 'user' },
        },
        //tokenType: 'Jwt',
        resetOnError: true,
        rewriteRedirects: false
      }
    }
  },

  /*
   ** Toast module configuration
   */
  toast: {
    position: 'bottom-left'
  },

  /*
  ** Build configuration
  */
  build: {
    vendor: ['axios', 'vue-notifications'],

    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
      if (ctx.isServer) {
        config.externals = [
          nodeExternals({
            whitelist: [/^vuetify/]
          })
        ]
      }
    }
  }
}
