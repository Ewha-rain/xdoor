<template>
  <div id="menu">
    <el-menu
      :default-active="$route.path"
      light router
      class="mar-l el-menu-vertical-demo el-col"
      @open="handleOpen"
      @close="handleClose">

      <el-submenu index="1">

        <template slot="title">
          <i class="iconfont icon-charts"></i>
          <span>报表</span>
        </template>

        <el-menu-item-group>
          <template>
            <el-menu-item index="/index/charts">报表</el-menu-item>
          </template>

        </el-menu-item-group>

      </el-submenu>

      <el-submenu index="2">

        <template slot="title">
          <i class="iconfont icon-build"></i>
          <span>公寓管理</span>
        </template>

        <el-menu-item-group>

          <template>
            <el-menu-item index="/index/xiaoquManage">管理公寓</el-menu-item>
          </template>

         <!-- <template>
            <el-menu-item index="/index/buildInsert">添加楼栋</el-menu-item>
          </template>

          <template>
            <el-menu-item index="/index/buildList">房态</el-menu-item>
          </template>-->

        </el-menu-item-group>

      </el-submenu>

      <el-submenu index="3">
        <template slot="title">
          <i class="iconfont icon-lockManage"></i>
          <span>设备管理</span>
        </template>

        <el-menu-item-group>

          <template>
            <el-menu-item index="/index/lockInsert">添加设备</el-menu-item>
          </template>

          <template>
            <el-menu-item index="/index/lockManage">设备管理</el-menu-item>
          </template>

        </el-menu-item-group>

      </el-submenu>

      <el-submenu index="4">
        <template slot="title">
          <i class="iconfont icon-invite"></i>
          <span>访客管理</span>
        </template>

        <el-menu-item-group>
          <template>
            <el-menu-item index="/index/inviteManage">访客管理</el-menu-item>
          </template>

        </el-menu-item-group>

      </el-submenu>

      <el-submenu index="5">
        <template slot="title">
          <i class="iconfont icon-maintain"></i>
          <span>报修管理</span>
        </template>

        <el-menu-item-group>
          <template>
            <el-menu-item index="/index/maintainManage">管理报修</el-menu-item>
          </template>

        </el-menu-item-group>

      </el-submenu>

      <el-submenu index="6">
        <template slot="title">
          <i class="iconfont icon-notice"></i>
          <span>公告管理</span>
        </template>

        <el-menu-item-group>
          <template>
            <el-menu-item index="/index/noticeManage">管理公告</el-menu-item>
          </template>

        </el-menu-item-group>

      </el-submenu>

      <el-submenu index="7">
        <template slot="title">
          <i class="iconfont icon-note"></i>
          <span>工作日志</span>
        </template>

        <el-menu-item-group>
          <template>
            <el-menu-item index="/index/noteManage">工作日志</el-menu-item>
          </template>

        </el-menu-item-group>

      </el-submenu>


    </el-menu>
  </div>
</template>

<script>
  export default {
    data() {
      return {}
    },
    methods: {
      handleOpen(key, keyPath) {
      },
      handleClose(key, keyPath) {
      }
    }
  }
</script>

<style>

  .el-menu-item-group__title {
    padding: 0 !important;
  }

  #menu .el-menu {
    border: 0;
  }

  #menu .el-menu-item {
    padding: 0;
    font-size: 14px;
    min-width: 0;
    /*background: #eeeeee;*/
  }

  #menu .el-submenu__title {
    background: #EEF1F6;
  }

  #menu .el-menu-item-group > ul {
    background-color: #E4E8F1;
  }

</style>
