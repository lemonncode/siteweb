<template>
  <v-dialog v-model="dialog" persistent max-width="700px">
    <v-card>
      <v-card-title>
        <span class="headline">Borrar favorito</span>
      </v-card-title>
      <v-card-text v-if="place">
        ¿Seguro que quiere borrar el favorito?
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn flat @click.native="closeDialog">Cancelar</v-btn>
        <v-btn color="primary" flat @click.native="deletePlace(place)">Borrar</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
    import { mapGetters } from 'vuex';

    export default {
        props: ['account'],
        methods: {
            closeDialog() {
                this.$store.commit('accountPlace/closeDeletePlaceDialog')
            },
            deletePlace(place) {
                this.$store.dispatch('accountPlace/deletePlace', { place })
                    .then(data => {
                        this.closeDialog()
                        this.showDeletePlaceSuccessMessage()
                    })
                    .catch(error => {
                        this.showDeletePlaceErrorMessage()
                    })
            }
        },
        computed: {
            ...mapGetters({
                place: 'accountPlace/deletePlace',
                places: 'accountPlace/places',
            }),
            dialog() {
                return this.$store.state.accountPlace.deletePlaceDialog
            }
        },
        notifications: {
            showDeletePlaceErrorMessage: {
                message: 'Error al borrar el favorito',
                type: 'error'
            },
            showDeletePlaceSuccessMessage: {
                message: 'Favorito borrado correctamente',
                type: 'success'
            }
        },
    }
</script>