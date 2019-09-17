<template>
  <v-chip :color="statusColor" small outline>{{ statusLabel }}</v-chip>
</template>

<script>
  export default {
    props: ['status'],
    data () {
      return {
        configuration: {
          'pending-payment': { text: 'Pendiente autorización pago', color: 'red' },
          'pending': { text: 'Pendiente de asignar', color: 'grey' },
          'asigned': { text: 'Asignado', color: 'orange' },
          'done': { text: 'Finalizado', color: 'green' },
          'canceled': { text: 'Cancelado', color: 'red' },
          'finalized':  { text: 'Finalizado', color: 'green' },
          'finished':  { text: 'Finalizado', color: 'green' },
          'started':  { text: 'Conductor en camino', color: 'lime' },
          'arrived':  { text: 'Conductor en punto de recogida', color: 'cyan' },
          'pickedup':  { text: 'En trayecto', color: 'blue' },
          'no-assignment': { text: 'Sin asignación', color: 'red' },
        }
      }
    },
    computed: {
      statusLabel () {
        return this.configuration[this.status].text
      },
      statusColor () {
        return this.configuration[this.status].color
      }
    }
  }
</script>
