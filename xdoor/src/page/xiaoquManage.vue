<template>
  <section>
    <el-row>
      <el-col :span="24">

        <div class="col-top">
          <h3>公寓管理</h3>

        </div>

        <br/>
        <el-form>
          <el-button style="margin-left: 16px" type="primary" icon="el-icon-plus" size="small" @click="addBuild">
            添加公寓
          </el-button>

          <!--<el-button
            type="danger"
            icon="el-icon-delete"
            @click="deleteAll"
            :disabled="this.selectVal.length < 1"
            size="small">批量删除
          </el-button>-->
        </el-form>

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

          <el-table-column fixed="left" type="selection" prop="buildId">
          </el-table-column>

          <el-table-column
            prop="buildName" fixed="left"
            label="公寓名称"
            width="220"
            show-overflow-tooltip
            align="center">
          </el-table-column>

          <el-table-column
            prop="buildAddress"
            label="公寓地址"
            width="400"
            show-overflow-tooltip
            align="center">
          </el-table-column>

          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">

              <el-button
                size="mini" type="primary" @click.stop="edit(scope.row)">
                编辑
              </el-button>

              <el-button
                size="mini" plain type="primary"
                @click.stop="addDong(scope.row)">
                添加楼栋
              </el-button>

              <el-button
                size="mini" plain type="warning"
                @click.stop="buildStatus(scope.row)">
                房态
              </el-button>

              <!--<el-button
                size="mini" type="danger" icon="el-icon-delete"
                @click.stop="handleDelete(scope.row)"></el-button>-->

            </template>

          </el-table-column>


        </el-table>

        <el-dialog
          title="添加/编辑公寓"
          :visible.sync="buildDialog"
          @close="closeDialog()">
          <el-form
            :model="buildForm"
            ref="buildForm"
            label-position="right"
            label-width="100px">

            <el-form-item label="公寓名称" prop="childBuildName">
              <el-input
                v-model="buildForm.childBuildName"
                placeholder="请输入公寓名称"
                size="small" clearable></el-input>
            </el-form-item>

            <el-form-item label="详细地址" prop="buildAddress">
              <el-input
                v-model="buildForm.buildAddress"
                placeholder="请输入详细地址"
                size="small" clearable></el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" size="small"
                         @click="submitBuild(buildForm)"
                         :loading="buildLoading">提交
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
        selectVal: [],
        loading: true,

        size: 10,
        current: 1,
        total: 0,
        searchParams: {},

        resData: [],

        buildForm: {
          buildId: '',
          parentBuildId: 0,
          childBuildName: '',
          buildAddress: '',
          generateCount: 1,
        },

        buildDialog: false,
        buildLoading: false,
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
          parentBuildId: 0,
          deepLevel: 1,
        };

//        for (let key in that.searchParams) {
//          if (that.searchParams[key]) {
//            data[key] = that.searchParams[key];
//          }
//        }
        that.$http.ajax('build/tree', data, function (res) {
          console.log(res);
          if (res.code == 0) {

            for (let i = 0; i < res.data.length; i++) {
              let map = res.data[i];
            }
            that.resData = res.data;
            that.loading = false;
          } else {
            that.$message.error('msg:' + res.msg);
          }
        }, function () {
          that.$router.push({path: '/login'});
        }, {needToken: true}, 'get')
      },
      addBuild: function () {
        const that = this;
        this.buildDialog = true;
        that.buildForm = {
          buildId: '',
          parentBuildId: 0,
          childBuildName: '',
          buildAddress: '',
          generateCount: 1,
        }
      },
      edit: function (item) {
        console.log(item)
        const that = this;
        this.buildDialog = true;
        that.buildForm = {
          buildId: item.buildId,
          parentBuildId: 0,
          childBuildName: item.buildName,
          buildAddress: item.buildAddress,
          generateCount: 1,
        }
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

      addDong(item) {
        const that = this;
        that.$router.push({
          name: 'buildInsert',
          query: {
            parentId: item.buildId
          }
        })
      },
      buildStatus(item) {
        const that = this;
        that.$router.push({
          name: 'buildList',
          query: {
            parentId: item.buildId
          }
        })
      },

      /**
       * 点击删除按钮
       * */
      handleDelete(row) {
        const that = this;
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = {
            buildId: row.buildId
          };
          that.$http.ajax('build/delete', data, function (res) {
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


      closeDialog: function () {
        this.buildForm = {
          buildId: '',
          parentBuildId: 0,
          childBuildName: '',
          buildAddress: '',
          generateCount: 1,
        }
      },
      submitBuild: function (item) {
        const that = this;
        let data = {};

        if (!item.childBuildName) {
          that.$message.error('请输入公寓名称');
          return false;
        }

        if (!item.buildAddress) {
          that.$message.error('请输入公寓地址');
          return false;
        }

        data.buildAddress = item.buildAddress;
        that.buildLoading = true;

        if (!item.buildId) {
          data.childBuildName = item.childBuildName;

          data.parentBuildId = 0;
          data.generateCount = 1;
          that.$http.ajax('build/create/layer', data, function (res) {
            if (res.code == 0) {
              that.buildDialog = false;
              that.$message({
                message: '添加成功！',
                type: 'success'
              });
              that.buildLoading = false;
              that.selectData();
            } else {
              that.$message.error('msg:' + res.msg);
              that.buildLoading = false;
            }
          }, function () {
            that.$router.push({path: '/login'});
          }, {needToken: true})
        } else {
          data.buildName = item.childBuildName;
          data.buildId = item.buildId;
          that.$http.ajax('build/update', data, function (res) {
            if (res.code == 0) {
              that.buildDialog = false;
              that.$message({
                message: '修改成功！',
                type: 'success'
              });
              that.buildLoading = false;
              that.selectData();
            } else {
              that.$message.error('msg:' + res.msg);
              that.buildLoading = false;
            }
          }, function () {
            that.$router.push({path: '/login'});
          }, {needToken: true})
        }


      },

      /**
       * 批量删除
       * */
      deleteAll() {
        const that = this;
        let ids = this.selectVal.map(item => item.noticeId);
        //获取所有选中行的id组成的字符串，以逗号分隔

        this.$confirm('此操作将永久删除选中文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          for (let i = 0; i < ids.length; i++) {
            that.$http.ajax('admin/notice/delete', {noticeId: ids[i]}, function (res) {
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
</style>
