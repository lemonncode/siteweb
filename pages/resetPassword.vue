<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-6">
          <v-toolbar dark color="secondary">
            <v-toolbar-title>Recuperar contraseña</v-toolbar-title>
          </v-toolbar>

          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-container>
                <v-layout row wrap>
                  <v-flex sm12>
                    <v-text-field
                        v-model="email"
                        :rules="emailRules"
                        type="text"
                        label="Email"
                        append-icon="email"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
                <p class="text-xs-left text--secondary">
                  Introduzca su correo y le enviaremos las instrucciones para recuperar su contraseña
                </p>
              </v-container>
            </v-form>

          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="" @click="cancel">Cancelar</v-btn>
            <v-btn color="secondary" @click="submit">Enviar</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  export default {
    data () {
      return {
        email: '',
        valid: false,
        emailRules: [
          v => !!v || 'Introduce un email',
          v => /.+@.+/.test(v) || 'Email inválido',
        ],
      };
    },
    methods: {
      submit() {
        if (!this.$refs.form.validate()) {
          return
        }

        this.$store.dispatch('user/resetPassword', this.email)
          .catch(() => {})
          .finally(() => {
              this.$router.push({ name: 'resetPasswordValid' })
          })
      },
      cancel() {
        this.$router.push({ name: 'login' })
      },
    },
  }
</script>