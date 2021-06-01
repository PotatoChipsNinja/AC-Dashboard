<template>
  <v-container>
    <div class="text-h5 my-2">监控和调度</div>
    <v-divider></v-divider>
    <v-row class="mt-2">
      <v-col style="max-width: 32rem">
        <v-card>
          <v-card-title>
            从机概况
          </v-card-title>

          <v-divider></v-divider>

          <v-card-text>
            <v-row align="center">
              <v-col cols="3" class="py-0">
                <v-subheader>
                  监测周期
                </v-subheader>
              </v-col>
              <v-col cols="9" class="py-0">
                <v-text-field
                  v-if="editing"
                  class="mt-0 pt-0"
                  hide-details
                  v-model="edited.cycle"
                  suffix="秒"
                  single-line
                  type="number"
                  style="width: 4rem; font-size: 1.1rem"
                ></v-text-field>
                <div v-else class="text--primary" style="font-size: 1.1rem">
                  {{ saved.cycle }} 秒
                </div>
              </v-col>

              <v-col cols="3" class="py-0">
                <v-subheader>
                  调度策略
                </v-subheader>
              </v-col>
              <v-col cols="9" class="py-0">
                <v-select
                  v-if="editing"
                  v-model="edited.strategy"
                  :items="options"
                  single-line
                  style="width: 11rem; font-size: 1.1rem"
                ></v-select>
                <div v-else class="text--primary" style="font-size: 1.1rem">
                  {{ options[saved.strategy].text }}
                </div>
              </v-col>

              <v-col cols="3" class="py-0">
                <v-subheader>
                  已开机
                </v-subheader>
              </v-col>
              <v-col cols="9" class="py-0">
                <div class="text--primary" style="font-size: 1.1rem">
                  {{ cnt.open }} 台
                </div>
              </v-col>

              <v-col cols="3" class="py-0">
                <v-subheader>
                  申请送风
                </v-subheader>
              </v-col>
              <v-col cols="9" class="py-0">
                <div class="text--primary" style="font-size: 1.1rem">
                  {{ cnt.req }} 台
                </div>
              </v-col>

              <v-col cols="3" class="py-0">
                <v-subheader>
                  正在送风
                </v-subheader>
              </v-col>
              <v-col cols="9" class="py-0">
                <div class="text--primary" style="font-size: 1.1rem">
                  {{ cnt.serve }} 台
                </div>
              </v-col>
            </v-row>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions v-if="!editing">
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="edit">
              编辑
            </v-btn>
          </v-card-actions>

          <v-card-actions v-else>
            <v-btn text color="error" :disabled="loading" @click="editing = false">
              取消
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn text color="success" :loading="loading" @click="apply">
              应用
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'Monitor',

    data: () => ({
      editing: false,
      loading: false,
      options: [
        { text: '先来先得', value: 0 },
        { text: '高速风优先抢占', value: 1 },
        { text: '时间片轮转', value: 2 },
      ],
      saved: {
        cycle: 0,
        strategy: 0,
      },
      edited: {
        cycle: 0,
        strategy: 0,
      },
      cnt: {
        open: 0,
        req: 0,
        serve: 0
      }
    }),

    mounted: function () {
      this.getInfo()
    },

    methods: {
      getInfo: function () {
        this.saved.cycle = 2
        this.saved.strategy = 1
      },
      edit: function () {
        this.edited.cycle = this.saved.cycle
        this.edited.strategy = this.saved.strategy
        this.editing = true
      },
      apply: function () {
        this.loading = true
        this.saved.cycle = this.edited.cycle
        this.saved.strategy = this.edited.strategy
        this.loading = false
        this.editing = false
      }
    }
  }
</script>
