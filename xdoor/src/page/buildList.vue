<template>
  <section>
    <el-row v-loading="loading">
      <!--<el-col :span="4">
        <div class="grid-content">
          <el-tree :data="treeData" default-expand-all :default-checked-keys="[112]"
                   :props="defaultProps" @node-click="handleNodeClick"></el-tree>
        </div>
      </el-col>-->

      <el-col :span="24" v-loading="loading">
        <div class="grid-content" v-for="item in houseData">
          <div v-for="item2 in buildData" style="margin-bottom: 20px">

            <div class="build-title">
              <a class="build-name">{{ item.buildName }} - {{ item2.buildName }}</a>
              <a class="build-tag tag-empty">空置：{{ item2.freeCount }}</a>
              <a class="build-tag tag-appoint">预定：{{ item2.orderCount }}</a>
              <a class="build-tag tag-no">已租：{{ item2.rentCount }}</a>
              <a class="build-tag tag-waring">30天内到期：{{ item2.rentThirtyCount }}</a>
              <a class="build-tag tag-danger">15天内交租：{{ item2.rentTimeFiftyExpire }}</a>
              <a class="build-tag tag-over">逾期：{{ item2.rentTimeExpire + item2.rentExpireCount }}</a>
            </div>

            <div class="build-list" v-for="item3 in item2.floorInfo">
              <el-row>
                <el-col :span="2">
                  <a class="build-number">{{ item3.buildName }}楼</a>
                </el-col>
                <el-col :span="22">
                  <div v-for="item4 in item3.familyInfo" style="display: inline-block">
                    <el-popover
                      placement="bottom"
                      width="350"
                      trigger="hover">
                      <div class="hover-content">
                        <p>
                          {{ item.buildName }} - {{ item2.buildName }} - {{ item3.buildName }}{{ item4.buildName}}
                          <el-button style="float: right" v-if="item4.buildStatus == 1" type="primary" size="small"
                                     @click="appointInsert(item4.buildId)">预定
                          </el-button>

                          <el-button style="float: right" v-if="item4.buildStatus == 3" type="danger" size="small"
                                     @click="cancelAppoint(item4.buildId)">取消预定
                          </el-button>

                        </p>
                        <!--<el-button v-if="item4.buildStatus == 4" type="primary" size="small" @click="payFee">缴费-->
                        <!--</el-button>-->
                        <!-- buildStatus = 1 未租 -->
                        <!-- buildStatus = 2 删除 -->
                        <!-- buildStatus = 3 已经预定 -->
                        <!-- buildStatus = 4 已租 -->

                        <div v-if="item4.buildStatus == 4" class="rentInfo">
                          <p>租期：{{ item4.rentStartTime }} - {{ item4.rentEndTime }}</p>
                          <p>押 {{ item4.rentPayDepositNum }} 付 {{ item4.rentPayRentalNum }}</p>
                          <p>入住人数：{{ item4.rentTotalUser }}</p>
                          <p>姓名：{{ item4.userName }}</p>
                          <p>性别：{{ item4.userSex }}</p>
                          <p>手机号：{{ item4.userPhone }}</p>
                          <p>身份证号：{{ item4.userIdNo }}</p>
                          <p>公司：{{ item4.userCompanyName }}</p>
                          <p>职位：{{ item4.userJob }}</p>
                          <p>备注：{{ item4.userNote }}</p>
                          <p>下次最迟交租时间：{{ item4.rentTimeEnd }}</p>
                        </div>

                      </div>

                      <div v-if="item4.buildStatus == 1" class="build-li" slot="reference"
                           @click.stop="userIn(item2,item3,item4)">
                        <i v-if="!item4.lockId" class="iconfont icon-lock"></i>
                        <i v-if="item4.lockOnlineStatus == 1" class="iconfont icon-lock lock-online"></i>
                        <i v-if="item4.lockOnlineStatus == 0" class="iconfont icon-lock lock-offline"></i>
                        <p class="number">{{ item3.buildName }}{{ item4.buildName }}</p>
                        <div class="ic-list">
                          <p>空</p>
                          <!--<i class="iconfont icon-people"></i>-->
                        </div>
                      </div>

                      <div v-if="item4.buildStatus == 3" class="build-li li-appoint" slot="reference"
                           @click.stop="userIn(item2,item3,item4)">
                        <i v-if="!item4.lockId" class="iconfont icon-lock"></i>
                        <i v-if="item4.lockOnlineStatus == 1" class="iconfont icon-lock lock-online"></i>
                        <i v-if="item4.lockOnlineStatus == 0" class="iconfont icon-lock lock-offline"></i>
                        <p class="number">{{ item3.buildName }}{{ item4.buildName }}</p>
                        <div class="ic-list">
                          <p>已预定</p>
                          <!--<i class="iconfont icon-people"></i>-->
                        </div>
                      </div>

                      <div
                        v-if="item4.buildStatus == 4  && !item4.rentThirty && !item4.rentExpire && !item4.rentFifteen && !item4.payExpire"
                        class="build-li li-no"
                        slot="reference"
                        @click.stop="userIn(item2,item3,item4)">
                        <i v-if="!item4.lockId" class="iconfont icon-lock"></i>
                        <i v-if="item4.lockOnlineStatus == 1" class="iconfont icon-lock lock-online"></i>
                        <i v-if="item4.lockOnlineStatus == 0" class="iconfont icon-lock lock-offline"></i>
                        <p class="number">{{ item3.buildName }}{{ item4.buildName }}</p>
                        <div class="ic-list">
                          <i v-if="item4.rentTotalUser > 1" class="iconfont icon-peoples"></i>
                          <i v-else class="iconfont icon-people"></i>
                          <!--<p>已租</p>-->
                        </div>
                      </div>

                      <div v-if="item4.buildStatus == 4 && item4.rentThirty" class="build-li li-warning"
                           slot="reference"
                           @click.stop="userIn(item2,item3,item4)">
                        <i v-if="!item4.lockId" class="iconfont icon-lock"></i>
                        <i v-if="item4.lockOnlineStatus == 1" class="iconfont icon-lock lock-online"></i>
                        <i v-if="item4.lockOnlineStatus == 0" class="iconfont icon-lock lock-offline"></i>
                        <p class="number">{{ item3.buildName }}{{ item4.buildName }}</p>
                        <div class="ic-list">
                          <p>{{ item4.rentThirty }}天到期</p>
                          <!--<p>{{item4.rentThirty }}</p>-->
                          <!--<i class="iconfont icon-people"></i>-->
                        </div>
                      </div>

                      <div v-if="item4.buildStatus == 4 && item4.rentExpire" class="build-li li-over"
                           slot="reference"
                           @click.stop="userIn(item2,item3,item4)">
                        <i v-if="!item4.lockId" class="iconfont icon-lock"></i>
                        <i v-if="item4.lockOnlineStatus == 1" class="iconfont icon-lock lock-online"></i>
                        <i v-if="item4.lockOnlineStatus == 0" class="iconfont icon-lock lock-offline"></i>
                        <p class="number">{{ item3.buildName }}{{ item4.buildName }}</p>
                        <div class="ic-list">
                          <p>租期逾期{{ item4.rentExpire }}天</p>
                          <!--<p>{{item4.rentThirty }}</p>-->
                          <!--<i class="iconfont icon-people"></i>-->
                        </div>
                      </div>

                      <div v-if="item4.buildStatus == 4 && item4.rentFifteen" class="build-li li-danger"
                           slot="reference"
                           @click.stop="userIn(item2,item3,item4)">
                        <i v-if="!item4.lockId" class="iconfont icon-lock"></i>
                        <i v-if="item4.lockOnlineStatus == 1" class="iconfont icon-lock lock-online"></i>
                        <i v-if="item4.lockOnlineStatus == 0" class="iconfont icon-lock lock-offline"></i>
                        <p class="number">{{ item3.buildName }}{{ item4.buildName }}</p>
                        <div class="ic-list">
                          <p>{{ item4.rentFifteen }}天内交租</p>
                          <!--<p>{{item4.rentThirty }}</p>-->
                          <!--<i class="iconfont icon-people"></i>-->
                        </div>
                      </div>

                      <div v-if="item4.buildStatus == 4 && item4.payExpire" class="build-li li-over"
                           slot="reference"
                           @click.stop="userIn(item2,item3,item4)">
                        <i v-if="!item4.lockId" class="iconfont icon-lock"></i>
                        <i v-if="item4.lockOnlineStatus == 1" class="iconfont icon-lock lock-online"></i>
                        <i v-if="item4.lockOnlineStatus == 0" class="iconfont icon-lock lock-offline"></i>
                        <p class="number">{{ item3.buildName }}{{ item4.buildName }}</p>
                        <div class="ic-list">
                          <p>交租逾期{{ item4.payExpire }}天</p>
                          <!--<p>{{item4.rentThirty }}</p>-->
                          <!--<i class="iconfont icon-people"></i>-->
                        </div>
                      </div>

                    </el-popover>
                  </div>

                </el-col>
              </el-row>

            </div>

          </div>

        </div>
        <!--<div class="grid-content" v-for="item in buildData">
          <div v-for="item2 in item.buildModelList" style="margin-bottom: 20px">

            <div class="build-title">
              <a class="build-name">{{ item.buildName }} - {{ item2.buildName }}</a>
              <a class="build-tag tag-no">已租：{{ item2.rentCount }}</a>
              <a class="build-tag tag-empty">空置：{{ item2.freeCount }}</a>

              <a class="build-tag tag-appoint">已预约：{{ item2.freeCount }}</a>

            </div>

            <div class="build-list" v-for="item3 in item2.buildModelList">
              <el-row>
                <el-col :span="2">
                  <a class="build-number">{{ item3.buildName }}楼</a>
                </el-col>
                <el-col :span="22">
                  <div v-for="item4 in item3.buildModelList" style="display: inline-block">
                    <el-popover
                      placement="bottom"
                      width="350"
                      trigger="hover">
                      <div class="hover-content">
                        <p>
                          {{ item.buildName }} - {{ item2.buildName }} - {{ item3.buildName }}{{ item4.buildName}}
                        </p>
                        <el-button v-if="item4.buildStatus == 1" type="primary" size="small"
                                   @click="appointInsert(item4.buildId)">预约
                        </el-button>

                        <div v-if="item4.buildStatus == 4" class="rentInfo">
                          <p>租期：{{ item4.rentStartTime }} - {{ item4.rentEndTime }}</p>
                          <p>押 {{ item4.rentPayDepositNum }} 付 {{ item4.rentPayRentalNum }}</p>
                          <p>入住人数：{{ item4.rentTotalUser }}</p>
                          <p>姓名：{{ item4.userName }}</p>
                          <p>性别：{{ item4.userSex }}</p>
                          <p>手机号：{{ item4.userPhone }}</p>
                          <p>身份证号：{{ item4.userIdNo }}</p>
                          <p>公司：{{ item4.userCompanyName }}</p>
                          <p>职位：{{ item4.userJob }}</p>
                          <p>备注：{{ item4.userNote }}</p>
                        </div>

                      </div>

                      <div v-if="item4.buildStatus == 1" class="build-li" slot="reference"
                           @click.stop="userIn(item2,item3,item4)">
                        <p class="number">{{ item3.buildName }}{{ item4.buildName }}</p>
                        <div class="ic-list">
                          <p>空</p>
                        </div>
                      </div>

                      <div v-if="item4.buildStatus == 3" class="build-li li-appoint" slot="reference"
                           @click.stop="userIn(item2,item3,item4)">
                        <p class="number">{{ item3.buildName }}{{ item4.buildName }}</p>
                        <div class="ic-list">
                          <p>已预约</p>
                        </div>
                      </div>

                      <div v-if="item4.buildStatus == 4" class="build-li li-no"
                           slot="reference"
                           @click.stop="userIn(item2,item3,item4)">
                        <p class="number">{{ item3.buildName }}{{ item4.buildName }}</p>
                        <div class="ic-list">
                          <i v-if="item4.rentTotalUser > 1" class="iconfont icon-peoples"></i>
                          <i v-else class="iconfont icon-people"></i>
                        </div>
                      </div>

                    </el-popover>
                  </div>

                </el-col>
              </el-row>

            </div>

          </div>

        </div>-->

        <el-dialog
          title="缴费"
          :visible.sync="dialogVisible"
          @close="closeDialog()">
          <el-form
            :model="feeForm"
            ref="feeForm"
            label-position="right"
            label-width="100px">

            <el-form-item label="房租" prop="fee">
              <el-select v-model="feeForm" placeholder="请选择" style="width: 100px;"
                         @change="" size="small">
                <el-option
                  v-for="item in times"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-input style="width: 100px"
                        v-model="feeForm"
                        placeholder="金额"
                        size="small" clearable></el-input>
              缴至
              <el-input style="width: 100px"
                        v-model="feeForm"
                        placeholder="日期"
                        size="small" clearable></el-input>
            </el-form-item>

          </el-form>
        </el-dialog>


        <el-dialog
          title="预约录入"
          :visible.sync="appointDialog"
          @close="closeAppointDialog()">
          <el-form
            :model="appointForm"
            ref="appointForm"
            label-position="right"
            label-width="100px">

            <el-form-item label="姓名" prop="name">
              <el-input style="width:200px"
                        v-model="appointForm.userNames"
                        placeholder="姓名"
                        size="small" clearable></el-input>
            </el-form-item>

            <el-form-item label="手机号" prop="phone">
              <el-input style="width:200px"
                        v-model="appointForm.userPhones"
                        placeholder="手机号"
                        maxlength="11"
                        size="small" clearable></el-input>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" size="small"
                         @click="submitAppoint(appointForm)"
                         :loading="appointLoading">提交
              </el-button>
            </el-form-item>

          </el-form>
        </el-dialog>
      </el-col>
    </el-row>
  </section>
