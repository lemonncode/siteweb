<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-alert :value="$auth.$state.redirect" type="info">
          Tiene que iniciar sesión para acceder al servicio
        </v-alert>
        <v-card class="elevation-6">
          <v-toolbar dark color="secondary">
            <v-toolbar-title>Iniciar sesión</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form @keydown.enter="login">
              <v-text-field v-model="username" label="Correo electrónico, teléfono o documento de identidad" type="text" prepend-icon="person" ref="username"></v-text-field>
              <v-text-field v-model="password" label="Contraseña" type="password" prepend-icon="lock"></v-text-field>
            </v-form>
            <v-layout justify-space-between>
              <nuxt-link :to="{ name: 'resetPassword' }" class="secondary--text font-weight-medium">¿Has olvidado la contraseña?</nuxt-link>
              <p class="text-xs-right text--secondary">
                ¿No tiene cuenta de acceso?
                <nuxt-link :to="{ name: 'registrarse' }" class="secondary--text font-weight-medium">Crear cuenta</nuxt-link>
              </p>
            </v-layout>
          </v-card-text>
          <v-card-text>
            <captcha></captcha>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="" @click="cancel">Cancelar</v-btn>
            <v-btn color="secondary" @click="login">
              <busy-overlay/>
              Iniciar sesión
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import busyOverlay from '~/components/busy-overlay'
  import Captcha from '~/components/Captcha';
  import { mapGetters } from 'vuex';

  export default {
    components: {
        Captcha,
        busyOverlay
    },
    mounted() {
      this.$refs.username.focus()
    },
    computed: {
        ...mapGetters({
            captchaValidation: 'user/validated'
        })
    },
    data() {
      return {
        username: '',
        password: ''
      };
    },
    methods: {
      login() {
        if (this.captchaValidation) {
          this.showLoginInfo()

          this.$store.dispatch('user/login', { username: this.username, password: this.password })
            .then(() => {
                this.showLoginSuccess({ message: `Bienvenido ${this.$auth.user.first_name}` })
                //this.$router.push({ name: 'app' })
            })
            .catch(error => {
                this.showLoginError(error.response !== undefined ? { message: error.response.data.message } : {})
            })
        } else {
          this.showCaptchaMessage()
        }

      },
      cancel() {
        this.$router.push({ name: 'index' })
      },
    },
    notifications: {
      showLoginInfo: {
        message: 'Iniciando sesión',
        type: 'info'
      },
      showLoginSuccess: {
        message: 'sesión iniciada con éxito',
        type: 'success'
      },
      showLoginError: {
        message: 'Error de connexión',
        type: 'error'
      },
      showCaptchaMessage: {
        message: 'El captcha debe ser verificado',
        type: 'error'
      }
    }
  }
</script>