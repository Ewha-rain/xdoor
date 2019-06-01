<template>
  <div>
    <header>
      <!--<img src="../../../static/image/logo.png" class="header-logo"/>-->
      <span class="header-title">{{project.name}}</span>

      <ul class="header-operations">
        <li>
          <span class="header-lang is-active">{{project.admin}}</span>
        </li>
        <li @click="logout">退出登录</li>
      </ul>
    </header>
  </div>
</template>
<script>
  export default {
    props: ['project'],
    data() {
      return {};
    },
    created() {
    },
    methods: {
      logout() {
        const that = this;

        that.$http.ajax('admin/logout', null, function (res) {
          console.log(res);
          if (res.code == 0) {
            that.$utils.delCookie('token');
            that.$router.push({path: '/login'});
          } else {
            that.$message.error('code:' + res.code + '&msg:' + res.msg);
          }
        }, function () {
            that.$router.push({path: '/login'});
        })
      }
    }
  };
</script>

<style lang="scss">
  @import "../../style/_style.scss";

  header {
    background-color: $main;
    height: 80px;
    width: 100%;
    top: 0;
    left: 0;
    padding: 0 20px;
    z-index: 1999;
    box-sizing: border-box;
    position: fixed;
  }

  .header-logo {
    position: absolute;
    top: 10px;
    height: 60px;
    left: 30px;
  }

  .header-title {
    float: left;
    margin-left: 15px;
    line-height: 80px;
    font: {
      /*weight: bold;*/
      size: 20px;
    }
    color: white;
  }

  .header-operations {
    display: inline-block;
    float: right;
    /*padding-right: 30px;*/
    height: 100%;
  }

  .header-operations li {
    color: #fff;
    display: inline-block;
    vertical-align: middle;
    padding: 0 10px;
    margin: 0 10px;
    line-height: 80px;
    cursor: pointer;
  }

  .header-operations li:first-child {
    cursor: default
  }

  .header-opacity {
    opacity: .7;
  }

  .header-operations:after, header:after {
    display: inline-block;
    content: "";
    height: 100%;
    vertical-align: middle;
  }
</style>
