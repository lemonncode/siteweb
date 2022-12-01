<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <template v-slot:activator="{ on }">
      <v-fab-transition>
        <v-btn
            color="primary"
            dark
            absolute
            bottom
            right
            fab
            v-on="on"
        >
          <v-icon>add</v-icon>
        </v-btn>
      </v-fab-transition>
    </template>
    <v-card>
      <v-card-title>
        <span class="headline">Añadir un código promocional</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form">
          <v-container>
            <v-layout row wrap>
              <v-flex xs12>
                <v-text-field
                    type="text"
                    label="Código"
                    v-model="code"
                    @input="$v.code.$touch()"
                    @blur="$v.code.$touch()"
                    :error-messages="codeErrors"
                    required
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="cancel">Cancelar</v-btn>
        <v-btn color="primary" @click="complete" :disabled="$v.$invalid">Añadir</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import { mapActions } from 'vuex'
  import { required } from 'vuelidate/lib/validators'

    export default {
      validations: {
        code: {
          required
        }
      },
      data() {
        return {
          dialog: false,
          code: null
        }
      },
      computed: {
        codeErrors() {
          const errors = []
          if (!this.$v.code.$dirty) return errors
          !this.$v.code.required && errors.push('Introduce un código')

          return errors
        },
      },
      methods: {
        ...mapActions({
          addDiscount: 'discount/addDiscount'
        }),
        cancel() {
          this.close()
        },
        complete() {
          this.addDiscount({ code: this.code })
            .then(data => {
              this.showAddAccountSuccessMessage()
              this.close()
            })
            .catch(error => {
              this.showAddDiscountErrorMessage()
            })
        },
        close () {
          this.dialog = false
          this.code = null
          this.$v.$reset()
        }
      },
      notifications: {
        showAddDiscountErrorMessage: {
          message: 'Código promocional inválido',
          type: 'error'
        },
        showAddAccountSuccessMessage: {
          message: 'Código promocional añadido',
          type: 'success'
        }
      },
    }
</script>
