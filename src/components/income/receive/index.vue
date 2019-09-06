<template>
  <div class="order-page">
    <search-part @search="searchResult">
    </search-part>
    <el-table :data="dataList" v-loading="loadingData"
              :row-style="{cursor: 'pointer'}" @row-click="showDetail"
              border class="clearfix mt-20" ref="orderDetail">
      <el-table-column prop="customerName" label="甲方" min-width="200">
        <template slot-scope="scope">{{scope.row.customerName}}</template>
      </el-table-column>
      <el-table-column prop="accountCheckNo" label="结算方式" width="120">
        <template slot-scope="scope">{{closeTypes[scope.row.statementMode].label}}</template>
      </el-table-column>
      <el-table-column prop="unreturnedAmount" label="回款日期" width="120">
        <template slot-scope="scope">{{scope.row.backAmountTime | date}}</template>
      </el-table-column>
      <el-table-column prop="accountCheckNo" label="银行名称" min-width="150">
        <template slot-scope="scope">{{scope.row.bankName}}</template>
      </el-table-column>
    </el-table>

    <div class="text-center" v-show="(dataList.length || pager.currentPage !== 1) && !loadingData">
      <el-pagination :current-page="pager.currentPage" :page-size="pager.pageSize"
                     :page-sizes="[10,20,50,100]"
                     :total="pager.count" @current-change="handleCurrentChange"
                     @size-change="handleSizeChange"
                     layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>

    <page-right :css="defaultPageRight" :show="showIndex !== -1" @right-close="resetRightBox">
      <component :formItem="form" :index="showIndex" :orgType="orgType" :is="currentPart" @change="change"
                 @right-close="resetRightBox" :addType="addType"/>
    </page-right>

  </div>
</template>
<script>
  import utils from '@/tools/utils';
  import SearchPart from './search';
  import addForm from './form/add-form.vue';
  import CommonMixin from '@/mixins/commonMixin';
  import {receiveTask} from '@/resources';
  import Detail from './detail.vue';

  export default {
    components: {
      SearchPart
    },
    mixins: [CommonMixin],
    data() {
      return {
        filters: {
          accountCheckType: '0'
        },
        dialogComponents: {
          0: addForm,
          1: Detail
        },
        orgType: {
          0: {'title': '待审核', 'num': 0, 'accountCheckType': '0'},
          1: {'title': '待开票', 'num': 0, 'accountCheckType': '1'},
          2: {'title': '待回款', 'num': 0, 'accountCheckType': '2'},
          3: {'title': '已回款', 'num': 0, 'accountCheckType': '3'},
          4: {'title': '审核未通过', 'num': 0, 'accountCheckType': '9'},
        },
        defaultPageRight: {'width': '920px', 'padding': 0},
        billItems: [],
        addType: -1
      };
    },
    watch: {
      filters: {
        handler: function (val) {
          this.queryList(1);
        },
        deep: true
      }
    },
    computed: {
      closeTypes() {
        return this.$store.state.closeTypes;
      }
    },
    mounted() {
      this.$store.state.costTypes.forEach(i => {
        this.billItems.push(...i.items);
      });
      this.queryList(1);
    },
    methods: {
      editItem(item) {
        item.realityBillingTotal = utils.autoformatDecimalPoint(item.realityBillingTotal);
        this.$httpRequestOpera(receiveTask.update(item), {
          errorTitle: '修改失败',
          success: res => {
            this.$notify.success({message: '修改成功'});
          },
          error: () => {
          }
        });
      },
      changeType(item, key) {
        this.filters.accountCheckType = item.accountCheckType;
      },
      isShowIcon(item, key, activeStatus) {
        return item.accountCheckType === activeStatus;
      },
      formatClass(item, key, activeStatus) {
        return {
          'active': item.accountCheckType === activeStatus
        };
      },
      showRecordDate: function (data) {
        if (!data) return '';
        return data ? this.$moment(data).format('YYYY-MM-DD HH:mm:ss') : '';
      },
      searchResult: function (search) {
        this.filters = Object.assign({}, this.filters, search);
      },
      resetRightBox() {
        this.defaultPageRight.width = '920px';
        this.showIndex = -1;
        this.currentItemId = '';
        this.currentItem = {};
        this.addType = -1;
      },
      showPart(index) {
        this.currentPart = this.dialogComponents[index];
        this.$nextTick(() => {
          this.showIndex = index;
        });
      },
      showDetail(item) {
        this.currentItem = item;
        this.currentItemId = item.billingModelId;
        this.defaultPageRight.width = '800px';
        this.form = item;
        this.showPart(1);
      },
      queryList(pageNo) {
        this.selectList = [];
        const http = receiveTask.query;
        const params = this.queryUtil(http, pageNo);
        // this.queryStatusNum(params);
      },
      queryStatusNum: function (params) {
        receiveTask.queryStateNum(params).then(res => {
          let data = res.data.data;
          this.orgType[0].num = data['checkPending'];
          this.orgType[1].num = data['checkMakeInvoice'];
          this.orgType[2].num = data['checkReturnMoney'];
          this.orgType[3].num = data['alreadyReturnMoney'];
          this.orgType[4].num = data['noPassNum'];
        });
      },
      add() {
        this.form = {};
        this.showPart(0);
      },
      edit(item, addType) {
        this.currentItem = item;
        this.currentItemId = item.billingModelId;
        this.form = item;
        this.defaultPageRight.width = '600px';
        this.addType = addType;
        this.showPart(0);
      },
      change() {
        this.resetRightBox();
        this.queryList(this.pager.currentPage);
      }
    }
  };
</script>
