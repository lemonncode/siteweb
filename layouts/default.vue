<template>
   <v-app>
    <Snackbar />
    <v-toolbar fixed>
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
          <v-btn flat :to="{ name: 'signup' }">Registrarse</v-btn>
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

      <v-footer class="secondary">
        <v-layout row wrap align-center>
          <v-flex xs12>
            <div class="white--text ml-3">
              Copyright © 2018 Auro, All rights reserved.
            </div>
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