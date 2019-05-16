<template>
  <v-stepper-content step="3" class="text-xs-right">
    <v-card class="mb-3" elevation="0">
      <v-container grid-list-md>
        <v-form>
          <v-layout class="row">
            <v-flex xs12 sm6>
              <v-text-field
                  type="email"
                  label="Correo electrónico"
                  append-icon="email"
                  v-model="email"
                  @input="$v.email.$touch()"
                  @blur="$v.email.$touch()"
                  :error-messages="emailErrors"
                  required
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm6>
              <v-text-field
                  :type="showPassword ? 'text' : 'password'"
                  label="Contraseña"
                  :append-icon="showPassword ? 'visibility_off' : 'visibility'"
                  v-model="password"
                  @input="$v.password.$touch()"
                  @blur="$v.password.$touch()"
                  @click:append="showPassword = !showPassword"
                  :error-messages="passwordErrors"
                  required
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-form>
      </v-container>
    </v-card>

    <v-btn @click="cancel">Atrás</v-btn>
    <v-btn color="primary" @click="complete" :disabled="$v.$invalid">Continuar</v-btn>
  </v-stepper-content>
</template>

<script>
  import { email, minLength, required } from 'vuelidate/lib/validators'

  export default {
    validations: {
      email: {
        required,
        email,
      },
      password: {
        required,
        minLength: minLength(8)
      }
    },
    data() {
      return {
        email: null,
        password: null,
        showPassword: false
      }
    },
    computed: {
      emailErrors () {
        const errors = []
        if (!this.$v.email.$dirty) return errors
        !this.$v.email.required && errors.push('Introduce un email')
        !this.$v.email.email && errors.push('Email inválido')

        return errors
      },
      passwordErrors () {
        const errors = []
        if (!this.$v.password.$dirty) return errors
        !this.$v.password.required && errors.push('Introduce una contraseña')
        !this.$v.password.minLength && errors.push('La contraseña debe contener por lo menos 8 caracteres')

        return errors
      }
    },
    methods: {
      cancel () {
        this.clear()
        this.$emit('canceled')
      },
      complete () {
        this.$emit('completed', {
          email: this.email,
          password: this.password
        })
      },
      clear () {
        this.$v.$reset()
        this.email = this.password = null
      }
    }
  }
</script>