<template>
  <v-dialog v-model="dialog" persistent max-width="700px">
    <v-card>
      <v-card-title>
        <span class="headline">Añadir una cuenta</span>
      </v-card-title>
      <v-card-text>
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-container>
            <v-layout row wrap>
              <v-flex xs12 sm6>
                <v-text-field
                    v-model="account.name"
                    :rules="nameRules"
                    type="text"
                    label="Nombre"
                    required
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field
                    v-model="account.identificationNumber"
                    :rules="documentNumberRules"
                    type="text"
                    label="Número de identificación"
                    required
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <phone-number-field v-model="account.phoneNumber"></phone-number-field>
              </v-flex>
              <v-flex sm6>
                <v-text-field
                    v-model="account.email"
                    :rules="emailRules"
                    type="text"
                    label="Email"
                    append-icon="email"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm8>
                <v-text-field
                    v-model="account.billingAddress.street"
                    type="text"
                    :rules="streetRules"
                    label="Dirección de facturación"
                    required
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm4>
                <v-text-field
                    v-model="account.billingAddress.zipCode"
                    :rules="zipCodeRules"
                    type="text"
                    label="Código postal"
                    required
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field
                    v-model="account.billingAddress.city"
                    :rules="cityRules"
                    type="text"
                    label="Ciudad"
                    required
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-text-field
                    v-model="account.billingAddress.province"
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
        <v-btn color="primary" flat @click.native="createAccount">Añadir cuenta</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
    import PhoneNumberField from '~/components/Fields/PhoneNumberField'

    export default {
        data () {
            return {
                account: {
                    name: '',
                    identificationNumber: '',
                    email: '',
                    phoneNumber: '',
                    billingAddress: {
                        city: '',
                        country: 'es',
                        province: '',
                        street: '',
                        zipCode: ''
                    },
                },
                valid: false,
                nameRules: [
                    v => !!v || 'Introduce un nombre',
                ],
                emailRules: [
                    v => !!v || 'Introduce un email',
                    v => /.+@.+/.test(v) || 'Email inválido',
                ],
                documentNumberRules: [
                    v => !!v || 'Introduce tu número de DNI',
                    v => /^(X(-|\.)?0?\d{7}(-|\.)?[A-Z]|[A-Z](-|\.)?\d{7}(-|\.)?[0-9A-Z]|\d{8}(-|\.)?[A-Z])$/.test(v) || 'Documento inválido',
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
                ]
            };
        },
        methods: {
            closeDialog() {
                this.$store.commit('userAccount/closeAddAccountDialog')
            },
            createAccount() {
                if (!this.$refs.form.validate()) {
                    return
                }
                this.$store.dispatch('userAccount/addUserAccount', this.account)
                    .then(data => {
                        this.closeDialog()
                        this.showAddAccountSuccessMessage()
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

                this.showAddAccountErrorMessage(notification)
            },
        },
        computed: {
            dialog() {
                return this.$store.state.userAccount.addAccountDialog
            }
        },
        notifications: {
            showAddAccountErrorMessage: {
                message: 'Error al crear la cuenta',
                type: 'error'
            },
            showAddAccountSuccessMessage: {
                message: 'Cuenta creada correctamente',
                type: 'success'
            }
        },
        components: {
        PhoneNumberField
      }
    }
</script>