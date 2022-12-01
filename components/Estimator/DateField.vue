<template>
  <v-menu
    ref="menu"
    :close-on-content-click="false"
    v-model="menu"
    :nudge-right="40"
    :return-value.sync="date"
    lazy
    transition="scale-transition"
    offset-y
    full-width
    min-width="290px"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        v-model="dateFormatted"
        label="Día"
        prepend-icon="event"
        @blur="date = parseDate(dateFormatted)"
        readonly
        v-on="on"
      ></v-text-field>
    </template>
    <v-date-picker v-model="date" locale="es-ES" scrollable :allowed-dates="allowedDates">
      <v-spacer></v-spacer>
      <v-btn text color="primary" @click="menu = false">Cancel</v-btn>
      <v-btn text color="primary" @click="$refs.menu.save(date)">OK</v-btn>
    </v-date-picker>
  </v-menu>
</template>

<script>
  export default {
    props: ['value'],
    data () {
      return {
        date: this.value,
        dateFormatted: null,
        menu: false
      };
    },
    watch: {
      date (date) {
        this.dateFormatted = this.formatDate(date)
        this.$emit('dateUpdated', date);
      }
    },
    methods: {
      allowedDates: val => new Date(val) >= (new Date()).setHours(0,0,0,0),
      formatDate (date) {
        if (!date) {
          return null;
        }

        const [year, month, day] = date.split('-');

        return `${day}/${month}/${year}`;
      },
      parseDate (date) {
        if (!date) {
          return null;
        }

        const [month, day, year] = date.split('/');

        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
    }
  }
</script>

