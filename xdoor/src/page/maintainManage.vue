<template>
  <section>
    <el-row>
      <el-col :span="24">

        <div class="col-top">
          <h3>管理报修</h3>
        </div>

        <div class="top-line"></div>

        <br/>
        <!--<div class="top-action">
          <div class="form-search">
            <el-form :inline="true" :model="searchParams">
              <el-form-item label="">
                <el-input
                  v-model="searchParams.visitorRecordName"
                  placeholder="请输入姓名"
                  size="small" clearable></el-input>
              </el-form-item>

              <el-form-item label="">
                <el-input
                  v-model="searchParams.visitorRecordPhone"
                  placeholder="请输入手机号"
                  size="small" clearable></el-input>
              </el-form-item>

              <el-form-item>
                <el-date-picker
                  v-model="timeRange" size="small"
                  type="datetimerange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期">
                </el-date-picker>

              </el-form-item>

              <el-button type="primary" size="medium"
                         icon="el-icon-search" @click="changeSelect">
              </el-button>
            </el-form>

          </div>
        </div>

        <br/>-->

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

          <el-table-column type="selection" prop="repairRecordId">
          </el-table-column>

          <el-table-column
            prop="" fixed="left"
            label="房间"
            width="120"
            align="center">
            <template slot-scope="scope">
              <p>{{ scope.row.dongName }}{{ scope.row.floorName }}{{ scope.row.roomName }}</p>
            </template>
          </el-table-column>

          <el-table-column
            prop="userName"
            label="报修人"
            width="100"
            align="center">
          </el-table-column>

          <el-table-column
            prop="userPhone"
            label="手机号"
            width="150"
            align="center">
          </el-table-column>

          <el-table-column
            prop=""
            label="报修类型"
            width="150"
            align="center">
            <template slot-scope="scope">
              <p v-if="scope.row.repairRecordKind == 0">其他</p>
              <p v-if="scope.row.repairRecordKind == 1">空调</p>
              <p v-if="scope.row.repairRecordKind == 2">电费</p>
              <p v-if="scope.row.repairRecordKind == 3">宽带</p>
              <p v-if="scope.row.repairRecordKind == 4">有线电视</p>
              <p v-if="scope.row.repairRecordKind == 5">热水器</p>
            </template>
          </el-table-column>

          <el-table-column
            prop="repairRecordContent"
            label="描述"
            width="200"
            show-overflow-tooltip
            align="center">
          </el-table-column>

          <el-table-column
            prop="repairRecordCreateTime"
            label="报修时间"
            width="180"
            align="center">
          </el-table-column>

          <el-table-column
            prop=""
            label="状态"
            width="100"
            align="center">
            <template slot-scope="scope">
              <p v-if="scope.row.repairRecordStatus == 1" style="color: red">未处理</p>
              <p v-if="scope.row.repairRecordStatus == 3">已处理</p>
            </template>
          </el-table-column>

          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">

              <el-button
                v-if="scope.row.repairRecordStatus == 1"
                size="mini" plain type="primary"
                @click.stop="updateStatus(scope.row)">
                处理
              </el-button>

              <p v-if="scope.row.repairRecordStatus == 3">
                {{ scope.row.repairRecordResult }}
              </p>

              <!--<el-button-->
              <!--size="mini"-->
              <!--type="danger" icon="el-icon-delete"-->
              <!--@click.stop="handleDelete(scope.row)"></el-button>-->

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
          title="访客登记"
          :visible.sync="updateDialog"
          @close="closeDialog()">
          <el-form
            :model="updateForm"
            ref="updateForm"
            label-position="right"
            label-width="100px">

            <el-form-item label="处理结果" prop="repairRecordResult">
              <el-input
                type="textarea"
                v-model="updateForm.repairRecordResult"
                placeholder="处理结果"
                size="small" clearable></el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" size="small"
                         @click="submitUpdate(updateForm)"
                         :loading="updateLoading">提交
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

        updateForm: {
          repairRecordId: '',
          repairRecordResult: '',
        },
        updateDialog: false,
        updateLoading: false,
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
        that.$http.ajax('admin/repair_record/list', data, function (res) {
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
       * 点击删除按钮
       * */
      handleDelete(index, row) {
        const that = this;
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let data = {
            repairRecordId: row.repairRecordId
          };
          that.$http.ajax('admin/repair_record/delete', data, function (res) {
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
       * 来访登记
       */
      updateStatus: function (item) {
        this.updateDialog = true;
        this.updateForm = {
          repairRecordId: item.repairRecordId,
          repairRecordResult: '',
        }
      },
      closeDialog: function () {
        this.updateForm = {
          repairRecordId: '',
          repairRecordResult: '',
        }
      },
      submitUpdate: function (item) {
        const that = this;
        let data = {};

        data.repairRecordId = item.repairRecordId;
        data.repairRecordStatus = 3;
        data.repairRecordResult = item.repairRecordResult;

        that.updateLoading = true;

        console.log(data);
        that.$http.ajax('admin/repair_record/update', data, function (res) {
          if (res.code == 0) {
            that.updateDialog = false;
            that.$message({
              message: '处理成功！',
              type: 'success'
            });
            that.updateLoading = false;
            that.selectData();
          } else {
            that.$message.error('msg:' + res.msg);
            that.updateLoading = false;
          }
        }, function () {
          that.$router.push({path: '/login'});
        }, {needToken: true})

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

  /*#edui1_toolbarboxouter {*/
  /*position: absolute!important;*/
  /*}*/

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
</style>
