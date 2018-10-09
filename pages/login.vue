<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-alert :value="$auth.$state.redirect" type="info">
          Tienes que conectarte para acceder a <strong>{{ $auth.$state.redirect }}</strong>
        </v-alert>
        <v-card class="elevation-6">
          <v-toolbar dark color="secondary">
            <v-toolbar-title>Iniciar sesión</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form @keydown.enter="login">
              <v-text-field v-model="email" label="Correo electrónico" type="text" prepend-icon="person"
                            ref="email"></v-text-field>
              <v-text-field v-model="password" label="Contraseña" type="password" prepend-icon="lock"></v-text-field>
            </v-form>
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

  export default {
    components: {busyOverlay},
    mounted() {
      this.$refs.email.focus()
    },
    data() {
      return {
        email: '',
        password: ''
      };
    },
    methods: {
      login() {
        this.showLoginInfo()

        this.$store.dispatch('user/login', { email: this.email, password: this.password })
          .then(() => {
            this.showLoginSuccess({ message: `Bienvenido ${this.$auth.user.first_name}` })
            //this.$router.push({ name: 'app' })
          })
          .catch(error => {
            this.showLoginError(error.response !== undefined ? { message: error.response.data.message } : {})
          })
      },
      cancel() {
        this.$router.push({ name: 'index' })
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
      }
    }
  }
</script>