<template>
  <v-dialog v-model="dialog" persistent max-width="700px">
    <v-card>
      <v-card-title>
        <span class="headline">Editar cuenta</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-container>
            <v-layout row wrap>
              <v-flex xs12 sm6>
                <v-text-field
                    v-model="account.account.customer.name"
                    type="text"
                    label="Nombre"
                    disabled
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field
                    v-model="account.account.customer.identification_number"
                    type="text"
                    label="Número de identificación"
                    disabled
                ></v-text-field>
              </v-flex>
              <v-flex sm6 xs12>
                <div class="v-text-field__slot">
                  <no-ssr>
                    <vue-tel-input v-model="account.account.customer.phone_number"
                                   @onValidate="onValidate"
                                   @onInput="onInput"
                                   :preferredCountries="['es', 'gb', 'us']"
                                   placeholder="Introduce un número de teléfono"
                                   required
                                   defaultCountry="es">
                    </vue-tel-input>
                  </no-ssr>
                  <div class="v-text-field__details" v-if="account.account.customer.phone_number && !validPhoneNumber">
                    <div class="v-messages theme--light error--text">
                      <div class="v-messages__wrapper">
                        <div class="v-messages__message">Teléfono no válido</div>
                      </div>
                    </div>
                  </div>
                </div>
              </v-flex>
              <v-flex sm6>
                <v-text-field
                    v-model="account.account.customer.email"
                    :rules="emailRules"
                    type="text"
                    label="Email"
                    append-icon="email"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm8>
                <v-text-field
                    v-model="account.account.customer.billing_address.street"
                    type="text"
                    :rules="streetRules"
                    label="Dirección de facturación"
                    required
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm4>
                <v-text-field
                    v-model="account.account.customer.billing_address.zip_code"
                    :rules="zipCodeRules"
                    type="text"
                    label="Código postal"
                    required
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field
                    v-model="account.account.customer.billing_address.city"
                    :rules="cityRules"
                    type="text"
                    label="Ciudad"
                    required
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field
                    v-model="account.account.customer.billing_address.province"
                    :rules="provinceRules"
                    type="text"
                    label="Provincia"
                    required
                ></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn flat @click.native="closeDialog">Cancelar</v-btn>
        <v-btn color="primary" flat @click.native="editAccount">Editar cuenta</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
    import countries from 'i18n-iso-countries';

    export default {
        props: ['account'],
        data () {
            return {
                valid: false,
                validPhoneNumber: false,
                phoneNumberRules: [
                    v => !!v || 'Introduce tu número de teléfono',
                    v => /^\d{9}$/.test(v) || 'Número de teléfono inválido',
                ],
                emailRules: [
                    v => !!v || 'Introduce un email',
                    v => /.+@.+/.test(v) || 'Email inválido',
                ],
                streetRules: [
                    v => !!v || 'Introduce una dirección',
                ],
                zipCodeRules: [
                    v => !!v || 'Introduce código postal',
                    v => /^(?:0[1-9]|[1-4]\d|5[0-2])\d{3}$/.test(v) || 'Código postal inválido',
                ],
                cityRules: [
                    v => !!v || 'Introduce una ciudad',
                ],
                provinceRules: [
                    v => !!v || 'Introduce una provincia',
                ],
                countries: Object.keys(countries.getAlpha3Codes()),
            };
        },
        methods: {
            closeDialog() {
                this.$store.commit('userAccount/closeEditAccountDialog')
            },
            onInput({ number, isValid, country }) {
                if (isValid) {
                    this.validPhoneNumber = true;
                }
            },
            onValidate({ number, isValid, country }) {
                if (!isValid) {
                    this.validPhoneNumber = false;
                }
            },
            editAccount() {
                if (!this.$refs.form.validate()) {
                    return
                }

                let editValues = {
                      email: this.account.account.customer.email,
                      phoneNumber: this.account.account.customer.phone_number,
                      billingAddress: {
                        city: this.account.account.customer.billing_address.city,
                        country: 'es',
                        province: this.account.account.customer.billing_address.province,
                        street: this.account.account.customer.billing_address.street,
                        zipCode: this.account.account.customer.billing_address.zip_code
                    },
                };

                this.$store.dispatch('userAccount/editUserAccount', {values: editValues, id: this.account.id})
                    .then(data => {
                        this.closeDialog()
                        this.showEditAccountSuccessMessage()
                    })
                    .catch(error => {
                        this.displayMessageError(error.response)
                    })
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

                this.showEditAccountErrorMessage(notification)
            },
        },
        computed: {
            dialog() {
                return this.$store.state.userAccount.editAccountDialog
            }
        },
        notifications: {
            showEditAccountErrorMessage: {
                message: 'Error al editar la cuenta',
                type: 'error'
            },
            showEditAccountSuccessMessage: {
                message: 'Cuenta editada correctamente',
                type: 'success'
            }
        },
    }
</script>