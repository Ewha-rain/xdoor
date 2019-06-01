<template>
  <section>
    <el-row>
      <el-col :span="24">
        <div class="title">
          <p>建楼</p>
          <p>按真实情况构建自己的楼盘</p>
        </div>


      </el-col>

    </el-row>

    <el-row :gutter="24">
      <el-col :span="6">
        <div class="grid-content"></div>
      </el-col>
      <el-col :span="12" style="background: #f5f5f5;border: 1px solid #eeeeee;padding-top: 20px">

        <el-form :model="buildForm"
                 ref="buildForm"
                 label-position="right"
                 label-width="90px">
          <!--<el-form-item label="区域" prop="area">
            <el-select placeholder="请选择" size="small">
              <el-option></el-option>
            </el-select>

            <el-select placeholder="请选择" size="small">
              <el-option></el-option>
            </el-select>

            <el-select placeholder="请选择" size="small">
              <el-option></el-option>
            </el-select>

          </el-form-item>-->

          <el-form-item label="公寓名称" prop="buildName">
            <el-input
              disabled
              v-model="buildForm.buildName"
              placeholder="请输入公寓名称"
              size="small" clearable></el-input>
          </el-form-item>

          <el-form-item label="详细地址" prop="buildAddress">
            <el-input
              disabled
              v-model="buildForm.buildAddress"
              placeholder="请输入详细地址"
              size="small" clearable></el-input>
          </el-form-item>


        </el-form>


      </el-col>
      <el-col :span="6">
        <div class="grid-content"></div>
      </el-col>
    </el-row>

    <el-row :gutter="24" style="padding-top: 20px">
      <el-col :span="6">
        <div class="grid-content"></div>
      </el-col>
      <el-col :span="12" style="border: 1px solid #eeeeee;padding-top: 20px">
        <p style="text-align: center;padding-bottom: 10px;">添加楼栋</p>
        <el-form :model="detailForm"
                 ref="detailForm"
                 label-position="right"
                 label-width="90px"
                 label="添加楼栋">

          <el-form-item label="楼栋名称" prop="dongName">
            <el-input style="width: 130px"
                      v-model="detailForm.dongName"
                      placeholder="例:1号楼"
                      size="small" clearable></el-input>
            共
            <el-input style="width: 110px"
                      v-model="detailForm.floorCount"
                      placeholder="每栋层数"
                      size="small" clearable></el-input>
            层
            <el-input style="width: 110px"
                      v-model="detailForm.roomCount"
                      placeholder="每层户数"
                      size="small" clearable></el-input>
            户
          </el-form-item>

          <el-form-item>
            <el-button type="primary" size="small"
                       @click="submitDetailForm(detailForm,'detailForm')"
                       :loading="submitLoading">添加
            </el-button>

          </el-form-item>

        </el-form>

      </el-col>
      <el-col :span="6">
        <div class="grid-content"></div>
      </el-col>
    </el-row>


  </section>
</template>

<script>

  export default {
    data() {
      return {
        parentId: '',
        submitLoading: false,
        buildForm: {
          buildId: '',
          buildName: '',
          buildAddress: ''
        },
        detailForm: {
          villageId: '',
          dongName: '',
          floorCount: '',
          roomCount: ''
        },
      };

    },
    created() {
      const that = this;
      that.parentId = that.$utils.getQueryString('parentId');
      that.selectBuild(that.parentId);
    },
    methods: {
      selectBuild: function (id) {
        const that = this;
        let data = {
          buildId: id
        };
        that.$http.ajax('build/select', data, function (res) {
          that.buildForm = res.data;
        }, function () {
          that.$router.push({path: '/login'});
        }, {needToken: true}, 'get')
      },

      submitDetailForm: function (item, formName) {
        const that = this;

        let data = {};
        if (!item.dongName) {
          that.$message.error('请填写楼栋名称');
          return false;
        }
        if (!item.floorCount) {
          that.$message.error('请填写每栋层数');
          return false;
        }
        if (!that.$utils.isPositiveInteger(parseInt(item.floorCount))) {
          that.$message.error('每栋层数应为正整数');
          return false;
        }
        if (!item.roomCount) {
          that.$message.error('请填写每层户数');
          return false;
        }
        if (!that.$utils.isPositiveInteger(parseInt(item.roomCount))) {
          that.$message.error('每层户数应为正整数');
          return false;
        }
        that.submitLoading = true;
        //添加
        data = {
          villageId: that.buildForm.buildId,
          dongName: that.detailForm.dongName,
          floorCount: that.detailForm.floorCount,
          roomCount: that.detailForm.roomCount
        };
        console.log(data);
        that.$http.ajax('build/create', data, function (res) {
          if (res.code == 0) {

            that.$message({
              message: '添加成功！',
              type: 'success'
            });
            that.submitLoading = false;
          } else {
            that.$message.error('msg:' + res.msg);
            that.submitLoading = false;
          }
        }, function () {
          that.$router.push({path: '/login'});
        }, {needToken: true})

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
      }
    }
  }
</script>

<style lang="scss" scoped>
  /*@import "../style/_table.scss";*/
  @import "../style/build.scss";

</style>
