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
              <v-flex xs12 sm6>
                <phone-number-field v-model="user.phoneNumber"></phone-number-field>
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
                <v-list-tile-sub-title class="text--secondary">{{ item.location.formatted_address }}</v-list-tile-sub-title>
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
    import { mapGetters, mapActions } from 'vuex'
    import countries from 'i18n-iso-countries'
    import PhoneNumberField from '~/components/Fields/PhoneNumberField'
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
                    documentNumber: ''
                },
                modal: false,
                valid: false,
                validated: false,
                firstNameRules: [
                    v => !!v || 'Introduce tu nombre',
                ],
                lastNameRules: [
                    v => !!v || 'Introduce tus apellidos',
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
        },
        computed: {
            ...mapGetters({
                userAccount: 'userAccount/account',
                places: 'accountPlace/places'
            }),

        },
        watch: {
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
              return
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
            PhoneNumberField
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