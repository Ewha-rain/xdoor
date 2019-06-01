<template>
  <section>
    <el-row>
      <el-col :span="4">
        <div class="grid-content"></div>
      </el-col>
      <el-col :span="12">

        <div class="part-top">
          <div class="title">
            <p>{{ buildName }} - {{ houseNumber }}</p>
          </div>

          <div class="rent">
            <p class="pay">月租金：{{ roomFeeValue }}元</p>
            <a class="update" v-if="buildStatus != 4" @click.stop="updateRentPay"><i class="iconfont icon-update"></i>设定租金、押金</a>
          </div>

        </div>

        <!-- 租房信息 -->
        <div class="part-info">
          <div class="box-base">
            <el-form :model="infoForm"
                     ref="infoForm"
                     label-position="right"
                     label-width="100px">
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
                  v-if="!isEdit2"
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

                <template v-else>
                  <div class="img-card" v-for="(item,index) in infoForm.rentContractImg">
                    <img width="200px" :src="item" alt="图片"/>
                    <!--<el-button size="medium" type="danger"
                               @click="infoForm.rentContract.splice(index,1);if(!infoForm.rentContract.length){isEdit2 = !isEdit2}"
                               icon="el-icon-delete" circle></el-button>-->
                  </div>
                </template>
              </el-form-item>

              <div class="line-gray"></div>

              <div class="userInfo" v-for="(item ,index) in userList">

                <i v-if="index > 0" class="iconfont icon-close" @click.stop="closeLi(index)"></i>
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
                    v-if="!item.isEdit"
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
                    <el-button size="small" type="primary" @click="clickUpload(index)">点击上传</el-button>
                    <p class="el-upload__tip" slot="tip">请上传身份证正反照，图片不能超过5M</p>
                  </el-upload>

                  <template v-else>
                    <div class="img-card" v-for="(itemImg ,indexImg) in item.userIdImg">
                      <img width="200px" :src="itemImg" alt="图片"/>
                      <!--<el-button size="medium" type="danger"
                                 @click="cardClick(item.userIdPic, index, indexImg)"
                                 icon="el-icon-delete" circle></el-button>-->
                    </div>
                  </template>
                </el-form-item>

                <el-form-item label="备注" prop="userNote">
                  <el-input style="width: 300px;margin-right: 10px"
                            type="textarea"
                            v-model="item.userNote"
                            placeholder="备注"
                            size="small" clearable></el-input>
                </el-form-item>

              </div>

              <div class="addUser">
                <el-button type="warning" size="small" plain icon="el-icon-plus"
                           @click="addUser">添加住户
                </el-button>
              </div>

              <!--<el-form-item label="房间备注" prop="houseRemark">
                <el-input style="width: 300px;margin-right: 10px"
                          type="textarea"
                          v-model="infoForm.remark"
                          placeholder="房间备注"
                          size="small" clearable></el-input>
              </el-form-item>-->

              <!-- -租房 -->
              <div class="other-box" v-if="buildStatus == 1">
                <el-form :model="payRentForm"
                         ref="payRentForm"
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
                    <p class="total-money">￥{{ firstPayTotal }}</p>
                  </el-form-item>

                  <div v-for="(map ,index) in payTypeList">
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

                      实付金额
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

                </el-form>
              </div>

              <div class="other-box">

                <el-form-item v-if="paramForm.time" label="上次更新时间" prop="water" style="width: 100px">
                  <el-tag>{{ paramForm.time }}</el-tag>
                </el-form-item>

                <el-form-item label="水表读数" prop="water">
                  <el-input style="width: 130px;margin-right: 10px"
                            v-model="paramForm.houseWater"
                            placeholder="水表读数(吨)"
                            size="small" clearable></el-input>
                  单价
                  <el-input style="width: 110px;margin-left: 5px"
                            v-model="paramForm.houseWaterPer"
                            placeholder="单价"
                            size="small" clearable></el-input>
                  元/吨

                </el-form-item>

                <el-form-item label="电表读数" prop="water">
                  <el-input style="width: 130px;margin-right: 10px"
                            v-model="paramForm.houseElectricity"
                            placeholder="电表读数(度)"
                            size="small" clearable></el-input>
                  单价
                  <el-input style="width: 110px;margin-left: 5px"
                            v-model="paramForm.houseElectricityPer"
                            placeholder="单价"
                            size="small" clearable></el-input>
                  元/度

                </el-form-item>

                <el-form-item label="热水读数" prop="water">
                  <el-input style="width: 130px;margin-right: 10px"
                            v-model="paramForm.houseGas"
                            placeholder="热水读数(吨)"
                            size="small" clearable></el-input>
                  单价
                  <el-input style="width: 110px;margin-left: 5px"
                            v-model="paramForm.houseGasPer"
                            placeholder="单价"
                            size="small" clearable></el-input>
                  元/吨

                </el-form-item>

                <el-form-item>
                  <el-button type="primary" size="small"
                             @click="submitOtherForm(paramForm)"
                             :loading="submitOtherLoading">保存
                  </el-button>
                </el-form-item>
              </div>

              <div class="submit">
                <el-button type="primary" size="small"
                           @click="submitForm(infoForm,'infoForm')"
                           :loading="submitLoading">提交
                </el-button>

              </div>

            </el-form>
          </div>
        </div>

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

        <!-- -退房 -->
        <el-dialog
          title="退房"
          :visible.sync="outDialog"
          @close="closeOutDialog()">
          <el-form :model="outForm"
                   ref="outForm"
                   label-position="right"
                   label-width="100px">

            <div v-for="(item ,index) in outFeeList">
              <el-form-item label="" prop="feeInfo">
                <el-input style="width: 100px"
                          v-model="item.feeNames"
                          placeholder="名称" disabled
                          size="small"></el-input>
                <el-input style="width: 200px;" disabled
                          v-model="item.feeValues"
                          placeholder="押金金额"
                          size="small"></el-input>
              </el-form-item>
            </div>

            <el-form-item>
              <el-button type="primary" size="small" plain icon="el-icon-plus"
                         @click="addReduce">新增扣款项
              </el-button>
            </el-form-item>

            <div v-for="(item ,index) in reduceList">
              <el-form-item label="" prop="">
                <el-input style="width: 100px"
                          v-model="item.feePayNames"
                          placeholder="扣款项名称"
                          size="small"></el-input>
                <el-input style="width: 200px;"
                          v-model="item.feePayValues"
                          placeholder="金额"
                          size="small"></el-input>
              </el-form-item>

              <el-form-item>
                <el-checkbox v-model="item.feePayDiscounts">从押金中扣除</el-checkbox>
              </el-form-item>
              <el-form-item>
                <el-input style="width: 304px;"
                          type="textarea"
                          v-model="item.feeNotes"
                          placeholder="原因"
                          size="small"></el-input>
                <i class="iconfont icon-close" style="vertical-align: middle; color: #999999;"
                   @click.stop="closeReduce(index)"></i>
              </el-form-item>

            </div>

            <el-form-item label="需退总押金">
              <p class="total-money">￥{{ outTotalMoney }}</p>
            </el-form-item>

            <el-form-item label="需退总房租">
              <p class="total-money">￥{{ outTotalRentMoney }}</p>
            </el-form-item>

            <el-form-item label="备注" prop="actionNote">
              <el-input style="width: 300px;"
                        type="textarea"
                        v-model="actionNote"
                        placeholder="备注"
                        size="small"></el-input>
            </el-form-item>


            <el-form-item>
              <el-button type="primary" size="small"
                         :loading="payLoading"
                         @click="submitOut">提交
              </el-button>
            </el-form-item>

          </el-form>
        </el-dialog>

        <el-dialog
          title="退房单"
          :visible.sync="printDialog"
          @close="closePrintDialog()">

          <el-button class="btn-print" style="float: right" type="primary" icon="el-icon-plus" size="small"
                     @click="printAction" v-print="'#printMe'">打印
          </el-button>

          <!--startprint-->
          <div class="box-print" id="printMe" v-loading="printLoading">

            <h3>{{ buildName }} - {{ houseNumber }}退房单</h3>
            <div class="line-black"></div>
            <div class="renter-info">
              <span>住户姓名：{{ userNames }}</span>
              <span>租期：{{ infoForm.startTime }} 至 {{ infoForm.endTime }}</span>
              <br/>
              <span>月租金：{{ roomFeeValue }}元</span>
              <span>房屋押金：{{ roomFeeValue }}元</span>
              <br/>
              <span>退房备注：{{ actionNote }}</span>
            </div>

            <div class="line-black"></div>

            <div class="print-detail">
              <p>退房清单明细：</p>

              <table class="print-table">
                <tr>
                  <th>项目</th>
                  <th>金额</th>
                  <th>备注</th>
                </tr>
                <tr v-for="item in printData">
                  <td>{{item.feeNames}}</td>
                  <td v-if="item.feeType && item.feeIds">+{{item.feeValues}}元
                    ({{item.day}}天 * {{item.dayFee}}元/天)
                  </td>
                  <td v-if="!item.feeType && item.feeIds">+{{item.feeValues}}元</td>
                  <td v-if="!item.feeType && !item.feeIds">-{{item.feeValues}}元
                    ({{item.day}}天 * {{item.dayFee}}元/天)
                  </td>

                  <td>{{item.feeNotes}}</td>
                </tr>
              </table>

              <!-- <el-table
                 ref="printTable"
                 highlightCurrentRow
                 :data="printData"
                 style="width: 100%;margin: 10px 0;"
                 size="medium">

                 <el-table-column
                   prop="feeNames"
                   label="项目"
                   show-overflow-tooltip
                   align="center">

                 </el-table-column>

                 <el-table-column
                   prop="feeValues"
                   label="金额"
                   align="center">
                   <template slot-scope="scope">
                     <p v-if="scope.row.feeType && scope.row.feeIds" class="l-online">+{{scope.row.feeValues}}元
                       ({{scope.row.day}}天 * {{scope.row.dayFee}}元/天)</p>
                     <p v-if="!scope.row.feeType && scope.row.feeIds" class="l-offline">+{{scope.row.feeValues}}元</p>
                     <p v-if="!scope.row.feeType && !scope.row.feeIds" class="l-offline">-{{scope.row.feeValues}}元</p>
                   </template>
                 </el-table-column>

                 <el-table-column
                   prop="feeNotes"
                   label="备注"
                   width="140"
                   show-overflow-tooltip
                   align="center">

                 </el-table-column>

               </el-table>-->
              <p>合计应退：{{printTotal}}元</p>
            </div>

          </div>

          <!--endprint-->
        </el-dialog>

        <!-- -交租 -->
        <el-dialog
          title="交租"
          :visible.sync="payRentDialog"
          @close="closePayRentDialog()">
          <el-form :model="payRentForm"
                   ref="payRentForm"
                   label-position="right"
                   label-width="100px">

            <el-form-item label="租金" prop="payRentMoney">
              <el-input style="width: 150px"
                        disabled
                        v-model="payRentForm.feeValues"
                        placeholder="租金"
                        size="small" clearable></el-input>
              <span>（ 押{{ rentPayDepositNum }}付{{ rentPayRentalNum }} ）</span>
            </el-form-item>

            <div v-for="(item ,index) in payRentList">
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
                <i class="iconfont icon-close" style="vertical-align: middle; color: #999999;"
                   @click.stop="closePayRent(index)"></i>
              </el-form-item>
            </div>

            <el-form-item>
              <el-button type="primary" size="small" plain icon="el-icon-plus"
                         @click="addPayRent">新增缴费项目
              </el-button>
            </el-form-item>

            <el-form-item label="总金额">
              <p class="total-money">￥{{ payRentTotalMoney }}</p>
            </el-form-item>

            <div v-for="(map ,index) in payTypeList">
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

                实付金额
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
                         :loading="payLoading"
                         @click="submitPayRent">提交
              </el-button>
            </el-form-item>

          </el-form>
        </el-dialog>

        <!-- -缴费 -->
        <el-dialog
          title="缴费"
          :visible.sync="payFeeDialog"
          @close="closePayFeeDialog()">
          <el-form :model="payFeeForm"
                   ref="payFeeForm"
                   label-position="right"
                   label-width="100px">

            <div v-for="(item ,index) in feeList">
              <el-form-item label="" prop="feeList">
                <el-input style="width: 100px"
                          v-model="item.feeNames"
                          placeholder="缴费名称"
                          size="small"></el-input>
                <el-input style="width: 200px;"
                          v-model="item.feeValues"
                          placeholder="缴费金额"
                          size="small"></el-input>
                <i v-if="index == 0" class="iconfont icon-add" style="vertical-align: middle; color: #999999;"
                   @click.stop="addPayFee"></i>
                <i v-if="index > 0" class="iconfont icon-close" style="vertical-align: middle; color: #999999;"
                   @click.stop="closePayFee(index)"></i>
              </el-form-item>
            </div>

            <el-form-item label="缴费总金额">
              <p class="total-money">￥{{ payFeeTotalMoney }}</p>
            </el-form-item>

            <div v-for="(map ,index) in payTypeList">
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

                实付金额
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
                         :loading="payLoading"
                         @click="submitPayFee">提交
              </el-button>
            </el-form-item>

          </el-form>
        </el-dialog>

      </el-col>
      <el-col :span="8">
        <div class="grid-content">
          <div class="action-right">
            <el-button v-if="buildStatus == 4" type="primary" size="small" @click="payFee">
              <i class="iconfont icon-fee"></i> 缴费
            </el-button>
            <br/>

            <el-button v-if="buildStatus == 4" type="primary" size="small" @click="payRent">
              <i class="iconfont icon-fee"></i> 交租
            </el-button>
            <br/>

            <el-button v-if="buildStatus == 4" type="danger" size="small" @click="outRent">
              <i class="iconfont icon-out"></i> 退房
            </el-button>
            <br/>

            <el-button v-if="buildStatus == 4" type="warning" size="small" @click="changeRoom">
              <i class="iconfont icon-change"></i> 换房
            </el-button>

          </div>

        </div>
      </el-col>
    </el-row>
  </section>
