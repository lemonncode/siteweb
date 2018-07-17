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
          <td>{{ props.item.origin.autocomplete }}</td>
          <td>{{ props.item.destination.autocomplete }}</td>
          <td class="text-xs-center">
            <trip-status-label :status="props.item.status"></trip-status-label>
          </td>
          <td class="text-xs-right">{{ props.item.fare }} €</td>
          <td class="text-xs-right">
            <v-icon
              color="red" 
              small
              @click="cancelTrip(props.item)"
              v-if="props.item.status === 'pending'"
            >
              cancel
            </v-icon>
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
            text: 'Origen', 
            value: 'origin',
          },
          { 
            text: 'Destino', 
            value: 'destination',
          },
          { 
            text: 'Estado', 
            value: 'status',
            align: 'center',
            sortable: false
          },
          { 
            text: 'Precio', 
            value: 'fare',
            align: 'right',
          },
          { 
            text: 'Actions', 
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
    methods: {
      async loadTrips () {
        this.trips = await this.$store.dispatch('getTrips')
        this.loading = false
      },
      async viewTrip (id) {
        this.$router.push({ name: 'app-trips-id', params: {id: id} })
      },
      async cancelTrip (trip) {
        let confirmation = confirm('Estas seguro que quieres cancelar este viaje ?')
        if (!confirmation) {
          return
        }

        this.$store.dispatch('cancelTrip', trip)
          .then(() => {
            trip.status = 'canceled'

            this.$store.commit('snackbar/setSnack', {
              message: 'El viaje ha sido cancelado',
              color: 'success'
            })
          })
          .catch(e => {
            this.$store.commit('snackbar/setSnack', {
              message: 'El viaje no se pudo cancelar',
              color: 'error'
            })
          })
      },
      formatedDate (date) {
        return moment(date).locale('es').format('LLL')
      }
    }
  }
</script>