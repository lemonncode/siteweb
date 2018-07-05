<template>
  <v-progress-linear v-model="progression" :color="color"></v-progress-linear>
</template>

<script>
  export default {
    props: ['status'],
    computed: {
      progression () {
        let progression = 25

        if (this.status === 'canceled' || this.status === 'done') {
          progression = 100
        } else if (this.status === 'asigned') {
          progression = 50
        }

        return progression
      },
      color () {
        let color = 'primary'

        switch (this.status) {
          case 'canceled': 
            color = 'red'
            break;

          case 'done': 
            color = 'green'
            break;

          case 'asigned':
            color = 'orange'
            break;
        }

        return color;
      }
    }
  }
</script>