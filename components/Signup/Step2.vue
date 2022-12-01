<template>
  <v-stepper-content step="2" class="text-xs-right">
    <v-card class="mb-3" elevation="0">
      <v-container grid-list-md>
        <v-form>
          <v-layout wrap>
            <v-flex xs12 sm6>
              <phone-number-field v-model="phoneNumber"></phone-number-field>
            </v-flex>
          </v-layout>
        </v-form>
      </v-container>
    </v-card>
    <v-btn @click="cancel">Atrás</v-btn>
    <v-btn class="ml-3" id="phone-validation" color="primary" @click="complete" :disabled="phoneNumber == null">Continuar</v-btn>
  </v-stepper-content>
</template>

<script>
  import PhoneNumberField from '~/components/Fields/PhoneNumberField'

  export default {
    data() {
      return {
        phoneNumber: null
      }
    },
    methods: {
      cancel () {
        this.clear()
        this.$emit('canceled')
      },
      complete () {
        this.$emit('completed', {
          phoneNumber: this.phoneNumber
        })
      },
      clear () {
        this.phoneNumber = null
      }
    },
    components: {
      PhoneNumberField
    }
  }
</script>
