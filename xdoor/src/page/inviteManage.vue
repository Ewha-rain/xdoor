<template>
  <section>
    <el-row>
      <el-col :span="24">

        <div class="col-top">
          <h3>访客记录</h3>

        </div>

        <br/>
        <el-form>
          <el-button style="margin-left: 16px" type="primary" icon="el-icon-plus" size="small" @click="inviteInsert">
            添加访客
          </el-button>

          <el-button
            type="danger"
            icon="el-icon-delete"
            @click="deleteAll"
            :disabled="this.selectVal.length < 1"
            size="small">批量删除
          </el-button>
        </el-form>

        <br/>
        <div class="top-action">
          <!--搜索表单-->
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

          <el-table-column type="selection" prop="visitorRecordId">
          </el-table-column>


          <el-table-column
            prop="visitorRecordName" :fixed="true"
            label="访客姓名"
            align="center">
          </el-table-column>

          <el-table-column
            prop="visitorRecordPhone"
            label="手机号"
            align="center">
          </el-table-column>

          <el-table-column
            prop="visitorRecordTime"
            label="访问时间"
            align="center">
          </el-table-column>

          <el-table-column
            prop="visitorRecordWish"
            label="访问意向"
            width="200"
            show-overflow-tooltip
            align="center">
          </el-table-column>

          <el-table-column label="操作">
            <template slot-scope="scope">

              <!--<el-button-->
              <!--size="mini"-->
              <!--plain-->
              <!--type="primary"-->
              <!--@click.stop="edit(scope.$index, scope.row)">-->
              <!--编辑-->
              <!--</el-button>-->

              <el-button
                size="mini"
                type="danger" icon="el-icon-delete"
                @click.stop="handleDelete(scope.$index, scope.row)"></el-button>

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
          :visible.sync="inviteDialog"
          @close="closeInviteDialog()">
          <el-form
            :model="inviteForm"
            ref="inviteForm"
            label-position="right"
            label-width="100px">

            <el-form-item label="姓名" prop="visitorRecordName">
              <el-input style="width: 200px;"
                        v-model="inviteForm.visitorRecordName"
                        placeholder="姓名"
                        size="small" clearable></el-input>
            </el-form-item>

            <el-form-item label="手机号" prop="visitorRecordPhone">
              <el-input style="width: 200px;"
                        v-model="inviteForm.visitorRecordPhone"
                        placeholder="手机号"
                        size="small" clearable></el-input>
            </el-form-item>

            <el-form-item label="时间" prop="visitorRecordTime">
              <el-date-picker
                v-model="inviteForm.visitorRecordTime"
                type="datetime"
                placeholder="选择日期时间">
              </el-date-picker>

            </el-form-item>

            <el-form-item label="意向" prop="visitorRecordWish">
              <el-input
                type="textarea"
                v-model="inviteForm.visitorRecordWish"
                placeholder="意向"
                size="small" clearable></el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" size="small"
                         @click="submitInvite(inviteForm)"
                         :loading="inviteLoading">提交
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
        timeRange: '',
        resData: [],

        inviteForm: {
          visitorRecordName: '',
          visitorRecordPhone: '',
          visitorRecordTime: '',//来访时间
          visitorRecordWish: ''//意向
        },
        inviteDialog: false,
        inviteLoading: false,
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

        if (that.timeRange) {
          data.fromTime = new Date(that.timeRange[0]).getTime();
          data.toTime = new Date(that.timeRange[1]).getTime();
        }
        for (let key in that.searchParams) {
          if (that.searchParams[key]) {
            data[key] = that.searchParams[key];
          }
        }
        that.$http.ajax('admin/visitor_record/list', data, function (res) {
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
            visitorRecordId: row.visitorRecordId
          };
          that.$http.ajax('admin/visitor_record/delete', data, function (res) {
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
      inviteInsert: function () {
        this.inviteDialog = true;
        this.inviteForm = {
          visitorRecordName: '',
          visitorRecordPhone: '',
          visitorRecordTime: '',//来访时间
          visitorRecordWish: ''//意向
        }
      },
      closeInviteDialog: function () {
        this.inviteForm = {
          visitorRecordName: '',
          visitorRecordPhone: '',
          visitorRecordTime: '',//来访时间
          visitorRecordWish: ''//意向
        }
      },
      submitInvite: function (item) {
        const that = this;
        let data = {};

        if (!that.inviteForm.visitorRecordName) {
          that.$message.error('请输入访客姓名');
          return false;
        }

        if (!that.inviteForm.visitorRecordPhone) {
          that.$message.error('请输入访客电话');
          return false;
        }

        if (!that.inviteForm.visitorRecordTime) {
          that.$message.error('请输入访客来访时间');
          return false;
        }

        if (that.inviteForm.visitorRecordWish) {
          data.visitorRecordWish = that.inviteForm.visitorRecordWish;
        }
        data.visitorRecordName = that.inviteForm.visitorRecordName;
        data.visitorRecordPhone = that.inviteForm.visitorRecordPhone;
        data.visitorRecordTime = that.$utils.formatDate(new Date(that.inviteForm.visitorRecordTime));

        that.inviteLoading = true;

        console.log(data);
          that.$http.ajax('admin/visitor_record/insert', data, function (res) {
            if (res.code == 0) {
              that.inviteDialog = false;
              that.$message({
                message: '添加成功！',
                type: 'success'
              });
              that.inviteLoading = false;
              that.selectData();
            } else {
              that.$message.error('msg:' + res.msg);
              that.inviteLoading = false;
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
