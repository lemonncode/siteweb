<template>
  <img :src="url" />
</template>

<script>
  export default {
    props: ['brand'],
    computed: {
      url() {
        let name = this.brand.toLocaleLowerCase().replace(/\s/g, '-')

        return `/images/payment-cards/${name}.png`
      }
    }
  }
</script>