</template>

<script>
  import ElCol from "element-ui/packages/col/src/col";

  export default {
    components: {ElCol},
    data() {
      return {
        parentId: '',
        houseData: [],//公寓
        buildData: [],//楼栋
        floorData: [],//层
        familyData: [],//户

        loading: true,

        dialogVisible: false,
        feeForm: {},
        times: [{
          value: 1, label: '1个月'
        }, {
          value: 2, label: '2个月'
        }, {
          value: 3, label: '3个月'
        }, {
          value: '4', label: '4个月'
        }, {
          value: '5', label: '5个月'
        }, {
          value: '6', label: '半年'
        }, {
          value: '7', label: '7个月'
        }, {
          value: '8', label: '8个月'
        }, {
          value: '9', label: '9个月'
        }, {
          value: '10', label: '10个月'
        }, {
          value: '11', label: '11个月'
        }, {
          value: '12', label: '1年'
        }, {
          value: '24', label: '2年'
        }],

        appointForm: {
          buildId: '',
          name: '',
          phone: '',
          content: ''//备注
        },
        appointDialog: false,
        appointLoading: false,
      }
    },
    created() {
      const that = this;
      let out = this.$route.params.out;
      if (out) {
        that.$message({
          message: '退房成功！',
          type: 'success'
        });
      }

      that.parentId = that.$utils.getQueryString('parentId');
      that.selectBuildList(that.parentId);
    },
    methods: {
      /**
       * 缴费
       **/
      payFee: function () {
        const that = this;
        that.dialogVisible = true;
      },
      selectBuildList: function (id) {
        const that = this;
        let data = {
          buildParentId: id
        };
        let houseData = [];
        let buildData = [];
        let floorData = [];
        let familyData = [];
        that.$http.ajax('build/list', data, function (res) {

          for (let i = 0; i < res.data.length; i++) {
            let map = res.data[i];

            if (map.buildLevel == 1) {
              houseData.push(map);
            }

            if (map.buildLevel == 2) {
              buildData.push(map);
            }
            if (map.buildLevel == 3) {
              floorData.push(map);
            }
            if (map.buildLevel == 4) {
              if (map.buildStatus == 4) {
                let today = that.$utils.formatDate(new Date(), 2);
                if (map.rentEndTime) {
                  let diff = that.$utils.getDateDiff(map.rentEndTime, today);

                  if (diff <= 30 && diff >= 0) {
                    map.rentThirty = diff;//30天内到期
                  }
                  if (diff < 0) {
                    map.rentExpire = Math.abs(diff);//合同逾期
                  }

                  let timeEnd = map.rentTimeEnd;//房租交至日期
                  let endDiff = that.$utils.getDateDiff(timeEnd, today) - 1;
                  if (endDiff >= 0 && endDiff <= 15) {
                    map.rentFifteen = endDiff;//15天内交租
                  }
                  if (endDiff < 0) {
                    map.payExpire = Math.abs(endDiff);//交租逾期
                  }

                }

                if (map.payExpire && map.rentThirty) {
                  map.rentThirty = false;
                }

                if (map.payExpire && map.rentExpire) {
                  map.payExpire = false;
                }
              }
              familyData.push(map);
            }

          }

          let newArray = [];
          for (let i = 0; i < familyData.length; i++) {
            let map = familyData[i];
            for (let j = i + 1; j < familyData.length; j++) {
              let map2 = familyData[j];
              if (map.buildId == map2.buildId) {
                j = ++i;
              }
            }
            newArray.push(familyData[i]);
          }
//          console.log(newArray);
//          familyData = newArray;

          let repeatArray = [];
          for (let i = 0; i < familyData.length; i++) {
            let map = familyData[i];
            if (map.buildStatus == 4) {
              repeatArray.push(map);
            }
          }

          for (let i = 0; i < newArray.length; i++) {
            let map = newArray[i];
            let final = [];
            for (let j = 0; j < repeatArray.length; j++) {
              let map2 = repeatArray[j];
              if (map.buildId == map2.buildId) {
                final.push(map2)
              }
            }
            newArray[i].userInfo = final;
          }

          for (let n = 0; n < newArray.length; n++) {
            let map4 = newArray[n];
            if (map4.buildStatus == 4) {
              let userName = [], userSex = [], userPhone = [],
                userIdNo = [], userCompanyName = [], userJob = [], userNote = [];
              for (let m = 0; m < map4.userInfo.length; m++) {
                let map5 = map4.userInfo[m];
                if (map5.userSex == '0') {
                  map5.sex = '男';
                } else {
                  map5.sex = '女';
                }
                userName.push(map5.userName);
                userSex.push(map5.sex);
                userPhone.push(map5.userPhone);
                userIdNo.push(map5.userIdNo);
                userCompanyName.push(map5.userCompanyName);
                userJob.push(map5.userJob);
                userNote.push(map5.userNote);
              }

              map4.userName = userName.join('，');
              map4.userSex = userSex.join('，');
              map4.userPhone = userPhone.join('，');
              map4.userIdNo = userIdNo.join('，');
              map4.userCompanyName = userCompanyName.join('，');
              map4.userJob = userJob.join('，');
              map4.userNote = userNote.join('，');
            }
          }
          // console.log(newArray);

          for (let j = 0; j < buildData.length; j++) {
            let map = buildData[j];
            let a = [];
            for (let i = 0; i < floorData.length; i++) {
              let data = floorData[i];
              if (map.buildId == data.buildParentId) {
                a.push(data);
              }
              map.floorInfo = a;

              for (let k = 0; k < map.floorInfo.length; k++) {
                let floor = map.floorInfo[k];
                let f = [];
                for (let l = 0; l < newArray.length; l++) {
                  let family = newArray[l];
                  if (floor.buildId == family.buildParentId) {
                    f.push(family);
                  }
                  floor.familyInfo = f;
                }
              }

            }
          }

          console.log(houseData)
          console.log(floorData);
          that.houseData = houseData;
          that.buildData = buildData;
          that.floorData = floorData;
          that.familyData = familyData;
          that.loading = false;
        }, function () {
          that.$router.push({path: '/login'});
        }, {needToken: true}, 'get')
      },

      selectBuildTree: function () {
        const that = this;
        let data = {
          parentBuildId: 0,
          deepLevel: 5,
          current: 1,
          size: 1
        };
        that.$http.ajax('build/tree', data, function (res) {

          for (let i = 0; i < res.data.length; i++) {
            let map = res.data[i];
            for (let j = 0; j < map.buildModelList.length; j++) {
              let map2 = map.buildModelList[j];
              for (let k = 0; k < map2.buildModelList.length; k++) {
                let map3 = map2.buildModelList[k];
                for (let l = 0; l < map3.buildModelList.length; l++) {
                  let map4 = map3.buildModelList[l];

                  if (map4.buildStatus == 4) {
                    map4.rentStartTime = map4.rentInfo.rentStartTime;
                    map4.rentEndTime = map4.rentInfo.rentEndTime;
                    map4.rentTotalUser = map4.rentInfo.rentTotalUser;
                    map4.rentPayRentalNum = map4.rentInfo.rentPayRentalNum;
                    map4.rentPayDepositNum = map4.rentInfo.rentPayDepositNum;
                    let userName = [], userSex = [], userPhone = [],
                      userIdNo = [], userCompanyName = [], userJob = [], userNote = [];
                    for (let m = 0; m < map4.rentUserInfo.length; m++) {
                      let map5 = map4.rentUserInfo[m];
                      if (map5.userSex == '0') {
                        map5.sex = '男';
                      } else {
                        map5.sex = '女';
                      }
                      userName.push(map5.userName);
                      userSex.push(map5.sex);
                      userPhone.push(map5.userPhone);
                      userIdNo.push(map5.userIdNo);
                      userCompanyName.push(map5.userCompanyName);
                      userJob.push(map5.userJob);
                      userNote.push(map5.userNote);
                    }

                    map4.userName = userName.join('，');
                    map4.userSex = userSex.join('，');
                    map4.userPhone = userPhone.join('，');
                    map4.userIdNo = userIdNo.join('，');
                    map4.userCompanyName = userCompanyName.join('，');
                    map4.userJob = userJob.join('，');
                    map4.userNote = userNote.join('，');
                  }

                }
              }
            }
          }
          that.buildData = res.data;
          that.loading = false;
        }, function () {
          that.$router.push({path: '/login'});
        }, {needToken: true}, 'get')
      },
      userIn: function (item2, item3, item4) {
        const that = this;
        that.$router.push({
          name: 'userInsert',
          query: {
            buildId: item4.buildId,
            buildName: item2.buildName,
            houseNumber: item3.buildName + item4.buildName,
          }
        })
      },
      handleNodeClick(data) {
        console.log(data);
      },

      /**
       * 预定录入-
       */
      appointInsert: function (id) {
        this.appointDialog = true;
        this.appointForm = {
          buildId: id,
          userNames: '',
          userPhones: ''
        }
      },
      closeAppointDialog: function () {
        this.appointForm = {
          buildId: '',
          userNames: '',
          userPhones: '',
        }
      },
      submitAppoint: function (item) {
        const that = this;
        let data = {
          buildId: that.appointForm.buildId
        };

        if (!item.userNames) {
          that.$message.error('请输入姓名');
          return false;
        }

        if (!item.userPhones) {
          that.$message.error('请输入手机号');
          return false;
        }

        if (!that.$utils.isPhone(item.userPhones)) {
          that.$message.error('请输入正确手机号格式');
          return false;
        }
        data.userNames = item.userNames;
        data.userPhones = item.userPhones;

        that.appointLoading = true;
        that.$http.ajax('build/order', data, function (res) {
          if (res.code == 0) {
            that.appointDialog = false;
            that.$message({
              message: '预定成功！',
              type: 'success'
            });
            that.selectBuildList();
            that.appointLoading = false;
          } else {
            that.$message.error('msg:' + res.msg);
            that.appointLoading = false;
          }
        }, function () {
          that.$router.push({path: '/login'});
        }, {needToken: true})

      },
      cancelAppoint: function (id) {
        const that = this;
        let data = {
          buildId: id
        };

        that.$confirm('确认取消预定?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.$http.ajax('build/unorder', data, function (res) {
            if (res.code == 0) {
              that.selectBuildList();
              that.$message({
                message: '取消预定成功！',
                type: 'success'
              });
            } else {
              that.$message.error('msg:' + res.msg);
            }
          }, function () {
            that.$router.push({path: '/login'});
          }, {needToken: true});
        }).catch(() => {
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../style/buildList.scss";
</style>
