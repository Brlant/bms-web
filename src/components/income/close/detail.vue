<style lang="scss" scoped="">
@import "../../.././assets/scss/mixins";

$leftWidth: 0;
.content-part {
  .content-left {
    width: $leftWidth;
  }

  .content-right {
    > h3 {
      left: $leftWidth;
    }

    padding-left: 10px;
    padding-right: 10px;
    left: $leftWidth;
  }
}

.oms-row {
  margin-bottom: 10px;
}

</style>
<template>
  <div class="content-part">
    <div class="content-right min-gutter">
      <h3 class="clearfix">详情</h3>
      <h2 class="detail-title">
        基础信息
        <span class="pull-right">
           <el-button size="mini" type="primary" @click="exportGoodsTotal"
                      :loading="exportGoodsLoading">导出货品合计</el-button>
        </span>
      </h2>
      <el-row class="clearfix">
        <el-col :span="12">
          <oms-row label="甲方" :span="8">{{ formItem.customerName }}</oms-row>
          <oms-row label="统一社会信用代码" :span="8">{{ formItem.creditCode }}</oms-row>
          <oms-row label="合同" :span="8">{{ formItem.contractName }}</oms-row>
          <oms-row label="结算单号" :span="8">{{ formItem.statementNo }}</oms-row>
          <oms-row label="结算单状态" :span="8">
            {{
              orgType[formItem.statementType < 9 ? 1 * formItem.statementType + 1 : formItem.statementType] &&
              orgType[formItem.statementType < 9 ? 1 * formItem.statementType + 1 : formItem.statementType].title
            }}
          </oms-row>
        </el-col>
        <el-col :span="12">
          <oms-row :span="8" label="结算单金额">{{ formItem.statementAmount | formatMoney }}</oms-row>
          <oms-row label="结算日期" :span="8">{{ formItem.statementTime | time }}</oms-row>
          <oms-row :span="8" label="待回款金额">{{ formItem.unreturnedAmount | formatMoney }}</oms-row>
          <oms-row label="回款日期" :span="8" v-show="formItem.backAmountTime">{{ formItem.backAmountTime | date }}
          </oms-row>
          <oms-row label="折扣" :span="8" v-show="formItem.discountAmount">{{ formItem.discountAmount }}%</oms-row>
          <oms-row label="备注" :span="8" v-show="formItem.statementRemark">{{ formItem.statementRemark }}</oms-row>
        </el-col>
      </el-row>
      <h2 class="detail-title">开票信息</h2>
      <el-row class="clearfix">
        <el-col :span="12">
          <oms-row label="发票类型" :span="8" v-show="formItem.invoiceType">
            {{ invoiceTypes[formItem.invoiceType] && invoiceTypes[formItem.invoiceType].label || formItem.invoiceType }}
          </oms-row>
          <oms-row label="发票内容" :span="8" v-show="formItem.invoiceContents">{{ formItem.invoiceContents }}</oms-row>
          <div v-show="formItem.invoiceNo">
            <oms-row label="发票号" :span="8">{{ formItem.invoiceNo }}</oms-row>
            <oms-row :span="8" label="发票金额">{{ formItem.invoiceAmount | formatMoney }}</oms-row>
          </div>
        </el-col>
        <el-col :span="12">
          <oms-row label="是否含税" :span="8">{{ formItem.includeTax === '0' ? '否' : '是' }}</oms-row>
          <oms-row label="税率" :span="8" v-show="formItem.taxRate">{{ formItem.taxRate }}%</oms-row>
          <oms-row :span="8" label="开票日期" v-show="formItem.invoiceTime">{{ formItem.invoiceTime | date }}</oms-row>
        </el-col>
      </el-row>
      <h2 class="detail-title">计费明细</h2>
      <el-table :data="billAccountList" v-loading="loading" :maxHeight="bodyHeight" border class="clearfix"
                ref="orderDetail">
        <el-table-column prop="actionType" label="订单号" width="140">
          <template slot-scope="scope">{{ scope.row.orderNumber }}</template>
        </el-table-column>
        <el-table-column prop="actionType" label="对账单号" width="150">
          <template slot-scope="scope">{{ scope.row.accountCheckNo }}</template>
        </el-table-column>
        <el-table-column prop="unreturnedAmount" label="待回款金额" width="100">
          <template slot-scope="scope">{{ scope.row.unreturnedAmount }}</template>
        </el-table-column>
        <el-table-column prop="unliquidatedAmount" label="未结算金额" width="100">
          <template slot-scope="scope">{{ scope.row.unliquidatedAmount }}</template>
        </el-table-column>
        <el-table-column prop="statementAmount" width="100px" label="结算金额">
        </el-table-column>
        <el-table-column prop="actionType" label="货品" width="200">
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
        <el-table-column prop="billingTotal" label="计费合计">
          <template slot-scope="scope">{{ scope.row.billingTotal }}</template>
        </el-table-column>
        <el-table-column prop="realityBillingTotal" width="120px" label="实际计费合计">
        </el-table-column>
        <el-table-column prop="billingTime" label="创建时间" width="160">
          <template slot-scope="scope">{{ scope.row.billingTime | time }}</template>
        </el-table-column>
      </el-table>
      <div class="text-center" v-show="billAccountList.length && !loading">
        <el-pagination
          :current-page="pager.currentPage"
          :page-sizes="[10,20,50,100]" :pageSize="pager.pageSize" :total="pager.count"
          @current-change="handleCurrentChange" @size-change="handleSizeChange"
          layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
      </div>

      <div style="margin-left: 5px;margin-top: 10px" v-has="'statement-audit'">
        <el-button type="success" @click="confirm" v-if="formItem.statementType === '0'">审核通过</el-button>
        <el-button type="primary" @click="noPass" v-if="formItem.statementType === '0'">审核不通过</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import {closeAccount} from '@/resources';
