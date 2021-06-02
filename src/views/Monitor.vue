<template>
  <v-container>
    <div class="text-h5 my-2">监控和调度</div>
    <v-divider></v-divider>
    <v-row class="mt-2">
      <v-col style="max-width: 24rem">
        <v-card>
          <v-card-title>
            从机概况
          </v-card-title>

          <v-divider></v-divider>

          <v-card-text>
            <v-row align="center">
              <v-col cols="5" class="py-0">
                <v-subheader>
                  监测周期
                </v-subheader>
              </v-col>
              <v-col cols="7" class="py-0">
                <v-text-field
                  v-if="editing"
                  class="mt-0 pt-0"
                  hide-details
                  v-model="edited.cycle"
                  suffix="秒"
                  single-line
                  type="number"
                  style="width: 4rem; font-size: 1rem"
                ></v-text-field>
                <div v-else class="text--primary" style="font-size: 1rem">
                  {{ saved.cycle }} 秒
                </div>
              </v-col>

              <v-col cols="5" class="py-0">
                <v-subheader>
                  调度策略
                </v-subheader>
              </v-col>
              <v-col cols="7" class="py-0">
                <v-select
                  v-if="editing"
                  v-model="edited.strategy"
                  :items="options"
                  single-line
                  style="width: 10rem; font-size: 1rem"
                ></v-select>
                <div v-else class="text--primary" style="font-size: 1rem">
                  {{ options[saved.strategy].text }}
                </div>
              </v-col>

              <v-col cols="5" class="py-0">
                <v-subheader>
                  已开机
                </v-subheader>
              </v-col>
              <v-col cols="7" class="py-0">
                <div class="text--primary" style="font-size: 1rem">
                  {{ cnt.open }} 台
                </div>
              </v-col>

              <v-col cols="5" class="py-0">
                <v-subheader>
                  申请送风
                </v-subheader>
              </v-col>
              <v-col cols="7" class="py-0">
                <div class="text--primary" style="font-size: 1rem">
                  {{ cnt.req }} 台
                </div>
              </v-col>

              <v-col cols="5" class="py-0">
                <v-subheader>
                  正在送风
                </v-subheader>
              </v-col>
              <v-col cols="7" class="py-0">
                <div class="text--primary" style="font-size: 1rem">
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

      <v-col>
        <v-data-table
          hide-default-footer
          :headers="headers"
          :items="tableItems"
          class="elevation-2 roomTable"
        >
          <template v-slot:[`item.status`]="{ item }">
            {{ strStatus[item.status] }}
          </template>
          <template v-slot:[`item.cur_temp`]="{ item }">
            {{ item.cur_temp }} &deg;C
          </template>
          <template v-slot:[`item.tar_temp`]="{ item }">
            {{ item.tar_temp }} &deg;C
          </template>
          <template v-slot:[`item.total_energy`]="{ item }">
            {{ item.total_energy }} J
          </template>
          <template v-slot:[`item.total_cost`]="{ item }">
            {{ item.total_cost }} 元
          </template>
        </v-data-table>
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
      roomInfo: [],
      headers: [
        { text: '房间号', value: 'id', align: 'center', class: 'pl-4 pr-0' },
        { text: '用户号', value: 'user_number', align: 'center', class: 'pl-4 pr-0' },
        { text: '状态', value: 'status', align: 'center', class: 'pl-4 pr-0' },
        { text: '当前温度', value: 'cur_temp', align: 'center', class: 'pl-4 pr-0' },
        { text: '目标温度', value: 'tar_temp', align: 'center', class: 'pl-4 pr-0' },
        { text: '耗能', value: 'total_energy', align: 'center', class: 'pl-4 pr-0' },
        { text: '费用', value: 'total_cost', align: 'center', class: 'pl-4 pr-0' }
      ],
      strStatus: ['待机', '请求送风', '正在送风']
    }),

    computed: {
      cnt: function () {
        let ret = {
          open: this.roomInfo.filter(o => o.is_active).length,
          req: this.roomInfo.filter(o => o.has_request).length,
          serve: this.roomInfo.filter(o => o.has_served).length
        }
        return ret
      },
      tableItems: function () {
        let ret = this.roomInfo
        ret.forEach(o => {
          if (!o.is_active || !o.has_request) {
            o.status = 0  // 待机
          } else if (!o.has_served) {
            o.status = 1  // 请求送风
          } else {
            o.status = 2  // 正在送风
          }
        })
        return ret
      }
    },

    mounted: function () {
      this.getInfo()
    },

    methods: {
      getInfo: function () {
        this.saved.cycle = 2
        this.saved.strategy = 1
        this.roomInfo = [
          {
            id: 123,
            is_active: true,
            has_request: true,
            has_served: false,
            tar_temp: 23,
            cur_temp: 25,
            user_number: 321,
            total_energy: 23,
            total_cost: 50
          },
          {
            id: 555,
            is_active: true,
            has_request: true,
            has_served: true,
            tar_temp: 21,
            cur_temp: 20,
            user_number: 333,
            total_energy: 12,
            total_cost: 10
          }
        ]
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
