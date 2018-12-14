<template>
  <v-chip :color="statusColor" small outline>{{ statusLabel }}</v-chip>
</template>

<script>
  export default {
    props: ['status'],
    data () {
      return {
        configuration: {
          pending: { text: 'Pendiente de asignar', color: 'grey' },
          asigned: { text: 'Asignado', color: 'orange' },
          done: { text: 'Terminado', color: 'green' },
          canceled: { text: 'Cancelado', color: 'red' },
          finalized:  { text: 'Finalizado', color: 'red' },
          finished:  { text: 'Finalizado', color: 'red' },
          started:  { text: 'Iniciado', color: 'lime' },
          arrived:  { text: 'En recogida', color: 'cyan' },
          pickedup:  { text: 'En trayecto', color: 'blue' },
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