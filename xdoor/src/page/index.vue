<template>
  <div id="index">
    <el-row class="container" style="height: 100%">

      <!--头部 -->
      <v-header :project="project"></v-header>

      <el-col :span="24" class="main">
        <el-row>

          <!--导航菜单  -->
          <el-col :span="4" class="nav-menu">
            <v-menu></v-menu>
          </el-col>

          <!--页面  -->
          <section class="contentCon">
            <el-col :span="24" class="content-wrapper">
              <transition>
                <router-view></router-view>
              </transition>
            </el-col>
          </section>

        </el-row>
      </el-col>
    </el-row>
  </div>

</template>

<script>
  import header from '../components/header/header.vue'
  import menu from '../components/menu/menu.vue'

  export default {
    data() {
      return {
        project: {
          admin: "admin",
          name:'dev.xlock后台管理系统'
        }
      }
    },
    created() {

    },
    beforeCreate() {
    },
    components: {
      'v-header': header,
      'v-menu': menu
    }
  }
</script>

<style>

  body {
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
    background-color: #fff;
  }

  .container {
    padding-top: 80px;
    height: 100%;
  }

  .container .main {
    padding: 0;
  }

  .container ul li.el-menu-item {
    font-size: 100%;
  }

  .container .mar-l {
    padding: 0;
  }

  .container .content-wrapper {
    padding: 20px;
  }

  .el-row {
    margin-bottom: 20px;

  }
  :last-child {
    margin-bottom: 0;
  }
  s

  .el-col {
    border-radius: 4px;
  }

  .bg-purple-dark {
    background: #99a9bf;
  }

  .bg-purple {
    background: #d3dce6;
  }

  .bg-purple-light {
    background: #e5e9f2;
  }

  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }

  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }

  .contentCon{
    margin-left: 180px;
  }
  .nav-menu {
    width: 190px!important;
    height: 100%!important;
    background: #f5f5f5;
    position: fixed!important;
    top: 80px!important;
    bottom: 0;
    left: 0;
    overflow: scroll;
    padding-bottom: 100px!important;
  }
 .nav-menu::-webkit-scrollbar {
    display: none;
 }
</style>

