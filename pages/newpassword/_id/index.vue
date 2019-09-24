<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-6">
          <v-toolbar dark color="secondary">
            <v-toolbar-title>Nueva contraseña</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form v-if = "validToken" ref="form" v-model="valid" lazy-validation>
              <v-container>
                <v-layout row wrap>
                  <v-flex sm12>
                    <v-text-field
                        v-model="password"
                        :rules="passwordRules"
                        :type="showPassword ? 'text' : 'password'"
                        :append-icon="showPassword ? 'visibility_off' : 'visibility'"
                        @click:append="showPassword = !showPassword"
                        label="Contraseña"
                    ></v-text-field>
                  </v-flex>
                  <v-flex sm12>
                    <v-text-field
                        v-model="confirmPassword"
                        :rules="confirmPasswordRules"
                        :type="showConfirmPassword ? 'text' : 'password'"
                        :append-icon="showConfirmPassword ? 'visibility_off' : 'visibility'"
                        @click:append="showConfirmPassword = !showConfirmPassword"
                        label="Confirmar contraseña"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-form>
            <v-card-text v-else>
              <p class="text-xs-left text--secondary">
                El token no es válido
              </p>
            </v-card-text>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="" @click="cancel">Cancelar</v-btn>
            <v-btn v-if="validToken" color="secondary" @click="submit">Enviar</v-btn>
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
        password: '',
        confirmPassword: '',
        showPassword: false,
        showConfirmPassword: false,
        valid: false,
        passwordRules: [
          v => !!v || 'Introduce una contraseña',
          v => v.length >= 8 || 'Usa 8 caracteres como mínimo para la contraseña',
        ],
          confirmPasswordRules: [
            v => !!v || 'Confirma la contraseña',
            v => v == this.password || 'Las contraseñas no coinciden',
        ],
        validToken: true,
      };
    },
    created() {
      this.token = this.$route.params.id
      this.$store.dispatch('user/validToken', { token: this.token})
        .then(() => {
          this.validToken = true;
        })
        .catch(error => {
          this.validToken = false;
        })
    },
    methods: {
      submit() {
        if (!this.$refs.form.validate()) {
          return
        }

        this.$store.dispatch('user/newPassword', { token: this.token, password: this.password, confirmPassword: this.confirmPassword })
          .then(() => {
              this.$router.push({ name: 'app' })
          })
          .catch(error => {
            this.showSubmitError()
          })
      },
      cancel() {
        this.$router.push({ name: 'app' })
      },
      displayMessageError(response) {
        let notification = {}

        if (response !== undefined) {
          for (let [key, value] of Object.entries(response.data.errors.children)) {
            if (value.errors !== undefined && value.errors.length > 0) {
              notification = { message: value.errors[0] }
              break
            }
          }
        }

        this.showSubmitError(notification)
      }
    },
    notifications: {
      showSubmitError: {
        message: 'Error al intentar generar una nueva contraseña',
        type: 'error'
      }
    }
  }
</script>
