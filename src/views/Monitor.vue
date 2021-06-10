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
                  hide-details="auto"
                  v-model="edited.cycle"
                  suffix="秒"
                  single-line
                  type="number"
                  style="width: 4rem; font-size: 1rem"
                  :rules="[(n) => (parseFloat(n) <= 0 ? '必须为正数' : true)]"
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
            <v-btn text color="primary" @click="edit" :disabled="disabled">
              编辑
            </v-btn>
          </v-card-actions>

          <v-card-actions v-else>
            <v-btn text color="error" :disabled="loading" @click="editing = false">
              取消
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn text color="success" :loading="loading" @click="apply" :disabled="parseFloat(this.edited.cycle) <= 0">
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
          no-data-text="无可用数据"
        >
          <template v-slot:[`item.status`]="{ item }">
            <v-chip
              :color="statusChip[item.status].color"
              dark
              small
            >
              {{ statusChip[item.status].text }}
            </v-chip>
          </template>
          <template v-slot:[`item.cur_temp`]="{ item }">
            {{ item.cur_temp ? item.cur_temp.toFixed(2) + ' &deg;C' : 'N/A' }}
          </template>
          <template v-slot:[`item.tar_temp`]="{ item }">
            {{ item.tar_temp ? item.tar_temp.toFixed(2) + ' &deg;C' : 'N/A' }}
          </template>
          <template v-slot:[`item.total_energy`]="{ item }">
            {{ item.total_energy ? item.total_energy.toFixed(2) + ' kW·h' : 'N/A' }}
          </template>
          <template v-slot:[`item.total_cost`]="{ item }">
            {{ item.total_cost ? item.total_cost.toFixed(2) + ' 元' : 'N/A' }}
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
      disabled: true,
      editing: false,
      loading: false,
      options: [
        { text: '时间片轮转', value: 0 },
        { text: '先来先服务', value: 1 }
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
      statusChip: [
        { text: '关机', color: 'grey' },
        { text: '待机', color: 'info' },
        { text: '请求送风', color: 'warning' },
        { text: '正在送风', color: 'success' }
      ],
      timer: null
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
          if (!o.is_active) {
            o.status = 0  // 关机
          } else if (!o.has_request) {
            o.status = 1  // 待机
          } else if (!o.has_served) {
            o.status = 2  // 请求送风
          } else {
            o.status = 3  // 正在送风
          }
        })
        return ret
      }
    },

    mounted: function () {
      this.getInfo()
      this.getRoomInfo()
    },

    destroyed: function () {
      this.timer = clearInterval(this.timer)
    },

    methods: {
      setTimer: function () {
        this.timer = clearInterval(this.timer)
        this.timer = setInterval(this.getRoomInfo, parseFloat(this.saved.cycle) * 1000)
      },
      getInfo: function () {
        this.$axios.get('/main/state')
          .then((res) => {
            this.saved.cycle = res.data.interval
            this.saved.strategy = res.data.strategy
            this.setTimer()
            this.disabled = false
          })
          .catch((err) => {
            console.log(err)
            this.$toast.error('与服务器连接出错')
          })
      },
      getRoomInfo: function () {
        this.$axios.get('/room')
          .then((res) => {
            this.roomInfo = res.data
          })
          .catch((err) => {
            console.log(err)
            this.$toast.error('与服务器连接出错')
          })
      },
      edit: function () {
        this.edited.cycle = this.saved.cycle
        this.edited.strategy = this.saved.strategy
        this.editing = true
      },
      apply: function () {
        this.loading = true
        this.$axios.post('/main/set_interval', this.edited.cycle.toString())
          .then(() => {
            this.saved.cycle = this.edited.cycle
            this.setTimer()
            if (this.edited.strategy != this.saved.strategy) {
              this.$axios.post('/main/set_strategy', this.edited.strategy.toString())
                .then(() => {
                  this.saved.strategy = this.edited.strategy
                  this.$toast.success('设置成功')
                })
                .catch((err) => {
                  console.log(err)
                  this.$toast.error('与服务器连接出错')
                })
                .then(() => {
                  this.loading = false
                  this.editing = false
                })
            } else {
              this.$toast.success('设置成功')
              this.loading = false
              this.editing = false
            }
          })
          .catch((err) => {
            console.log(err)
            this.$toast.error('与服务器连接出错')
            this.loading = false
            this.editing = false
          })
      }
    }
  }
</script>
