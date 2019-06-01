<template>
  <section>
    <el-row>
      <el-col :span="24">

        <div class="col-top">
          <h3>日志</h3>
        </div>

        <br/>
        <div>
          <p>房间名称：<span style="color: red">{{ buildName }}</span> &nbsp;&nbsp;&nbsp;
            设备mac：<span style="color: red">{{ mac }}</span> &nbsp;&nbsp;
            <span v-if="lockStatus == 1"
                  style="background: green;color: white;padding: 3px 8px;border-radius: 12px;font-size: 14px">在线</span>
            <span v-if="lockStatus == 0"
                  style="background: #999999;color: white;padding: 3px 8px;border-radius: 12px;font-size: 14px">离线</span>
          </p>

        </div>

        <br/>
        <!-- <div class="top-action">
           <div class="form-search">
             <el-form :inline="true" :model="searchParams">

               <el-form-item label="">
                 <el-select v-model="searchParams.lockPasswordType" placeholder="请选择" style="width: 120px;"
                            @change="changeSelect" size="small">
                   <el-option label="普通密码" value="2">普通密码</el-option>
                   <el-option label="开门卡" value="1">开门卡</el-option>
                 </el-select>
               </el-form-item>

               <el-button type="primary" size="medium"
                          icon="el-icon-search" @click="changeSelect">
               </el-button>
             </el-form>

           </div>
         </div>-->

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
            prop="lockRecordContent"
            label="动作"
            show-overflow-tooltip
            align="center">
          </el-table-column>

          <el-table-column
            prop="lockRecordCreateTime"
            label="时间"
            align="center">
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
        lockId: '',
        buildName: '',
        mac: '',
        lockStatus: '',
        selectVal: [],
        loading: false,

        size: 10,
        current: 1,
        total: 0,
        searchParams: {},
        resData: [],
      };

    },

    created() {
      const that = this;

      that.lockId = that.$utils.getQueryString('lockId');
      that.buildName = decodeURI(that.$utils.getQueryString('buildName'));
      that.mac = that.$utils.getQueryString('mac');
      that.lockStatus = that.$utils.getQueryString('lockStatus');
      that.selectData();

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

//        for (let key in that.searchParams) {
//          if (that.searchParams[key]) {
//            data[key] = that.searchParams[key];
//          }
//        }

        that.$http.ajax('admin/lock/record/list', data, function (res) {
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
