<template>
  <section>
    <el-row>
      <el-col :span="24">

        <div class="col-top">
          <h3>添加设备</h3>
        </div>

        <br/>
        <div class="top-action">
          <!--搜索表单-->
          <div class="form-search">
            <el-form :inline="true" :model="searchParams">

              <el-form-item label="选择房间">
                <el-select v-model="searchParams.buildId" clearable placeholder="请选择" style="width: 100px;"
                           @change="changeSelect" size="small">
                  <el-option
                    v-for="item in rooms"
                    :key="item.buildId"
                    :label="item.buildName"
                    :value="item.buildId">
                  </el-option>
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

          <el-table-column type="selection" prop="buildId">
          </el-table-column>

          <el-table-column
            prop=""
            label="房间号"
            width="180"
            align="center">
            <template slot-scope="scope">
              <p>{{ scope.row.dongName }}{{ scope.row.floorName }}{{ scope.row.roomName }}</p>
            </template>
          </el-table-column>

          <el-table-column
            prop=""
            label="设备mac"
            width="240"
            show-overflow-tooltip
            align="center">
            <template slot-scope="scope">
              <el-input v-if="!scope.row.lockId"
                        v-model="scope.row.mac"
                        placeholder="请输入设备mac"
                        size="small" clearable></el-input>
              <p v-else>{{ scope.row.lockMac }}</p>
            </template>
          </el-table-column>


          <el-table-column label="操作" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" :loading="submitLoading" v-if="!scope.row.lockId"
                         @click.stop="bindLock(scope.row)">绑定
              </el-button>
              <el-button size="mini" type="danger" :loading="submitLoading" v-else @click.stop="unbindLock(scope.row)">
                解绑
              </el-button>
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

      </el-col>
    </el-row>

  </section>
</template>

<script>

  export default {
    data() {
      return {
        selectVal: [],
        loading: false,
        submitLoading: false,

        size: 10,
        current: 1,
        total: 0,
        resData: [],
        searchParams: {},
        rooms: [],
      };

    },

    created() {
      this.selectRoom();
      this.selectData();
    },

    methods: {
      changeSelect() {
        const that = this;
        that.current = 1;
        that.selectData();
      },
      selectRoom: function () {
        const that = this;
        that.$http.ajax('build/select/room', {}, function (res) {
          console.log(res);
          let room = [];
          if (res.code == 0) {

            for (let i = 0; i < res.data.length; i++) {
              let map = res.data[i];
              room.push({
                buildId: map.buildId,
                buildName: map.dongName + map.floorName + map.buildName,
              })
            }
            that.rooms = room;
          } else {
            that.$message.error('msg:' + res.msg);
          }
        }, function () {
          that.$router.push({path: '/login'});
        }, {needToken: true}, 'get')
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
        that.$http.ajax('build/select/room/page', data, function (res) {
          console.log(res);
          let room = [];
          if (res.code == 0) {
            that.total = res.data.rowCount;

            for (let i = 0; i < res.data.data.length; i++) {
              let map = res.data.data[i];
              room.push({
                buildId: map.buildId,
                buildName: map.dongName + map.floorName + map.buildName,
              })
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
       * 绑定
       * */
      bindLock: function (item) {
        const that = this;
        let buildName = item.dongName + item.floorName + item.roomName;
        let data = {
          lockBuildId: item.buildId,
          lockName: buildName
        };
        if (!item.mac) {
          that.$message.error('请填写mac');
          return false;
        }
        data.lockMac = item.mac;
        that.submitLoading = true;
        that.$http.ajax('admin/lock/insert', data, function (res) {
          if (res.code == 0) {
            that.$message({
              message: '绑定成功！',
              type: 'success'
            });
            that.submitLoading = false;
            that.selectData();
          } else {
            that.submitLoading = false;
            that.$message.error('msg:' + res.msg);
          }
        }, function () {
          that.$router.push({path: '/login'});
        }, {needToken: true})

      },

      /**
       * 解绑
       * */
      unbindLock: function (item) {
        const that = this;
        this.$confirm('确认解绑？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = {
            lockId: item.lockId
          };
          that.submitLoading = true;
          that.$http.ajax('admin/lock/delete', data, function (res) {
            if (res.code == 0) {
              that.selectData();
              that.$message({
                type: 'success',
                message: '解绑成功!'
              });
              that.submitLoading = false;
            } else {
              that.$message.error('msg:' + res.msg);
              that.submitLoading = false;
            }
          }, function () {
            that.$router.push('/login');
          }, {needToken: true});

        }).catch(() => {
        });
      },

      /**
       * 批量删除
       * */
      deleteAll() {
        const that = this;
        let ids = this.selectVal.map(item => item.visitorRecordId);
        //获取所有选中行的id组成的字符串，以逗号分隔

        this.$confirm('此操作将永久删除选中文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          for (let i = 0; i < ids.length; i++) {
            that.$http.ajax('admin/visitor_record/delete', {visitorRecordId: ids[i]}, function (res) {
              if (res.code == 0) {
                that.loading = true;
                that.selectData();
                that.$message({
                  type: 'success',
                  message: '批量删除成功!'
                })
              } else {
                that.$message.error('msg:' + res.msg);
              }
            }, function () {
              that.$router.push({path: '/login'});
            }, {needToken: true})
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消批量删除'
          });
        });
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
