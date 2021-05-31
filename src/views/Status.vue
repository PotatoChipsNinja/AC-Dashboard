<template>
  <v-container>
    <div class="text-h5 my-2">状态管理</div>
    <v-divider></v-divider>
    <v-row class="mt-2">
      <v-col style="max-width: 32rem">
        <v-card>
          <v-card-title>
            主机
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
            <v-btn text color="success" @click="edit">
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
<!--
        <v-card
          class="mx-auto"
          max-width="344"
        >
          <v-card-text>
            <div>Word of the Day</div>
            <p class="display-1 text--primary">
              el·ee·mos·y·nar·y
            </p>
            <p>adjective</p>
            <div class="text--primary">
              relating to or dependent on charity; charitable.<br>
              "an eleemosynary educational institution."
            </div>
          </v-card-text>
          <v-card-actions>
            <v-btn
              text
              color="teal accent-4"
            >
              Learn More
            </v-btn>
          </v-card-actions>
        </v-card>
-->
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'Status',

    data: () => ({
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

    methods: {
      edit: function () {
        this.edited.modeWarm = this.saved.modeWarm
        this.edited.temp = this.saved.temp
        this.editing = true
      },
      getInfo: function () {
        this.isRunning = true
        this.saved.modeWarm = true
        this.saved.temp = 26
      },
      apply: function () {
        this.loading = true
        this.saved.modeWarm = this.edited.modeWarm
        this.saved.temp = this.edited.temp
        this.loading = false
        this.editing = false
      }
    }
  }
</script>
