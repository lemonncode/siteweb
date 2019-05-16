<template>
  <v-layout row justify-space-between>
    <v-flex xs3>
      <v-text-field
          type="text"
          label="Prefijo"
          prefix="+"
          v-model="extension"
          @input="$v.extension.$touch()"
          @blur="$v.extension.$touch()"
          :error-messages="extensionErrors"
          @keyup="change"
          required
      ></v-text-field>
    </v-flex>
    <v-flex xs8>
      <v-text-field
          type="text"
          label="Número de teléfono"
          v-model="number"
          @input="$v.number.$touch()"
          @blur="$v.number.$touch()"
          :error-messages="numberErrors"
          @keyup="change"
          required
      ></v-text-field>
    </v-flex>
  </v-layout>
</template>

<script>
  import { required } from 'vuelidate/lib/validators'

  export default {
    validations: {
      extension: {
        required
      },
      number: {
        required
      }
    },
    props: ['value'],
    data () {
      return {
        extension: '34',
        number: null
      }
    },
    watch: {
      value: {
        immediate: true,
        handler (val) {
          if (!this.value) return

          this.extension = this.value.substring(1, 3)
          this.number = this.value.substring(3)
        }
      },
    },
    computed: {
      extensionErrors () {
        const errors = []
        if (!this.$v.extension.$dirty) return errors
        !this.$v.extension.required && errors.push('Introduce un prefijo')

        return errors
      },
      numberErrors () {
        const errors = []
        if (!this.$v.number.$dirty) return errors
        !this.$v.number.required && errors.push('Introduce un número de teléfono')

        return errors
      }
    },
    methods: {
      change() {
        let phoneNumber = !this.$v.$invalid ? '+' + this.extension + this.number : null
        this.$emit('input', phoneNumber)
      }
    }
  }
</script>
