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
          <v-stepper-step :complete="currentStep > 3" step="3">Paso 3</v-stepper-step>
          <v-divider></v-divider>
          <v-stepper-step step="4">Paso 4</v-stepper-step>
        </v-stepper-header>

        <v-stepper-items>
          <step1 @canceled="cancel($event)" @completed="completeStep1($event)"></step1>
          <step2 @canceled="cancel($event)" @completed="completeStep2($event)"></step2>
          <step3 @canceled="cancel($event)" @completed="completeStep3($event)"></step3>
          <step4 @canceled="cancel($event)" @completed="completeStep4($event)"></step4>
        </v-stepper-items>
      </v-stepper>
    </v-card>
  </v-dialog>
</template>

<script>
  import Step1 from './Step1'
  import Step2 from './Step2'
  import Step3 from './Step3'
  import Step4 from './Step4'
  import { firebase } from '~/plugins/firebase.js'

  export default {
    data() {
      return {
        currentStep: 0,
        confirmationResult: null,
        appVerifier : null,
        user: {
          firstName: null,
          lastName: null,
          documentType: null,
          documentNumber: null,
          phoneNumber: null,
          email: null,
          password: null,
        }
      }
    },
    created(){
      if (process.client) {
        this.initReCaptcha()
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
      async completeStep2 (event) {
        this.user.phoneNumber = event.phoneNumber
        this.validation()
      },
      completeStep3 (event) {
        var code = event.validationCode
        const self = this;
        this.confirmationResult.confirm(code).then(function (result) {
            self.showPhoneVerificationSuccess();
            self.currentStep = 4
        }).catch(function (error) {
            // User couldn't sign in (bad verification code?)
            self.showPhoneVerificationError();
        });
      },
      completeStep4 (event) {
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
      async validation() {

          this.sendSmsValidation();
      },
      async sendSmsValidation() {;
          let phoneNumber = this.user.phoneNumber;
          let appVerifier = this.appVerifier;
          const self = this;

          firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
              .then(function (confirmationResult) {
                  // SMS sent. Prompt user to type the code from the message, then sign the
                  // user in with confirmationResult.confirm(code).
                  self.confirmationResult = confirmationResult;
                  self.showSendSmsSuccess();
                  self.currentStep = 3;
              }).catch(function (error) {
                // Error; SMS not sent
                self.showSendSmsError();
            });
      },
      initReCaptcha(){
        firebase.auth().languageCode = 'es';
        const self = this;
        setTimeout(()=>{
            let recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
                'size': 'invisible',
                'callback': function(response) {
                    // reCAPTCHA solved, allow signInWithPhoneNumber.
                    // ...
                    self.showCaptchaSuccess();
                },
                'expired-callback': function() {
                    // Response expired. Ask user to solve reCAPTCHA again.
                    self.showCaptchaError();
                }
            });
            //
            this.appVerifier =  recaptchaVerifier;
        },1000)
      }
    },
    notifications: {
      showRegistrationError: {
        message: 'Error de connexión',
        type: 'error'
      },
      showLoginSuccess: {
        message: 'Sesión iniciada con éxito',
        type: 'success'
      },
      showSendSmsSuccess: {
        message: 'Sms de validación enviado',
        type: 'success'
      },
      showSendSmsError: {
        message: 'Error al enviar Sms de validación',
        type: 'error'
      },
      showCaptchaSuccess: {
        message: 'Captcha validado correctamente',
        type: 'success'
      },
      showCaptchaError: {
        message: 'Error al validar el captcha',
        type: 'error'
      },
      showPhoneVerificationSuccess: {
        message: 'Verificación correcta',
        type: 'success'
      },
      showPhoneVerificationError: {
        message: 'Error al verificar el teléfono',
        type: 'error'
      },
    },
    components: {
      Step1,
      Step2,
      Step3,
      Step4
    },
  }
</script>
