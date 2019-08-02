<template>
  <div class="order-page">
    <search-part @search="searchResult">
      <template slot="btn">
        <el-button @click="add" plain size="small" v-has="''">
          <f-a class="icon-small" name="plus"></f-a>
          添加
        </el-button>
        <el-button @click="batchCreate" plain size="small" v-has="''" v-show="filters.attachmentType === '0'">
          <f-a class="icon-small" name="allot"></f-a>
          批量生成对账单
        </el-button>
        <el-button @click="batchCreateCloseAccount" plain size="small" v-has="''"
                   v-show="filters.attachmentType === '1'">
          <f-a class="icon-small" name="allot"></f-a>
          批量生成结算单
        </el-button>
      </template>
    </search-part>
    <status-list :activeStatus="filters.attachmentType" :statusList="orgType"
                 :checkStatus="changeType" :isShowNum="true" :isShowIcon="isShowIcon"
                 :formatClass="formatClass"></status-list>
    <el-table :data="dataList" @selection-change="selectionChange" v-loading="loadingData"
              border class="clearfix mt-20" ref="orderDetail">
      <el-table-column
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column prop="contractName" label="合同" width="100">
        <template slot-scope="scope">{{scope.row.contractName}}</template>
      </el-table-column>
      <el-table-column prop="customerName" label="甲方" width="140">
        <template slot-scope="scope">{{scope.row.customerName}}</template>
      </el-table-column>
      <el-table-column prop="actionType" label="项目" width="140">
        <template slot-scope="scope">{{scope.row.projectName}}</template>
      </el-table-column>
      <el-table-column prop="actionType" label="订单号" width="140">
        <template slot-scope="scope">{{scope.row.orderNumber}}</template>
      </el-table-column>
      <el-table-column prop="actionType" label="对账单号" width="150">
        <template slot-scope="scope">{{scope.row.accountingRecordNo}}</template>
      </el-table-column>
      <el-table-column prop="actionType" label="货品" width="200">
        <template slot-scope="scope">
          {{scope.row.orgGoodsName}}
          <div>规格：{{scope.row.goodsSpecification}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="batchNumber" label="批号" width="120">
        <template slot-scope="scope">{{scope.row.batchNumber}}</template>
      </el-table-column>
      <el-table-column prop="billingItemName" label="计费项" width="200">
        <template slot-scope="scope">{{formatBillingItemName(scope.row)}}</template>
      </el-table-column>
      <el-table-column prop="billingUntilPrice" label="单价" width="150px">
        <template slot-scope="scope">{{scope.row.billingUntilPrice}}</template>
      </el-table-column>
      <el-table-column prop="billingQuantity" label="数量">
        <template slot-scope="scope">{{scope.row.billingQuantity}}</template>
      </el-table-column>
      <el-table-column prop="unreturnedAmount" label="待回款金额" width="120">
        <template slot-scope="scope">{{scope.row.unreturnedAmount}}</template>
      </el-table-column>
      <el-table-column prop="unliquidatedAmount" label="未结算金额" width="120">
        <template slot-scope="scope">{{scope.row.unliquidatedAmount}}</template>
      </el-table-column>
      <el-table-column prop="billingTotal" label="计费合计">
        <template slot-scope="scope">{{scope.row.billingTotal}}</template>
      </el-table-column>
      <el-table-column prop="realityBillingTotal" width="120px" label="实际计费合计"
                       :fixed="filters.attachmentType === '0' ? 'right' : false">
        <template slot-scope="scope">
          <oms-input v-if="scope.row.attachmentType === '0'" v-model="scope.row.realityBillingTotal"
                     @blur="editItem(scope.row)"/>
          <span v-else>{{scope.row.realityBillingTotal}}</span>
        </template>
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
      <component :formItem="form" :data="dySelectList" :index="showIndex" :statusType="statusType" :is="currentPart" @change="change"
                 @right-close="resetRightBox" :formatBillingItemName="formatBillingItemName"/>
    </page-right>

  </div>
</template>
<script>
  import utils from '@/tools/utils';
  import SearchPart from './search';
  import addForm from './form/add-form.vue';
  import CommonMixin from '@/mixins/commonMixin';
  import {accountBill, contractAccountDetail} from '@/resources';
  import Detail from './detail.vue';
  import CloseAccount from './closeAccount';

  export default {
    components: {
      SearchPart,
      CloseAccount
    },
    mixins: [CommonMixin],
    data() {
      return {
        statusType: JSON.parse(JSON.stringify(utils.orderType)),
        filters: {
          attachmentType: '0'
        },
        dialogComponents: {
          0: addForm,
          1: Detail,
          2: CloseAccount
        },
        orgType: {
          0: {'title': '未对账', 'num': 0, 'attachmentType': '0'},
          1: {'title': '已对账', 'num': 0, 'attachmentType': '1'},
          2: {'title': '已回款', 'num': 0, 'attachmentType': '2'},
        },
        defaultPageRight: {'width': '920px', 'padding': 0},
        selectList: [],
        dySelectList: []
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
    mounted() {
      this.queryList(1);
    },
    methods: {
      selectionChange(val) {
        this.selectList = val;
      },
      batchCreate() {
        if (!this.selectList.length) return this.$notify.info({message: '请选择计费明细'});
        this.$confirmOpera('是否批量生成勾选的计费明细的对账单', () => {
          this.$httpRequestOpera(accountBill.batchCreateBill(this.selectList.map(m => m.billingOfAccountId)), {
            successTitle: '生成成功',
            errorTitle: '生成失败',
            success: (res) => {
              this.queryList(this.pager.currentPage);
            }
          });
        });
      },
      batchCreateCloseAccount() {
        if (!this.selectList.length) return this.$notify.info({message: '请选择计费明细'});
        let list = JSON.parse(JSON.stringify(this.selectList));
        list.forEach(i => i.statementAmount = i.unliquidatedAmount);
        this.dySelectList = list;
        this.showPart(2);
      },
      formatBillingItemName(item) {
        let bill = this.$store.state.billItemList.find(f => f.id === item.billingItemName);
        if (!bill) return;
        return bill.name;
      },
      editItem(item) {
        item.realityBillingTotal = utils.autoformatDecimalPoint(item.realityBillingTotal);
        this.$httpRequestOpera(contractAccountDetail.update(item), {
          errorTitle: '修改失败',
          success: res => {
            this.$notify.success({message: '修改成功'});
          },
          error: () => {
          }
        });
      },
      changeType(item, key) {
        this.filters.attachmentType = item.attachmentType;
      },
      isShowIcon(item, key, activeStatus) {
        return item.attachmentType === activeStatus;
      },
      formatClass(item, key, activeStatus) {
        return {
          'active': item.attachmentType === activeStatus
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
        this.dySelectList = [];
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
        this.defaultPageRight.width = '900px';
        this.form = item;
        this.showPart(1);
      },
      queryList(pageNo) {
        this.selectList = [];
        const http = contractAccountDetail.query;
        const params = this.queryUtil(http, pageNo);
        this.queryStatusNum(params);
      },
      queryStatusNum: function (params) {
        contractAccountDetail.queryStateNum(params).then(res => {
          let data = res.data.data;
          this.orgType[0].num = data['nonAccountCheck'];
          this.orgType[1].num = data['nonReturnMoneyNum'];
          this.orgType[2].num = data['allReturnMoneyNum'];
        });
      },
      add() {
        this.form = {};
        this.showPart(0);
      },
      edit(item) {
        this.currentItem = item;
        this.currentItemId = item.billingModelId;
        this.form = item;
        this.showPart(0);
      },
      change() {
        this.resetRightBox();
        this.queryList(this.pager.currentPage);
      }
    }
  };
</script>
