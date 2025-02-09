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
          导出未结算明细报表
        </el-button>
      </template>
    </search-part>
    <status-list :activeStatus="filters.attachmentType" :statusList="orgType"
                 :checkStatus="changeType" :isShowNum="true" :isShowIcon="isShowIcon"
                 :formatClass="formatClass">
      <span class="total-info" v-if="totalInfo">
        <span class="total-info__item">数量小计：{{ totalInfo.billingQuantity }}</span>
        <span class="total-info__item">计费小计：{{ totalInfo.billingTotal | formatMoney }}</span>
        <span class="total-info__item">未结算金额小计：{{ totalInfo.unliquidatedAmount | formatMoney }}</span>
        <span class="total-info__item">实际计费小计：{{ totalInfo.realityBillingTotal | formatMoney }}</span>
      </span>
    </status-list>
    <el-table :data="dataList" v-loading="loadingData" row-key="billingOfAccountId"
              border class="clearfix mt-20" ref="table" @cell-click="cellClick" @selection-change="selectionChange">
      <el-table-column type="selection" width="55" reserve-selection :selectable="selectable">
      </el-table-column>
      <el-table-column prop="contractName" label="合同" width="150">
        <template slot-scope="scope">{{ scope.row.contractName }}</template>
      </el-table-column>
      <el-table-column prop="customerName" label="甲方" width="140">
        <template slot-scope="scope">{{ scope.row.customerName }}</template>
      </el-table-column>
      <el-table-column prop="actionType" label="项目" width="140">
        <template slot-scope="scope">{{ scope.row.projectName }}</template>
      </el-table-column>
      <el-table-column prop="billingTime" label="创建时间" width="160">
        <template slot-scope="scope">{{ scope.row.billingTime | time }}</template>
      </el-table-column>
      <el-table-column prop="actionType" label="订单号" width="140">
        <template slot-scope="scope">{{ scope.row.orderNumber }}</template>
      </el-table-column>
      <el-table-column prop="actionType" label="对账单号" width="150">
        <template slot-scope="scope">{{ scope.row.accountCheckNo }}</template>
      </el-table-column>
      <el-table-column prop="actionType" label="货品" width="300">
        <template slot-scope="scope">
          {{ scope.row.orgGoodsName }}
          <div v-show="scope.row.goodsSpecification">规格：{{ scope.row.goodsSpecification }}</div>
        </template>
      </el-table-column>
      <el-table-column prop="batchNumber" label="批号" width="120">
        <template slot-scope="scope">{{ scope.row.batchNumber }}</template>
      </el-table-column>
      <el-table-column prop="billingItemName" label="计费项" width="200">
        <template slot-scope="scope">{{ formatBillingItemName(scope.row) }}</template>
      </el-table-column>
      <el-table-column prop="billingCustomName" label="计费项名称" width="200">
        <template slot-scope="scope">{{ scope.row.billingCustomName }}</template>
      </el-table-column>
      <el-table-column prop="billingUntilPrice" label="单价" width="150px">
        <template slot-scope="scope">{{ scope.row.billingUntilPrice }}</template>
      </el-table-column>
      <el-table-column prop="billingQuantity" label="数量">
        <template slot-scope="scope">{{ scope.row.billingQuantity }}</template>
      </el-table-column>
      <el-table-column prop="unreturnedAmount" label="待回款金额" width="120" fixed="right">
        <template slot-scope="scope">{{ scope.row.unreturnedAmount | formatMoney }}</template>
      </el-table-column>
      <el-table-column prop="unliquidatedAmount" label="未结算金额" width="120" fixed="right">
        <template slot-scope="scope">{{ scope.row.unliquidatedAmount | formatMoney }}</template>
      </el-table-column>
      <el-table-column prop="billingTotal" label="计费合计" fixed="right" width="120">
        <template slot-scope="scope">{{ scope.row.billingTotal | formatMoney }}</template>
      </el-table-column>
      <el-table-column prop="realityBillingTotal" width="120px" label="实际计费合计"
                       fixed="right">
        <template slot-scope="scope">
          <div v-if="$_has('edit-billing-of-account')">
            <oms-input v-if="scope.row.attachmentType === '0'" v-model="scope.row.realityBillingTotal"
                       @blur="editItem(scope.row)"/>
            <span v-else>{{ scope.row.realityBillingTotal }}</span>
          </div>
          <span v-else>{{ scope.row.realityBillingTotal }}</span>
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
      let unliquidatedAmount = 0;
      this.selectList.forEach(i => {
        billingQuantity += i.billingQuantity;
        billingTotal += i.billingTotal;
        unliquidatedAmount += i.unliquidatedAmount;
        realityBillingTotal += (Number(i.realityBillingTotal) || 0);
      });
      return {billingQuantity, billingTotal, realityBillingTotal,unliquidatedAmount};
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
      if (!this.selectList.length) {
        console.log("请选择计费明细");
        return this.$notify.info({message: '请选择计费明细'});
      }

      // 下面的代码都用不上了，支持多个合同合并，那单个合同的提示语就不重要了，直接调用接口生成对账单，后端按客户分组，一个对账单存多个合同即可
      this.doCreate();

      // let obj = {};
      // this.selectList.forEach(i => {
      //   obj[i.contractId] = '';
      // });

      // 2023-03-21 不同的合同可以一起批量生成对账单
      // 所以下面的代码注释掉
      // const len = Object.keys(obj).length;
      // if (len > 1) {
      //   debugger
      //   console.log("请选择相同合同的计费明细");
      //   return this.$notify.info('请选择相同合同的计费明细');
      // }

      // let item = this.selectList[0];
      // 本次对账金额
      // let contractIds = new Set();
      // let cutAmount = 0;
      // this.selectList.forEach(row => {
      //   cutAmount += Number(row.realityBillingTotal);
        // contractIds.add(row.contractId);
      // });

      // contractIds.forEach(contractId=>{
      //   this.$http.get(`/bms-boa/query-boa-contractId-sum?contractId=${contractId}`).then(res => {
      //     const lowerLimitAmount = res.data.lowerLimitAmount;
      //     const upperLimitAmount = res.data.upperLimitAmount;
      //     // 已对账金额
      //     let closeAmount = res.data.contractTotal;
      //     // (1)对账前未达下限:
      //     // 若该合同存在【合同下限金额】，且【合同已执行金额】<【合同下限金 额】，
      //     // 则【剩余执行金额】=【合同下限金额】—【合同已执行金额】。
      //     if (lowerLimitAmount && closeAmount < lowerLimitAmount) {
      //       // 下限剩余执行金额
      //       const lowerAmount = lowerLimitAmount - closeAmount;
      //       // 1如果【本次对账金额】小于【剩余执行金额】，则【对账后状态】=未 达下限。(即对账后仍未达下限)
      //       if (cutAmount < lowerAmount) {
      //         this.doCreate(this.getStr(lowerLimitAmount, upperLimitAmount, closeAmount, lowerAmount, cutAmount, '未达合同下限金额'));
      //         return;
      //       }
      //       // 2如果不存在【合同上限金额】，则【对账后状态】=未达上限。
      //       if (!upperLimitAmount) {
      //         this.doCreate(this.getStr(lowerLimitAmount, upperLimitAmount, closeAmount, lowerAmount, cutAmount, '未达合同上限金额'));
      //         return;
      //       }
      //       // 上限剩余执行金额
      //       const upperAmount = upperLimitAmount - closeAmount;
      //       // 3如果存在【合同上限金额】且【本次对账金额】小于或等于(【合同上 限金额】—【合同已执行金额】)，则【对账后状态】=未超上限，
      //       // 否则【对 账后状态】=超过上限。(即对账后超过下限)
      //       if (cutAmount <= upperAmount) {
      //         this.doCreate(this.getStr(lowerLimitAmount, upperLimitAmount, closeAmount, lowerAmount, cutAmount, '未超合同上限金额'));
      //         return;
      //       } else {
      //         this.doCreate(this.getStr(lowerLimitAmount, upperLimitAmount, closeAmount, lowerAmount, cutAmount, '超过合同上限金额'));
      //         return;
      //       }
      //     }
      //     // (2)对账前未超上限:
      //     // 若该合同存在【合同上限金额】，且【合同已执行金额】<【合同上限金 额】，
      //     // 则【剩余执行金额】=【合同上限金额】—【合同已执行金额】。
      //     if (upperLimitAmount && closeAmount < upperLimitAmount) {
      //       // 上限剩余执行金额
      //       const upperAmount = upperLimitAmount - closeAmount;
      //       if (cutAmount < upperAmount) {
      //         this.doCreate(this.getStr(lowerLimitAmount, upperLimitAmount, closeAmount, upperAmount, cutAmount, '未达合同上限金额'));
      //         return;
      //       } else {
      //         this.doCreate(this.getStr(lowerLimitAmount, upperLimitAmount, closeAmount, upperAmount, cutAmount, '超过合同上限金额'));
      //         return;
      //       }
      //     }
      //     // (3)对账前已超上限:
      //     // 若该合同存在【合同上限金额】，且【合同已执行金额】>=【合同上限金 额】，
      //     // 则【剩余执行金额】=【合同上限金额】—【合同已执行金额】,【对账 后状态】=超过上限。
      //     if (upperLimitAmount && closeAmount >= upperLimitAmount) {
      //       // 上限剩余执行金额
      //       const upperAmount = upperLimitAmount - closeAmount;
      //       this.doCreate(this.getStr(lowerLimitAmount, upperLimitAmount, closeAmount, upperAmount, cutAmount, '超过合同上限金额'));
      //       return;
      //     }
      //
      //     // (4)上、下限有一个设置，不提示。
      //     if (!lowerLimitAmount || !upperLimitAmount) {
      //       this.doCreate();
      //     }
      //   });
      // })

    },
    getStr(lowerLimitAmount, upperLimitAmount, closeAmount, amount, cutAmount, status) {
      let LimitAmountStr = `合同下限金额：${lowerLimitAmount && lowerLimitAmount.toFixed(2) || '无'}<br>合同上限金额：${
        upperLimitAmount && upperLimitAmount.toFixed(2) || '无'}<br>`;
      let str = `合同已执行金额：${closeAmount && closeAmount.toFixed(2) || closeAmount}<br>剩余执行金额：${amount && amount.toFixed(2) || amount}<br>本次对账金额：${cutAmount && cutAmount.toFixed(2) || cutAmount}<br>对账后状态：${status}<br>`;
      return LimitAmountStr + str;
    },
    doCreate(title = '') {
      title = title ? title + '<br>' : '';
      this.$alert(title + '是否确定生成对账单？', '', {
        dangerouslyUseHTMLString: true,
        showCancelButton: true
      }).then(res => {
        this.$httpRequestOpera(accountBill.batchCreateBill(this.selectList.map(m => m.billingOfAccountId)), {
          successTitle: '生成成功',
          errorTitle: '生成失败',
          success: (res) => {
            this.$refs.table.clearSelection();
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
      this.$refs.table.clearSelection();
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
