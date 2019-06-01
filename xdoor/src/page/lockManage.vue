<template>
  <section>
    <el-row>
      <el-col :span="24">

        <div class="col-top">
          <h3>设备管理</h3>
        </div>

        <!--<br/>-->
        <!--<el-form>
          <el-button style="margin-left: 16px" type="primary" icon="el-icon-plus" size="small" @click="inviteInsert">
            添加日志
          </el-button>
        </el-form>-->

        <br/>
        <div class="top-action">
          <!--搜索表单-->
          <div class="form-search">
            <el-form :inline="true" :model="searchParams">

              <el-form-item label="">
                <el-input
                  v-model="searchParams.lockMac"
                  placeholder="请输入设备MAC"
                  size="small" clearable></el-input>
              </el-form-item>

              <el-form-item label="联网状态">
                <el-select v-model="searchParams.lockOnlineStatus" clearable placeholder="请选择" style="width: 100px;"
                           @change="changeSelect" size="small">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="在线" value="1"></el-option>
                  <el-option label="离线" value="0"></el-option>
                </el-select>
              </el-form-item>

              <el-button type="primary" size="small"
                         icon="el-icon-search" @click="changeSelect">
              </el-button>
            </el-form>

          </div>
        </div>

        <br/>

        <!--数据表格-->
        <el-table
          v-loading="loading"
          ref="multipleTable"
          border
          highlightCurrentRow
          :data="resData"
          style="width: 100%"
          @row-click="handleTableChange"
          @selection-change="handleSelectionChange"
          size="medium">

          <!--<el-table-column type="selection" prop="lockId">-->
          <!--</el-table-column>-->

          <el-table-column prop="lockMac" fixed="left" label="设备mac" width="220" show-overflow-tooltip align="center">
          </el-table-column>

          <el-table-column prop="lockName" label="设备名称" width="150" show-overflow-tooltip align="center">
          </el-table-column>

          <!--<el-table-column-->
          <!--prop="lockBuildId"-->
          <!--label="房间号"-->
          <!--width="150"-->
          <!--align="center">-->
          <!--<template slot-scope="scope">-->
          <!--<p>{{ scope.row.dongName }}{{ scope.row.floorName }}{{ scope.row.roomName }}</p>-->
          <!--</template>-->
          <!--</el-table-column>-->

          <el-table-column prop="" label="联网状态" width="120" align="center">
            <template slot-scope="scope">
              <p v-if="scope.row.lockOnlineStatus == 0" class="l-online">在线</p>
              <p v-if="scope.row.lockOnlineStatus == 1" class="l-offline">不正常</p>
              <p v-if="scope.row.lockOnlineStatus == 2" class="l-offline">未激活</p>
              <p v-if="scope.row.lockOnlineStatus == 3" class="l-offline">离线</p>
            </template>
          </el-table-column>

          <el-table-column prop="lockBattery" label="电量" width="90" align="center">
            <template slot-scope="scope">
              <p>{{ scope.row.lockBattery }}%</p>
            </template>
          </el-table-column>

          <el-table-column
            prop="lockTextPasswordCount" label="普通密码数" width="100" align="center">
          </el-table-column>

          <el-table-column
            prop="lockCardPasswordCount"
            label="开门卡数"
            width="100"
            align="center">
          </el-table-column>

          <el-table-column
            prop="lockCreateTime"
            label="添加时间"
            width="180"
            align="center">
          </el-table-column>

          <el-table-column label="操作" fixed="right">
            <template slot-scope="scope">
              <el-dropdown trigger="click">
                <el-button type="primary" size="small">
                  操作<i style="padding: 0;" class="el-icon-arrow-down el-icon--right"></i>
                </el-button>

                <el-dropdown-menu slot="dropdown">

                  <el-dropdown-item style="padding: 8px" @click.native="authList(scope.row)">授权列表
                  </el-dropdown-item>

                  <el-dropdown-item style="padding: 8px" @click.native="getPassword(scope.row)">获取动态密码
                  </el-dropdown-item>

                  <el-dropdown-item style="padding: 8px" @click.native="lockLog(scope.row)">日志</el-dropdown-item>

                  <el-dropdown-item style="padding: 8px" @click.native="deleteLock(scope.row)">删除设备</el-dropdown-item>

                  <el-dropdown-item style="padding: 8px" @click.native="openDoor(scope.row)"
                                    :disabled="scope.row.lockOnlineStatus == 0 ? true : false">平台远程开启门锁
                  </el-dropdown-item>

                  <el-dropdown-item style="padding: 8px" @click.native="emptyPassword(scope.row)"
                                    :disabled="scope.row.lockOnlineStatus == 0 ? true : false">清除密码
                  </el-dropdown-item>

                  <el-dropdown-item style="padding: 8px" @click.native="emptyCard(scope.row)"
                                    :disabled="scope.row.lockOnlineStatus == 0 ? true : false">清除所有卡
                  </el-dropdown-item>

                </el-dropdown-menu>
              </el-dropdown>
              <!--<el-button size="mini" type="primary" @click.stop="edit(scope.$index, scope.row)"-->
              <!--icon="el-icon-arrow-down">操作-->
              <!--</el-button>-->
            </template>
          </el-table-column>

        </el-table>

        <!--分页-->
        <div class="block">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="current"
            :page-size="size"
            layout="total, prev, pager, next, jumper"
            :total="total">
          </el-pagination>
        </div>


        <el-dialog
          title="获取动态密码"
          :visible.sync="passwordDialog"
          @close="closeDialog()">

          <div>
            <p>动态密码：{{ tempPass.password }}</p>
            <p>失效时间：{{ tempPass.endTime }}</p>
          </div>
        </el-dialog>


      </el-col>
    </el-row>

  </section>
