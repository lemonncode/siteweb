<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-6">
          <v-toolbar dark color="secondary">
            <v-toolbar-title>Regístrate para viajar</v-toolbar-title>
          </v-toolbar>

          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-container>
                <v-layout row wrap>
                  <v-flex xs12 sm6>
                    <v-text-field
                        v-model="user.firstName"
                        :rules="firstNameRules"
                        type="text"
                        label="Nombre"
                        required
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6>
                    <v-text-field
                        v-model="user.lastName"
                        :rules="lastNameRules"
                        type="text"
                        label="Apellidos"
                        required
                    ></v-text-field>
                  </v-flex>
                  <v-flex sm12>
                    <v-text-field
                        v-model="user.phoneNumber"
                        :rules="phoneNumberRules"
                        type="text"
                        label="Número de teléfono"
                        append-icon="smartphone"
                        mask="### ### ###"
                    ></v-text-field>
                  </v-flex>
                  <v-flex sm12>
                    <v-text-field
                        v-model="user.email"
                        :rules="emailRules"
                        type="text"
                        label="Email"
                        append-icon="email"
                    ></v-text-field>
                  </v-flex>
                  <v-flex sm12>
                    <v-text-field
                        v-model="user.password"
                        :rules="passwordRules"
                        :type="showPassword ? 'text' : 'password'"
                        :append-icon="showPassword ? 'visibility_off' : 'visibility'"
                        @click:append="showPassword = !showPassword"
                        label="Contraseña"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-form>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="" @click="cancel">Cancelar</v-btn>
            <v-btn color="secondary" @click="submit">Regístrate</v-btn>
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
        user: {
          firstName: '',
          lastName: '',
          phoneNumber: '',
          email: '',
          password: '',
        },
        valid: false,
        firstNameRules: [
          v => !!v || 'Introduce tu nombre',
        ],
        lastNameRules: [
          v => !!v || 'Introduce tus apellidos',
        ],
        phoneNumberRules: [
          v => !!v || 'Introduce tu número de teléfono',
          v => /^\d{9}$/.test(v) || 'Número de teléfono inválido',
        ],
        emailRules: [
          v => !!v || 'Introduce un email',
          v => /.+@.+/.test(v) || 'Email inválido',
        ],
        passwordRules: [
          v => !!v || 'Introduce una contraseña',
          v => v.length >= 8 || 'Usa 8 caracteres como mínimo para la contraseña',
        ],
        showPassword: false,
      };
    },
    methods: {
      submit() {
        if (!this.$refs.form.validate()) {
          return
        }

        this.$store.dispatch('user/register', this.user)
          .then(() => {
            this.$store.dispatch('user/login', this.user).then(() => {
              this.showLoginSuccess({ message: `Bienvenido ${this.$auth.user.first_name}` })
            })
          })
          .catch(error => {
            this.displayMessageError(error.response)
          })
      },
      cancel() {
        this.$router.push({ name: 'index' })
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

        this.showRegistrationError(notification)
      }
    },
    notifications: {
      showRegistrationError: {
        message: 'Error de connexión',
        type: 'error'
      },
      showLoginSuccess: {
        message: 'sesión iniciada con éxito',
        type: 'success'
      }
    }
  }
</script>