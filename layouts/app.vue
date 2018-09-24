<template>
  <v-app>
    <Snackbar />
    <v-navigation-drawer
      fixed
      :clipped="$vuetify.breakpoint.mdAndUp"
      app
      v-model="drawer"
    >
      <v-list dense>
        <template v-for="item in items">
          <v-layout
            row
            v-if="item.heading"
            align-center
            :key="item.heading"
          >
            <v-flex xs6>
              <v-subheader v-if="item.heading">
                {{ item.heading }}
              </v-subheader>
            </v-flex>
            <v-flex xs6 class="text-xs-center">
              <a href="#!" class="body-2 black--text">EDIT</a>
            </v-flex>
          </v-layout>
          <v-divider
            v-else-if="item.divider"
            :key="item.text"
            dark
            class="my-3"
          ></v-divider>
          <v-list-group
            v-else-if="item.children"
            v-model="item.model"
            :key="item.text"
            :prepend-icon="item.model ? item.icon : item['icon-alt']"
            append-icon=""
          >
            <v-list-tile slot="activator">
              <v-list-tile-content>
                <v-list-tile-title>
                  {{ item.text }}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
            <v-list-tile
              v-for="(child, i) in item.children"
              :key="i"
            >
              <v-list-tile-action v-if="child.icon">
                <v-icon>{{ child.icon }}</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>
                  {{ child.text }}
                </v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list-group>
          <v-list-tile :key="item.text" :to="item.to" router>
            <v-list-tile-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>
                {{ item.text }}
              </v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      color="secondary"
      dark
      app
      :clipped-left="$vuetify.breakpoint.mdAndUp"
      fixed
    >
      <v-toolbar-title class="ml-0 pl-3">
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <nuxt-link :to="{ name: 'index' }">
          <v-avatar size="32px" >
            <img src="/logo.svg" alt="Auro"/>
          </v-avatar>
        <span class="hidden-sm-and-down pl-2">{{ title }}</span>
        </nuxt-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn flat>{{ $auth.user.first_name }}</v-btn>
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
    </v-toolbar>
    <v-content>
      <nuxt-child>
        <v-container fluid>
          <router-view></router-view>
        </v-container>
      </nuxt-child>

      <!--
        <v-container fluid>
          <router-view></router-view>
        </v-container>
      -->
      <!--
      <v-container fluid fill-height pa-0>
        <v-layout justify-center align-center>
          <nuxt />
        </v-layout>
      </v-container
      -->
    </v-content>
  </v-app>
</template>

<script>
  import Snackbar from '~/components/Snackbar'

  export default {
    components: {
      Snackbar
    },
    middleware: 'auth',
    data() {
      return {
        title: 'Auro',
        items: [
          { icon: 'commute', text: 'Planificar un viaje', to: { name: 'app' } },
          { icon: 'local_taxi', text: 'Viajes', to: { name: 'app-trips' } },
          { icon: 'credit_card', text: 'Métodos de pago', to: { name: 'app-payment-methods' } },
          { icon: 'settings', text: 'Parámetros' },
          { divider: true },
          { icon: 'feedback', text: 'Enviar un feedback' },
          { icon: 'history', text: 'Preguntas frecuentes' },
          { icon: 'help', text: 'Ayuda' },
        ],
        drawer: null,
      }
    },
  }
</script>