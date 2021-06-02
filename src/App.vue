<template>
  <v-app>
    <v-app-bar app color="bar" dark clipped-left>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-toolbar-title>
        <router-link to="/" style="color: unset; text-decoration: unset">
          <v-icon class="mr-2">mdi-air-conditioner</v-icon>分布式空调管理系统
        </router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <div v-show="username" class="text-subtitle-1 font-weight-light mx-1" style="cursor: default">
        {{ username }}
      </div>
      <v-btn icon @click="logout" v-show="username">
        <v-icon>mdi-logout-variant</v-icon>
      </v-btn>

      <v-btn icon @click="$vuetify.theme.dark = !$vuetify.theme.dark">
        <v-icon v-text="$vuetify.theme.dark ? 'mdi-brightness-7' : 'mdi-brightness-4'"></v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app clipped>
      <v-list nav dense v-show="!username">
        <v-list-item-group color="primary">
          <v-list-item to="/login">
            <v-list-item-icon>
              <v-icon>mdi-home</v-icon>
            </v-list-item-icon>
            <v-list-item-title>登录</v-list-item-title>
          </v-list-item>
        </v-list-item-group>
      </v-list>

      <v-list nav dense v-show="username">
        <template v-for="menuObj in menu">
          <v-list-item-group :key="menuObj.name" v-if="menuObj.route" color="primary">
            <v-list-item :to="menuObj.route">
              <v-list-item-icon>
                <v-icon v-text="menuObj.icon"></v-icon>
              </v-list-item-icon>
              <v-list-item-title v-text="menuObj.name"></v-list-item-title>
            </v-list-item>
          </v-list-item-group>

          <v-list-group
            :key="menuObj.name"
            v-else
            :prepend-icon="menuObj.icon"
            no-action
            :value="!isFold(menuObj)"
          >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title v-text="menuObj.name"></v-list-item-title>
              </v-list-item-content>
            </template>

            <v-list-item
              v-for="submenuObj in menuObj.submenu"
              :key="submenuObj.name"
              :to="submenuObj.route"
            >
              <v-list-item-content>
                <v-list-item-title v-text="submenuObj.name"></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>
        </template>
      </v-list>

      <template v-slot:append>
        <div id="copyright" class="text--secondary">
          &copy; {{ new Date().getFullYear() }} <a href="https://github.com/PotatoChipsNinja/AC-Dashboard" target="_blank">A/C Dashboard</a>
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
      username: null,
      menu: [
        {
          name: '首页',
          icon: 'mdi-home',
          route: '/'
        },
        {
          name: '主机管理',
          icon: 'mdi-monitor-dashboard',
          submenu: [
            {
              name: '状态管理',
              route: '/status'
            },
            {
              name: '监控和调度',
              route: '/monitor'
            }
          ]
        },
        {
          name: '报表查询',
          icon: 'mdi-credit-card-check-outline',
          submenu: [
            {
              name: '送风请求记录',
              route: '/query'
            },
            {
              name: '用量统计',
              route: '/stastic'
            }
          ]
        },
        {
          name: '修改密码',
          icon: 'mdi-card-account-details-outline',
          route: '/passwd'
        }
      ]
    }),

    mounted: function () {
      this.username = localStorage.getItem('username')
    },

    methods: {
      logout: function () {
        localStorage.removeItem('username')
        this.username = null
        this.$toast('已登出')
        this.$router.replace('/login')
      },
      isFold: function (menuObj) {
        let flag = true
        menuObj.submenu.forEach(e => {
          if (e.route == this.$route.path) {
            flag = false
          }
        })
        return flag
      }
    }
  }
</script>
