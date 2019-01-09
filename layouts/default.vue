<template>
   <v-app>
    <Snackbar />
    <v-toolbar>
      <v-toolbar-title class="ml-0 pl-0">
        <nuxt-link :to="{ name: 'index' }">
          <v-avatar size="32px" >
            <img src="/logo-base-black.png" alt="Auro"/>
          </v-avatar>
          <span class="hidden-sm-and-down pl-2">{{ title }}</span>
        </nuxt-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <template v-if="!$auth.$state.loggedIn">
        <v-toolbar-items>
          <v-btn flat :to="{ name: 'registrarse' }">Registrarse</v-btn>
          <v-btn flat :to="{ name: 'login' }">Iniciar sesión</v-btn>
        </v-toolbar-items>
      </template>
      <template v-else>
        <v-btn :to="{ name: 'app' }" icon color="secondary">
          <v-icon>add</v-icon>
        </v-btn>
        <v-menu offset-y>
          <v-btn slot="activator" icon>
            <v-icon>more_vert</v-icon>
          </v-btn>
          <v-list>
            <v-list-tile @click="$auth.logout()">
              <v-list-tile-action>
                <v-icon color="primary">exit_to_app</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title >Cerrar sesión</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-menu>
      </template>
    </v-toolbar>
    <v-content>
      <nuxt></nuxt>
      <v-footer class="secondary" color="#ed6363" height="auto">
        <v-layout justify-center
                  row
                  wrap
        >
          <v-btn
              color="white"
              flat
              round
          >
            <router-link to="politica-de-cookies">Política de cookies</router-link>
          </v-btn>
          <v-btn
              color="white"
              flat
              round
          >
            <router-link to="aviso-legal">Aviso legal</router-link>
          </v-btn>
          <v-btn
              color="white"
              flat
              round
          >
            <router-link to="politica-de-privacidad">Política de privacidad</router-link>
          </v-btn>
          <v-flex
              lighten-2
              py-3
              text-xs-center
              white--text
              xs12
          >
            &copy; 2019 — <strong>Auro Travel</strong>
          </v-flex>
        </v-layout>
      </v-footer>

    </v-content>
  </v-app>
</template>

<script>
  import Snackbar from '~/components/Snackbar'

  export default {
    components: {
      Snackbar
    },
    middleware: 'login',
    data() {
      return {
        title: 'Auro',
      }
    }
  }
</script>