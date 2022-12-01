<template>
  <v-layout justify-space-between>
    <v-flex xs3 v-for="index in 6" :key="index">
      <v-text-field
          type="text"
          v-model="digit[index-1]"
          @keyup="change($event, index)"
          @keypress="isNumber($event)"
          delete="delete"
          maxlength="1"
          required
          :ref="'field-'+index"
      ></v-text-field>
    </v-flex>
  </v-layout>
</template>

<script>
  import { required } from 'vuelidate/lib/validators'

  export default {
    validations: {
      digit: {
        required
      },
    },
    props: ['value'],
    data () {
      return {
        digit: [],
      }
    },
    watch: {
      value: {
        handler (val) {
          if (this.digit.length < 6) return
        }
      },
    },
    computed: {
    },
    methods: {
      change(event, index) {
        this.isNumber(event)

        if (event.keyCode == 8) {
          this.digit.splice(index-1, 1)
        }

        if (this.digit.length < 6 && this.digit.length > 0) {
          this.$refs["field-" + (this.digit.length + 1)][0].focus()
        }

        let validationCode = this.digit.length == 6 ? this.digit.join("") : null
        this.$emit('input', validationCode)
      },
      isNumber ($event) {
        let keyCode = ($event.keyCode ? $event.keyCode : $event.which);

        if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) { // 46 is dot
          $event.preventDefault();
        }
      }
    }
  }
</script>

<style scoped>
  >>> input {
    text-align: center !important;
  }
</style>
