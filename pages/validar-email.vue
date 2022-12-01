<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-6">
          <v-toolbar dark color="secondary">
            <v-toolbar-title>Validar correo electrónico</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <p v-if="!errorMessage" class="text-xs-left text--secondary">
              Hemos enviado un mensaje a su correo electŕonico. En caso de no haberlo recibido, póngase en contacto con nosotros.
            </p>
            <p v-else class="text-xs-left text--secondary">
              El correo ya ha sido validado, o no se puede validar.
            </p>
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
                errorMessage: null
            };
        },
        mounted () {
            this.$store.dispatch('user/validateEmail', this.$auth.user.email).then( () => {
                this.showSubmitSuccess();
            }).catch( (error) => {
                this.errorMessage = error.message
                this.showSubmitError()
            });
        },
        notifications: {
            showSubmitSuccess: {
                message: 'Correo de validación enviado',
                type: 'success'
            },
            showSubmitError: {
                message: 'Error al enviar mensaje de validación',
                type: 'error'
            }
        }
    }
</script>
