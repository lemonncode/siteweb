<template>
  <v-stepper-content step="2" class="text-xs-right">
    <v-card class="mb-3" elevation="0">
      <v-container grid-list-md>
        <v-form>
          <v-layout wrap>
            <v-flex xs4 sm2 md2>
              <v-text-field
                  type="text"
                  label="Prefijo"
                  prefix="+"
                  v-model="phoneNumberExtension"
                  @input="$v.phoneNumberExtension.$touch()"
                  @blur="$v.phoneNumberExtension.$touch()"
                  :error-messages="phoneNumberExtensionErrors"
                  required
              ></v-text-field>
            </v-flex>
            <v-flex xs8 sm4 md4>
              <v-text-field
                  type="text"
                  label="Número de teléfono"
                  v-model="phoneNumber"
                  @input="$v.phoneNumber.$touch()"
                  @blur="$v.phoneNumber.$touch()"
                  :error-messages="phoneNumberErrors"
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
  import { required } from 'vuelidate/lib/validators'

  export default {
    validations: {
      phoneNumberExtension: {
        required
      },
      phoneNumber: {
        required
      }
    },
    data() {
      return {
        phoneNumberExtension: '34',
        phoneNumber: null
      }
    },
    computed: {
      phoneNumberExtensionErrors () {
        const errors = []
        if (!this.$v.phoneNumberExtension.$dirty) return errors
        !this.$v.phoneNumberExtension.required && errors.push('Introduce tu prefijo')

        return errors
      },
      phoneNumberErrors () {
        const errors = []
        if (!this.$v.phoneNumber.$dirty) return errors
        !this.$v.phoneNumber.required && errors.push('Introduce un número de télefono')

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
          phoneNumber: '+' + this.phoneNumberExtension + this.phoneNumber
        })
      },
      clear () {
        this.$v.$reset()
        this.phoneNumberExtension = 34
        this.phoneNumber = null
      }
    }
  }
</script>