<template>
  <v-stepper-content step="1" class="text-xs-right">
    <v-card class="mb-3" elevation="0">
      <v-container grid-list-md>
        <v-form>
          <v-layout wrap>
            <v-flex xs12 sm6>
              <v-text-field
                  type="text"
                  label="Nombre"
                  v-model="firstName"
                  @input="$v.firstName.$touch()"
                  @blur="$v.firstName.$touch()"
                  :error-messages="firstNameErrors"
                  required
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm6>
              <v-text-field
                  type="text"
                  label="Apellido(s)"
                  v-model="lastName"
                  @input="$v.lastName.$touch()"
                  @blur="$v.lastName.$touch()"
                  :error-messages="lastNameErrors"
                  required
              ></v-text-field>
            </v-flex>
            <v-flex xs12 sm6>
              <v-select
                  label="Tipo de documento"
                  :items="documentOptions"
                  v-model="documentType"
                  item-text="name"
                  item-value="value"
              ></v-select>
            </v-flex>
            <v-flex xs12 sm6 v-if="documentType == 'nif' || documentType == 'nie'">
              <v-text-field
                  type="text"
                  label="Número de documento"
                  v-model="documentNumber"
                  @input="$v.documentNumber.$touch()"
                  @blur="$v.documentNumber.$touch()"
                  :error-messages="documentNumberErrors"
                  required
              ></v-text-field>
            </v-flex>
            <v-flex xs4 sm2 v-if="documentType == 'passport'">
              <v-select
                  label="País"
                  :items="countries"
                  v-model="passportCountry"
              ></v-select>
            </v-flex>
            <v-flex xs8 sm4 md4 v-if="documentType == 'passport'">
              <v-text-field
                  type="text"
                  label="Número de pasaporte"
                  v-model="passportNumber"
                  @input="$v.passportNumber.$touch()"
                  @blur="$v.passportNumber.$touch()"
                  :error-messages="passportNumberErrors"
                  required
              ></v-text-field>
            </v-flex>
          </v-layout>
        </v-form>
      </v-container>
    </v-card>

    <v-btn @click="cancel">Cancelar</v-btn>
    <v-btn class="ml-3" color="primary" @click="complete" :disabled="$v.$invalid">Continuar</v-btn>
  </v-stepper-content>
</template>

<script>
  import { required, requiredIf } from 'vuelidate/lib/validators'
  import countries from 'i18n-iso-countries';

  export default {
    validations: {
      firstName: {
        required
      },
      lastName: {
        required
      },
      documentNumber: {
        required: requiredIf(vm => vm.documentType === 'nif' || vm.documentType === 'nie'),
        valid: (value, vm) =>
          (vm.documentType === 'nif' && /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKEtrwagmyfpdxbnjzsqvhlcke]{1}$/.test(value)) ||
          (vm.documentType === 'nie' && /^[XYZ]{1}[0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKETtrwagmyfpdxbnjzsqvhlcket]{1}$/.test(value)) ||
          vm.documentType === 'passport'
      },
      passportNumber: {
        required: requiredIf(vm => vm.documentType === 'passport')
      }
    },
    data() {
      return {
        firstName: null,
        lastName: null,
        documentType: 'nif',
        documentNumber: null,
        passportCountry: null,
        passportNumber: null,
        countries: Object.keys(countries.getAlpha3Codes()),
        documentOptions: [
          { name: 'Nif', value: 'nif' },
          { name: 'Nie', value: 'nie' },
          { name: 'Pasaporte', value: 'passport' }
        ],
      }
    },
    computed: {
      firstNameErrors () {
        const errors = []
        if (!this.$v.firstName.$dirty) return errors
        !this.$v.firstName.required && errors.push('Introduce tu nombre')

        return errors
      },
      lastNameErrors () {
        const errors = []
        if (!this.$v.lastName.$dirty) return errors
        !this.$v.lastName.required && errors.push('Introduce tu(s) apellido(s)')

        return errors
      },
      documentNumberErrors () {
        const errors = []
        if (!this.$v.documentNumber.$dirty) return errors
        !this.$v.documentNumber.required && errors.push('Introduce tu número de documento')
        !this.$v.documentNumber.valid && errors.push('Número de documento inválido')

        return errors
      },
      passportNumberErrors () {
        const errors = []
        if (!this.$v.passportNumber.$dirty) return errors
        !this.$v.passportNumber.required && errors.push('Introduce tu número de pasaporte')

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
          firstName: this.firstName,
          lastName: this.lastName,
          documentType: this.documentType,
          documentNumber: this.documentType === 'nif' || this.documentType === 'nie' ? this.documentNumber : this.passportCountry + this.passportNumber
        })
      },
      clear () {
        this.$v.$reset()
        this.firstName = this.lastName = null
        this.documentType = 'nif'
        this.documentNumber = this.passportCountry = this.passportNumber = null
      }
    }
  }
</script>
