<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-6">
          <v-toolbar dark color="secondary">
            <v-toolbar-title>Regístrate para viajar</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form ref="form" v-model="valid" lazy-validation>
              <v-container>
                <v-layout row wrap>
                  <v-flex xs12 sm6>
                    <v-text-field
                        v-model="user.firstName"
                        :rules="firstNameRules"
                        type="text"
                        label="Nombre"
                        required
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6>
                    <v-text-field
                        v-model="user.lastName"
                        :rules="lastNameRules"
                        type="text"
                        label="Apellidos"
                        required
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6>
                    <v-select
                        :items="documentOptions"
                        label="Tipo de documento"
                        item-text="name"
                        item-value="value"
                        v-model="user.documentType"
                    ></v-select>
                  </v-flex>
                  <v-flex xs12 sm6 v-if="user.documentType == 'nif'">
                    <v-text-field
                        v-model="user.documentNumber"
                        :rules="nifNumberRules"
                        type="text"
                        label="Número de DNI"
                        required
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 v-else-if="user.documentType == 'nie'">
                    <v-text-field
                        v-model="user.documentNumber"
                        :rules="nieNumberRules"
                        type="text"
                        label="Número de NIE"
                        required
                    ></v-text-field>
                  </v-flex>
                  <v-flex xs6 sm2 v-if="user.documentType == 'passport'">
                    <v-select
                        v-model="passportCountry"
                        :items="countries"
                        label="País"
                    ></v-select>
                  </v-flex>
                  <v-flex xs6 sm4 v-if="user.documentType == 'passport'">
                    <v-text-field
                        v-model="passportNumber"
                        :rules="passportNumberRules"
                        type="text"
                        label="Número de pasaporte"
                        required
                    ></v-text-field>
                  </v-flex>
                  <v-flex sm6 xs12>
                    <div class="v-text-field__slot">
                      <no-ssr>
                        <vue-tel-input v-model="user.phoneNumber"
                                       @onValidate="onValidate"
                                       @onInput="onInput"
                                       :preferredCountries="['es', 'gb', 'us']"
                                       placeholder="Introduce un número de teléfono"
                                       required
                                       defaultCountry="es">
                        </vue-tel-input>
                      </no-ssr>
                      <div class="v-text-field__details" v-if="user.phoneNumber && !validPhoneNumber">
                        <div class="v-messages theme--light error--text">
                          <div class="v-messages__wrapper">
                            <div class="v-messages__message">Teléfono no válido</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </v-flex>
                  <v-flex xs12 sm6 md4>
                    <v-dialog
                        ref="dialog"
                        v-model="modal"
                        :return-value.sync="date"
                        :rules="birthDateRules"
                        persistent
                        lazy
                        full-width
                        width="290px"
                        required
                    >
                      <v-text-field
                          slot="activator"
                          v-model="dateFormatted"
                          label="Fecha de nacimiento"
                          persistent-hint
                          @blur="date = parseDate(dateFormatted)"
                      ></v-text-field>
                      <v-date-picker locale="es-ES" color="#ed6363" v-model="date">
                        <v-spacer></v-spacer>
                        <v-btn flat color="primary" @click="modal = false">Cancelar</v-btn>
                        <v-btn flat color="primary" @click="$refs.dialog.save(date)">OK</v-btn>
                      </v-date-picker>
                    </v-dialog>
                  </v-flex>
                  <v-flex xs6 sm2>
                    <v-select
                        v-model="user.gender"
                        :items="genders"
                        :rules="genderRules"
                        item-text="name"
                        item-value="value"
                        label="Género"
                        required
                    ></v-select>
                  </v-flex>
                  <v-flex sm12>
                    <v-text-field
                        v-model="user.email"
                        :rules="emailRules"
                        type="text"
                        label="Email"
                        append-icon="email"
                    ></v-text-field>
                  </v-flex>
                  <v-flex sm12>
                    <v-text-field
                        v-model="user.password"
                        :rules="passwordRules"
                        :type="showPassword ? 'text' : 'password'"
                        :append-icon="showPassword ? 'visibility_off' : 'visibility'"
                        @click:append="showPassword = !showPassword"
                        label="Contraseña"
                    ></v-text-field>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-form>
            <privacy-policy></privacy-policy>
          </v-card-text>
          <v-card-text>
            <captcha></captcha>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="" @click="cancel">Cancelar</v-btn>
            <v-btn color="secondary" @click="submit">Regístrate</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
    import countries from 'i18n-iso-countries';
    import privacyPolicy from '../privacyPolicy';
    import Captcha from '~/components/Captcha';
    import { mapGetters } from 'vuex';

    export default {
        data () {
            return {
                user: {
                    firstName: '',
                    lastName: '',
                    phoneNumber: '',
                    email: '',
                    password: '',
                    documentType: 'nif',
                    documentNumber: '',
                    gender: '',
                    birthDate: ''
                },
                modal: false,
                valid: false,
                validPhoneNumber: false,
                dateFormatted: '',
                date: '',
                validated: false,
                firstNameRules: [
                    v => !!v || 'Introduce tu nombre',
                ],
                lastNameRules: [
                    v => !!v || 'Introduce tus apellidos',
                ],
                phoneNumberRules: [
                    v => !!v || 'Introduce tu número de teléfono',
                    v => /^\d{9}$/.test(v) || 'Número de teléfono inválido',
                ],
                emailRules: [
                    v => !!v || 'Introduce un email',
                    v => /.+@.+/.test(v) || 'Email inválido',
                ],
                passwordRules: [
                    v => !!v || 'Introduce una contraseña',
                    v => v.length >= 8 || 'Usa 8 caracteres como mínimo para la contraseña',
                ],
                genderRules: [
                    v => !!v || 'Seleccione género',
                ],
                birthDateRules: [
                    v => !!v || 'Seleccione fecha',
                ],
                showPassword: false,
                nifNumberRules: [
                    v => !!v || 'Introduce tu número de DNI',
                    v => /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKEtrwagmyfpdxbnjzsqvhlcke]{1}$/.test(v) || 'DNI inválido',
                ],
                nieNumberRules: [
                    v => !!v || 'Introduce tu número de NIE',
                    v => /^[XYZ]{1}[0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKETtrwagmyfpdxbnjzsqvhlcket]{1}$/.test(v) || 'NIE inválido',
                ],
                passportNumberRules: [
                    v => !!v || 'Introduce número de pasaporte'
                ],
                documentOptions: [{name: "DNI", value: 'nif'}, {name: "NIE", value: 'nie'}, {name: "Pasaporte", value: 'passport'}],
                countries: Object.keys(countries.getAlpha3Codes()),
                genders: [{name: "Hombre", value: 'male'}, {name: "Mujer", value: 'female'}],
                passportCountry: '',
                passportNumber: ''
            };
        },
        computed: {
            ...mapGetters({
                captchaValidation: 'user/validated'
            })
        },
        watch: {
            date (val) {
                this.dateFormatted = this.formatDate(this.date)
            },
            passportCountry (val) {
                this.user.documentNumber = this.passportCountry + this.passportNumber
            },
            passportNumber (val) {
                this.user.documentNumber = this.passportCountry + this.passportNumber
            }
        },
        methods: {
            submit() {
                if (this.captchaValidation) {
                    if (!this.$refs.form.validate()) {
                        return
                    }

                    this.$store.dispatch('user/register', this.user)
                        .then(() => {
                            this.user.username = this.user.email;
                            this.$store.dispatch('user/login', this.user).then(() => {
                                this.showLoginSuccess({message: `Bienvenido ${this.$auth.user.first_name}`})
                            })
                        })
                        .catch(error => {
                            this.displayMessageError(error.response)
                        })
                } else {
                    this.showCaptchaMessage()
                }
            },
            cancel() {
                console.log(this.countries);
                this.$router.push({ name: 'index' })
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
            formatDate (date) {
                if (!date) return null
                this.user.birthDate = date
                const [year, month, day] = date.split('-')
                return `${day}/${month}/${year}`
            },
            parseDate (date) {
                if (!date) return null

                const [day, month, year] = date.split('/')
                return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
            },
            onVerify: function (response) {
                this.verified = true;
            },
        },
        notifications: {
            showRegistrationError: {
                message: 'Error de connexión',
                type: 'error'
            },
            showLoginSuccess: {
                message: 'sesión iniciada con éxito',
                type: 'success'
            },
            showCaptchaMessage: {
                message: 'El captcha debe ser verificado',
                type: 'error'
            }
        },
        components: {
            privacyPolicy,
            Captcha,
        }
    }
</script>