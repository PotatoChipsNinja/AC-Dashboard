<template>
  <div>
    <h1>欢迎你，{{ username }}</h1>
    <v-img
      :src="require('../assets/logo.svg')"
      class="my-3"
      contain
      height="200"
    />
  </div>
</template>

<script>
  export default {
    name: 'Home',

    props: {
      username: String
    }
  }
</script>
