<template>
  <v-container>
    <div class="text-h5 my-2">修改密码</div>
    <v-divider></v-divider>
    <v-row class="mt-2">
      <v-col style="max-width: 32rem">
        <v-card>
          <v-card-text class="px-8">
            <v-text-field
              v-model="input.old"
              prepend-icon="mdi-form-textbox-password"
              :append-icon="show.old ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show.old ? 'text' : 'password'"
              @click:append="show.old = !show.old"
              label="当前密码"
              :error-messages="errMsg.old"
              @input="errMsg.old = ''"
              clearable
            ></v-text-field>

            <v-text-field
              v-model="input.new"
              prepend-icon="mdi-new-box"
              :append-icon="show.new ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show.new ? 'text' : 'password'"
              @click:append="show.new = !show.new"
              label="新密码"
              :error-messages="errMsg.new"
              @input="errMsg.new = ''"
              clearable
            ></v-text-field>

            <v-text-field
              v-model="input.repeat"
              prepend-icon="mdi-repeat"
              :append-icon="show.repeat ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show.repeat ? 'text' : 'password'"
              @click:append="show.repeat = !show.repeat"
              label="重复密码"
              :error-messages="errMsg.repeat"
              @input="errMsg.repeat = ''"
              clearable
            ></v-text-field>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text color="success" :loading="loading" @click="apply">
              确定
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: 'Passwd',

    data: () => ({
      loading: false,
      input: {
        old: '',
        new: '',
        repeat: ''
      },
      errMsg: {
        old: '',
        new: '',
        repeat: ''
      },
      show: {
        old: false,
        new: false,
        repeat: false
      }
    }),

    methods: {
      apply: function () {
        this.errMsg.old = ''
        this.errMsg.new = ''
        this.errMsg.repeat = ''
        this.loading = true
        if (!this.input.old) {
          this.errMsg.old = '请输入当前密码'
        } else if (!this.input.new) {
          this.errMsg.new = '新密码不能为空'
        } else if (this.input.repeat != this.input.new) {
          this.errMsg.repeat = '两次输入的密码不一致'
        } else {
          // 上传新密码
          let success = true
          if (success) {
            //this.$toast.success('密码修改成功')
            this.$toast.warning('该服务暂不支持')
            this.input.old = ''
            this.input.new = ''
            this.input.repeat = ''
          } else {
            this.errMsg.old = '密码错误'
          }
        }
        this.loading = false
      }
    }
  }
</script>
