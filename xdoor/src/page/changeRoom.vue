<template>
  <section>
    <el-row v-loading="loading" element-loading-text="拼命加载中"
    >
      <el-col :span="24">
        <div class="grid-content">
          <h3>当前日期：{{ today }}</h3>
        </div>
      </el-col>
      <!-- -当前 -->
      <el-col :span="10">
        <div class="grid-content">
          <div class="border-box" style="margin-right: 14px">
            <h4 style="padding: 10px 0;">当前租房信息</h4>

            <el-form
              :model="nowForm"
              ref="nowForm"
              label-position="left"
              label-width="100px">

              <el-form-item label="租期">
                <p>{{ nowForm.rentStartTime }} 至 {{ nowForm.rentEndTime }} （{{ nowForm.rentTotalTime }}
                  押{{ nowForm.rentPayDepositNum }}付{{ nowForm.rentPayRentalNum }}）</p>
              </el-form-item>

              <el-form-item label="租金已交">
                <p class="color-money">￥{{ nowForm.rentTotalPay }} <span style="font-size: 14px">（已交{{ nowForm.payMouth }}个月 交至{{ nowForm.rentTimeEnd }}）</span>
                </p>
              </el-form-item>

              <el-form-item label="押金已交">
                <p class="color-money">￥{{ otherDePay }}<span style="font-size: 14px">（ {{ depositPay }}元房屋押金 {{ otherDePayName }}）</span>
                </p>
              </el-form-item>

              <div v-for="(item ,index) in nowOtherList">
                <el-form-item :label="item.feeNames">
                  <el-input style="width: 100px"
                            v-model="item.feeValues"
                            :placeholder="item.feeNames"
                            size="small"></el-input>
                  元
                </el-form-item>
              </div>

              <el-form-item>
                <el-button type="primary" size="small" plain icon="el-icon-plus"
                           @click="addNowFee">添加其他费用
                </el-button>
              </el-form-item>

              <div v-for="(item ,index) in nowFeeList" style="margin-left: -100px">
                <el-form-item label="" prop="nowFee">
                  <el-input style="width: 100px"
                            v-model="item.feeNames"
                            placeholder="名称"
                            size="small"></el-input>
                  <el-input style="width: 200px;"
                            v-model="item.feeValues"
                            placeholder="金额"
                            size="small"></el-input>
                  <i class="iconfont icon-close"
                     style="vertical-align: middle; color: #999999;"
                     @click.stop="reduceNowFee(index)"></i>
                </el-form-item>
              </div>

              <el-form-item label="现入住人">
                <p v-for="item in nowUser"> {{ item.userName }} &nbsp;&nbsp; {{ item.userPhone }}</p>
              </el-form-item>

            </el-form>
          </div>
        </div>
      </el-col>

      <!-- -换房 -->
      <el-col :span="14">
        <div class="grid-content">
          <div class="border-box" style="margin-right: 14px;">
            <h4 style="padding: 10px 0;">换房</h4>

            <el-form
              :model="infoForm"
              ref="infoForm"
              label-position="left"
              label-width="100px">

              <el-form-item label="选房">
                <el-select v-model="infoForm.buildId" placeholder="请选择"
                           style="width: 150px;"
                           size="small" @change="changeSelectRent(infoForm.buildId)">
                  <el-option
                    v-for="item in rooms"
                    :key="item.buildId"
                    :label="item.buildName"
                    :value="item.buildId">
                  </el-option>
                </el-select>
                <a class="a-set" v-if="infoForm.buildId" @click.stop="updateRentPay(infoForm.buildId)">&nbsp;<i
                  class="iconfont icon-update"></i>设定租金、押金</a>
              </el-form-item>

              <el-form-item label="租赁时间" prop="rentTime">
                <el-select v-model="infoForm.rentTotalMonth" placeholder="请选择" style="width: 100px;"
                           @change="timeChange" size="small">
                  <el-option
                    v-for="item in times"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>

                <el-date-picker
                  style="width: 140px;" size="small"
                  v-model="infoForm.rentStartTime"
                  align="right"
                  type="date"
                  placeholder="选择开始日"
                  :picker-options="pickerOptions1"
                  @change="selectStart">
                </el-date-picker>

                <el-date-picker
                  disabled size="small"
                  style="width: 140px;"
                  v-model="infoForm.rentEndTime"
                  align="right"
                  type="date"
                  placeholder="结束日">
                </el-date-picker>

              </el-form-item>

              <el-form-item label="交租方式" prop="type">
                押
                <el-select v-model="infoForm.rentPayDepositNum" placeholder="请选择" style="width: 100px;"
                           @change="numChange" size="small">
                  <el-option
                    v-for="item in types"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
                付
                <el-select v-model="infoForm.rentPayRentalNum" placeholder="请选择" style="width: 100px;"
                           @change="numChange" size="small">
                  <el-option
                    v-for="item in types2"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="居住人数" prop="totalUser">
                <el-radio v-model="infoForm.totalUser" label="1">1</el-radio>
                <el-radio v-model="infoForm.totalUser" label="2">2</el-radio>
                <el-radio v-model="infoForm.totalUser" label="3">3</el-radio>
                <el-radio v-model="infoForm.totalUser" label="4">3以上</el-radio>
                <el-input
                  style="width: 100px;margin-left: 10px"
                  v-model="infoForm.totalUser"
                  placeholder="入住人数"
                  size="small" clearable></el-input>
                人
              </el-form-item>

              <el-form-item label="合同" prop="rentContract">
                <el-upload
                  ref="upload2"
                  action="https://upload.qiniup.com"
                  :on-success="handleAvatarSuccess2"
                  :on-error="handleError2"
                  :on-remove="handelRemove2"
                  :before-upload="beforeAvatarUpload2"
                  :data="postData2"
                  :on-exceed="uploadMax2"
                  :file-list="infoForm.rentContract"
                  list-type="picture">
                  <el-button size="small" type="primary">点击上传</el-button>
                  <p class="el-upload__tip" slot="tip">请选择1~5张图片，图片不能超过5M</p>
                </el-upload>

              </el-form-item>

              <el-form-item label="入住人">
                <p v-for="(item,index) in userList"> {{ item.userName }} &nbsp;&nbsp; {{ item.userPhone }}
                  <span style="color: red;margin-left: 14px;cursor: pointer" @click.stop="deleteUser(index)">删除</span>
                </p>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" plain size="small" plain icon="el-icon-plus"
                           @click="addUser">添加住户
                </el-button>
              </el-form-item>

              <div class="userInfo" v-for="(item ,index) in addUserList">

                <i class="iconfont icon-close" @click.stop="closeLi(index)"></i>
                <el-form-item label="姓名" prop="userName">
                  <el-input style="width: 110px;margin-right: 10px"
                            v-model="item.userName"
                            placeholder="姓名"
                            size="small" clearable></el-input>
                  手机号
                  <el-input style="width: 180px;margin-left: 5px"
                            v-model="item.userPhone"
                            placeholder="手机号" maxlength="11"
                            size="small" clearable></el-input>

                </el-form-item>

                <el-form-item label="公司" prop="userCompanyName">
                  <el-input style="width: 200px;margin-right: 10px"
                            v-model="item.userCompanyName"
                            placeholder="公司名"
                            size="small" clearable></el-input>
                  职位
                  <el-input style="width: 110px;margin-left: 5px"
                            v-model="item.userJob"
                            placeholder="职位"
                            size="small" clearable></el-input>

                </el-form-item>

                <el-form-item label="性别" prop="userSex">
                  <el-radio v-model="item.userSex" label="0">男</el-radio>
                  <el-radio v-model="item.userSex" label="1">女</el-radio>
                </el-form-item>

                <el-form-item label="身份证号" prop="userIdNo">
                  <el-input style="width: 300px;margin-right: 10px"
                            v-model="item.userIdNo"
                            placeholder="身份证号" maxlength="20"
                            size="small" clearable></el-input>
                </el-form-item>

                <el-form-item label="身份证照" prop="userIdPic">
                  <el-upload
                    ref="upload"
                    action="https://upload.qiniup.com"
                    :on-success="handleAvatarSuccess"
                    :on-error="handleError"
                    :on-remove="handelRemove"
                    :before-upload="beforeAvatarUpload"
                    :data="postData"
                    :on-exceed="uploadMax"
                    :file-list="item.userIdPic"
                    list-type="picture">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <p class="el-upload__tip" slot="tip">请上传身份证正反照，图片不能超过5M</p>
                  </el-upload>
                </el-form-item>

                <el-form-item label="备注" prop="userNote">
                  <el-input style="width: 300px;margin-right: 10px"
                            type="textarea"
                            v-model="item.userNote"
                            placeholder="备注"
                            size="small" clearable></el-input>
                </el-form-item>

              </div>

              <div class="other-box">
                <el-form
                  ref="payRent"
                  label-position="right"
                  label-width="100px">

                  <el-form-item label="总租金+押金" prop="firstPay">
                    <el-input style="width: 305px"
                              disabled
                              v-model="firstPayFixed"
                              placeholder="总租金+押金"
                              size="small" clearable></el-input>
                  </el-form-item>

                  <div v-for="(item ,index) in deList">
                    <el-form-item label="" prop="feeInfo">
                      <el-input style="width: 100px"
                                :disabled="item.feeIds == 0 ? false : true"
                                v-model="item.feeNames"
                                placeholder="名称"
                                size="small"></el-input>
                      <el-input style="width: 200px;"
                                :disabled="item.feeIds == 0 ? false : true"
                                v-model="item.feeValues"
                                placeholder="金额"
                                size="small"></el-input>
                      <i v-if="item.feeIds == 0" class="iconfont icon-close"
                         style="vertical-align: middle; color: #999999;"
                         @click.stop="closePay(index)"></i>
                    </el-form-item>
                  </div>

                  <el-form-item>
                    <el-button type="primary" size="small" plain icon="el-icon-plus"
                               @click="addPay">新增缴费项目
                    </el-button>
                  </el-form-item>

                  <el-form-item label="总金额">
                    <p class="color-money">￥{{ firstPayTotal }}</p>
                  </el-form-item>

                </el-form>
              </div>

            </el-form>

          </div>
        </div>
      </el-col>

      <el-col :span="24">
        <div class="grid-content">
          <div class="border-box" style="margin-top: 20px;background: #fdf3f4">
            <h4 style="padding: 10px 0;">结算</h4>
            <el-form
              :model="sumForm"
              ref="sumForm"
              label-position="left"
              label-width="100px">

              <el-form-item label="当前应退总额">
                <p class="color-money">￥{{ refundTotal }}</p>
                <span>（应退租金：{{ refundRentDay }}天{{ refundRent }}元）</span>
                <span>（应退押金：{{ refundDeposit }}）</span>
                <span>（应付其他：{{ refundOther }}元）</span>
              </el-form-item>

              <el-form-item label="换房应付总额" v-show="infoForm.buildId">
                <p class="color-money">￥{{ paymentTotal }}</p>
                <span>（应付租金：{{ infoForm.rentPayRentalNum }}个月{{ paymentRent }}元）</span>
                <span>（应付押金：{{ paymentDepositName }}）</span>
                <span>（应付其他： {{ paymentOther }}元）</span>
              </el-form-item>

              <el-form-item label="换房应付总额" v-show="!infoForm.buildId">
                <p class="color-money">请先选房</p>
              </el-form-item>

              <el-form-item label="结论" v-show="infoForm.buildId">
                <p class="color-money" v-if="refundTotal > paymentTotal">应退￥{{ sumTotal }}</p>
                <p class="color-money" v-if="refundTotal <= paymentTotal">应付￥{{ sumTotal }}</p>
              </el-form-item>

              <el-form-item label="结论" v-show="!infoForm.buildId">
                <p class="color-money">请先选房</p>
              </el-form-item>

              <div v-for="(map ,index) in payTypeList" v-if="refundTotal != paymentTotal">
                <el-form-item label="支付方式">
                  <el-select v-model="map.feePayTypes" placeholder="请选择" style="width: 100px;margin-right: 10px"
                             size="small">
                    <el-option
                      v-for="item in pay"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>

                  实{{map.feePayTowards == 1 ? '付' : '退' }}金额
                  <el-input style="width: 120px; margin-left: 10px"
                            v-model="map.feePayValues"
                            placeholder="实付金额(元)"
                            size="small"></el-input>
                  <i v-if="index == 0" class="iconfont icon-add" style="vertical-align: middle; color: #999999;"
                     @click.stop="addPayType"></i>
                  <i v-if="index > 0" class="iconfont icon-close" style="vertical-align: middle; color: #999999;"
                     @click.stop="deletePayType(index)"></i>
                </el-form-item>
              </div>

              <el-form-item label="备注" prop="feeNote">
                <el-input style="width: 300px;"
                          type="textarea"
                          v-model="feeNote"
                          placeholder="备注"
                          size="small"></el-input>
              </el-form-item>

              <el-form-item>
                <el-button type="primary" size="small"
                           @click="submitChange"
                           :loading="submitLoading">确认换房
                </el-button>
              </el-form-item>
            </el-form>
          </div>
        </div>

      </el-col>
    </el-row>


    <!-- -设定 -->
    <el-dialog
      title="租金、押金设定"
      :visible.sync="dialogVisible"
      @close="closeDialog()">
      <el-form :model="payForm"
               ref="payForm"
               label-position="right"
               label-width="100px">
        <el-form-item label="月租金" prop="rentMoney">
          <el-input style="width: 305px"
                    v-model="payForm.feeValues"
                    placeholder="月租金"
                    size="small" clearable></el-input>
        </el-form-item>

        <div v-for="(item ,index) in deList">
          <el-form-item label="" prop="feeInfo">
            <el-input style="width: 100px"
                      v-model="item.feeNames"
                      placeholder="名称"
                      size="small"></el-input>
            <el-input style="width: 200px;"
                      v-model="item.feeValues"
                      placeholder="押金金额"
                      size="small"></el-input>
            <i class="iconfont icon-close" style="vertical-align: middle; color: #999999;"
               @click.stop="closePay(index,item)"></i>
          </el-form-item>
        </div>

        <el-form-item>
          <el-button type="primary" size="small" plain icon="el-icon-plus"
                     @click="addPay">新增押金项目
          </el-button>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" size="small"
                     :loading="payLoading"
                     @click="submitDialog">提交
          </el-button>
        </el-form-item>

      </el-form>
    </el-dialog>

  </section>