</template>

<script>
  export default {
    data() {
      return {
        isSetOther: false,
        buildId: '',//房屋Id
        buildStatus: '',//房屋状态
        buildName: '',//楼栋名称
        houseNumber: '',//房间号
        submitLoading: false,
        submitOtherLoading: false,//水电...

        //-租房
        roomFeeValue: 0,//月租金
        firstPayTotal: 0,//总租金+总押金+（增加的其他费用）
        firstPayFixed: 0,//总租金+总押金---(用于计算)
        firstPayForm: {
          feeIds: '',
          feeNames: '',
          feeValues: 0,
        },

        dialogVisible: false,
        payLoading: false,
        payForm: {
          feeIds: '',
          feeNames: '月租金',
          feeValues: 2000,
        },
        feeNote: '',//设定租金、押金的备注

        deList: [],
        payTypeList: [{
          feePayTypes: 1,
          feePayValues: '',
        }],

        //-退房
        outForm: {},
        reduceList: [],
        outDialog: false,
        outTotalMoney: 0,
        outTotalRentMoney: 0,
        refundRentDay: 0,
        outFeeList: [],
        actionNote: '',
        allYa: 0,
        //退房单
        printDialog: false,
        userNames: '',
        printLoading: false,
        printData: [],
        printTotal: 0,

        //-交租
        payRentDialog: false,
        payRentList: [],
        payRentForm: {
          feeIds: '',
          feeNames: '租金',
          feeValues: 2000,
        },
        rentTotalPay: 0,
        payRentTotalMoney: 0,
        deleteFeeIds: [],

        //-缴费
        payFeeDialog: false,
        payFeeForm: {},
        payFeeTotalMoney: 0,
        feeList: [{
          feeIds: '0',
          feeNames: '',
          feeValues: '',
        }],

        rentPayDepositNum: 0,
        rentPayRentalNum: 0,
        userList: [{
          userName: '',
          userPhone: '',
          userSex: '0',
          userCompanyName: '',
          userJob: '',
          userIdPic: [],
          userIdNo: '',
          userNote: '',
          isEdit: false
        }],
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

        paramForm: {
          time: '',
          houseWater: '',
          houseElectricity: '',
          houseGas: '',
          houseElectricityPer: '',
          houseWaterPer: '',
          houseGasPer: ''
        },
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
        pay: [{
          value: 1, label: '现金'
        }, {
          value: 2, label: '刷卡'
        }, {
          value: 3, label: '其他'
        }],
        types: [{
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
        index: '',
        isEdit: false,
        dialogImg: [],
        fileList: [],
        postData: {
          token: '',
        },
        isEdit2: false,
        dialogImg2: [],
        fileList2: [],
        postData2: {
          token: ''
        }
      }
    },
    created() {
      const that = this;
      that.buildId = that.$utils.getQueryString('buildId');
      that.buildName = decodeURI(that.$utils.getQueryString('buildName'));
      that.houseNumber = that.$utils.getQueryString('houseNumber');
      that.infoForm.buildId = that.buildId;

      that.selectFamily(that.buildId);
    },
    watch: {
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
      feeList: {
        handler: function (row) {
          const that = this;
          let m = 0;
          for (let i = 0; i < that.feeList.length; i++) {
            let map = that.feeList[i];
            if (map.feeValues && that.$utils.isPositiveInteger(parseInt(map.feeValues))) {
              m += parseInt(map.feeValues);
            }
          }
          that.payFeeTotalMoney = m;
        },
        deep: true
      },
      payRentList: {
        handler: function (row) {
          const that = this;
          let m = 0;
          for (let i = 0; i < that.payRentList.length; i++) {
            let map = that.payRentList[i];
            if (map.feeValues && that.$utils.isPositiveInteger(parseInt(map.feeValues))) {
              m += parseInt(map.feeValues);
            }

          }
          that.payRentTotalMoney = parseInt(that.rentTotalPay) + m;
        },
        deep: true
      },
      reduceList: {
        handler: function (row) {
          const that = this;
          let m = 0;
          for (let i = 0; i < that.reduceList.length; i++) {
            let map = that.reduceList[i];
            if (map.feePayValues && that.$utils.isPositiveInteger(parseInt(map.feePayValues)) && map.feePayDiscounts) {
              m += parseInt(map.feePayValues);
            }
          }
          that.outTotalMoney = that.allYa - m;
        },
        deep: true
      },
    },
    methods: {
      /**
       * 查询房屋状态
       **/
      selectFamily: function (id) {
        const that = this;
        let data = {
          buildId: id
        };
        that.$http.ajax('build/select', data, function (res) {
          let data = res.data;
          that.buildStatus = data.buildStatus;

          if (data.buildStatus == 4) {
            that.selectRent(id);
          }
          that.firstSelectRent();

          if (data.buildStatus == 3) {
            that.selectOrder(id);
          }

        }, function () {
          that.$router.push({path: '/login'});
        }, {needToken: true}, 'get');
      },
      /**
       * 查询租户信息
       **/
      selectRent: function (id) {
        const that = this;
        let data = {
          buildId: id
        };
        that.isEdit = true;
        that.isEdit2 = true;
        that.$http.ajax('admin/rent/select', data, function (res) {
          if (res.code == 0) {
            let data = res.data;
            that.infoForm = {
              buildId: data.buildId,
              rentStartTime: new Date(data.rentStartTime),
              rentEndTime: new Date(data.rentEndTime),
              rentTotalMonth: data.rentTotalMonth,
              rentPayRentalNum: parseInt(data.rentPayRentalNum),//付
              rentPayDepositNum: parseInt(data.rentPayDepositNum),//押
              rentContract: data.rentContract,//合同
              totalUser: data.rentTotalUser.toString(),//入住总人数
              rentTimeEnd: data.rentTimeEnd,
              startTime: data.rentStartTime,
              endTime: data.rentEndTime
            };

            that.rentPayDepositNum = parseInt(data.rentPayDepositNum);
            that.rentPayRentalNum = parseInt(data.rentPayRentalNum);
            let houseInfo = data.houseDO;

            that.paramForm = {
              time: houseInfo.houseModiTime,
              houseWater: houseInfo.houseWater,
              houseElectricity: houseInfo.houseElectricity,
              houseGas: houseInfo.houseGas,
              houseElectricityPer: houseInfo.houseElectricityPer,
              houseWaterPer: houseInfo.houseWaterPer,
              houseGasPer: houseInfo.houseGasPer
            };
            let userInfo = data.userInfo;
            let con = [];
            let contract = data.rentContract.split(',');
            for (let j = 0; j < contract.length; j++) {
              let map = contract[j];
              con.push(that.$http.qiniuUrl() + map);
            }
            that.infoForm.rentContractImg = con;

            let userNames = [];
            for (let i = 0; i < userInfo.length; i++) {
              userNames.push(userInfo[i].userName);
              userInfo[i].userIdImg = [];
              userInfo[i].userIdPic = userInfo[i].userIdPic.split(',');
              for (let j = 0; j < userInfo[i].userIdPic.length; j++) {
                userInfo[i].userIdImg[j] = that.$http.qiniuUrl() + userInfo[i].userIdPic[j];
              }
              userInfo[i].isEdit = true;
              that.userList[i] = userInfo[i];
            }

            that.userNames = userNames.join("，");

          } else {
            that.$message.error('msg:' + res.msg);
          }
        }, function () {
          that.$router.push({path: '/login'});
        }, {needToken: true}, 'get');
      },

      /**
       * 查询预约信息
       **/
      selectOrder: function (id) {
        const that = this;
        let data = {
          buildId: id
        };

        that.$http.ajax('build/order', data, function (res) {
          if (res.code == 0) {
            that.userList[0].userName = res.data.roomOrderUserName;
            that.userList[0].userPhone = res.data.roomOrderUserPhone;
          } else {
            that.$message.error('msg:' + res.msg);
          }
        }, function () {
          that.$router.push({path: '/login'});
        }, {needToken: true}, 'get');
      },
      /**
       * 增加支付方式
       **/
      addPayType: function () {
        const that = this;
        let li = {
          feePayTypes: 1,
          feePayValues: '',
        };
        that.payTypeList.push(li);
      },
      /**
       * 删除支付方式
       **/
      deletePayType: function (index) {
        this.payTypeList.splice(index, 1);
      },
      /**
       * 关闭弹出曾（设定租金、押金）
       **/
      closeDialog(row) {
        const that = this;
        that.delist = [{
          feeIds: '0',
          feeNames: '房屋押金',
          feeValues: '',
        }];
        that.payTypeList = [{
          feePayTypes: 1,
          feePayValues: '',
        }];
        that.payForm = {
          feeIds: '',
          feeNames: '月租金',
          feeValues: 2000,
        };

        that.feeNote = '';
        that.deleteFeeIds = [];
      },
      /**
       * 增加租金项目
       **/
      addPay: function () {
        const that = this;
        let li = {
          feeIds: '0',
          feeNames: '',
          feeValues: '',
        };
        that.deList.push(li);
      },
      /**
       * 减去租金项目
       **/
      closePay: function (index, item) {
        const that = this;
        this.deList.splice(index, 1);

        if (item) {
          if (item.feeIds != 0) {
            that.deleteFeeIds.push(item.feeIds);
          }
        }

      },
      closeReduce: function (index) {
        this.reduceList.splice(index, 1);
      },

      /**
       * 弹出层  租金+押金设定
       **/
      updateRentPay: function () {
        const that = this;
        that.selectRentFee();
        that.dialogVisible = true;

      },

      selectRentFee: function (type) {
        const that = this;
        let de = that.rentPayDepositNum;
        let pay = that.rentPayRentalNum;
        that.$http.ajax('admin/rent/fee', {
          buildId: that.buildId
        }, function (res) {
          if (res.code == 0) {
            that.feeNote = res.data.roomFeeNote;
            let de = [];
            let totalDe = 0, totalPay = 0;
            for (let i = 0; i < res.data.roomFeeList.length; i++) {
              let map = res.data.roomFeeList[i];

              if (map.roomFeeOrder == 0) {
                totalPay = pay * map.roomFeeValue;
                that.payForm.feeValues = map.roomFeeValue;
                that.payForm.feeIds = map.roomFeeId;
                that.payRentForm.feeValues = map.roomFeeValue;
                that.payRentForm.feeIds = map.roomFeeId;
              }

              if (map.roomFeeOrder == 1) {
                de.push({
                  feeIds: map.roomFeeId,
                  feeNames: map.roomFeeName,
                  feeValues: map.roomFeeValue
                });
              }

            }

            if (type == 1) {
              that.rentTotalPay = totalPay;
              that.payRentTotalMoney = totalPay;
            }

            if (type == 1) {
              that.deList = [{
                feeIds: '0',
                feeNames: '',
                feeValues: ''
              }]
            } else {
              that.deList = de;
            }

          } else {
            that.$message.error('msg:' + res.msg);
          }
        }, function () {
          that.$router.push({path: '/login'});
        }, {needToken: true}, 'get');


      },

      /**
       * -设定
       * */
      submitDialog: function () {
        const that = this;
        let data = {
          buildId: that.buildId
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
            if (that.buildStatus == 1) {
              that.firstSelectRent();
            }
          } else {
            that.payLoading = false;
            that.$message.error('msg:' + res.msg);
          }
        }, function () {
          that.$router.push({path: '/login'});
        },{needToken: true})
      },

      /**
       * -交租
       **/
      payRent: function () {
        const that = this;
        that.selectRentFee(1);
        that.payRentDialog = true;

      },
      closePayRentDialog: function () {
        const that = this;
        that.payRentList = [];
        that.payTypeList = [{
          feePayTypes: 1,
          feePayValues: '',
        }];
        that.payRentForm = {
          feeIds: '',
          feeNames: '租金',
          feeValues: '',
        };

        that.feeNote = '';
        that.payRentTotalMoney = 0;
      },
      addPayRent: function () {
        const that = this;
        let li = {
          feeIds: 0,
          feeNames: '',
          feeValues: '',
        };
        that.payRentList.push(li);
      },
      closePayRent: function (index) {
        const that = this;
        that.payRentList.splice(index, 1);
      },
      submitPayRent: function () {
        const that = this;
        let data = {
          buildId: that.buildId
        };
        let payForm = that.payForm;
        let payRentList = that.payRentList;
        let ptList = that.payTypeList;
//        if (!payForm.feeValues) {
//          that.$message.error('请输入月租金');
//          return false;
//        }

        for (let i = 0; i < payRentList.length; i++) {
          let map = payRentList[i];
          if (!map.feeNames || !map.feeValues) {
            that.$message.error('请完整填写缴费项目');
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
        if (that.payRentTotalMoney != ptTotal) {
          that.$message.error('实付金额想加应等于总金额');
          return false;
        }
        data.feeNote = that.feeNote;

        let feeIds = [], feeNames = [], feeValues = [],
          feePayTypes = [], feePayValues = [];

        for (let i = 0; i < payRentList.concat(payForm).length; i++) {

          let map = payRentList.concat(payForm)[i];
          feeIds.push(map.feeIds);
          feeNames.push(map.feeNames);
          feeValues.push(map.feeValues);
        }

        for (let i = 0; i < ptList.length; i++) {
          let map = ptList[i];
          feePayTypes.push(map.feePayTypes);
          feePayValues.push(map.feePayValues);
        }
        that.payLoading = true;

        data.feeIds = feeIds.toString();
        data.feeNames = feeNames.toString();
        data.feeValues = feeValues.toString();
        data.feePayTypes = feePayTypes.toString();
        data.feePayValues = feePayValues.toString();
        that.$http.ajax('admin/rent/pay_fee/rent', data, function (res) {
          if (res.code == 0) {
            that.payLoading = false;
            that.payRentDialog = false;
            that.$message({
              message: '交租成功！',
              type: 'success'
            });
          } else {
            that.payLoading = false;
            that.$message.error('msg:' + res.msg);
          }
        }, function () {
          that.$router.push({path: '/login'});
        },{needToken: true})
      },


      /**
       * -缴费
       **/
      payFee: function () {
        const that = this;
        that.payFeeDialog = true;
      },
      closePayFeeDialog: function () {
        const that = this;
        that.feeList = [{
          feeIds: '0',
          feeNames: '',
          feeValues: '',
        }];
        that.payTypeList = [{
          feePayTypes: 1,
          feePayValues: '',
        }];
        that.feeNote = '';
        that.payFeeTotalMoney = 0;
      },
      addPayFee: function () {
        const that = this;
        let li = {
          feeIds: '0',
          feeNames: '',
          feeValues: '',
        };
        that.feeList.push(li);
      },
      closePayFee: function (index) {
        const that = this;
        that.feeList.splice(index, 1);
      },
      submitPayFee: function () {
        const that = this;
        let data = {
          buildId: that.buildId
        };

        let feeList = that.feeList;
        let ptList = that.payTypeList;
        for (let i = 0; i < feeList.length; i++) {
          let map = feeList[i];
          if (!map.feeNames || !map.feeValues) {
            that.$message.error('请完整填写缴费项目');
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
        if (that.payFeeTotalMoney != ptTotal) {
          that.$message.error('实付金额想加应等于缴费总金额');
          return false;
        }
        data.feeNote = that.feeNote;

        let feeIds = [], feeNames = [], feeValues = [],
          feePayTypes = [], feePayValues = [];

        for (let i = 0; i < feeList.length; i++) {
          let map = feeList[i];
          feeIds.push(map.feeIds);
          feeNames.push(map.feeNames);
          feeValues.push(map.feeValues);
        }

        for (let i = 0; i < ptList.length; i++) {
          let map = ptList[i];
          feePayTypes.push(map.feePayTypes);
          feePayValues.push(map.feePayValues);
        }
        that.payLoading = true;

        data.feeIds = feeIds.toString();
        data.feeNames = feeNames.toString();
        data.feeValues = feeValues.toString();
        data.feePayTypes = feePayTypes.toString();
        data.feePayValues = feePayValues.toString();
        that.$http.ajax('admin/rent/pay_fee/other', data, function (res) {
          if (res.code == 0) {
            that.payLoading = false;
            that.payFeeDialog = false;
            that.$message({
              message: '缴费成功！',
              type: 'success'
            });
          } else {
            that.payLoading = false;
            that.$message.error('msg:' + res.msg);
          }
        }, function () {
          that.$router.push({path: '/login'});
        },{needToken: true})


      },


      /**
       *  -租房
       **/
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

      cardClick: function (item, index, indexImg) {
        const that = this;
//        console.log(item);
//        console.log(indexImg);
        item.splice(indexImg, 1);
        console.log(item);
        console.log(indexImg);
        console.log(that.userList)
//        console.log(index);
//        if (!that.userList[index].userIdPic.length) {
//          that.isEdit = false;
//          return false;
//        }
//        that.userList[index].userIdPic.splice(indexImg, 1);
//        console.log(that.userList[index].userIdPic);

//        item.userIdPic.splice(indexImg ,1);if(!item.userIdPic.length){isEdit = !isEdit}
      },

      numChange: function () {
        const that = this;
        let de = that.infoForm.rentPayDepositNum;
        let pay = that.infoForm.rentPayRentalNum;

        that.firstPayTotal = (pay + de) * that.roomFeeValue;
        that.firstPayFixed = (pay + de) * that.roomFeeValue;
      },
      firstSelectRent: function () {
        const that = this;
        let deNum = that.infoForm.rentPayDepositNum;
        let pay = that.infoForm.rentPayRentalNum;

        that.$http.ajax('admin/rent/fee', {
          buildId: that.buildId
        }, function (res) {
          if (res.code == 0) {
            that.feeNote = res.data.roomFeeNote;
            let de = [];
            let totalPay = 0;
            for (let i = 0; i < res.data.roomFeeList.length; i++) {
              let map = res.data.roomFeeList[i];

              if (map.roomFeeOrder == 0) {
                that.roomFeeValue = map.roomFeeValue;
                totalPay = (pay + deNum) * map.roomFeeValue;

                that.firstPayForm = {
                  feeIds: map.roomFeeId,
                  feeNames: map.roomFeeName,
                  feeValues: map.roomFeeValue,
                }
              }

              if (map.roomFeeOrder == 1) {
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

          } else {
            that.$message.error('msg:' + res.msg);
          }
        }, function () {
          that.$router.push({path: '/login'});
        }, {needToken: true}, 'get');
      },
      submitForm: function (item, name) {
        const that = this;
        let data = {};

        if (!item.rentTotalMonth) {
          that.$message.error('请选择租赁时长');
          return;
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

        data = {
          buildId: that.buildId,
          rentEndTime: that.$utils.formatDate(new Date(item.rentEndTime), 2),
          rentTotalMonth: item.rentTotalMonth,
          rentPayRentalNum: item.rentPayRentalNum,
          rentPayDepositNum: item.rentPayDepositNum,
          rentContract: item.rentContract.toString(),
          totalUser: item.totalUser
        };

        if (that.buildStatus == 4) {
          data.rentStartTime = that.$utils.formatDate(new Date(item.rentStartTime), 2)
        } else {
          data.rentStartTime = item.rentStartTime;
        }
        let userPhones = [], userIdPics = [], userIdNos = [], userSexs = [],
          userNames = [], userCompanyNames = [], userJobs = [], userNotes = [];
        for (let i = 0; i < that.userList.length; i++) {
          let map = that.userList[i];
          if (!map.userName || !map.userPhone || !map.userCompanyName || !map.userJob || !map.userIdNo || !map.userIdPic.length) {
            that.$message.error('入住人所有信息必填');
            return false;
          }
          if (map.userIdPic.length != 2) {
            that.$message.error('身份证照应传两张');
            return false;
          }
          userPhones.push(map.userPhone);
          userIdPics.push(map.userIdPic.toString());
          userIdNos.push(map.userIdNo);
          userSexs.push(map.userSex);
          userNames.push(map.userName);
          userCompanyNames.push(map.userCompanyName);
          userJobs.push(map.userJob);
          userNotes.push(map.userNote);
        }
        console.log(that.userList);
        data.userPhones = userPhones.toString();
        data.userIdPics = userIdPics.toString();
        data.userIdNos = userIdNos.toString();
        data.userSexs = userSexs.toString();
        data.userNames = userNames.toString();
        data.userCompanyNames = userCompanyNames.toString();
        data.userJobs = userJobs.toString();
        data.userNotes = userNotes.toString();

        if (that.buildStatus == 1) {
          let firstForm = that.firstPayForm;
          let deList = that.deList;
          let ptList = that.payTypeList;

          for (let i = 0; i < deList.length; i++) {
            let map = deList[i];
            if (!map.feeNames || !map.feeValues) {
              that.$message.error('请完整填写其他缴费项目');
              return false;
            }

            if (!that.$utils.isPositiveInteger(map.feeValues)) {
              that.$message.error('缴费金额应设定正整数！');
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
          if (that.firstPayTotal != ptTotal) {
            that.$message.error('实付金额相加应等于总金额');
            return false;
          }
          data.feeNote = that.feeNote;
          let feeIds = [], feeNames = [], feeValues = [],
            feePayTypes = [], feePayValues = [];
          for (let i = 0; i < deList.concat(firstForm).length; i++) {

            let map = deList.concat(firstForm)[i];
            feeIds.push(map.feeIds);
            feeNames.push(map.feeNames);
            feeValues.push(map.feeValues);
          }

          for (let i = 0; i < ptList.length; i++) {
            let map = ptList[i];
            feePayTypes.push(map.feePayTypes);
            feePayValues.push(map.feePayValues);
          }
          data.feeIds = feeIds.toString();
          data.feeNames = feeNames.toString();
          data.feeValues = feeValues.toString();
          data.feePayTypes = feePayTypes.toString();
          data.feePayValues = feePayValues.toString();
        }
        that.submitLoading = true;

        that.$http.ajax('admin/rent/insert', data, function (res) {
          if (res.code == 0) {
            that.$message({
              message: '操作成功！',
              type: 'success'
            });
            that.deList = [{
              feeIds: 0,
              feeNames: '',
              feePayValues: '',
            }];
            that.feeNote = '';
            that.submitLoading = false;
            that.buildStatus = 4;
            window.location.reload();
          } else {
            that.submitLoading = false;
            that.$message.error('msg:' + res.msg);
          }
        }, function () {
          that.$router.push({path: '/login'});
        },{needToken: true})
      },
      submitOtherForm: function (item) {
        const that = this;
        let data = {};

        if (!item.houseWater) {
          that.$message.error('请填写水表读数');
          return false;
        }
        if (!item.houseWaterPer) {
          that.$message.error('请填写水表单价');
          return false;
        }
        if (!item.houseWaterPer) {
          that.$message.error('请填写电表读数');
          return false;
        }
        if (!item.houseElectricityPer) {
          that.$message.error('请填写电表单价');
          return false;
        }
        if (!item.houseGas) {
          that.$message.error('请填写热水表读数');
          return false;
        }
        if (!item.houseGasPer) {
          that.$message.error('请填写热水表单价');
          return false;
        }

        data = {
          buildId: that.buildId,
          houseWater: item.houseWater,
          houseElectricity: item.houseElectricity,
          houseGas: item.houseGas,
          houseElectricityPer: item.houseElectricityPer,
          houseWaterPer: item.houseWaterPer,
          houseGasPer: item.houseGasPer
        };

        that.submitOtherLoading = true;
        that.$http.ajax('admin/rent/update', data, function (res) {
          if (res.code == 0) {
            that.$message({
              message: '保存成功！',
              type: 'success'
            });
            that.submitOtherLoading = false;
          } else {
            that.submitOtherLoading = false;
            that.$message.error('msg:' + res.msg);
          }
        }, function () {
          that.$router.push({path: '/login'});
        },{needToken: true})
      },
      addUser: function () {
        const that = this;
        let li = {
          userName: '',
          userPhone: '',
          userSex: '0',
          userCompanyName: '',
          userJob: '',
          userIdPic: [],
          userIdNo: '',
          userNote: ''
        };
        that.userList.push(li);
      },
      closeLi: function (index) {
        this.userList.splice(index, 1)
      },


      /**
       * 七牛
       * */
      clickUpload: function (index) {
        const that = this;
        that.index = index;
        console.log(index);
      },
      handleAvatarSuccess(res, file, fileList) {   //上传成功后在图片框显示图片
        const that = this;
//        this.fileList.push(res.key);
        that.userList[that.index].userIdPic.push(res.key);
        console.log(that.userList);
      },
      handleError(res, file, fileList) {   //显示错误
      },
      handelRemove(file, fileList) {
//        this.fileList = [];
        this.userList.splice(this.index, 1);
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

      /**
       * -退房
       */
      outRent: function () {
        const that = this;
        that.printData = [];
        console.log(that.infoForm);
        let infoForm = that.infoForm;
        let today = that.$utils.formatDate(new Date(), 2);
        let day = that.$utils.getDateDiff(infoForm.rentTimeEnd, today);
        that.refundRentDay = day;

        that.outDialog = true;
        that.$http.ajax('admin/rent/fee', {
          buildId: that.buildId
        }, function (res) {
          if (res.code == 0) {
            let outTotalMoney = 0;
            let de = [];
            let dayFee = 0;
            for (let i = 0; i < res.data.roomFeeList.length; i++) {
              let map = res.data.roomFeeList[i];
              if (map.roomFeeOrder == 0) {
                that.outTotalRentMoney = ((map.roomFeeValue / 30).toFixed(0) * day).toFixed(0);
                dayFee = (map.roomFeeValue / 30).toFixed(0);

                outTotalMoney += map.roomFeeValue;
                de.push({
                  feeIds: map.roomFeeId,
                  feeNames: '房屋押金',
                  feeValues: map.roomFeeValue
                });

              }
              if (map.roomFeeOrder == 1) {
                outTotalMoney += map.roomFeeValue;
                de.push({
                  feeIds: map.roomFeeId,
                  feeNames: map.roomFeeName,
                  feeValues: map.roomFeeValue
                });
              }
              that.outTotalMoney = outTotalMoney;
              that.allYa = outTotalMoney;
              that.outFeeList = de;

              that.printData.push({
                feeIds: 'feeId',
                feeNames: '应退房租',
                feeValues: that.outTotalRentMoney,
                dayFee: dayFee,
                day: day,
                feeType: true
              });
              that.printData = that.printData.concat(de);
            }
          } else {
            that.$message.error('msg:' + res.msg);
          }
        }, function () {
          that.$router.push({path: '/login'});
        }, {needToken: true}, 'get');
      },
      submitOut: function () {
        const that = this;
        let data = {
          buildId: that.buildId
        };
        let reduceList = that.reduceList;

        let reduceAll = 0;
        let feePayNames = [], feePayDiscounts = [], feePayValues = [], feeNotes = [];
        for (let i = 0; i < reduceList.length; i++) {
          let map = reduceList[i];
          if (!map.feePayNames || !map.feePayValues || !map.feeNotes) {
            that.$message.error('请完整填写扣款项');
            return false;
          }

          if (!that.$utils.isPositiveInteger(map.feePayValues)) {
            that.$message.error('扣款金额应为正整数');
            return false;
          }

          reduceAll += parseInt(map.feePayValues);

          map.discounts = map.feePayDiscounts ? 1 : 0;
          feePayNames.push(map.feePayNames);
          feePayDiscounts.push(map.discounts);
          feePayValues.push(map.feePayValues);
          feeNotes.push(map.feeNotes);
        }
        if (that.allYa < reduceAll) {
          that.$message.error('扣款金额总额应小于等于押金总额');
          return false;
        }
        if (reduceList.length) {
          data.feePayNames = feePayNames.toString();
          data.feePayValues = feePayValues.toString();
          data.feePayDiscounts = feePayDiscounts.toString();
          data.feeNotes = feeNotes.toString();
        }

        data.refundRentFee = that.outTotalRentMoney;

        data.actionNote = that.actionNote;
        data.refundSum = that.outTotalMoney;
        that.printTotal = parseInt(data.refundSum) + parseInt(data.refundRentFee);

        that.$confirm('您确认退房?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.payLoading = true;
          that.$http.ajax('admin/rent/delete', data, function (res) {
            that.payLoading = false;
            if (res.code == 0) {
              that.$message({
                message: '退房成功！',
                type: 'success'
              });

              let array = [];
              for (let i = 0; i < reduceList.length; i++) {
                let map = reduceList[i];
                if (map.feePayDiscounts == 1) {
                  array.push({
                    feeNames: map.feePayNames,
                    feeValues: map.feePayValues,
                    feeNotes: map.feeNotes
                  });
                }
              }
              that.printData = that.printData.concat(array);
              that.outDialog = false;
              that.printDialog = true;
            } else {
              that.$message.error('msg:' + res.msg);
            }
          }, function () {
            that.$router.push({path: '/login'});
          },{needToken: true})

        }).catch(() => {
        });
      },
      addReduce: function () {
        //新增扣款项
        const that = this;
        let li = {
          feePayNames: '',
          feePayValues: '',
          feeNotes: '',
          feePayDiscounts: false
        };
        that.reduceList.push(li);
      },
      closeOutDialog: function () {
        const that = this;
        that.delist = [{
          feeIds: '0',
          feeNames: '房屋押金',
          feeValues: '',
        }];
        that.payTypeList = [{
          feePayTypes: 1,
          feePayValues: '',
        }];
        that.payForm = {
          feeIds: '',
          feeNames: '月租金',
          feeValues: 2000,
        };

        that.feeNote = '';
      },

      //退房单
      closePrintDialog: function () {
        const that = this;
        that.delist = [{
          feeIds: '0',
          feeNames: '房屋押金',
          feeValues: '',
        }];
        that.payTypeList = [{
          feePayTypes: 1,
          feePayValues: '',
        }];
        that.payForm = {
          feeIds: '',
          feeNames: '月租金',
          feeValues: 2000,
        };

        that.feeNote = '';
        window.location.reload();
      },

      printAction: function () {
        const that = this;
        // that.$utils.doPrint();

      },
      /**
       * -换房
       */
      changeRoom: function () {
        const that = this;
        that.$router.push({
          path: '/index/changeRoom',
          query: {
            buildId: that.buildId
          }
        })
      },
    }
  }
</script>

<style lang="scss" scoped>
  @import "../style/userIn.scss";
</style>
