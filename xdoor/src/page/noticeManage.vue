<template>
  <section>
    <el-row>
      <el-col :span="24">

        <div class="col-top">
          <h3>公告管理</h3>

        </div>

        <br/>
        <el-form>
          <el-button style="margin-left: 16px" type="primary" icon="el-icon-plus" size="small" @click="addNotice">
            添加公告
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
        <!-- <el-table
          v-loading="loading"
          ref="multipleTable"
          border
          highlightCurrentRow
          :data="resData"
          style="width: 100%"
          @row-click="handleTableChange"
          @selection-change="handleSelectionChange"
          size="medium"> -->

          <el-table
          ref="multipleTable"
          border
          highlightCurrentRow
          :data="resData"
          style="width: 100%"
          @row-click="handleTableChange"
          @selection-change="handleSelectionChange"
          size="medium">

          <el-table-column type="selection" prop="noticeId">
          </el-table-column>


          <el-table-column
            prop="noticeTitle" fixed="left"
            label="公告标题"
            width="220"
            show-overflow-tooltip
            align="center">
          </el-table-column>

          <el-table-column
            prop="noticeContent"
            label="公告内容"
            width="400"
            show-overflow-tooltip
            align="center">
          </el-table-column>

          <!-- <el-table-column
             prop="noticeType"
             label="公告类型"
             width="100"
             align="center">
           </el-table-column>-->

          <el-table-column
            prop="noticeCreateTime"
            label="发布时间"
            width="180"
            show-overflow-tooltip
            align="center">
          </el-table-column>

          <el-table-column fixed="right" label="操作">
            <template slot-scope="scope">

              <el-button
                size="mini"
                plain
                type="primary"
                @click.stop="edit(scope.row)">
                编辑
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
          title="添加/编辑公告"
          :visible.sync="noticeDialog"
          @close="closeDialog()">
          <el-form
            :model="noticeForm"
            ref="noticeForm"
            label-position="right"
            label-width="100px">

            <el-form-item label="公告标题" prop="noticeTitle">
              <el-input
                v-model="noticeForm.noticeTitle"
                placeholder="公告标题"
                size="small" clearable></el-input>
            </el-form-item>

            <el-form-item label="公告内容" prop="noticeContent">
              <el-input
                type="textarea"
                v-model="noticeForm.noticeContent"
                placeholder="公告内容"
                size="small" clearable></el-input>
            </el-form-item>

            <!-- <el-form-item label="公告类型" prop="noticeType">

               <el-select v-model="noticeForm.noticeType" clearable placeholder="请选择" style="width: 200px;"
                          @change="changeType" size="small">
                 <el-option label="" value="1"></el-option>
                 <el-option label="" value="2"></el-option>
                 <el-option label="" value="3"></el-option>
               </el-select>

             </el-form-item>-->

            <el-form-item>
              <el-button type="primary" size="small"
                         @click="submitNotice(noticeForm)"
                         :loading="noticeLoading">提交
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

        noticeForm: {
          noticeId: '',
          noticeTitle: '',
          noticeContent: '',
          noticeType: '1',
        },

        noticeDialog: false,
        noticeLoading: false,

        optionData: []
      };

    },

    created() {
      // this.selectData();
    },

    methods: {

      selectBuildTree() {
        const that = this;
        let data = {
          parentBuildId: 0,
          deepLevel: 1
        };
        that.$http.ajax('build/tree', data, function (res) {
          console.log(res);
          if (res.code == 0) {

            for (let i = 0; i < res.data.length; i++) {
              let map = res.data[i];
            }
            that.optionData = res.data;
          } else {
            that.$message.error('msg:' + res.msg);
          }
        }, function () {
          that.$router.push({path: '/login'});
        }, {needToken: true}, 'get')
      },
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

//        for (let key in that.searchParams) {
//          if (that.searchParams[key]) {
//            data[key] = that.searchParams[key];
//          }
//        }
        that.$http.ajax('admin/notice/list/page', data, function (res) {
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
      addNotice: function () {
        this.noticeDialog = true;
      },
      edit: function (item) {
        const that = this;
        this.noticeDialog = true;
        that.noticeForm = {
          noticeId: item.noticeId,
          noticeTitle: item.noticeTitle,
          noticeContent: item.noticeContent,
          noticeType: item.noticeType,
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
            noticeId: row.noticeId
          };
          that.$http.ajax('admin/notice/delete', data, function (res) {
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
        this.noticeForm = {
          noticeId: '',
          noticeTitle: '',
          noticeContent: '',
          noticeType: '',
        }
      },
      submitNotice: function (item) {
        const that = this;
        let data = {};

        if (!item.noticeTitle) {
          that.$message.error('请输入公告标题');
          return false;
        }

        if (!item.noticeContent) {
          that.$message.error('请输入公告内容');
          return false;
        }

        data.noticeTitle = that.noticeForm.noticeTitle;
        data.noticeContent = item.noticeContent;
        data.noticeType = item.noticeType;

        that.noticeLoading = true;

        if (!item.noticeId) {
          that.$http.ajax('admin/notice/insert', data, function (res) {
            if (res.code == 0) {
              that.noticeDialog = false;
              that.$message({
                message: '添加成功！',
                type: 'success'
              });
              that.noticeLoading = false;
              that.selectData();
            } else {
              that.$message.error('msg:' + res.msg);
              that.noticeLoading = false;
            }
          }, function () {
            that.$router.push({path: '/login'});
          }, {needToken: true})
        } else {
          data.noticeId = item.noticeId;
          that.$http.ajax('admin/notice/update', data, function (res) {
            if (res.code == 0) {
              that.noticeDialog = false;
              that.$message({
                message: '修改成功！',
                type: 'success'
              });
              that.noticeLoading = false;
              that.selectData();
            } else {
              that.$message.error('msg:' + res.msg);
              that.noticeLoading = false;
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