</template>

<script>
  export default {
    data() {
      return {
        loading: true,
        buildId: '',
        today: '',
        submitLoading: false,

        //-当前
        nowForm: {},
        nowUser: [],//当前住户
        nowFeeList: [],//其他费用列
        nowOtherList: [{
          feeIds: 0,
          feeNames: '水费',
          feeValues: ''
        }, {
          feeIds: 0,
          feeNames: '电费',
          feeValues: ''
        }, {
          feeIds: 0,
          feeNames: '燃气费',
          feeValues: ''
        }],//水电燃列
        depositPay: 0,//已缴的房屋押金
        otherDePay: 0,//已缴的其他押金
        otherDePayName: '',

        //-换房
        infoForm: {
          buildId: '',
          rentStartTime: '',
          rentEndTime: '',
          rentTotalMonth: '',
          rentPayRentalNum: 1,
          rentPayDepositNum: 1,//押
          rentContract: [],//合同
          totalUser: '1'
        },
        rooms: [],

        newRoomFeeList: [],
        dialogVisible: false,//设定
        payLoading: false,
        payForm: {
          feeIds: '',
          feeNames: '月租金',
          feeValues: 2000,
        },
        feeNote: '',//设定租金、押金的备注
        deList: [],
        deleteFeeIds: '',

        userList: [],
        addUserList: [],
        types: [{
          value: 1, label: 1
        }, {
          value: 2, label: 2
        }, {value: 3, label: 3}, {
          value: 4, label: 4
        }, {
          value: 5, label: 5
        }, {
          value: 6, label: 6
        }, {
          value: 7, label: 7
        }, {
          value: 8, label: 8
        }, {
          value: 9, label: 9
        }, {
          value: 10, label: 10
        }, {
          value: 11, label: 11
        }, {
          value: 12, label: 12
        }],
        types2: [{
          value: 1, label: 1
        }, {
          value: 2, label: 2
        }, {
          value: 3, label: 3
        }, {
          value: 4, label: 4
        }, {
          value: 5, label: 5
        }, {
          value: 6, label: 6
        }, {
          value: 7, label: 7
        }, {
          value: 8, label: 8
        }, {
          value: 9, label: 9
        }, {
          value: 10, label: 10
        }, {
          value: 11, label: 11
        }, {
          value: 12, label: 12
        }],
        times: [{
          value: 1, label: '1个月'
        }, {
          value: 2, label: '2个月'
        }, {
          value: 3, label: '3个月'
        }, {
          value: 4, label: '4个月'
        }, {
          value: 5, label: '5个月'
        }, {
          value: 6, label: '半年'
        }, {
          value: 7, label: '7个月'
        }, {
          value: 8, label: '8个月'
        }, {
          value: 9, label: '9个月'
        }, {
          value: 10, label: '10个月'
        }, {
          value: 11, label: '11个月'
        }, {
          value: 12, label: '1年'
        }, {
          value: 24, label: '2年'
        }],
        pickerOptions1: {
          disabledDate(time) {
//            return time.getTime() > Date.now();
          },
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
        },

        fileList: [],
        postData: {
          token: '',
        },
        fileList2: [],
        postData2: {
          token: ''
        },

        roomFeeValue: 0,//月租金
        firstPayTotal: 0,//总租金+总押金+（增加的其他费用）
        firstPayFixed: 0,//总租金+总押金---(用于计算)

        pay: [{
          value: 1, label: '现金'
        }, {
          value: 2, label: '刷卡'
        }, {
          value: 3, label: '其他'
        }],
        payTypeList: [{
          feePayTypes: 1,
          feePayValues: '',
          feePayTowards: 1
        }],

        //-结算
        sumForm: {},

        refundTotal: 0,
        refundRentDay: 0,
        refundRent: 0,
        deposit: '',
        refundDeposit: 0,
        refundOther: 0,

        paymentTotal: 0,
        paymentRent: 0,
        paymentDeposit: 0,
        paymentDepositName: '',
        paymentOther: 0,

        sumTotal: 0,
        towards: 1,
      }
    },
    created() {
      const that = this;
      that.buildId = that.$utils.getQueryString('buildId');
      that.today = that.$utils.formatDate(new Date(), 2);

      that.selectUserNow();
      that.selectNowRent(that.buildId);
      that.selectEmptyRoom();
    },
    watch: {
      firstPayTotal: {
        handler: function (value) {
          const that = this;
          that.paymentTotal = value;
        },
        deep: true
      },
      refundTotal: {
        handler: function () {
          const that = this;
          let re = that.refundTotal;//应退
          let pay = that.paymentTotal;//应付
          let price = 0;
          if (re > pay) {
            price = re - pay;
          }
          if (re < pay) {
            price = pay - re;
          }

          if (re <= pay) {
            that.towards = 1;
          } else {
            that.towards = -1;
          }

          that.sumTotal = price;
        },
        deep: true
      },
      paymentTotal: {
        handler: function () {
          const that = this;
          let re = that.refundTotal;//应退
          let pay = that.paymentTotal;//应付
          let price = 0;
          if (re > pay) {
            price = re - pay;
          }
          if (re < pay) {
            price = pay - re;
          }

          if (re <= pay) {
            that.towards = 1;
          } else {
            that.towards = -1;
          }

          that.sumTotal = price;
        },
        deep: true
      },
      deList: {
        handler: function (row) {
          const that = this;
          let m = 0;
          for (let i = 0; i < that.deList.length; i++) {
            let map = that.deList[i];
            if (map.feeValues && that.$utils.isPositiveInteger(parseInt(map.feeValues))) {
              m += parseInt(map.feeValues);
            }
          }
          that.firstPayTotal = that.firstPayFixed + m;
          that.paymentOther = m;
          that.paymentTotal = parseInt(that.paymentRent) + parseInt(that.paymentDeposit) + parseInt(that.paymentOther);
        },
        deep: true
      },
      firstPayFixed: {
        handler: function (value) {
          const that = this;
          let m = 0;
          for (let i = 0; i < that.deList.length; i++) {
            let map = that.deList[i];
            if (map.feeValues && that.$utils.isPositiveInteger(parseInt(map.feeValues))) {
              m += parseInt(map.feeValues);
            }
          }
          that.firstPayTotal = that.firstPayFixed + m;
        },
        deep: true
      },
      nowOtherList: {
        handler: function (row) {
          const that = this;
          let m = 0;
          for (let i = 0; i < that.nowOtherList.length; i++) {
            let map = that.nowOtherList[i];
            if (map.feeValues && that.$utils.isPositiveInteger(parseInt(map.feeValues))) {
              m += parseInt(map.feeValues);
            }
          }
          for (let i = 0; i < that.nowFeeList.length; i++) {
            let map = that.nowFeeList[i];
            if (map.feeValues && that.$utils.isPositiveInteger(parseInt(map.feeValues))) {
              m += parseInt(map.feeValues);
            }
          }
          that.refundOther = m;
          that.refundTotal = that.deposit + parseInt(that.refundRent) - parseInt(that.refundOther);
        },
        deep: true
      },
      nowFeeList: {
        handler: function (row) {
          const that = this;
          let m = 0;
          for (let i = 0; i < that.nowOtherList.length; i++) {
            let map = that.nowOtherList[i];
            if (map.feeValues && that.$utils.isPositiveInteger(parseInt(map.feeValues))) {
              m += parseInt(map.feeValues);
            }
          }
          for (let i = 0; i < that.nowFeeList.length; i++) {
            let map = that.nowFeeList[i];
            if (map.feeValues && that.$utils.isPositiveInteger(parseInt(map.feeValues))) {
              m += parseInt(map.feeValues);
            }
          }
          that.refundOther = m;
          that.refundTotal = that.deposit + parseInt(that.refundRent) - parseInt(that.refundOther);
        },
        deep: true
      }
    },
    methods: {
      selectNewRoomFeeList: function (buildId) {
        const that = this;
        that.roomFeeList(function (res) {
          let data = res.data.roomFeeList;
          let li = [];
          for (let i = 0; i < data.length; i++) {
            let map = data[i];
            if (map.roomFeeOrder == 0 || map.roomFeeOrder == 1) {
              li.push({
                feeIds: map.roomFeeId,
                feeNames: map.roomFeeName,
                feeValues: map.roomFeeValue
              })
            }
          }
          that.newRoomFeeList = li;
        }, buildId)
      },
      selectUserNow: function () {
        const that = this;
        that.$http.ajax('admin/rent/select', {buildId: that.buildId}, function (res) {
          if (res.code == 0) {
            let data = res.data;
            that.userList = data.userInfo;
          } else {
            that.$message.error('msg:' + res.msg);
          }
        }, function () {
          that.$router.push({path: '/login'});
        }, {needToken: true}, 'get');
      },
      /**
       * 查询当前租房信息
       */
      selectNowRent: function (id) {
        const that = this;
        let data = {
          buildId: id
        };
        that.$http.ajax('admin/rent/select', data, function (res) {
          if (res.code == 0) {
            let data = res.data;
            that.nowForm = {
              rentStartTime: data.rentStartTime,
              rentEndTime: data.rentEndTime,
              rentTotalMonth: data.rentTotalMonth,//租多少个月
              rentPayRentalNum: parseInt(data.rentPayRentalNum),//付
              rentPayDepositNum: parseInt(data.rentPayDepositNum),//押
              totalUser: data.rentTotalUser.toString(),//入住总人数
              rentTimeEnd: data.rentTimeEnd,
            };

            let mouth = that.$utils.getDateMonthDiff(data.rentTimeEnd, data.rentStartTime);
            let day = that.$utils.getDateDiff(data.rentTimeEnd, that.today);
            that.refundRentDay = day;

            that.nowForm.payMouth = mouth;
            if (data.rentTotalMonth == 12) {
              that.nowForm.rentTotalTime = '1年'
            } else if (data.rentTotalMonth == 24) {
              that.nowForm.rentTotalTime = '2年'
            } else if (data.rentTotalMonth == 6) {
              that.nowForm.rentTotalTime = '半年'
            } else if (data.rentTotalMonth == 18) {
              that.nowForm.rentTotalTime = '1年半'
            } else {
              that.nowForm.rentTotalTime = data.rentTotalMonth + '个月'
            }

            let nowUser = data.userInfo;
            that.nowUser = nowUser;
          } else {
            that.$message.error('msg:' + res.msg);
          }
          that.selectRentFee(id);
        }, function () {
          that.$router.push({path: '/login'});
        }, {needToken: true}, 'get');
      },
      //添加其他费用
      addNowFee: function () {
        const that = this;
        let li = {
          feeIs: 0,
          feeNames: '',
          feeValues: ''
        };
        that.nowFeeList.push(li);
      },
      //减去已添加的费用
      reduceNowFee: function (index) {
        const that = this;
        that.nowFeeList.splice(index, 1);
      },

      /**
       * 查询当前该户房租+押金
       */
      selectRentFee: function (id) {
        const that = this;
        let de = that.nowForm.rentPayDepositNum;
        let pay = that.nowForm.rentPayRentalNum;
        that.nowForm.depositPay = 0;
        that.roomFeeList(function (res) {
          let depositPay = 0, otherDePay = 0, otherDePayName = [];
          let refundDeposit = [], deposit = 0;
          for (let i = 0; i < res.data.roomFeeList.length; i++) {
            let map = res.data.roomFeeList[i];

            if (map.roomFeeOrder == 0) {
              depositPay = de * map.roomFeeValue;//房屋押金
              that.nowForm.rentTotalPay = that.nowForm.payMouth * map.roomFeeValue;
              that.refundRent = ((map.roomFeeValue / 30) * that.refundRentDay).toFixed(0);
              refundDeposit.push('房屋押金' + map.roomFeeValue * de + '元');
              deposit = de * map.roomFeeValue;
            }

            if (map.roomFeeOrder == 1) {
              otherDePay += map.roomFeeValue;
              otherDePayName.push(map.roomFeeValue + "元" + map.roomFeeName);
              refundDeposit.push(map.roomFeeName + map.roomFeeValue + '元');
              deposit += map.roomFeeValue;
            }
          }
          that.deposit = deposit;
          that.refundTotal = parseInt(deposit) + parseInt(that.refundRent) - parseInt(that.refundOther);
          that.refundDeposit = refundDeposit.join(" ");
          that.otherDePay = otherDePay + depositPay;
          that.otherDePayName = otherDePayName.join(" ");
          that.depositPay = depositPay;
          that.loading = false;
        });
      },

      /**
       * -换房
       */
      //查询空房
      selectEmptyRoom: function () {
        const that = this;
        that.$http.ajax('build/select/room', {}, function (res) {
          if (res.code == 0) {
            let room = [];
            for (let i = 0; i < res.data.length; i++) {
              let map = res.data[i];
              if (map.buildStatus == 1) {
                room.push({
                  buildId: map.buildId,
                  buildName: map.dongName + map.floorName + map.buildName,
                })
              }
            }

            that.rooms = room;
          } else {
            that.$message.error('msg:' + res.msg);
          }
        }, function () {
          that.$router.push({path: '/login'});
        }, {needToken: true}, 'get');
      },
      // 租金 + 押金设定
      updateRentPay: function (buildId) {
        const that = this;
        that.selectRentFeeChange(buildId);
        that.dialogVisible = true;
      },
      selectRentFeeChange: function (buildId) {
        const that = this;
        that.roomFeeList(function (res) {
          that.feeNote = res.data.roomFeeNote;
          let deList = [];
          for (let i = 0; i < res.data.roomFeeList.length; i++) {
            let map = res.data.roomFeeList[i];

            if (map.roomFeeOrder == 0) {
              that.payForm.feeValues = map.roomFeeValue;
              that.payForm.feeIds = map.roomFeeId;
              that.payForm.feeNames = map.roomFeeName;
            }

            if (map.roomFeeOrder == 1) {
              deList.push({
                feeIds: map.roomFeeId,
                feeNames: map.roomFeeName,
                feeValues: map.roomFeeValue
              });
            }
          }
          that.deList = deList;
        }, buildId)
      },

      //增加租金项目
      addPay: function () {
        const that = this;
        let li = {
          feeIds: '0',
          feeNames: '',
          feeValues: '',
        };
        that.deList.push(li);
      },
      closePay: function (index, item) {
        const that = this;
        this.deList.splice(index, 1);
        if (item) {
          if (item.feeIds != 0) {
            that.deleteFeeIds.push(item.feeIds);
          }
        }

      },

      //提交租金押金设定
      submitDialog: function () {
        const that = this;
        let data = {
          buildId: that.infoForm.buildId
        };
        let payForm = that.payForm;
        let deList = that.deList;

        if (!payForm.feeValues) {
          that.$message.error('请输入月租金');
          return false;
        }

        for (let i = 0; i < deList.length; i++) {
          let map = deList[i];
          if (!map.feeNames || !map.feeValues) {
            that.$message.error('请完整填写押金项目');
            return false;
          }

          if (!that.$utils.isPositiveInteger(map.feeValues)) {
            that.$message.error('金额应设定正整数！');
            return false;
          }
        }

        if (that.deleteFeeIds.length) {
          data.deleteFeeIds = that.deleteFeeIds.toString();
        }
        let feeIds = [], feeNames = [], feeValues = [];

        for (let i = 0; i < deList.concat(payForm).length; i++) {

          let map = deList.concat(payForm)[i];
          feeIds.push(map.feeIds);
          feeNames.push(map.feeNames);
          feeValues.push(map.feeValues);
        }

        that.payLoading = true;

        data.feeIds = feeIds.toString();
        data.feeNames = feeNames.toString();
        data.feeValues = feeValues.toString();

        that.$http.ajax('admin/rent/fee', data, function (res) {
          if (res.code == 0) {
            that.payLoading = false;
            that.dialogVisible = false;
            that.$message({
              message: '月租金、押金设定成功！',
              type: 'success'
            });
            that.changeSelectRent();

          } else {
            that.payLoading = false;
            that.$message.error('msg:' + res.msg);
          }
        }, function () {
          that.$router.push({path: '/login'});
        },{needToken: true})
      },

      //关闭弹出曾（设定租金、押金）
      closeDialog(row) {
        const that = this;
        that.delist = [{
          feeIds: '0',
          feeNames: '房屋押金',
          feeValues: '',
        }];
        that.payForm = {
          feeIds: '',
          feeNames: '月租金',
          feeValues: 2000,
        };
        that.deleteFeeIds = [];
      },

      //监听租赁时间
      timeChange: function () {
        const that = this;
        if (that.infoForm.rentStartTime) {
          let day = that.$utils.dateAdd("m", parseInt(that.infoForm.rentTotalMonth), new Date(that.infoForm.rentStartTime));
          that.infoForm.rentEndTime = that.$utils.dateAdd('-d', 1, new Date(day));
        }
      },
      //监听租期开始时间
      selectStart: function (value) {
        const that = this;
        that.infoForm.rentStartTime = that.$utils.formatDate(new Date(value), 2);
        let day = '';
        if (that.infoForm.rentTotalMonth) {
          day = that.$utils.dateAdd("m", parseInt(that.infoForm.rentTotalMonth), new Date(value));
        } else {
          day = that.$utils.dateAdd("m", 12, new Date(value));
        }

        that.infoForm.rentEndTime = that.$utils.dateAdd('-d', 1, new Date(day));
      },
      //押变化
      numChange: function () {
        const that = this;
        let de = that.infoForm.rentPayDepositNum;
        let pay = that.infoForm.rentPayRentalNum;

        that.firstPayTotal = (pay + de) * that.roomFeeValue;
        that.firstPayFixed = (pay + de) * that.roomFeeValue;
      },
      //删除用户
      deleteUser: function (index) {
        const that = this;
        that.userList.splice(index, 1);
      },
      addUser: function () {
        const that = this;
        let li = {
          userId: '',
          userName: '',
          userPhone: '',
          userSex: '0',
          userCompanyName: '',
          userJob: '',
          userIdPic: [],
          userIdNo: '',
          userNote: '',
        };
        that.addUserList.push(li);
      },
      closeLi: function (index) {
        this.addUserList.splice(index, 1)
      },

      //换房算租金+押金+其他费用
      changeSelectRent: function () {
        const that = this;
        let deNum = that.infoForm.rentPayDepositNum;
        let pay = that.infoForm.rentPayRentalNum;

        that.selectNewRoomFeeList(that.infoForm.buildId);
        that.roomFeeList(function (res) {
          let de = [];
          let totalPay = 0;
          let paymentRent = 0, paymentDepositName = [], paymentDeposit = 0;
          for (let i = 0; i < res.data.roomFeeList.length; i++) {
            let map = res.data.roomFeeList[i];

            if (map.roomFeeOrder == 0) {
              that.roomFeeValue = map.roomFeeValue;
              totalPay = (pay + deNum) * map.roomFeeValue;
              paymentRent = pay * map.roomFeeValue;
              paymentDepositName.push('房屋押金' + map.roomFeeValue + '元');
              paymentDeposit = deNum * map.roomFeeValue;
            }

            if (map.roomFeeOrder == 1) {
              paymentDepositName.push(map.roomFeeName + map.roomFeeValue + '元');
              de.push({
                feeIds: map.roomFeeId,
                feeNames: map.roomFeeName,
                feeValues: map.roomFeeValue
              });
            }

          }

          that.deList = de;
          that.firstPayFixed = totalPay;
          that.firstPayTotal = totalPay;

          that.paymentRent = paymentRent;
          that.paymentDepositName = paymentDepositName.join(' ');
          that.paymentDeposit = paymentDeposit;
          that.paymentTotal = parseInt(that.paymentRent) + parseInt(that.paymentDeposit) + parseInt(that.paymentOther);
        }, that.infoForm.buildId);
      },

      /**
       * 结算
       **/
      //增加支付方式
      addPayType: function () {
        const that = this;
        let li = {
          feePayTypes: 1,
          feePayValues: '',
        };
        that.payTypeList.push(li);
      },
      deletePayType: function (index) {
        this.payTypeList.splice(index, 1);
      },

      /**
       * 确认换房
       **/
      submitChange: function () {
        const that = this;
        let data = {
          sourceBuild: that.buildId
        };
        let nowOtherList = that.nowOtherList;//水电燃
        let nowFeeList = that.nowFeeList;//当前房子其他费用

        let item = that.infoForm;
        let userList = that.userList;
        let addUserList = that.addUserList;
        let deList = that.deList;
        let ptList = that.payTypeList;

        console.log(item);
        for (let i = 0; i < nowOtherList.length; i++) {
          let map = nowOtherList[i];
          if (map.feeValues && !that.$utils.isPositiveInteger(map.feeValues)) {
            that.$message.error('水电燃费用金额应为正整数');
            return false;
          }
        }
        for (let i = 0; i < nowFeeList.length; i++) {
          let map = nowFeeList[i];
          if (!map.feeNames || !map.feeValues) {
            that.$message.error('请填写完整当前租房其他费用');
            return false;
          }

          if (!that.$utils.isPositiveInteger(map.feeValues)) {
            that.$message.error('当前租房其他费用金额应为正整数');
            return false;
          }
        }
        if (!item.buildId) {
          that.$message.error('请先选房');
          return false;
        }

        if (!item.rentTotalMonth) {
          that.$message.error('请选择租赁时长');
          return false;
        }

        if (!item.rentStartTime) {
          that.$message.error('请选择租赁开始时间');
          return false;
        }

        if (!item.totalUser) {
          that.$message.error('请设置居住人数');
          return false;
        }
        if (!item.rentContract.length) {
          that.$message.error('请上传合同图片');
          return false;
        }

        if (!userList.length && !addUserList.length) {
          that.$message.error('请添加入住人');
          return false;
        }

        for (let i = 0; i < addUserList.length; i++) {
          let map = addUserList[i];
          if (!map.userName || !map.userPhone || !map.userCompanyName || !map.userJob || !map.userIdNo || !map.userIdPic.length) {
            that.$message.error('入住人所有信息必填');
            return false;
          }
          if (map.userIdPic.length != 2) {
            that.$message.error('身份证照应传两张');
            return false;
          }
        }
        for (let i = 0; i < deList.length; i++) {
          let map = deList[i];
          if (!map.feeValues || !map.feeNames) {
            that.$message.error('请完整填写新房新增缴费项目');
            return false;
          }
          if (!that.$utils.isPositiveInteger(map.feeValues)) {
            that.$message.error('新房新增缴费金额应为正整数');
            return false;
          }
        }

        let ptTotal = 0;
        for (let i = 0; i < ptList.length; i++) {
          let map = ptList[i];

          if (!map.feePayValues) {
            that.$message.error('请完整填写支付金额');
            return false;
          }
          if (!that.$utils.isPositiveInteger(map.feePayValues)) {
            that.$message.error('支付金额应为正整数');
            return false;
          }
          ptTotal += parseInt(map.feePayValues);
        }

        if (that.sumTotal != ptTotal) {
          if (that.towards == 1) {
            that.$message.error('实付金额想加应等于总付金额');
            return false;
          } else {
            that.$message.error('实退金额想加应等于总退金额');
            return false;
          }
        }

        that.submitLoading = true;
        that.loading = true;
        data.targetBuildId = item.buildId;
        data.rentEndTime = that.$utils.formatDate(new Date(item.rentEndTime), 2);
        data.rentTotalMonth = item.rentTotalMonth;
        data.rentPayRentalNum = item.rentPayRentalNum;
        data.rentPayDepositNum = item.rentPayDepositNum;
        data.rentContract = item.rentContract.toString();
        data.totalUser = item.totalUser;
        data.rentStartTime = item.rentStartTime;

        let userPhones = [], userIdPics = [], userIdNos = [], userSexs = [],
          userNames = [], userCompanyNames = [], userJobs = [], userNotes = [];
        let user = [];
        user = userList.concat(addUserList);
        for (let i = 0; i < user.length; i++) {
          let map = user[i];
          userPhones.push(map.userPhone);
          userIdPics.push(map.userIdPic.toString());
          userIdNos.push(map.userIdNo);
          userSexs.push(map.userSex);
          userNames.push(map.userName);
          userCompanyNames.push(map.userCompanyName);
          userJobs.push(map.userJob);
          userNotes.push(map.userNote);
        }
        data.userPhones = userPhones.toString();
        data.userIdPics = userIdPics.toString();
        data.userIdNos = userIdNos.toString();
        data.userSexs = userSexs.toString();
        data.userNames = userNames.toString();
        data.userCompanyNames = userCompanyNames.toString();
        data.userJobs = userJobs.toString();
        data.userNotes = userNotes.toString();

        let feeIds = [], feeNames = [], feeValues = [];

        for (let i = 0; i < deList.concat(that.newRoomFeeList).length; i++) {
          let map = deList.concat(that.newRoomFeeList)[i];
          feeIds.push(map.feeIds);
          feeNames.push(map.feeNames);
          feeValues.push(map.feeValues);
        }
        data.feeIds = feeIds.toString();
        data.feeNames = feeNames.toString();
        data.feeValues = feeValues.toString();

        let feePayTypes = [], feePayValues = [], feePayTowards = [];
        for (let i = 0; i < ptList.length; i++) {
          let map = ptList[i];
          feePayTypes.push(map.feePayTypes);
          feePayValues.push(map.feePayValues);
          feePayTowards.push(that.towards);
        }
        data.feePayTypes = feePayTypes.toString();
        data.feePayValues = feePayValues.toString();
        data.feePayTowards = feePayTowards.toString();

        let sourceFeeNames = [], sourceFeeValues = [];
        for (let i = 0; i < nowOtherList.length; i++) {
          let map = nowOtherList[i];
          if (map.feeValues) {
            sourceFeeValues.push(map.feeValues);
            sourceFeeNames.push(map.feeNames);
          }
        }

        for (let i = 0; i < nowFeeList.length; i++) {
          let map = nowFeeList[i];
          sourceFeeValues.push(map.feeValues);
          sourceFeeNames.push(map.feeNames);
        }

        data.sourceFeeValues = sourceFeeValues.toString();
        data.sourceFeeNames = sourceFeeNames.toString();

        data.feeNotes = that.feeNote;

        data.sourceRefundValue = that.refundTotal;

        console.log(data);
        that.$http.ajax('admin/rent/change', data, function (res) {
          if (res.code == 0) {
            that.loading = false;
            that.submitLoading = false;
            that.$alert('换房成功！', '提示', {
              confirmButtonText: '好的',
              callback: action => {
                that.$router.push({
                  name: 'buildList'
                })
              }
            });

          } else {
            that.loading = false;
            that.submitLoading = false;
            that.$message.error('msg:' + res.msg);
          }
        }, function () {
          that.$router.push({path: '/login'});
        },{needToken: true})

      },
      roomFeeList: function (callback, buildId) {
        const that = this;
        let data = {};
        if (buildId) {
          data.buildId = buildId
        } else {
          data.buildId = that.buildId;
        }
        that.$http.ajax('admin/rent/fee', data, function (res) {
          if (res.code == 0) {
            callback && callback(res);
          } else {
            that.$message.error('msg:' + res.msg);
            that.loading = false;
          }
        }, function () {
          that.$router.push({path: '/login'});
        }, {needToken: true}, 'get');

      },

      /**
       * -七牛
       */
      handleAvatarSuccess(res, file, fileList) {   //上传成功后在图片框显示图片
        const that = this;
//        this.fileList.push(res.key);
        that.userList[that.index].userIdPic.push(res.key);
      },
      handleError(res, file, fileList) {   //显示错误
      },
      handelRemove(file, fileList) {
//        this.fileList = [];
        this.postData = {
          token: ''
        }
      },
      beforeAvatarUpload(file) {    //在图片提交前进行验证
        const that = this;
        const isLt2M = file.size / 1024 / 1024 < 5;
        const isJPE = file.type === 'image/jpg';
        const isPNG = file.type === 'image/png';
        const isJPEG = file.type === 'image/jpeg';
        const isGIF = file.type === 'image/gif';

        if (!isPNG && !isJPEG && !isGIF && !isJPE) {
          this.$message.error('上传文件只能是图片格式');
          return false;
        }

        if (!isLt2M) {
          this.$message.error('上传文件不能大于5M');
          return false;
        }

        return this.$http.ajax('1/common/qiniu/token', {}, function (res) {
          that.postData.token = res.data;
        }, null, {ajaxAsync: true}, 'get');
      },
      uploadMax(files, fileList) { // 文件超出个数限制时的钩子
        const that = this;
        if (that.userList[that.index].userIdPic.length >= 2) {
          this.$message.error('只可上传两张');
        }
      },

      handleAvatarSuccess2(res, file) {   //上传成功后在图片框显示图片
        this.fileList2.push(res.key);
        this.infoForm.rentContract.push(res.key);
      },
      handleError2(res) {   //显示错误
      },
      handelRemove2(file, fileList) {
        this.fileList2 = [];
//        this.infoForm.brandLogo = "";
        this.postData2 = {
          token: ''
        }
      },
      beforeAvatarUpload2(file) {    //在图片提交前进行验证
        const that = this;
        const isLt2M = file.size / 1024 / 1024 < 5;
        const isJPE = file.type === 'image/jpg';
        const isPNG = file.type === 'image/png';
        const isJPEG = file.type === 'image/jpeg';
        const isGIF = file.type === 'image/gif';

        if (!isPNG && !isJPEG && !isGIF && !isJPE) {
          this.$message.error('上传文件只能是图片格式');
          return false;
        }

        if (!isLt2M) {
          this.$message.error('上传文件不能大于5M');
          return false;
        }

        return this.$http.ajax('1/common/qiniu/token', {}, function (res) {

          that.postData2.token = res.data;
        }, null, {ajaxAsync: true}, 'get');
      },
      uploadMax2(files, fileList) { // 文件超出个数限制时的钩子

        if (fileList.length >= 5) {
          this.$message.error('只可上传5张');
        }
      },
    }
  }
</script>

<style lang="scss" scoped>
  @import "../style/changeRoom.scss";
  /deep/ .el-message {
    z-index: 9999999 !important;
  }
</style>

