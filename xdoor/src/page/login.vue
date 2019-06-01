<template>
  <div class="login-container">
    <el-form
      class="login-form"
      :model="loginForm"
      :rules="rules"
      ref="loginForm"
      label-position="left"
      label-width="80px">

      <div class="title-container">
        <h3 class="title">dev.xlock后台管理登录</h3>
      </div>

      <el-form-item prop="username" label="用户名">
        <el-input type="text" clearable auto-complete="on"
                  v-model="loginForm.username"
                  maxlength="20" minlength="5"
                  placeholder="用户名"></el-input>
      </el-form-item>

      <el-form-item prop="password" label="密码">
        <el-input type="password" clearable
                  v-model="loginForm.password"
                  onpaste="return false"
                  maxlength="20" minlength="5"
                  placeholder="密码"></el-input>
      </el-form-item>

      <!--<el-form-item prop="code" label="验证码" class="checkcode">
        <el-input type="text" clearable id="J_codetext"
                  placeholder="验证码" maxlength="4"
                  v-model="loginForm.code"
                  @keyup.enter.native="login">
        </el-input>

        <img id="codeImg" align="center"
             title="加载中" class="pointer"
             :src="codeSrc"
             width="120" style="height:40px;margin-left:35%"/>

        <input id="changeImg" type="button"
               value="换一张" class="ver_btn"
               @click="changeCode"/>

      </el-form-item>-->

      <el-form-item>
        <el-button class="login-button"
                   type="primary"
                   :loading="loading"
                   @click="login">登录
        </el-button>
      </el-form-item>


    </el-form>
  </div>
</template>

<script>
  import md5 from '../../static/js/jQuery.md5'

  export default {
    data() {
      return {
        loginForm: {
          username: '',
          password: '',
          code: ''
        },
        rules: {
          username: [{required: true, message: '请输入用户名', trigger: 'blur'},
            {max: 20, message: '用户名最多20位', trigger: 'blur'},
            {min: 5, message: '用户名至少5位', trigger: 'blur'}],
          password: [{required: true, message: '请输入密码', trigger: 'blur'},
            {max: 20, message: '密码最多20位', trigger: 'blur'},
            {min: 5, message: '密码至少5位', trigger: 'blur'}],
        },
        loading: false,
        codeSrc: 'http://admins.xsindex.ooglock.com/service/admin/identification'
      }
    },
    created() {
    },
    methods: {
      login() {
        const that = this;
        that.$refs.loginForm.validate(valid => {
          if (valid) {
            that.loading = true;
            let loginForm = that.loginForm;

            let data = {
              userName: loginForm.username,
              userPassword: $.md5(loginForm.password).toUpperCase(),
            };
            that.$http.ajax('admin/login', data, function (res) {
              console.log(res);
              that.loading = false;
              if (res.code == 0) {
                // that.$utils.setCookie("adminId", res.data.userId);
                that.$utils.setCookie('token', res.data.token);
                that.$router.push({
                  path: '/index/charts'
                });
              } else {
                that.$message.error(res.msg);
              }
            }, function (e) {
              console.log(e);
            });

          } else {
            return false;
          }
        })

      },
      changeCode() {
        this.codeSrc = 'http://admins.xsindex.ooglock.com/service/admin/identification?random=' + new Date().getTime();
      }
    }
  }
</script>


<style lang="scss" scoped>
  @import "../style/login";
</style>