</template>

<script>

  export default {
    data() {
      return {
        selectVal: [],
        loading: true,

        size: 12,
        current: 1,
        total: 0,
        searchParams: {},
        timeRange: '',
        resData: [],

        tempPass: {
          password: '',
          endTime: ''
        },
        passwordDialog: false,
      };

    },

    created() {
      this.selectData();
    },

    methods: {
      changeSelect() {
        const that = this;
        that.current = 1;
        that.selectData();
      },
      /**
       * 查询数据
       * */
      selectData() {
        const that = this;
        that.loading = true;
        let data = {
          current: that.current,
          size: that.size
        };

        for (let key in that.searchParams) {
          if (that.searchParams[key]) {
            data[key] = that.searchParams[key];
          }
        }

        that.$http.ajax('admin/lock/list/page', data, function (res) {
          console.log(res);
          if (res.code == 0) {
            that.total = res.data.rowCount;

            for (let i = 0; i < res.data.data.length; i++) {
              let map = res.data.data[i];
            }
            that.resData = res.data.data;
            that.loading = false;
          } else {
            that.$message.error('msg:' + res.msg);
          }
        }, function () {
          that.$router.push({path: '/login'});
        }, {needToken: true}, 'get')
      },

      /**
       * 多选
       * */
      handleSelectionChange(val) {
        this.selectVal = val;
      },
      handleTableChange(row, event, column) {
        this.$refs.multipleTable.toggleRowSelection(row)
      },

      /**
       * 授权列表
       * */
      authList: function (item) {
        const that = this;
        console.log(item);
        that.$router.push({
          name: 'authList',
          query: {
            lockId: item.lockId
          }
        })
      },

      /**
       * 获取动态密码
       * */
      getPassword: function (item) {
        const that = this;
        let data = {
          lockId: item.lockId
        };
        that.$http.ajax('admin/lock/password/get_temp_password', data, function (res) {
          if (res.code == 0) {
            that.tempPass = {
              password: res.data[0].password,
              endTime: res.data[0].endTime
            };
            that.passwordDialog = true;
          } else {
            that.$message.error('msg:' + res.msg);
          }
        }, function () {
          that.$router.push('/login');
        }, {needToken: true}, 'get');

      },

      /**
       * 日志
       * */
      lockLog: function (item) {
        const that = this;
        that.$router.push({
          name: 'lockRecord',
          query: {
            lockId: item.lockId,
            buildName: item.dongName + item.floorName + item.roomName,
            mac: item.lockMac,
            lockStatus: item.lockStatus
          }
        })
      },

      /**
       * 删除设备
       * */
      deleteLock: function (item) {
        const that = this;
        this.$confirm('确认删除设备?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = {
            lockId: item.lockId
          };
          that.$http.ajax('admin/lock/delete', data, function (res) {
            if (res.code == 0) {
              that.selectData();
              that.$message({
                type: 'success',
                message: '删除成功!'
              });

            } else {
              that.$message.error('msg:' + res.msg);
            }
          }, function () {
            that.$router.push('/login');
          }, {needToken: true});


        }).catch(() => {
        });
      },

      /**
       * 远程开门
       * */
      openDoor: function (item) {
        const that = this;
        this.$confirm('确认远程开门?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = {
            lockId: item.lockId
          };
          that.loading = true;
          that.$http.ajax('admin/lock/remote_open', data, function (res) {
            if (res.code == 0) {
              that.loading = false;
              that.$message({
                type: 'success',
                message: '远程开门成功!'
              });

            } else {
              that.loading = false;
              that.$message.error('msg:' + res.msg);
            }
          }, function () {
            that.$router.push('/login');
          }, {needToken: true});


        }).catch(() => {
        });
      },

      /**
       * 清除密码
       * */
      emptyPassword: function (item) {
        const that = this;
        this.$confirm('确认清除设备所有密码?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = {
            lockId: item.lockId
          };
          that.$http.ajax('admin/lock/password/clear_all_password', data, function (res) {
            if (res.code == 0) {
              that.selectData();
              that.$message({
                type: 'success',
                message: '清除成功!'
              });

            } else {
              that.$message.error('msg:' + res.msg);
            }
          }, function () {
            that.$router.push('/login');
          }, {needToken: true});


        }).catch(() => {
        });
      },

      /**
       * 清除卡
       * */
      emptyCard: function (item) {
        const that = this;
        this.$confirm('确认清除设备所有卡?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = {
            lockId: item.lockId
          };
          that.$http.ajax('admin/lock/password/clear_all_card', data, function (res) {
            if (res.code == 0) {
              that.selectData();
              that.$message({
                type: 'success',
                message: '清除成功!'
              });

            } else {
              that.$message.error('msg:' + res.msg);
            }
          }, function () {
            that.$router.push('/login');
          }, {needToken: true});


        }).catch(() => {
        });
      },


      closeDialog: function () {
        const that = this;
        that.tempPass = {
          password: '',
          endTime: ''
        }
      },

      /**
       * 分页
       * */
      handleSizeChange(val) {
      },
      handleCurrentChange(val) {
        this.loading = true;
        this.current = val;
        this.selectData();
      },

    }
  }
</script>

<style lang="scss" scoped>
  @import "../style/_table.scss";

  .el-input__inner {
    line-height: normal !important;
  }

  .el-dialog__body img {
    max-width: 100%;
  }

  .img-card img {
    background: #ccc;
  }

  .top-action a {
    cursor: pointer;
  }

  .blue {
    color: #47AFED;
  }

  .sure {
    cursor: pointer;
    color: #388E3C;
  }

  .cancel {
    cursor: pointer;
    color: #999999;
  }

  .list-icon {
    margin-right: 5px
  }

  .level2 {
    padding-left: 16px !important;
  }

  .level3 {
    padding-left: 32px !important;
  }

  .l-online {
    background: #388E3C;
    color: white;
    display: inline-block;
    padding: 2px 10px;
    font-size: 0.9em;
    border-radius: 18px;
  }

  .l-offline {
    background: #999999;
    color: white;
    display: inline-block;
    padding: 2px 10px;
    font-size: 0.9em;
    border-radius: 18px;
  }

  .el-dropdown-link {
    cursor: pointer;
    color: #409EFF;
  }

  .el-icon-arrow-down {
    font-size: 12px;
    padding: 4px;
  }

</style>
