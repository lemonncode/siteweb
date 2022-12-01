import colors from 'vuetify/es5/util/colors'
const pkg = require('./package')
const nodeExternals = require('webpack-node-externals')

export default {
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: "Auro Travel | Auro New Transport Concept",
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content:
          "Auro Travel, la manera más cómoda de viajar. Embárcate en la flota líder",
      },
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.png" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons",
      },
    ],
    script: [
      { src: "https://js.stripe.com/v3" },
      {
        src: "https://www.google.com/recaptcha/api.js?onload=vueRecaptchaApiLoaded&render=explicit",
      },
    ],
  },

  /*
   ** Customize the progress-bar color
   */
  loading: {
    name: "chasing-dots",
    color: "#ff5638",
    //color: '#000000'
    background: "white",
    height: "4px",
  },

  /*
   ** Global CSS
   */
  css: [
    // "~/assets/styles/main.styl"
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    { src: "@plugins/vue-notifications.js", ssr: false },
    "@plugins/map",
    "@plugins/firebase",
    { src: "@plugins/telephone", ssr: false },
    "@plugins/login",
    "@plugins/vuelidate",
    { src: "~plugins/ga.js", ssr: false },
    "~/plugins/api",
    { src: "~plugins/vue-cookie-law", ssr: false },
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
   
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    "@nuxtjs/axios",
    "@nuxtjs/auth-next",
    "@nuxtjs/toast",
    "@nuxtjs/dotenv",
    "cookie-universal-nuxt",
    "@nuxtjs/vuetify",
   
  ],

  /*
   ** Axios module configuration
   */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    baseURL: process.env.API_URL,
  },

  auth: {
    strategies: {
      local: {
        scheme: "refresh",
        refreshToken: {
          property: "refresh_token",
        },
        user: {
          property: "user",
        },
        endpoints: {
          login: {
            url: "/login",
            method: "post",
          },
          refresh: {
            url: "/token/refresh",
            method: "post",
          },
          user: {
            url: "/user",
            method: "get",
          },
          logout: false,
        },
      },
    },
    redirect: {
      home: "/app",
    },
  },

  /*
   ** Toast module configuration
   */
  toast: {
    position: "bottom-left",
  },

  // Vuetify module configuration (https://go.nuxtjs.dev/config-vuetify)
  vuetify: {
    customVariables: ["~/assets/variables.scss"],
    theme: {
      dark: false,
      themes: {
        light: {
          primary: "#003545",
          accent: colors.grey.darken3,
          secondary: "#ed6363",
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    transpile: [/^vue2-google-maps($|\/)/],
    vendor: ["axios", "vue-notifications"],

    /*
     ** You can extend webpack config here
     */
    extend(config, ctx) {
      module.exports = {
        module: {
          rules: [
            {
              test: /\.styl$/,
              loader: "stylus-loader", // compiles Styl to CSS
            },
          ],
        },
      };
    },
  },
};