import utils from '@/tools/utils';

export default {
  props: {
    formItem: {
      type: Object,
      required: true
    },
    index: Number,
    orgType: Object
  },
  data() {
    return {
      billAccountList: [],
      loading: false,
      exportGoodsLoading: false,
      pager: {
        currentPage: 1,
        count: 0,
        pageSize: 10
      }
    };
  },
  computed: {
    invoiceTypes() {
      return this.$store.state.invoiceTypes;
    },
    bodyHeight: function () {
      let height = parseInt(this.$store.state.bodyHeight, 10);
      height = (height - 320);
      if (height < 280) {
        height = 280;
      }
      return height + 'px';
    }
  },
  watch: {
    index(val) {
      this.billAccountList = [];
      if (val !== 1) return;
      this.queryList(1);
    }
  },
  methods: {
    handleSizeChange(val) {
      this.pager.pageSize = val;
      this.queryList(1);
    },
    handleCurrentChange(val) {
      this.queryList(val);
    },
    queryList(pageNo) {
      this.billAccountList = [];
      if (!this.formItem.statementId) return;
      this.pager.currentPage = pageNo;
      let params = Object.assign({}, {
        pageNo: pageNo,
        pageSize: this.pager.pageSize,
      });
      this.loading = true;
      let nowTime = new Date();
      this.nowTime = nowTime;
      let url = `bms-sd/${this.formItem.statementId}/detail`;
      this.$http.get(url, {params}).then(res => {
        this.billAccountList = res.data.list.map(m => Object.assign(m.billingOfAccount, {statementAmount: m.statementAmount})) || [];
        this.pager.count = res.data.count;
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      });
    },
    formatBillingItemName(item) {
      let bill = this.$store.state.billItemList.find(f => f.id === item.billingItemName);
      if (!bill) return item.billingItemName;
      return bill.name;
    },
    confirm() {
      this.$confirmOpera('是否确认审核通过', () => {
        this.$httpRequestOpera(closeAccount.audit({statementId: this.formItem.statementId, checkType: '1'}), {
          successTitle: '审核成功',
          errorTitle: '审核失败',
          success: (res) => {
            this.$emit('change');
          }
        });
      });
    },
    noPass() {
      this.$confirmOpera('是否确认审核不通过', () => {
        this.$httpRequestOpera(closeAccount.audit({statementId: this.formItem.statementId, checkType: '0'}), {
          successTitle: '审核不通过完成',
          errorTitle: '审核失败',
          success: (res) => {
            this.$emit('change');
          }
        });
      });
    },
    exportGoodsTotal() {
      this.exportGoodsLoading = true;
      closeAccount.exportGoodsExcel({statementId: this.formItem.statementId}).then(res => {
        utils.download(res.data.data.path);
        this.exportGoodsLoading = false;
      }).catch(() => {
        this.exportGoodsLoading = false;
      });
    }
  }
};
</script>
