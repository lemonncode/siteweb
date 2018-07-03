<template>
   <v-app>
    <v-toolbar fixed>
      <v-toolbar-title class="ml-0 pl-3">
        <nuxt-link :to="{ name: 'index' }">
          <v-avatar size="32px" >
            <img src="/logo-base-black.png" alt="Auro"/>
          </v-avatar>
          <span class="hidden-sm-and-down pl-2">{{ title }}</span>
        </nuxt-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <template v-if="!$auth.$state.loggedIn">
        <v-toolbar-items class="hidden-sm-and-down">
          <v-btn flat>Crear una cuenta</v-btn>
          <v-btn flat :to="{ name: 'login' }">Iniciar sesión</v-btn>
        </v-toolbar-items>
      </template>
      <template v-else>
        <v-btn :to="{ name: 'app' }" icon color="secondary">
          <v-icon>add</v-icon>
        </v-btn>
        <v-btn :to="{ name: 'app' }" icon>
          <v-icon>apps</v-icon>
        </v-btn>
        <v-btn icon>
          <v-icon>more_vert</v-icon>
        </v-btn>
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
  export default {
    middleware: 'login',
    data() {
      return {
        title: 'Auro',
      }
    }
  }
</script>