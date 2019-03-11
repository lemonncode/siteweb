<template>
  <v-card>
    <v-card-title>
      <h3 class="headline mb-0">Viajes</h3>
      <v-spacer></v-spacer>
      <v-text-field
        v-model="search"
        append-icon="search"
        label="Búsqueda"
        single-line
        hide-details
      ></v-text-field>
      <v-spacer></v-spacer>
      <v-btn color="#ed6363" class="white--text" @click="getCsv()">Descargar</v-btn>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="trips"
      :loading="loading"
      :search="search"
      :pagination.sync="pagination"
      hide-actions
      class="elevation-1"
      no-data-text="No tienes viajes"
    >
      <template slot="items" slot-scope="props">
        <tr @click="viewTrip(props.item.id)" :style="{ cursor: 'pointer'}">
          <td>{{ formatedDate(props.item.date) }}</td>
          <td>{{ props.item.user_name }}</td>
          <td>{{ props.item.origin.autocomplete }}</td>
          <td>{{ props.item.destination.autocomplete }}</td>
          <td class="text-xs-center">
            <trip-status-label :status="props.item.status"></trip-status-label>
          </td>
          <td class="text-xs-right">{{ props.item.price }} €</td>
          <td class="text-xs-right">
            <v-tooltip bottom>
              <v-icon color="red" v-if="props.item.status !== 'done' && props.item.status !== 'finalized'
                && props.item.status !== 'canceled' && props.item.status !== 'pickedup'" small slot="activator" @click="cancelTrip(props.item)">cancel</v-icon>
              <span>Cancelar</span>
            </v-tooltip>
            <v-tooltip bottom>
              <v-icon v-if="props.item.invoiced" small slot="activator" @click="printTripInvoice(props.item, $event)">print</v-icon>
              <span>Imprimir</span>
            </v-tooltip>
          </td>
        </tr>
      </template>
      <v-alert slot="no-results" :value="true" color="error">
        No hay viajes para la siguente búsqueda "{{ search }}".
      </v-alert>
    </v-data-table>
  </v-card>
</template>

<script>
  import moment from 'moment'
  import TripStatusLabel from './TripStatusLabel'
  import { mapGetters } from 'vuex';
  
  export default {
    components: {
      TripStatusLabel
    },
    mounted () {
      this.loadTrips()
    },
    data () {
      return {
        search: '',
        headers: [
          { text: 'Fecha', value: 'date' },
          {
            text: 'Usuario',
            value: 'user_name',
          },
          { 
            text: 'Origen', 
            value: 'origin.autocomplete',
          },
          { 
            text: 'Destino', 
            value: 'destination.autocomplete',
          },
          { 
            text: 'Estado', 
            value: 'status',
            align: 'center',
            sortable: false
          },
          { 
            text: 'Precio', 
            value: 'price',
            align: 'right',
          },
          { 
            text: 'Acciones',
            value: false, 
            align: 'right' 
          }
        ],
        loading: 'secondary',
        trips: [],
        pagination: {
          'sortBy': 'date', 
          'descending': true, 
          'rowsPerPage': -1
        }
      }
    },
    computed: {
      ...mapGetters({
        current_account: 'userAccount/currentAccount',
      }),
    },
    watch: {
      current_account: {
        handler: 'loadTrips'
      }
    },
    methods: {
      async loadTrips () {
        this.trips = await this.$store.dispatch('getTrips')
        this.loading = false
      },
      async getCsv () {
          await this.$store.dispatch('getTripsCsv')
      },
      async viewTrip (id) {
        this.$router.push({ name: 'app-trips-id', params: {id: id} })
      },
      async cancelTrip (trip) {
        let confirmation = confirm('Estas seguro que quieres cancelar este viaje ?')
        if (!confirmation) {
          return
        }
        
        await this.$store.dispatch('cancelTrip', trip)
          .then(() => { 
            this.showCanceledTripSuccessMessage();
          })
          .catch(e => {

          })
        ;

        /*this.$store.dispatch('cancelTrip', trip)
          .then(() => {
            trip.status = 'canceled'

            this.$store.commit('snackbar/setSnack', {
              message: 'El viaje ha sido cancelado',
              color: 'success'
            })
          })
          .catch(e => {
            this.$auth.redirect('app');

            this.$store.commit('snackbar/setSnack', {
              message: 'El viaje no se pudo cancelar',
              color: 'error'
            })
          })*/
      },

      async printTripInvoice (trip, event) {
          event.stopPropagation();
          await this.$store.dispatch('printTrip', trip.id)
              .then(() => {
                  this.showPrintInvoiceSuccessMessage();
              })
              .catch(e => {
                  this.showPrintInvoiceErrorMessage();
              })
          ;
      },
      formatedDate (date) {
        return moment(date).locale('es').format('LLL')
      }
    },
    notifications: {
      showCanceledTripSuccessMessage: {
        message: 'Viaje privado cancelado',
        type: 'success' 
      },
      showPrintInvoiceSuccessMessage: {
          message: 'Factura descargada correctamente',
          type: 'success'
      },
      showPrintInvoiceErrorMessage: {
          message: 'Error al obtener la factura',
          type: 'success'
      }
    }
  }
</script>