<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template v-slot:activator="{ on }">
      <v-btn text v-on="on">Iniciar sesión</v-btn>
    </template>
    <v-card>
      <v-card-title class="secondary white--text">
        <span class="headline">Iniciar sesión</span>
      </v-card-title>
      <v-card-text>
        <v-container grid-list-md>
          <v-form @keydown.enter="login">
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field
                    v-model="username"
                    label="Correo electrónico / número de teléfono"
                    type="text"
                    prepend-icon="person"
                    ref="username">
                </v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                    v-model="password"
                    label="Contraseña"
                    type="password"
                    prepend-icon="lock"
                    :type="showPassword ? 'text' : 'password'"
                    :append-icon="showPassword ? 'visibility_off' : 'visibility'"
                    @click:append="showPassword = !showPassword">
                </v-text-field>
                <nuxt-link :to="{ name: 'resetPassword' }" class="secondary--text ml-4">¿Has olvidado la contraseña?</nuxt-link>
              </v-flex>
              <v-flex x12 text--secondary text-xs-right>
                  ¿No tiene cuenta de acceso?
                  <a class="secondary--text font-weight-medium" @click="signup">Crear cuenta</a>
              </v-flex>
              <v-flex class="mt-3" x12>
                <captcha></captcha>
              </v-flex>
            </v-layout>
          </v-form>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="dialog = false">Cancelar</v-btn>
        <v-btn color="primary" @click="login">Iniciar sesión</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import Captcha from '~/components/Captcha'

  export default {
    data() {
      return {
        username: null,
        password: null,
        showPassword: false,
        showConfirmPassword: false
      }
    },
    watch: {
      '$route.path' () {
        this.dialog = false
      }
    },
    computed: {
      ...mapGetters({
        captchaValidation: 'user/validated'
      }),
      dialog: {
        get () {
          return this.$store.state.signin.dialog
        },
        set (value) {
          this.$store.dispatch('signin/dialog', value)
        }
      }
    },
    methods: {
      ...mapActions({
        userLogin: 'user/login',
        setAccount: 'userAccount/setAccount',
        loadAccount: 'userAccount/load',
        setSignupDialog: 'signup/dialog'
      }),
      login () {
        if (!this.captchaValidation) {
          this.showCaptchaMessage()
          return
        }

        this.showLoginInfo()

        this.userLogin({ username: this.username, password: this.password })
          .then(() => {
            this.setAccount(this.$auth.user.account)
            this.loadAccount()
            this.showLoginSuccess({ message: `Bienvenido ${this.$auth.user.first_name}` })
            //this.$router.push({ name: 'app' })
          })
          .catch(error => {
            this.showLoginError(error.response !== undefined ? { message: error.response.data.message } : {})
          })
      }, signup () {
        this.dialog = false
        this.setSignupDialog(true)
      }
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
    },
    components: {
      Captcha
    },
  }
</script>
