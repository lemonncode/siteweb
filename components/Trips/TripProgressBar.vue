<template>
  <v-progress-linear v-model="progression" :color="color" height="4"></v-progress-linear>
</template>

<script>
  export default {
    props: ['status'],
    computed: {
      progression () {
        let progression = 12.50

        if (this.status === 'canceled' || this.status === 'done' || this.status === 'finished' || this.status === 'finalized' || this.status === 'no-assignment') {
          progression = 100
        } else if (this.status === 'arrived') {
          progression = 65
        } else if (this.status === 'pickedup') {
            progression = 80
        } else if (this.status === 'started') {
            progression = 50
        } else if (this.status === 'asigned') {
            progression = 35
        } else if (this.status === 'pending') {
          progression = 20
        }

        return progression
      },
      color () {
        let color = 'primary'

        switch (this.status) {
          case 'canceled':
          case 'no-assignment':
          case 'pending-payment':
            color = 'red'
            break;

          case 'done':
          case 'finished':
          case 'finalized':
            color = 'green'
            break;

          case 'asigned':
            color = 'orange'
            break;

          case 'started':
            color = 'lime'
            break;

          case 'arrived':
            color = 'cyan'
            break;

          case 'pickedup':
            color = 'blue'
            break;
        }

        return color;
      }
    }
  }
</script>

