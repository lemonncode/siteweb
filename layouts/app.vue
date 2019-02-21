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
      <v-btn class="hidden-sm-and-down" v-if="current_account != null && current_account.discriminator != 'personal'" flat>{{ $auth.user.first_name }} - {{ current_account.account.customer.name }} </v-btn>
      <v-btn class="hidden-sm-and-down" v-else flat>{{ $auth.user.first_name }} </v-btn>
      <v-menu offset-y>
        <v-btn slot="activator" icon>
          <v-icon>more_vert</v-icon>
        </v-btn>
        <v-list>
          <v-list-tile @click="setAccount($auth.user.account)">
            <v-list-tile-action>
              <v-icon color="primary">account_box</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title v-bind:class="{ 'red--text': isCurrent($auth.user.account) }">Cuenta personal</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-divider inset></v-divider>

          <v-list-tile v-for="account in user_accounts" :key="account.id" @click="setAccount(account)">
            <v-list-tile-action>
              <v-icon color="primary">assessment</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title v-bind:class="{ 'red--text': isCurrent(account) }">{{ account.account.customer.name }}</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <v-divider inset></v-divider>
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
  import { mapGetters, mapActions, mapMutations } from 'vuex';

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
          { icon: 'assessment', text: 'Cuentas', to: { name: 'app-accounts' } },
          { icon: 'settings', text: 'Configuración' },
          { divider: true },
          { icon: 'feedback', text: 'Enviar un feedback' },
          { icon: 'history', text: 'Preguntas frecuentes' },
          { icon: 'help', text: 'Ayuda' },
        ],
        drawer: null,
      }
    },
    created: function () {
      this.setAccount(null);
    },
    computed: {
        ...mapGetters({
            current_account: 'userAccount/currentAccount',
            users_account: 'account/currentUsersAccount',
            user_accounts: 'userAccount/userAccounts'
        }),
    },
    methods: {
      ...mapActions({
        refreshAccount: 'userAccount/refreshAccount',
        userAccounts: 'userAccount/userAccounts',
        getUsers: 'account/getCurrentUsers',
        getAccounts: 'userAccount/getUserAccounts'
      }),
      ...mapMutations({
          addUserSelected: 'userAccount/addUserSelected',
      }),
      setAccount: function(account) {
        this.getAccounts().then( (accounts) => {
          this.refreshAccount([account, accounts]).then( (data) => {
            let discriminator = this.getDiscriminator(data);
            if (discriminator == 'business') {
                this.getUsers(data.account.id).then(() => {
                    let currentDiscriminator = this.getDiscriminator(this.current_account);
                    if (currentDiscriminator == 'business') {
                        let _self = this;
                        let userSelected = this.users_account.find(function (user) {
                            return user.user.id == _self.$auth.user.id
                        });

                        this.addUserSelected(userSelected);
                    }
                })
            }
          });
        })
      },
      isCurrent(account) {
        if (this.current_account != null) {
            return this.current_account.id == account.id;
        }

        return false;
      },
      getDiscriminator(account) {
          return (typeof account.account != 'undefined') ? account.account.discriminator: account.discriminator;
      }
    }
  }
</script>