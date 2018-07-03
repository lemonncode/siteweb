<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-alert :value="error" type="error">{{ error }}</v-alert>
        <v-alert :value="$auth.$state.redirect" type="info">
          Tienes que conectarte para acceder a <strong>{{ $auth.$state.redirect }}</strong>
        </v-alert>
        <v-card class="elevation-6">
          <v-toolbar dark color="secondary">
            <v-toolbar-title>Conexión</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form @keydown.enter="login">        
              <v-text-field v-model="username" label="Correo electrónico" type="text" prepend-icon="person" ref="username"></v-text-field>
              <v-text-field v-model="password" label="Contraseña" type="password" prepend-icon="lock"></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="" @click="cancel">Cancelar</v-btn>
            <v-btn color="secondary" @click="login"><busy-overlay /> Conectarse</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script> 
  import busyOverlay from '~/components/busy-overlay'

  export default {
    components: { busyOverlay },
    mounted () {
      this.$refs.username.focus()
    },
    data () {
      return {
        username: '',
        password: '',
        error: null
      };
    },
    methods: {
      async login () {
        this.error = null

        return this.$auth
          .loginWith('local', {
            data: {
              username: this.username,
              password: this.password
            }
          })
          .catch(e => {
            this.error = e.response.data.message
          })
      }, 
      cancel () {
        this.$router.push({ name: 'index' })
      }
    }
  }
</script>