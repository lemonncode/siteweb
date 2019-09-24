<template>
  <v-stepper-content step="3" class="text-xs-left">
    <v-card class="mb-3" elevation="0">
      <v-container grid-list-md>
        <v-form>
          <v-layout wrap>
            <v-flex xs12 sm6>
              <h3>Verificación por SMS</h3>
              <p>Debes intorucir el PIN recibido por SMS para validar tu número de teléfono.</p>
              <sms-validation-code-field @input="validationCode = $event"></sms-validation-code-field>
            </v-flex>
          </v-layout>
        </v-form>
      </v-container>
    </v-card>

    <v-btn @click="cancel">Atrás</v-btn>
    <v-btn color="primary" @click="complete" :disabled="validationCode == null || validationCode.length != 6">Continuar</v-btn>
  </v-stepper-content>
</template>

<script>
  import SmsValidationCodeField from '~/components/Fields/SmsValidationCodeField'

  export default {
    data() {
      return {
        validationCode: null
      }
    },
    methods: {
      cancel () {
        this.clear()
        this.$emit('canceled')
      },
      complete () {
        this.$emit('completed', {
          validationCode: this.validationCode
        })
      },
      clear () {
        this.validationCode = null
      }
    },
    components: {
        SmsValidationCodeField
    }
  }
</script>
