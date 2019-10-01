<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-6">
          <v-toolbar dark color="secondary">
            <v-toolbar-title>Validar correo electrónico</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
              <p class="text-xs-left text--secondary">
                {{ text }}
              </p>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import { mapActions } from 'vuex';

  export default {
    data () {
      return {
        validToken: false,
        text: 'Verificando....',
      };
    },
    created() {
      if (process.client) {
        this.token = this.$route.params.id
        this.$store.dispatch('user/emailValidation', { token: this.token})
          .then(() => {
            this.text = 'El correo ha sido validado correctamente.';
            this.validToken = true;
            this.emailValidated(true);
          })
          .catch(error => {
            this.text = 'El token no es correcto.'
            this.validToken = false;
          })
      }
    },
    methods: {
      ...mapActions({
        emailValidated: 'user/emailValidated',
      }),
    }
  }
</script>
