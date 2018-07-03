<template>
<div class="overlay" v-if="$auth.$state.busy">
  <img src="~/assets/loading.svg" alt="Loading..." />
</div>
</template>