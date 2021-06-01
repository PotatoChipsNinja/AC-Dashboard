<template>
  <div class="d-flex justify-center" style="height: 100%">
    <v-col cols="6" align-self="center">
      <v-card class="overflow-hidden" color="login lighten-1" dark>
        <v-toolbar flat color="login">
          <v-icon>mdi-login-variant</v-icon>
          <v-toolbar-title class="font-weight-light ml-2">
            管理员登录
          </v-toolbar-title>
        </v-toolbar>
        <v-card-text>
          <v-text-field
            v-model="inputUsername"
            color="white"
            prepend-icon="mdi-account"
            label="用户名"
            :error-messages="usernameErrMsg"
            @input="usernameErrMsg = ''"
            clearable
          ></v-text-field>
          <v-text-field
            v-model="inputPassword"
            color="white"
            prepend-icon="mdi-form-textbox-password"
            label="密码"
            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            :type="show ? 'text' : 'password'"
            @click:append="show = !show"
            :error-messages="passwordErrMsg"
            @input="passwordErrMsg = ''"
            clearable
          ></v-text-field>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="indigo" @click="login">
            登录
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </div>
</template>

<script>
  export default {
    name: 'Login',

    data: () => ({
      show: false,
      inputUsername: '',
      inputPassword: '',
      usernameErrMsg: '',
      passwordErrMsg: ''
    }),

    methods: {
      login: function () {
        if (!this.inputUsername) {
          this.usernameErrMsg = '用户名不能为空'
        } else if (!this.inputPassword) {
          this.passwordErrMsg = '密码不能为空'
        } else if (this.inputUsername != 'admin') {
          this.usernameErrMsg = '用户不存在'
        } else if (this.inputPassword != '123456') {
          this.passwordErrMsg = '密码错误'
        } else {
          localStorage.setItem('username', 'admin')
          this.$emit('update:username', 'admin')
          this.$router.replace('/')
        }
      }
    },

    mounted: function () {
      if (localStorage.getItem('username')) {
        this.$router.replace('/')
      }
    }
  }
</script>
