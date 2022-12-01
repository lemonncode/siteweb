<template>
  <v-app>
    <v-system-bar
      app
      color="orange"
      style="font-weight: 100; color: black;"
      v-if="!$auth.user.verified_email && !emailVerified"
    >
      <div class="flex-grow-1"></div>
      <v-icon color="black">warning</v-icon><n-link to="/validar-email" no-prefetch> Pinche aquí para validar su correo electrónico.</n-link>
    </v-system-bar>
    <Snackbar />
    <v-navigation-drawer
      app
      v-model="drawer"
      :clipped="$vuetify.breakpoint.lgAndUp"
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
            <v-list-item v-slot:activator="{ on }">
              <v-list-item-content v-on="on">
                <v-list-item-title>
                  {{ item.text }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item
              v-for="(child, i) in item.children"
              :key="i"
            >
              <v-list-item-action v-if="child.icon">
                <v-icon>{{ child.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>
                  {{ child.text }}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
          <v-list-item :key="item.text" :to="item.to" router exact>
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title>
                {{ item.text }}
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </template>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      color="secondary"
      dark
      app
    >
      <v-toolbar-title class="ml-0 pl-3">
        <nuxt-link :to="{ name: 'index' }">
          <v-avatar size="32px" >
            <img src="/logo.svg" alt="Auro"/>
          </v-avatar>
          <span class="hidden-sm-and-down pl-2">{{ title }}</span>
        </nuxt-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text v-if="currentAccount != null && currentAccount.discriminator != 'personal'">{{ $auth.user.first_name }} - {{ currentAccount.account.name }} </v-btn>
      <v-btn text v-else>{{ $auth.user.first_name }} </v-btn>
      <v-menu
        offset-y
        left
        bottom
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>mdi-dots-vertical</v-icon>
          </v-btn>
        </template>

        <v-list>
          <v-list-item @click="setAccount($auth.user.account)">
            <v-list-item-action>
              <v-icon color="primary">account_box</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-bind:class="{ 'red--text': isCurrent($auth.user.account) }">Cuenta personal</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-divider inset></v-divider>

          <v-list-item v-for="account in userAccounts" :key="account.id" @click="setAccount(account)">
            <v-list-item-action>
              <v-icon color="primary">assessment</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-bind:class="{ 'red--text': isCurrent(account) }">{{ account.account.name }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-divider inset></v-divider>
          <v-list-item @click="$auth.logout()">
            <v-list-item-action>
              <v-icon color="primary">exit_to_app</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title >Cerrar sesión</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main>
      <nuxt />
    </v-main>
  </v-app>
</template>

<script>
  import Snackbar from '~/components/Snackbar'
  import { mapGetters, mapActions } from 'vuex';

  export default {
    components: {
      Snackbar
    },
    middleware: ['auth', 'account'],
    data() {
      return {
        title: 'Auro',
        items: [
          { icon: 'commute', text: 'Planificar un viaje', to: { name: 'app-trips-new' } },
          { icon: 'local_taxi', text: 'Viajes', to: { name: 'app-trips' } },
          { icon: 'credit_card', text: 'Métodos de pago', to: { name: 'app-payment-methods' } },
          { icon: 'assessment', text: 'Cuentas de empresa', to: { name: 'app-accounts' } },
          { icon: 'attach_money', text: 'Descuentos', to: { name: 'app-discounts' } },
          { icon: 'settings', text: 'Configuración', to: { name: 'app-settings' } },
          { divider: true },
          /*{ icon: 'feedback', text: 'Enviar un feedback' },
          { icon: 'history', text: 'Preguntas frecuentes' },
          { icon: 'help', text: 'Ayuda' },*/
        ],
        drawer: null,
      }
    },
    computed: {
      ...mapGetters({
        currentAccount: 'userAccount/currentAccount',
        userAccounts: 'userAccount/userAccounts',
        emailVerified: 'user/emailValidated',
      }),
    },
    methods: {
      ...mapActions({
        setAccount: 'userAccount/setAccount',
      }),
      isCurrent(account) {
        if (typeof account != 'undefined' && account != null && this.currentAccount != null) {
            return this.currentAccount.id == account.id;
        }

        return false;
      }
    }
  }
</script>
