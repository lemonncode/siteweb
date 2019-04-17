<template>
  <v-dialog v-model="dialog" persistent max-width="800px">
    <template v-slot:activator="{ on }">
      <v-btn flat v-on="on">Registrarse</v-btn>
    </template>
    <v-card>
      <v-card-title class="secondary white--text">
        <span class="headline">Regístrate para viajar</span>
      </v-card-title>

      <v-stepper v-model="currentStep">
        <v-stepper-header>
          <v-stepper-step :complete="currentStep > 1" step="1">Paso 1</v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step :complete="currentStep > 2" step="2">Paso 2</v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step step="3">Paso 3</v-stepper-step>
        </v-stepper-header>

        <v-stepper-items>
          <step1 @canceled="cancel($event)" @completed="completeStep1($event)"></step1>
          <step2 @canceled="cancel($event)" @completed="completeStep2($event)"></step2>
          <step3 @canceled="cancel($event)" @completed="completeStep3($event)"></step3>
        </v-stepper-items>
      </v-stepper>
    </v-card>
  </v-dialog>
</template>

<script>
  import Step1 from './Step1'
  import Step2 from './Step2'
  import Step3 from './Step3'

  export default {
    data() {
      return {
        currentStep: 0,
        user: {
          firstName: null,
          lastName: null,
          documentType: null,
          documentNumber: null,
          phoneNumber: null,
          email: null,
          password: null
        }
      }
    },
    computed: {
      dialog: {
        get () {
          return this.$store.state.signup.dialog
        },
        set (value) {
          this.$store.dispatch('signup/dialog', value)
        }
      }
    },
    methods: {
      cancel (event) {
        if (this.currentStep == 1) {
          this.dialog = false
        } else {
          this.currentStep--
        }
      },
      completeStep1 (event) {
        this.currentStep = 2
        this.user.firstName = event.firstName
        this.user.lastName = event.lastName
        this.user.documentType = event.documentType
        this.user.documentNumber = event.documentNumber
      },
      completeStep2 (event) {
        this.currentStep = 3
        this.user.phoneNumber = event.phoneNumber
      },
      completeStep3 (event) {
        this.user.email = event.email
        this.user.password = event.password
        this.complete()
      },
      complete () {
        this.$store.dispatch('user/register', this.user)
          .then(() => this.$store.dispatch('user/login', {username: this.user.email, password: this.user.password}))
          .then(() => this.dialog = false)
          .then(() => this.showLoginSuccess({message: `Bienvenido ${this.$auth.user.first_name}`}) )
          .catch(error => this.displayMessageError(error.response))
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
      },
    },
    notifications: {
      showRegistrationError: {
        message: 'Error de connexión',
        type: 'error'
      },
      showLoginSuccess: {
        message: 'Sesión iniciada con éxito',
        type: 'success'
      }
    },
    components: {
      Step1,
      Step2,
      Step3
    },
  }
</script>