<template>
  <v-container>
    <div class="text-h5 my-2">状态管理</div>
    <v-divider></v-divider>
    <v-row class="mt-2">
      <v-col style="max-width: 32rem">
        <v-card>
          <v-card-title>
            主机概况
          </v-card-title>

          <v-divider></v-divider>

          <v-card-text>
            <v-row align="center">
              <v-col cols="3" class="py-0">
                <v-subheader>
                  运行状态
                </v-subheader>
              </v-col>
              <v-col cols="9" class="py-0">
                <div class="text--primary" style="font-size: 1.1rem">
                  <v-icon :color="isRunning ? 'success' : 'gray'">mdi-circle-medium</v-icon>
                  {{ isRunning ? '工作' : '待机' }}
                </div>
              </v-col>

              <v-col cols="3" class="py-0">
                <v-subheader>
                  工作模式
                </v-subheader>
              </v-col>
              <v-col cols="9" class="py-0">
                <v-switch
                  v-if="editing"
                  v-model="edited.modeWarm"
                  inset
                  color="red"
                  class="inactive-blue ml-2"
                >
                  <template v-slot:label>
                    <div class="text--primary" style="font-size: 1.1rem">
                      {{ edited.modeWarm ? '制热' : '制冷' }}
                    </div>
                  </template>
                </v-switch>

                <div v-else class="text--primary" style="font-size: 1.1rem">
                  <v-icon :color="saved.modeWarm ? 'red' : 'blue'" v-text="saved.modeWarm ? 'mdi-fire' : 'mdi-snowflake'"></v-icon>
                  {{ saved.modeWarm ? '制热' : '制冷' }}
                </div>
              </v-col>

              <v-col cols="3" class="py-0">
                <v-subheader>
                  工作温度
                </v-subheader>
              </v-col>
              <v-col cols="9" class="py-0">
                <v-slider
                  v-if="editing"
                  v-model="edited.temp"
                  :thumb-size="24"
                  thumb-label="always"
                  class="mt-6 temp-slider"
                  :color="edited.modeWarm ? 'red' : 'blue'"
                  :min="edited.modeWarm ? 25 : 18"
                  :max="edited.modeWarm ? 30 : 25"
                ></v-slider>

                <div v-else class="text--primary" style="font-size: 1.1rem">
                  <span class="display-1 font-weight-light">{{ saved.temp }}</span>
                  <span class="subheading font-weight-light mr-1">&deg;C</span>
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
    name: 'Status',

    data: () => ({
      disabled: true,
      editing: false,
      loading: false,
      isRunning: false,
      saved: {
        modeWarm: false,
        temp: 0
      },
      edited: {
        modeWarm: false,
        temp: 0
      }
    }),

    mounted: function () {
      this.getInfo()
    },

    methods: {
      getInfo: function () {
        this.$axios.get('/main/state')
          .then((res) => {
            this.isRunning = res.data.work_mode == 1
            this.saved.modeWarm = res.data.mode == 1
            this.saved.temp = res.data.work_temp
            this.disabled = false
          })
          .catch((err) => {
            console.log(err)
            this.$toast.error('与服务器连接出错')
          })
      },
      edit: function () {
        this.edited.modeWarm = this.saved.modeWarm
        this.edited.temp = this.saved.temp
        this.editing = true
      },
      apply: function () {
        this.loading = true
        this.$axios.post('/main/set_mode', this.edited.modeWarm ? '1' : '0')
          .then(() => {
            this.saved.modeWarm = this.edited.modeWarm
            this.$axios.post('/main/set_temp', this.edited.temp)
              .then(() => {
                this.saved.temp = this.edited.temp
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
