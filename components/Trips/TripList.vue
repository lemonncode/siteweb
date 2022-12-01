<template>
  <v-card>
    <v-card-title>
      <h3 class="mr-5 headline mb-0">Viajes</h3>
      <v-flex xs6 sm2 d-flex mt-2 ml-5 v-if="this.current_account.discriminator !== 'personal' && this.current_account.role !== 'user' && this.current_account.role !== 'manager'">
        <v-select
          v-model="user"
          :items="usersAccount"
          item-text="user.full_name"
          item-value="user.id"
          label="Usuario"
          @change="loadItems"
          clearable
        ></v-select>
      </v-flex>
      <v-flex xs6 sm2 d-flex mt-2 ml-5>
        <v-select
          v-model="selectedMonth"
          :items="selectMonth"
          label="Fecha"
        ></v-select>
      </v-flex>
      <v-flex xs12 sm3 d-flex mt-2 ml-5>
        <v-menu
          ref="menu"
          v-model="menu"
          :close-on-content-click="false"
          :return-value.sync="dates"
          transition="scale-transition"
          offset-y
          min-width="290px"
          v-if="selectedMonth === 'custom'"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              v-model="dates"
              label="Rango"
              prepend-icon="mdi-calendar"
              readonly
              v-bind="attrs"
              v-on="on"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="dates"
            range
            :first-day-of-week="1"
            locale="es"
          >
            <v-btn
              text color="primary" @click="menu = false">Cancel
            </v-btn>
            <v-btn
              text color="primary" @click="$refs.menu.save(dates)">OK
            </v-btn>
          </v-date-picker>
      </v-menu>
      </v-flex>
      <v-flex xs12 sm3 mt-2 ml-5 class="text-right">
        <v-btn color="#ed6363" class="white--text" @click="getCsv()">Descargar</v-btn>
      </v-flex>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="items"
      :server-items-length="totalItems"
      :footer-props="{ itemsPerPageOptions }"
      :search="search"
      :options.sync="options"
      multi-sort
      :sort-by="['date']"
      :sort-desc="[true]"
      class="elevation-1"
      no-data-text="No tienes viajes"
      @click:row="viewTrip" :style="{ cursor: 'pointer'}"
    >
      <template v-slot:item.user_name="{ item }">
        <span><small>{{ item.user_name }}</small></span>
      </template>
      <template v-slot:item.date="{ item }">
        <span><small>{{ formatedDate(item.date) }}</small></span>
      </template>
      <template v-slot:item.origin_location="{ item }">
        <span><small>{{ item.origin_location ? item.origin_location.formatted_address : '-' }}</small></span>
      </template>
      <template v-slot:item.destination_location="{ item }">
        <span><small>{{ item.destination_location ? item.destination_location.formatted_address : '-' }}</small></span>
      </template>
      <template v-slot:item.status="{ item }">
        <trip-status-label :status="item.status"></trip-status-label>
      </template>
      <template v-slot:item.price="{ item }">
        <span><small>{{item.price}} €</small></span>
      </template>
      <template v-slot:item.actions="{ item }">
        <div v-if="item.status !== 'done' && item.status !== 'finalized'
                && item.status !== 'canceled' && item.status !== 'pickedup'" small @click="cancelTrip(item)">
          <v-icon small color="red" >cancel</v-icon>
          <span><small>Cancelar</small></span>
        </div>
        <div v-if="item.invoice_item !== null" @click="printTripInvoice(item, $event)">
          <v-icon small >print</v-icon>
          <span><small>Imprimir</small></span>
        </div>
      </template>
      <template slot="body.append">
        <tr class="red--text">
          <th class="title">Total</th>
          <th></th>
          <th></th>
          <th></th>
          <th></th>
          <th class="text-right title">{{ sumField('price') }} €</th>
        </tr>
      </template>
      <v-alert slot="no-results" :value="true" color="error">
        No hay viajes para la siguente búsqueda "{{ search }}".
      </v-alert>
    </v-data-table>
    <v-dialog
      :value="loading"
      persistent
      content-class="text-center"
      width="300"
    >
      <v-card>
        <v-card-text class="pt-6">
          <v-progress-circular
            :size="50"
            class="mb-3"
            color="primary"
            indeterminate
          />
          <p>Cargando...</p>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
  import moment from 'moment'
  import TripStatusLabel from './TripStatusLabel'
  import {mapActions, mapGetters} from 'vuex';
  import { datatableMixin } from "~/mixins/datatable";

  export default {
    components: {
      TripStatusLabel
    },
    mixins: [
      datatableMixin
    ],
    data () {
      return {
        menu: false,
        user: null,
        search: '',
        selectedMonth: 'current',
        selectMonth: [
          {
            text: 'Mes actual', value: 'current'
          },
          {
            text: 'Mes anterior', value: 'last'
          },
          {
            text: 'Personalizado', value: 'custom'
          }
        ],
        headers: [
          { text: 'Fecha', value: 'date', width: "10%" },
          {
            text: 'Usuario',
            value: 'user_name',
            width: "10%"
          },
          {
            text: 'Origen',
            value: 'origin_location',
            width: "15%"
          },
          {
            text: 'Destino',
            value: 'destination_location',
            width: "15%"
          },
          {
            text: 'Estado',
            value: 'status',
            align: 'center',
            width: "10%"
          },
          {
            text: 'Precio',
            value: 'price',
            align: 'right',
            width: "10%"
          },
          {
            text: 'Acciones',
            value: 'actions',
            align: 'right',
            width: "10%"
          }
        ],
        options: {},
        dates: [],
        startDate: new Date((new Date()).getFullYear(), (new Date()).getMonth(), 2),
        endDate: new Date((new Date()).getFullYear(), (new Date()).getMonth() + 1, 1),
        csv: false,
        loading: false
      }
    },
    created() {
      if (this.current_account.discriminator !== 'personal') {
        this.getCurrentUsers(this.current_account.account.id)
      }
    },
    computed: {
      ...mapGetters({
        current_account: 'userAccount/currentAccount',
        usersAccount: 'account/currentUsersAccount'
      }),
      resource () {
        return this.$api.accountTrips
      }
    },
    watch: {
      current_account: {
        handler: 'loadItems'
      },
      selectedMonth (value) {
        var date = new Date();
        if (value === 'current') {
          this.startDate = new Date(date.getFullYear(), date.getMonth(), 1);
          this.endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
          this.loadItems()
        } else if (value === 'last') {
          this.startDate = new Date(date.getFullYear(), date.getMonth() -1, 1);
          this.endDate = new Date(date.getFullYear(), date.getMonth(), 0);
          this.loadItems()
        }
      },
      dates (value) {
        if (value.length === 2) {
          this.startDate = new Date(value[0])
          this.endDate = new Date(value[1])
          this.loadItems()
        }
      }
    },
    methods: {
      ...mapActions({
        getCurrentUsers: 'account/getCurrentUsers'
      }),
      async getCsv () {
          this.csv = true
          await this.loadCsvItems()
          this.csv = false
      },
      async viewTrip (value) {
        this.$router.push({ name: 'app-trips-id', params: {id: value.id} })
      },
      async cancelTrip (trip) {
        let confirmation = confirm('Estas seguro que quieres cancelar este viaje ?')
        if (!confirmation) {
          return
        }

        await this.$store.dispatch('cancelTrip', trip)
          .then(() => {
            this.showCanceledTripSuccessMessage();
            this.loadItems()
          })
          .catch(e => {

          });
      },
      async loadCsvItems () {
        this.loading = true
        try {
          const response = await this.resource.cget(this.queryParams)
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `viajes${moment().format('DDMMYYYYhhmm')}.csv`);
          document.body.appendChild(link);
          link.click();
        } catch (e) {
        } finally {
          this.loading = false
        }
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
      },
      sumField(key) {
        let total = this.items.reduce((a, b) => a + (b[key] || 0), 0)
        return total.toFixed(2)
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
