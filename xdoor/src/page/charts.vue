<template>
  <section>

    <el-row>
      <el-col :span="24">

        <el-table
          v-loading="loading"
          ref="multipleTable"
          :data="resData"
          highlightCurrentRow
          border
          style="width: 100%"
          size="small">

          <el-table-column
            prop="feePayType"
            label="类别"
            width="180"
            align="center">
            <template slot-scope="scope">
              <p v-if="scope.row.feePayType == 1">刷卡</p>
              <p v-if="scope.row.feePayType == 2">现金</p>
              <p v-if="scope.row.feePayType == 3">其他</p>
              <p v-if="scope.row.feePayType != 1 && scope.row.feePayType != 2 &&scope.row.feePayType != 3 ">其他</p>
            </template>
          </el-table-column>

          <el-table-column
            label="金额"
            width="240"
            show-overflow-tooltip
            align="center">
            <template slot-scope="scope">
              <p v-if="scope.row.feePayTowards == 1" style="color: #58D68D">+{{scope.row.feePayValue}}</p>
              <p v-if="scope.row.feePayTowards == -1" style="color: #EC7063">-{{scope.row.feePayValue}}</p>
            </template>
          </el-table-column>

          <el-table-column
            label="状态"
            width="180"
            align="center">
            <template slot-scope="scope">
              <p v-if="scope.row.feePayStatus == 1" style="color: #F5B041">待确认</p>
              <p v-if="scope.row.feePayStatus == 3">已确认</p>
            </template>
          </el-table-column>


          <el-table-column label="操作" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" :loading="submitLoading" v-if="scope.row.feePayStatus == 1"
                         @click.stop="ensure(scope.row)">确定
              </el-button>
            </template>
          </el-table-column>

        </el-table>
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
      <!-- 出租率折线图 -->
      <el-col :span="12">
        <div class="grid-content">
          <x-chart id="rentCharts" class="high" :option="rentOption"></x-chart>
        </div>
      </el-col>

      <!-- 退房率折线图 -->
      <el-col :span="12">
        <div class="grid-content">
          <x-chart id="outRentCharts" class="high" :option="outRentOption"></x-chart>
        </div>
      </el-col>

    </el-row>

    <el-row>
      <!-- 营业柱状报表 -->
      <el-col :span="12">
        <div class="grid-content">
          <x-chart id="incomeCharts1" class="high" :option="incomeOption1"></x-chart>
        </div>
      </el-col>

      <el-col :span="12">
        <div class="grid-content">
          <x-chart id="incomeCharts2" class="high" :option="incomeOption2"></x-chart>
        </div>
      </el-col>

    </el-row>

    <el-row>
      <!-- 住户租住时长对比 -->
      <el-col :span="12">
        <div class="grid-content">
          <x-chart id="rentTimeCharts" class="high" :option="rentTimeOption"></x-chart>
        </div>
      </el-col>

      <!-- 住户画像 -->
      <el-col :span="12">
        <div class="grid-content">
          <x-chart id="renterCharts" class="high" :option="renterOption"></x-chart>
        </div>
      </el-col>

    </el-row>

  </section>
</template>

