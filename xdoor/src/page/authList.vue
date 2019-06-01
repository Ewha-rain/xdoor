<template>
  <section>
    <el-row>
      <el-col :span="24">

        <div class="col-top">
          <h3>授权列表</h3>
        </div>

        <br/>
        <el-form>
          <el-button style="margin-left: 16px" type="primary" icon="el-icon-plus" size="small" @click="passwordInsert">
            添加权限
          </el-button>
        </el-form>

        <br/>
        <div class="top-action">
          <!--搜索表单-->
          <div class="form-search">
            <el-form :inline="true" :model="searchParams">

              <el-form-item label="">
                <el-select v-model="searchParams.lockPasswordType" placeholder="请选择" style="width: 120px;"
                           @change="changeSelect" size="small">
                  <!--<el-option label="固定密码" value="2">固定密码</el-option>-->
                  <!--<el-option label="开门卡" value="3">开门卡</el-option>-->
                  <el-option label="临时密码" value="4">临时密码</el-option>
                  <el-option label="定时密码" value="5">定时密码</el-option>
                </el-select>
              </el-form-item>

              <!--<el-button type="primary" size="medium"
                         icon="el-icon-search" @click="changeSelect">
              </el-button>-->
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

          <el-table-column
            prop="lockPasswordContent"
            label="权限密码"
            width="220"
            show-overflow-tooltip
            align="center">
          </el-table-column>

          <el-table-column
            prop="lockPasswordStartTime"
            label="生效时间"
            width="200"
            align="center">
          </el-table-column>

          <el-table-column
            prop="lockPasswordEndTime"
            label="失效时间"
            width="200"
            align="center">
          </el-table-column>

          <el-table-column
            prop="lockPasswordCreateTime"
            label="添加时间"
            width="200"
            align="center">
          </el-table-column>


          <el-table-column label="操作" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="primary"
                         @click.stop="updatePassword(scope.row)">修改
              </el-button>
              <el-button
                size="mini"
                type="danger" icon="el-icon-delete"
                @click.stop="handleDelete(scope.row)"></el-button>
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
          title="添加/编辑权限密码"
          :visible.sync="authDialog"
          @close="closeDialog()">
          <el-form
            :model="authForm"
            ref="authForm"
            label-position="right"
            label-width="100px">

            <el-form-item label="权限密码" prop="lockPasswordContent">
              <el-input maxlength="6"
                        v-model="authForm.lockPasswordContent"
                        placeholder="请填写权限密码"
                        size="small" clearable></el-input>
            </el-form-item>

            <el-form-item label="生效时间" prop="lockPasswordStartTime">
              <el-date-picker
                v-model="authForm.startTime"
                type="datetime"
                placeholder="选择生效时间">
              </el-date-picker>
            </el-form-item>

            <el-form-item label="失效时间" prop="lockPasswordEndTime">
              <el-date-picker
                v-model="authForm.endTime"
                type="datetime"
                placeholder="选择失效时间">
              </el-date-picker>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" size="small"
                         @click="submitPassword(authForm)"
                         :loading="submitLoading">提交
              </el-button>
            </el-form-item>

          </el-form>
        </el-dialog>
      </el-col>
    </el-row>

  </section>
</template>

