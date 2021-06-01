<template>
  <v-container class="pa-8">
    <v-row class="my-4">
      <v-col cols="12" class="d-flex justify-center">
        <v-img
          :src="require('../assets/bupt_logo.png')"
          max-width="100"
          max-height="100"
        />
        <v-divider vertical class="ml-6 mr-4"></v-divider>
        <v-icon size="100" color="#2196f3">mdi-air-conditioner</v-icon>
      </v-col>

      <v-col cols="12" class="d-flex justify-center">
        <div class="text-h4 font-weight-light">{{ username }}, 欢迎使用分布式空调管理系统</div>
      </v-col>

      <v-col cols="12" class="d-flex justify-center pt-0">
        <div class="text--secondary font-weight-light">通过下方卡片快捷进入功能页，或通过侧边栏进行导航</div>
      </v-col>
    </v-row>

    <v-row dense>
      <v-col
        v-for="(item, i) in items"
        :key="i"
        cols="6"
      >
        <v-card
          :color="!$vuetify.theme.dark ? item.color : ''"
          dark
        >
          <div class="d-flex flex-no-wrap justify-space-between">
            <div>
              <v-card-title
                class="text-h5"
                v-text="item.title"
              ></v-card-title>

              <v-card-subtitle v-text="item.description"></v-card-subtitle>

              <v-card-actions>
                <!--
                <v-btn text>
                  Listen Now
                </v-btn>
                -->
                <v-btn
                  class="ml-2 mt-5"
                  outlined
                  rounded
                  small
                  :to="item.route"
                >
                  立即查看
                </v-btn>
              </v-card-actions>
            </div>

            <v-avatar
              class="ma-3"
              size="125"
              tile
            >
              <v-icon size="80" v-text="item.icon"></v-icon>
            </v-avatar>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'Home',

    props: {
      username: String
    },

    data: () => ({
      items: [
        {
          color: '#1F7087',
          title: '状态管理',
          description: '状态管理的描述...',
          icon: 'mdi-camera-control',
          route: '/status'
        },
        {
          color: '#952175',
          title: '监控和调度',
          description: '监控和调度的描述...',
          icon: 'mdi-monitor-dashboard',
          route: '/monitor'
        },
        {
          color: '#26c6da',
          title: '请求记录查询',
          description: '请求记录查询的描述...',
          icon: 'mdi-database-search',
          route: '/query'
        },
        {
          color: '#9e9d24',
          title: '统计信息',
          description: '统计信息的描述',
          icon: 'mdi-chart-areaspline',
          route: '/stastic'
        }
      ]
    })
  }
</script>
