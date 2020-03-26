<style lang="scss">
  .total-info {
    align-items: flex-end;
    position: absolute;
    right: 20px;

    &__item {
      margin: 0 10px;
      font-weight: 500;
    }
  }
</style>
<template>
  <div class="order-page">
    <search-part @search="searchResult" ref="searchPart">
      <template slot="btn">
        <el-button @click="add" plain size="small" v-has="'add-billing-of-account'">
          <f-a class="icon-small" name="plus"></f-a>
          添加
        </el-button>
        <el-button @click="batchCreate" plain size="small" v-has="'create-account-check'"
                   v-show="filters.attachmentType === '0'">
          <f-a class="icon-small" name="allot"></f-a>
          批量生成对账单
        </el-button>
        <el-button @click="batchCreateCloseAccount" plain size="small" v-has="'race-blending'"
                   v-show="filters.attachmentType === '2'">
          <f-a class="icon-small" name="allot"></f-a>
          批量生成结算单
        </el-button>

        <el-button @click="batchInsertCloseAccount" plain size="small" v-has="'add-statement'"
                   v-show="filters.attachmentType === '2'">
          <f-a class="icon-small" name="allot"></f-a>
          添加到已有结算单
        </el-button>

        <el-button @click="createCloseAccount" plain size="small"
                   v-show="filters.attachmentType === '2'" v-has="'add-statement-estimated-amount'">
          <f-a class="icon-small" name="allot"></f-a>
          按结算金额生成结算单
        </el-button>

        <el-button @click="exportExcel" plain size="small">
          <f-a class="icon-small" name="export"></f-a>
          导出Excel
        </el-button>

        <el-button @click="exportCloseAccount" plain size="small"
                   v-show="filters.attachmentType === '2'" v-has="'export-unbilled-info'">
          <f-a class="icon-small" name="export"></f-a>
          导出未开票明细报表
        </el-button>
      </template>
    </search-part>
    <status-list :activeStatus="filters.attachmentType" :statusList="orgType"
                 :checkStatus="changeType" :isShowNum="true" :isShowIcon="isShowIcon"
                 :formatClass="formatClass">
      <span class="total-info" v-if="totalInfo">
        <span class="total-info__item">数量小计：{{totalInfo.billingQuantity}}</span>
        <span class="total-info__item">计费小计：{{totalInfo.billingTotal | formatMoney}}</span>
        <span class="total-info__item">实际计费小计：{{totalInfo.realityBillingTotal | formatMoney}}</span>
      </span>
    </status-list>
    <el-table :data="dataList" v-loading="loadingData" row-key="billingOfAccountId"
              border class="clearfix mt-20" ref="table" @cell-click="cellClick" @selection-change="selectionChange">
      <el-table-column type="selection" width="55" reserve-selection :selectable="selectable">
      </el-table-column>
      <el-table-column prop="contractName" label="合同" width="150">
        <template slot-scope="scope">{{scope.row.contractName}}</template>
      </el-table-column>
      <el-table-column prop="customerName" label="甲方" width="140">
        <template slot-scope="scope">{{scope.row.customerName}}</template>
      </el-table-column>
      <el-table-column prop="actionType" label="项目" width="140">
        <template slot-scope="scope">{{scope.row.projectName}}</template>
      </el-table-column>
      <el-table-column prop="billingTime" label="创建时间" width="160">
        <template slot-scope="scope">{{scope.row.billingTime | time}}</template>
      </el-table-column>
      <el-table-column prop="actionType" label="订单号" width="140">
        <template slot-scope="scope">{{scope.row.orderNumber}}</template>
      </el-table-column>
      <el-table-column prop="actionType" label="对账单号" width="150">
        <template slot-scope="scope">{{scope.row.accountCheckNo}}</template>
      </el-table-column>
      <el-table-column prop="actionType" label="货品" width="300">
        <template slot-scope="scope">
          {{scope.row.orgGoodsName}}
          <div v-show="scope.row.goodsSpecification">规格：{{scope.row.goodsSpecification}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="batchNumber" label="批号" width="120">
        <template slot-scope="scope">{{scope.row.batchNumber}}</template>
      </el-table-column>
      <el-table-column prop="billingItemName" label="计费项" width="200">
        <template slot-scope="scope">{{formatBillingItemName(scope.row)}}</template>
      </el-table-column>
      <el-table-column prop="billingCustomName" label="计费项名称" width="200">
        <template slot-scope="scope">{{scope.row.billingCustomName}}</template>
      </el-table-column>
      <el-table-column prop="billingUntilPrice" label="单价" width="150px">
        <template slot-scope="scope">{{scope.row.billingUntilPrice}}</template>
      </el-table-column>
      <el-table-column prop="billingQuantity" label="数量">
        <template slot-scope="scope">{{scope.row.billingQuantity}}</template>
      </el-table-column>
      <el-table-column prop="unreturnedAmount" label="待回款金额" width="120" fixed="right">
        <template slot-scope="scope">{{scope.row.unreturnedAmount | formatMoney}}</template>
      </el-table-column>
      <el-table-column prop="unliquidatedAmount" label="未结算金额" width="120" fixed="right">
        <template slot-scope="scope">{{scope.row.unliquidatedAmount | formatMoney}}</template>
      </el-table-column>
      <el-table-column prop="billingTotal" label="计费合计" fixed="right" width="120">
        <template slot-scope="scope">{{scope.row.billingTotal | formatMoney}}</template>
      </el-table-column>
      <el-table-column prop="realityBillingTotal" width="120px" label="实际计费合计"
                       fixed="right">
        <template slot-scope="scope">
          <div v-if="$_has('edit-billing-of-account')">
            <oms-input v-if="scope.row.attachmentType === '0'" v-model="scope.row.realityBillingTotal"
                       @blur="editItem(scope.row)"/>
            <span v-else>{{scope.row.realityBillingTotal}}</span>
          </div>
          <span v-else>{{scope.row.realityBillingTotal}}</span>
        </template>
      </el-table-column>
    </el-table>

    <div class="text-center" v-show="(dataList.length || pager.currentPage !== 1) && !loadingData">
      <el-pagination :current-page="pager.currentPage" :page-size="pager.pageSize"
                     :page-sizes="[10,20,50,100, 100000]"
                     :total="pager.count" @current-change="handleCurrentChange"
                     @size-change="handleSizeChange"
                     layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </div>

    <page-right :css="defaultPageRight" :show="showIndex !== -1" @right-close="resetRightBox">
      <component :formItem="form" :data="dySelectList" :index="showIndex" :statusType="statusType" :is="currentPart"
                 @change="change"
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
  import batchInsertCloseAccount from './batchInsertCloseAccount';
  import createForm from './form/create-form';

  export default {
    components: {
      SearchPart,
      CloseAccount,
      batchInsertCloseAccount,
      createForm
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
          2: CloseAccount,
          3: batchInsertCloseAccount,
          4: createForm
        },
        orgType: {
          0: {'title': '全部', 'num': 0, 'attachmentType': '', isAll: true},
          1: {'title': '未对账', 'num': 0, 'attachmentType': '0'},
          2: {'title': '对账中', 'num': 0, 'attachmentType': '1'},
          3: {'title': '已对账', 'num': 0, 'attachmentType': '2'},
          4: {'title': '已回款', 'num': 0, 'attachmentType': '3'},
        },
        defaultPageRight: {'width': '920px', 'padding': 0},
        dySelectList: [],
        selectList: []
      };
    },
    computed: {
      totalInfo() {
        if (!this.selectList.length) return;
        let billingQuantity = 0;
        let billingTotal = 0;
        let realityBillingTotal = 0;
        this.selectList.forEach(i => {
          billingQuantity += i.billingQuantity;
          billingTotal += i.billingTotal;
          realityBillingTotal += (Number(i.realityBillingTotal) || 0);
        });
        return {billingQuantity, billingTotal, realityBillingTotal};
      }
    },
    watch: {
      filters: {
        handler: function (val) {
          this.$refs.table.clearSelection();
          this.queryList(1);
        },
        deep: true
      }
    },
    mounted() {
      this.$getDict('invoiceContent');
      this.queryList(1);
    },
    methods: {
      selectable(row) {
        return this.filters.attachmentType !== '2' || this.filters.attachmentType === '2' && !!row.unliquidatedAmount;
      },
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
        list.forEach(i => i.statementAmount = utils.autoformatDecimalPoint(i.unliquidatedAmount));
        this.dySelectList = list;
        this.showPart(2);
      },
      batchInsertCloseAccount() {
        if (!this.selectList.length) return this.$notify.info({message: '请选择计费明细'});
        let obj = {};
        this.selectList.forEach(i => obj[i.contractId] = '');
        if (Object.keys(obj).length > 1) {
          return this.$notify.info({message: '请选择相同合同的计费明细'});
        }
        let list = JSON.parse(JSON.stringify(this.selectList));
        list.forEach(i => i.statementAmount = utils.autoformatDecimalPoint(i.unliquidatedAmount));
        this.dySelectList = list;
        this.showPart(3);
      },
      createCloseAccount() {
        this.form = {};
        this.showPart(4);
      },
      formatBillingItemName(item) {
        let bill = this.$store.state.billItemList.find(f => f.id === item.billingItemName);
        if (!bill) return item.billingItemName;
        return bill.name;
      },
      editItem(item) {
        item.realityBillingTotal = utils.autoformatDecimalPoint(item.realityBillingTotal);
        this.$httpRequestOpera(contractAccountDetail.update(item), {
          errorTitle: '修改失败',
          success: res => {
            item.unreturnedAmount = item.realityBillingTotal;
            item.unliquidatedAmount = item.realityBillingTotal;
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
        const http = contractAccountDetail.query;
        const params = this.queryUtil(http, pageNo, null, () => {
          this.dataList.forEach(item => {
            item.realityBillingTotal = utils.autoformatDecimalPoint(item.realityBillingTotal);
          });
        });
        this.queryStatusNum(params);
      },
      queryStatusNum: function (params) {
        contractAccountDetail.queryStateNum(Object.assign({}, params, {attachmentType: null})).then(res => {
          let data = res.data.data;
          utils.setStatusCount(this.orgType, data, 'attachmentType');
        });
      },
      exportExcel() {
        this.$refs.searchPart.setSearch();
        let filters = Object.assign({}, this.$refs.searchPart.searchCondition);
        this.$store.commit('initPrint', {isPrinting: true, moduleId: this.$route.path});
        contractAccountDetail.export(filters).then(res => {
          this.$store.commit('initPrint', {isPrinting: false, moduleId: this.$route.path});
          utils.download(res.data.data.path);
        }).catch(() => {
          this.$store.commit('initPrint', {isPrinting: false, moduleId: this.$route.path});
        });
      },
      exportCloseAccount() {
        this.$refs.searchPart.setSearch();
        let filters = Object.assign({}, this.$refs.searchPart.searchCondition);
        if (!filters.startTime) {
          return this.$notify.info('请选择创建时间');
        }
        this.$store.commit('initPrint', {isPrinting: true, moduleId: this.$route.path});
        contractAccountDetail.exportMonthDetail(filters).then(res => {
          this.$store.commit('initPrint', {isPrinting: false, moduleId: this.$route.path});
          utils.download(res.data.data.path);
        }).catch(e => {
          this.$store.commit('initPrint', {isPrinting: false, moduleId: this.$route.path});
          this.$notify.error({
            duration: 2000,
            message: e.response && e.response.data && e.response.data.msg || '无对账单信息'
          });
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
      },
      cellClick(row, column, cell) {
        if (column.type === 'selection') {
          this.$refs.table.toggleRowSelection(row);
        }
      }
    }
  };
</script>