<script>

  export default {
    data() {
      return {
        lockId: '',
        selectVal: [],
        loading: true,
        submitLoading: false,
        authDialog: false,
        size: 10,
        current: 1,
        total: 0,
        searchParams: {
          lockPasswordType: '4'
        },
        resData: [],

        authForm: {
          lockPasswordLockId: '',
          lockPasswordType: '',
          lockPasswordContent: '',
          startTime: '',
          endTime: '',
          lockPasswordId: ''
        },

      };

    },

    created() {
      const that = this;

      that.lockId = that.$utils.getQueryString('lockId');
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
          lockId: that.lockId,
          current: that.current,
          size: that.size
        };

        for (let key in that.searchParams) {
          if (that.searchParams[key]) {
            data[key] = that.searchParams[key];
          }
        }

        that.$http.ajax('admin/lock/password/list', data, function (res) {
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
            that.loading = false;
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
       * 添加
       * */
      passwordInsert: function () {
        const that = this;
        that.authDialog = true;
        that.authForm = {
          lockPasswordLockId: that.lockId,
          lockPasswordType: '',
          lockPasswordContent: '',
          startTime: '',
          endTime: '',
          lockPasswordId: ''
        }
      },

      /**
       * 修改
       * */
      updatePassword: function (item) {
        const that = this;
        that.authDialog = true;
        console.log(new Date(item.lockPasswordStartTime));
        that.authForm = {
          lockPasswordLockId: item.lockPasswordLockId,
          lockPasswordType: item.lockPasswordType,
          lockPasswordContent: item.lockPasswordContent,
          startTime: new Date(item.lockPasswordStartTime),
          endTime: new Date(item.lockPasswordEndTime),
          lockPasswordId: item.lockPasswordId
        };
      },

      submitPassword: function (item) {
        const that = this;
        let data = {};

        if (!item.lockPasswordContent) {
          that.$message.error('请填写权限密码');
          return false;
        }

        // if (!that.$utils.isNumber(item.lockPasswordContent) || item.lockPasswordContent.length != 6) {
        //   that.$message.error('请填写正确的权限密码');
        //   return false;
        // }

        if (!item.startTime) {
          that.$message.error('请选择生效时间');
          return false;
        }
        if (!item.endTime) {
          that.$message.error('请选择失效时间');
          return false;
        }

        if (new Date(item.startTime).getTime() >= new Date(item.endTime)) {
          that.$message.error('生效时间应在失效时间之前');
          return false;
        }


        that.submitLoading = true;
        if (!item.lockPasswordId) {
          data.lockPasswordLockId = that.lockId;
          data.lockPasswordType = that.searchParams.lockPasswordType;
          data.lockPasswordContent = item.lockPasswordContent;
          data.lockPasswordStartTime = that.$utils.formatDate(new Date(item.startTime));
          data.lockPasswordEndTime = that.$utils.formatDate(new Date(item.endTime));
          that.$http.ajax('admin/lock/password/insert', data, function (res) {
            if (res.code == 0) {
              that.authDialog = false;
              that.$message({
                message: '添加成功！',
                type: 'success'
              });
              that.submitLoading = false;
              that.selectData();
            } else {
              that.$message.error('msg:' + res.msg);
              that.submitLoading = false;
            }
          }, function () {
            that.$router.push({path: '/login'});
          },{needToken: true})
        } else {
          data.lockId = item.lockPasswordLockId;
          data.password = item.lockPasswordContent;
          data.lockPasswordId = item.lockPasswordId;
          data.lockPasswordStartTime = that.$utils.formatDate(new Date(item.startTime));
          data.lockPasswordEndTime = that.$utils.formatDate(new Date(item.endTime));
          that.$http.ajax('admin/lock/password/update', data, function (res) {
            if (res.code == 0) {
              that.authDialog = false;
              that.$message({
                message: '修改成功！',
                type: 'success'
              });
              that.submitLoading = false;
              that.selectData();
            } else {
              that.$message.error('msg:' + res.msg);
              that.submitLoading = false;
            }
          }, function () {
            that.$router.push({path: '/login'});
          }, {needToken: true})
        }


      },

      /**
       * 删除
       * */
      handleDelete(row) {
        const that = this;
        this.$confirm('确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = {
            lockId: row.lockPasswordLockId,
            lockPasswordId: row.lockPasswordId
          };
          that.$http.ajax('admin/lock/password/delete', data, function (res) {
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
//          this.$message({
//            type: 'info',
//            message: '已取消删除'
//          });
        });

      },

      closeDialog: function () {
        const that = this;
        that.authForm = {
          lockPasswordLockId: that.lockId,
          lockPasswordType: '',
          lockPasswordContent: '',
          lockPasswordStartTime: '',
          lockPasswordEndTime: ''
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
