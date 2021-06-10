<template>
  <v-container>
    <div class="text-h5 my-2">送风请求记录</div>
    <v-divider></v-divider>
    <v-row class="mt-2">
      <v-col style="max-width: 34rem">
        <v-card>
          <v-card-text class="px-8">
            <v-row align="center">
              <v-col cols="3" class="py-0">
                <v-subheader>
                  时间粒度
                </v-subheader>
              </v-col>
              <v-col cols="9" class="py-0">
                <v-radio-group v-model="type" row>
                  <v-radio
                    v-for="n in 3"
                    :key="n-1"
                    :label="strType[n-1]"
                    :value="n-1"
                  ></v-radio>
                </v-radio-group>
              </v-col>

              <v-col cols="3" class="py-0">
                <v-subheader>
                  时间选择
                </v-subheader>
              </v-col>
              <v-col cols="9" class="py-0">
                <v-dialog
                  v-if="type == 0"
                  ref="dialogDay"
                  v-model="modal"
                  :return-value.sync="dateDay"
                  persistent
                  width="26rem"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      :value="dateDay"
                      label="选择日期"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="dateDay"
                    scrollable
                    locale="zh"
                    width="26rem"
                  >
                    <v-spacer></v-spacer>
                    <v-btn
                      text
                      color="primary"
                      @click="modal = false"
                    >
                      取消
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.dialogDay.save(dateDay)"
                    >
                      确定
                    </v-btn>
                  </v-date-picker>
                </v-dialog>

                <v-dialog
                  v-else-if="type == 1"
                  ref="dialogWeek"
                  v-model="modal"
                  :return-value.sync="dateWeek"
                  persistent
                  width="26rem"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      :value="dateWeek[0] + ' 至 ' + dateWeek[6]"
                      label="选择日期"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="dateWeek"
                    @input="pick"
                    multiple
                    scrollable
                    no-title
                    locale="zh"
                    width="26rem"
                  >
                    <v-spacer></v-spacer>
                    <v-btn
                      text
                      color="primary"
                      @click="modal = false"
                    >
                      取消
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.dialogWeek.save(dateWeek)"
                    >
                      确定
                    </v-btn>
                  </v-date-picker>
                </v-dialog>

                <v-dialog
                  v-else
                  ref="dialogMonth"
                  v-model="modal"
                  :return-value.sync="dateMonth"
                  persistent
                  width="20rem"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="dateMonth"
                      label="选择日期"
                      prepend-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="dateMonth"
                    type="month"
                    scrollable
                    locale="zh"
                    width="20rem"
                  >
                    <v-spacer></v-spacer>
                    <v-btn
                      text
                      color="primary"
                      @click="modal = false"
                    >
                      取消
                    </v-btn>
                    <v-btn
                      text
                      color="primary"
                      @click="$refs.dialogMonth.save(dateMonth)"
                    >
                      确定
                    </v-btn>
                  </v-date-picker>
                </v-dialog>
              </v-col>
            </v-row>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text color="success" :loading="loading" @click="apply">
              查询
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-data-table
          hide-default-footer
          :headers="headers"
          :items="tableItems"
          class="elevation-2"
          :loading="loadingTable"
          loading-text="加载中，请稍候"
          no-data-text="无可用数据"
        >
          <template v-slot:[`item.start_time`]="{ item }">
            {{ formatDate(item.start_time) }}
          </template>
          <template v-slot:[`item.end_time`]="{ item }">
            {{ formatDate(item.end_time) }}
          </template>
          <template v-slot:[`item.speed`]="{ item }">
            <v-chip
              :color="speedChip[item.speed].color"
              dark
              small
            >
              {{ speedChip[item.speed].text }}
            </v-chip>
          </template>
          <template v-slot:[`item.total_energy`]="{ item }">
            {{ item.total_energy.toFixed(2) }} kW·h
          </template>
          <template v-slot:[`item.total_cost`]="{ item }">
            {{ item.total_cost.toFixed(2) }} 元
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import qs from 'qs'

  export default {
    name: 'Query',

    data: () => ({
      dateDay: '',
      dateWeek: [],
      dateMonth: '',
      modal: false,
      type: 0,
      strType: ['日报表', '周报表', '月报表'],
      loading: false,
      result: [],
      headers: [
        { text: '房间号', value: 'room_id', align: 'center', class: 'pl-4 pr-0' },
        { text: '用户号', value: 'user_number', align: 'center', class: 'pl-4 pr-0' },
        { text: '请求开始时间', value: 'start_time', align: 'center', class: 'pl-4 pr-0' },
        { text: '请求结束时间', value: 'end_time', align: 'center', class: 'pl-4 pr-0' },
        { text: '请求风速', value: 'speed', align: 'center', class: 'pl-4 pr-0' },
        { text: '请求开始时温度', value: 'start_temp', align: 'center', class: 'pl-4 pr-0' },
        { text: '请求结束时温度', value: 'end_temp', align: 'center', class: 'pl-4 pr-0' },
        { text: '请求期间能耗', value: 'total_energy', align: 'center', class: 'pl-4 pr-0' },
        { text: '请求期间开销', value: 'total_cost', align: 'center', class: 'pl-4 pr-0' }
      ],
      speedChip: [
        { text: '低风速', color: 'success' },
        { text: '中风速', color: 'warning' },
        { text: '高风速', color: 'error' }
      ],
      loadingTable: false
    }),

    computed: {
      tableItems: function () {
        let ret = this.result
        ret.forEach(o => {
          o.start_time = new Date(o.start_time)
          o.end_time = new Date(o.end_time)
        })
        return ret
      }
    },

    mounted: function () {
      let today = new Date()
      this.dateDay = this.formatDate(today)
      this.pick([this.formatDate(today)])
      this.dateMonth = today.getFullYear() + '-' + ('0' + (today.getMonth()+1)).substr(-2)
    },

    methods: {
      pick: function (dates) {
        let pickedDate = dates[dates.length-1]
        let dateObj = new Date(pickedDate)
        while (dateObj.getDay() != 1) {
          dateObj.setDate(dateObj.getDate() - 1)
        }
        this.dateWeek = []
        for (let i = 0; i < 7; ++i) {
          this.dateWeek.push(this.formatDate(dateObj))
          dateObj.setDate(dateObj.getDate() + 1)
        }
      },

      formatDate: function (dateObj) {
        return dateObj.getFullYear()
          + '-'
          + ('0' + (dateObj.getMonth()+1)).substr(-2)
          + '-'
          + ('0' + dateObj.getDate()).substr(-2)
      },

      apply: function () {
        this.loading = true
        this.loadingTable = true
        this.result = []

        let url = '/request'
        let time
        switch (this.type) {
          case 0:
            url += '/day'
            time = this.dateDay
            break
          case 1:
            url += '/week'
            time = this.dateWeek[0]
            break
          case 2:
            url += '/month'
            time = this.dateMonth + '-01'
            break
        }

        this.$axios.post(url + '?' + qs.stringify({ time: time }))
          .then((res) => {
            this.result = res.data
          })
          .catch((err) => {
            console.log(err)
            this.$toast.error('与服务器连接出错')
          })
          .then(() => {
            this.loading = false
            this.loadingTable = false
          })
      }
    }
  }
</script>
