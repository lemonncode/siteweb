<template>
  <v-layout justify-center>
    <v-flex xs12 sm8 v-if="this.$auth.user != null">
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
            </v-layout>
          </v-container>
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="" @click="cancel">Cancelar</v-btn>
        <v-btn color="secondary" @click="submit">Modificar</v-btn>
      </v-card-actions>
      <v-card class="mt-4">
        <v-toolbar color="blue-grey darken-3" dark>
          <v-toolbar-title>Lugares favoritos</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-list two-line v-if="places.length > 0">
          <template v-for="(item, index) in places">
            <v-list-tile
                :key="item.name"
                avatar
                ripple
            >
              <v-list-tile-content>
                <v-list-tile-title><strong>{{ item.name }}</strong></v-list-tile-title>
                <v-list-tile-sub-title class="text--secondary">{{ item.place.autocomplete }}</v-list-tile-sub-title>
              </v-list-tile-content>

              <v-list-tile-action>
                <v-icon
                    small
                    color="#ed6363"
                    @click="deletePlace(item)"
                >
                  delete
                </v-icon>
              </v-list-tile-action>

            </v-list-tile>
            <v-divider
                v-if="index + 1 < places.length"
                :key="index"
            ></v-divider>
          </template>
        </v-list>
        <v-list v-else>
          <v-list-tile>
            <v-list-tile-content>
              No has añadido ningún favorito todavía.
            </v-list-tile-content>
          </v-list-tile>
        </v-list>
        <v-fab-transition>
          <v-btn
              color="primary"
              dark
              small
              absolute
              bottom
              right
              fab
              @click="openAddPlaceDialog"
          >
            <v-icon>add</v-icon>
          </v-btn>
        </v-fab-transition>
      </v-card>
      <delete-place-dialog></delete-place-dialog>
      <add-place-dialog></add-place-dialog>
    </v-flex>
  </v-layout>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex';
    import countries from 'i18n-iso-countries';
    import DeletePlaceDialog from '~/components/Settings/DeletePlaceDialog'
    import AddPlaceDialog from '~/components/Settings/AddPlaceDialog'

    export default {
        name: "UserSettings",
        data () {
            return {
                user: {
                    firstName: '',
                    lastName: '',
                    phoneNumber: '',
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
                genderRules: [
                    v => !!v || 'Seleccione género',
                ],
                birthDateRules: [
                    v => !!v || 'Seleccione fecha',
                ],
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
                passportNumber: '',
                headers: [
                    { text: 'Nombre', sortable: false, align: 'left', value: 'full_name', width: '30%' },
                    { text: 'Dirección', value: 'role', width: '50%' },
                    { text: 'Acciones', value: 'full_name', sortable: false }

                ],
                userPlaces: [],
            };
        },
        created () {
            this.getPlaces();
            this.user.firstName = this.$auth.user.first_name;
            this.user.lastName = this.$auth.user.last_name;
            this.user.phoneNumber = this.$auth.user.phone_number;
            this.user.documentType = this.$auth.user.document_type;
            this.user.documentNumber = this.$auth.user.document_number;
            this.user.gender = this.$auth.user.gender;
            this.user.birthDate = this.parseDate(this.$auth.user.birth_date);
            this.dateFormatted = this.$auth.user.birth_date;
        },
        computed: {
            ...mapGetters({
                userAccount: 'userAccount/account',
                places: 'accountPlace/places'
            }),

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
            },
            places () {
                this.initialize();
            }
        },
        methods: {
            ...mapActions({
                getPlaces: 'accountPlace/getPlaces'
            }),
            initialize() {
                this.userPlaces = this.places;
            },
            submit() {
                if (!this.$refs.form.validate()) {
                    return
                }

                this.$store.dispatch('user/update', this.user)
                    .then(() => {
                        this.showSuccess()
                    })
                    .catch(error => {
                        this.displayMessageError(error.response)
                    })
            },
            cancel() {
                this.$router.push({ name: 'app' })
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

                this.showError(notification)
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

                const [day, month, year] = date.split('-')
                return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
            },
            deletePlace(item) {
                this.$store.commit('accountPlace/openDeletePlaceDialog', item)
            },
            openAddPlaceDialog() {
                this.$store.commit('accountPlace/openAddPlaceDialog')
            },
        },
        components: {
            AddPlaceDialog,
            DeletePlaceDialog,
        },
        notifications: {
            showSuccess: {
                message: 'Usuario modificado correctamente',
                type: 'success'
            },
            showError: {
                message: 'Error de connexión',
                type: 'error'
            },
        },
    }

</script>

<style scoped>
  >>> .v-list__tile {
    font-size: 14px;
  }

  >>> .v-card__title {
    padding: 16px 16px 2px 14px;
  }

  >>> .v-icon {
    font-size: 18px;
  }

  >>> .v-tabs__div {
    font-size: 14px;
  }
</style>