<script>
  import XChart from '../components/charts.vue'

  export default {
    components: {
      XChart
    },
    data() {
      return {
        rentOption: {},
        outRentOption: {},
        incomeOption1: {},
        incomeOption2: {},
        rentTimeOption: {},
        renterOption: {},

        loading: true,
        submitLoading: false,
        resData: [],
        size: 5,
        current: 1,
        total: 0,
      }
    },
    created() {
      const that = this;
      that.selectDaily();
    },
    mounted: function () {
      const that = this;
      that.rentCharts();
      that.outRentCharts();
      that.incomeCharts();
      that.rentTimeCharts();
      that.renterCharts();
    },
    methods: {
      /**
       * 查询日审
       */
      selectDaily() {
        const that = this;
        that.loading = true;
        let data = {
          current: that.current,
          size: that.size
        };
        that.$http.ajax('admin/audit/list/page', data, function (res) {
          that.loading = false;

          if (res.code == 0) {
            that.total = res.data.rowCount;

            // for (let i = 0; i < res.data.data.length; i++) {
            //   let map = res.data.data[i];
            //   room.push({
            //     buildId: map.buildId,
            //     buildName: map.dongName + map.floorName + map.buildName,
            //   })
            // }
            that.resData = res.data.data;
            that.loading = false;
          } else {
            that.$message.error('msg:' + res.msg);
          }
        }, function () {
            that.$router.push({path: '/login'});
        }, {needToken: true}, 'get')
      },
      ensure: function (item) {
        const that = this;
        that.submitLoading = true;
        let data = {
          payRecordId: item.feePayId
        };
        that.$http.ajax('admin/audit/ensure', data, function (res) {

          if (res.code == 0) {
            that.$message({
              message: '操作成功！',
              type: 'success'
            });
            that.selectDaily();
            that.submitLoading = false;
          } else {
            that.submitLoading = false;
            that.$message.error('msg:' + res.msg);
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
        this.selectDaily();
      },
      /**
       * 出租率折线图
       */
      rentCharts: function () {
        const that = this;
        let data = [];
        that.$http.ajax('admin/statistics/build_status', {}, function (res) {
          if (res.code == 0) {

            for (let i = 0; i < res.data.length; i++) {
              let map = res.data[i];
              if (map.orderRate || map.rentRate) {
                data.push(parseFloat((parseFloat(map.orderRate) + parseFloat(map.rentRate)).toFixed(2)));
              } else {
                data.push(0);
              }

            }
            that.rentOption = {
              chart: {
                type: 'line'
              },
              title: {
                text: '出租率折线图'
              },
              subtitle: {text: ''},

              scrollbar: {
                enabled: true
              },

              xAxis: {
                categories: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
              },
              yAxis: {
                title: {
                  text: '出租率（%）'
                },
                min: 0,
                max: 100
              },
              colors: ['#4CAF50'],
              tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                  '<td style="padding:0"><b>{point.y:.2f} %</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
              },

              plotOptions: {
                line: {
                  dataLabels: {
                    enabled: true
                  },
                  enableMouseTracking: true
                }
              },

              series: [{
                name: '出租率',
                data: data
              }],

              responsive: {
                rules: [{
                  condition: {
                    maxWidth: 500
                  },
                  chartOptions: {
                    legend: {
                      layout: 'horizontal',
                      align: 'center',
                      verticalAlign: 'bottom'
                    }
                  }
                }]
              }

            }

          } else {
            that.$message.error('msg:' + res.msg);
          }
        }, function (e) {
          if (e == 'no') {
            that.$router.push({path: '/login'});
          }
        }, {needToken: true}, 'get');

      },
      /**
       * 退房率折线图
       */
      outRentCharts: function () {
        const that = this;
        that.outRentOption = {
          chart: {
            type: 'line'
          },
          title: {
            text: '退房率折线图'
          },
          subtitle: {text: ''},

          scrollbar: {
            enabled: true
          },

          xAxis: {
            categories: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
          },
          yAxis: {
            title: {
              text: '退房率（%）'
            },
            min: 0,
            max: 100
          },
          tooltip: {
            headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
              '<td style="padding:0"><b>{point.y:.2f} %</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
          },

          colors: ['#F44336'],
          plotOptions: {
            line: {
              dataLabels: {
                enabled: true
              },
              enableMouseTracking: true
            }
          },

          series: [{
            name: '退房率',
            data: [1, 4, 6, 7, 6, 3, 11, 7, 8, 0, 0, 2]
          }],

          responsive: {
            rules: [{
              condition: {
                maxWidth: 500
              },
              chartOptions: {
                legend: {
                  layout: 'horizontal',
                  align: 'center',
                  verticalAlign: 'bottom'
                }
              }
            }]
          }

        }
      },
      /**
       * 营业额柱状
       */
      incomeCharts: function () {
        const that = this;
        let rentFee1 = [], otherFee1 = [], refund1 = [];

        that.$http.ajax('admin/statistics/week_money', {}, function (res) {
          console.log(res);

          if (res.code == 0) {
            for (let i = 0; i < res.data.length; i++) {
              let map = res.data[i];
              if (map.name == 'rentFee') {
                rentFee1.push(map.value)
              }
              if (map.name == 'otherFee') {
                otherFee1.push(map.value)
              }
              if (map.name == 'refund') {
                refund1.push(map.value)
              }
            }

            that.incomeOption1 = {
              chart: {
                type: 'column'
              },
              title: {
                text: '本周营业额柱状图'
              },
              subtitle: {text: ''},
              xAxis: {
                categories: [
                  that.$utils.getWeek(0),
                  that.$utils.getWeek(1),
                  that.$utils.getWeek(2),
                  that.$utils.getWeek(3),
                  that.$utils.getWeek(4),
                  that.$utils.getWeek(5),
                  that.$utils.getWeek(6)],
                crosshair: true
              },
              yAxis: {
                min: 0,
                title: {
                  text: '金额 (元)'
                }
              },
              colors: ['#5DADE2', '#F7DC6F', '#F5B7B1'],
              tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                  '<td style="padding:0"><b>{point.y:.1f} 元</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
              },
              plotOptions: {
                column: {
                  pointPadding: 0.2,
                  borderWidth: 0
                }
              },
              series: [{
                name: '房租',
                data: rentFee1
              }, {
                name: '维修',
                data: otherFee1
              }, {
                name: '其他',
                data: refund1
              }]
            };
          } else {
            that.$message.error('msg:' + res.msg);
          }
        }, function () {
          that.$router.push({path: '/login'});

        }, {needToken: true}, 'get');


        let rentFee2 = [], otherFee2 = [], refund2 = [];
        that.$http.ajax('admin/statistics/month_money', {}, function (res) {
          console.log(res);

          if (res.code == 0) {
            for (let i = 0; i < res.data.length; i++) {
              let map = res.data[i];
              if (map.name == 'rentFee') {
                rentFee2.push(map.value)
              }
              if (map.name == 'otherFee') {
                otherFee2.push(map.value)
              }
              if (map.name == 'refund') {
                refund2.push(map.value)
              }
            }

            that.incomeOption2 = {
              chart: {
                type: 'column'
              },
              title: {
                text: new Date().getFullYear() + '年营业额柱状图'
              },
              subtitle: {text: ''},
              xAxis: {
                categories: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
                crosshair: true
              },
              colors: ['#3F51B5', '#F57C00', '#455A64'],
              yAxis: {
                min: 0,
                title: {
                  text: '金额 (元)'
                }
              },
              tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                  '<td style="padding:0"><b>{point.y:.1f} 元</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
              },
              plotOptions: {
                column: {
                  pointPadding: 0.2,
                  borderWidth: 0
                }
              },
              series: [{
                name: '房租',
                data: rentFee2
              }, {
                name: '维修',
                data: otherFee2
              }, {
                name: '其他',
                data: refund2

              }]
            };
          } else {
            that.$message.error('msg:' + res.msg);
          }
        }, function () {
          that.$router.push({path: '/login'});
        }, {needToken: true}, 'get');


      },

      /**
       * 住户租住时长对比
       */
      rentTimeCharts: function () {
        const that = this;
        let data = [];
        that.$http.ajax('admin/statistics/rent_time', {}, function (res) {
          console.log(res);
          if (res.code == 0) {

            for (let i = 0; i < res.data.length; i++) {
              let map = res.data[i];
              if (map.name == 'oneQuartor') {
                data.push(parseInt((map.rate * 100).toFixed(0)));
              }
              if (map.name == 'twoQuartor') {
                data.push(parseInt((map.rate * 100).toFixed(0)));
              }
              if (map.name == 'oneYear') {
                data.push(parseInt((map.rate * 100).toFixed(0)));
              }
              if (map.name == 'twoYear') {
                data.push(parseInt((map.rate * 100).toFixed(0)));
              }
            }

            that.rentTimeOption = {
              chart: {type: 'bar'},
              title: {text: '住户租房时长对比'},
              subtitle: {text: ''},
              xAxis: {
                categories: ['季度期', '半年期', '一年期', '两年年期']
              },
              yAxis: {
                min: 0,
                max: 100,
                title: {
                  text: '',
                  align: ''
                },
                labels: {
                  overflow: 'justify'
                }
              },
              tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                  '<td style="padding:0"><b>{point.y:.1f} %</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true,
                valueSuffix: ' %'
              },
              colors: ['#7C4DFF', '#FF9800', '#009688', '#795548'],
              plotOptions: {
                bar: {
                  dataLabels: {
                    enabled: true
                  },
                }
              },
              legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'top',
                x: -40,
                y: 80,
                floating: true,
                borderWidth: 1,
                backgroundColor: '#ffffff',
                shadow: true
              },
              credits: {
                enabled: false
              },
              series: [
                {
                  name: '住户百分比',
                  data: data
                }
//            {
//              name: '季度期',
//              data: [2, 0, 0, 0]
//            },
//            {
//              name: '半年期',
//              data: [0,10,0,0]
//            },
//            {
//              name: '一年期',
//              data: [0,0,70,0]
//            },
//            {
//              name: '两年期',
//              data: [0,0,0,18]
//            }
              ]
            };
          } else {
            that.$message.error('msg:' + res.msg);
          }
        }, function () {
            that.$router.push({path: '/login'});
        }, {needToken: true}, 'get');


      },

      /**
       * 住户画像
       */
      renterCharts: function () {
        const that = this;
        let array = [];
        let total = 0;
        that.$http.ajax('admin/statistics/sex', {}, function (res) {
          if (res.code == 0) {

            for (let i = 0; i < res.data.length; i++) {
              let map = res.data[i];
              total += map.count;
            }
            array.push({
              name: '男',
              y: parseInt(((res.data[0].count / total) * 100).toFixed(0))
            }, {
              name: '女',
              y: parseInt(((res.data[1].count / total) * 100).toFixed(0))
            });

            console.log(array);
            that.renterOption = {
              chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
              },
              title: {
                text: '住户画像'
              },
              tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
              },
              colors: ['#2196F3', '#FF4081'],
              plotOptions: {
                pie: {
                  allowPointSelect: true,
                  cursor: 'pointer',
                  dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                      color: 'black'
                    },
                    connectorColor: 'silver'
                  }
                }
              },
              series: [{
                name: '占比',
                data: array
              }]
            }

          } else {
            that.$message.error('msg:' + res.msg);
          }
        }, function () {
            that.$router.push({path: '/login'});
        }, {needToken: true}, 'get');

      },


    }
  }
</script>

<style lang="scss" scoped>
  @import "../style/charts.scss";
</style>
