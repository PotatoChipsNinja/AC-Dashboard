<template>
  <v-app>
    <v-app-bar app color="primary" dark clipped-left>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>
        <router-link to="/" style="color: unset; text-decoration: unset">
          <v-icon class="mr-2">mdi-air-conditioner</v-icon>分布式空调管理系统
        </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="logout" v-show="username">
        <v-icon>mdi-logout-variant</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app clipped>
      <v-list nav dense>
        <v-list-item-group v-show="!username" active-class="deep-purple--text text--accent-4">
          <v-list-item to="/login">
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-title>登录</v-list-item-title>
          </v-list-item>

          <v-list-item to="/register">
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-title>注册</v-list-item-title>
          </v-list-item>
        </v-list-item-group>

        <v-list-item-group v-show="username" active-class="deep-purple--text text--accent-4">
          <v-list-item to="/">
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Home</v-list-item-title>
          </v-list-item>

          <v-list-item to="/about">
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-title>About</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>
      <template v-slot:append>
        <div id="copyright">
          &copy; 2021 <a href="https://github.com/PotatoChipsNinja/AC-Dashboard" target="_blank">A/C Dashboard</a>
          <br/>
          All Rights Reserved.
        </div>
      </template>
    </v-navigation-drawer>

    <v-main>
      <router-view :username.sync="username" />
    </v-main>
  </v-app>
</template>

<script>
  export default {
    name: 'App',

    data: () => ({
      drawer: true,
      username: null
    }),

    mounted: function () {
      this.username = localStorage.getItem('username')
      if (!this.username && this.$route.path != '/login' && this.$route.path != '/register') {
        this.$router.replace('/login')
      }
    },

    methods: {
      logout: function () {
        localStorage.removeItem('username')
        this.username = null
        this.$router.replace('/login')
      }
    }
  }
</script>
