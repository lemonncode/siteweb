<template>
   <v-app>
    <Snackbar />
    <v-app-bar
      app
    >
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

          <signup-dialog></signup-dialog>
          <signin-dialog></signin-dialog>
      </template>
      <template v-else>
        <v-btn
          fab
          dark
          small
          color="secondary"
          :to="{ name: 'app' }"
        >
          <v-icon dark>
            mdi-plus
          </v-icon>
        </v-btn>
        <v-menu offset-y>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" icon>
              <v-icon>more_vert</v-icon>
            </v-btn>
          </template>
          <v-list>
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
      </template>
    </v-app-bar>
    <v-main>
      <nuxt></nuxt>
    </v-main>
    <v-footer
       app
       class="secondary"
       color="#ed6363"
       height="auto"
       absolute
     >
       <v-row
         justify="center"
         no-gutters
       >
         <v-btn
           color="white"
           text
           rounded
           class="my-2"
         >
           <router-link to="politica-de-cookies">Política de cookies</router-link>
         </v-btn>
         <v-btn
           color="white"
           text
           rounded
           class="my-2"
         >
           <router-link to="politica-de-privacidad">Política de privacidad</router-link>
         </v-btn>
         <v-btn
           color="white"
           text
           rounded
           class="my-2"
         >
           <router-link to="aviso-legal">Aviso legal</router-link>
         </v-btn>
         <v-btn
           color="white"
           text
           rounded
           class="my-2"
         >
           <router-link to="politica-de-calidad">Política de calidad y medio ambiente</router-link>
         </v-btn>
         <v-col
           class="secondary py-4 text-center white--text"
           cols="12"
         >
           {{ new Date().getFullYear() }} — <strong>Auro Travel</strong>
         </v-col>
       </v-row>
     </v-footer>
    <div id="recaptcha-container"></div>
  </v-app>
</template>

<script>
  import SignupDialog from '~/components/Signup/SignupDialog';
  import SigninDialog from '~/components/Signin/SigninDialog';
  import Snackbar from '~/components/Snackbar'

  export default {
    data() {
      return {
        title: 'Auro',
      }
    },
    components: {
      SignupDialog,
      SigninDialog,
      Snackbar
    }
  }
</script>
