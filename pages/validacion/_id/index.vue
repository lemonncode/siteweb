<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-6">
          <v-toolbar dark color="secondary">
            <v-toolbar-title>Validar correo electrónico</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <p v-if="validToken" class="text-xs-left text--secondary">
              El correo ha sido validado correctamente.
            </p>
            <v-card-text v-else>
              <p class="text-xs-left text--secondary">
                El token no es válido
              </p>
            </v-card-text>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    data () {
      return {
        validToken: true,
      };
    },
    created() {
      this.token = this.$route.params.id
      this.$store.dispatch('user/emailValidToken', { token: this.token})
        .then(() => {
          this.validToken = true;
          this.$store.dispatch('user/emailValidation', { token: this.token})
        })
        .catch(error => {
          this.validToken = false;
        })
    }
  }
</script>
