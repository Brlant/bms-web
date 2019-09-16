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
      <h2 class="detail-title">基础信息</h2>
      <el-row>
        <el-col :span="12">
          <oms-row label="甲方" :span="8">{{ formItem.customerName }}</oms-row>
          <oms-row label="合同" :span="8">{{ formItem.contractName }}</oms-row>
          <oms-row label="结算单号" :span="8">{{ formItem.statementNo }}</oms-row>
          <oms-row label="发票类型" :span="8" v-show="formItem.invoiceType">{{ formItem.invoiceType}}</oms-row>
          <oms-row label="发票号" :span="8" v-show="formItem.invoiceNo">{{ formItem.invoiceNo }}</oms-row>
          <oms-row label="结算单状态" :span="8">{{ orgType[formItem.statementType].title }}</oms-row>
        </el-col>
        <el-col :span="12">
          <oms-row label="结算单金额" :span="8">{{ formItem.statementAmount }}</oms-row>
          <oms-row label="结算日期" :span="8">{{ formItem.statementTime | time }}</oms-row>
          <oms-row label="待回款金额" :span="8">{{ formItem.unreturnedAmount }}</oms-row>
          <oms-row label="回款日期" :span="8" v-show="formItem.backAmountTime">{{ formItem.backAmountTime | time }}</oms-row>
          <oms-row label="是否含税" :span="8">{{ formItem.includeTax === '0' ? '否' : '是' }}</oms-row>
          <oms-row label="税率" :span="8" v-show="formItem.taxRate">{{ formItem.taxRate }}</oms-row>
          <oms-row label="优惠金额" :span="8" v-show="formItem.preferentialAmount">{{ formItem.preferentialAmount }}
          </oms-row>
          <oms-row label="折扣" :span="8" v-show="formItem.discountAmount">{{ formItem.discountAmount }}%</oms-row>
        </el-col>
      </el-row>
      <h2 class="detail-title">计费明细</h2>
      <el-table :data="billAccountList" v-loading="loading" border class="clearfix mt-20" ref="orderDetail">
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
          <template slot-scope="scope">{{scope.row.accountCheckNo}}</template>
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
        <el-table-column prop="billingTotal" label="计费合计">
          <template slot-scope="scope">{{scope.row.billingTotal}}</template>
        </el-table-column>
        <el-table-column prop="realityBillingTotal" width="120px" label="实际计费合计">
        </el-table-column>
        <el-table-column prop="unreturnedAmount" label="待回款金额" width="120" fixed="right">
          <template slot-scope="scope">{{scope.row.unreturnedAmount}}</template>
        </el-table-column>
        <el-table-column prop="unliquidatedAmount" label="未结算金额" width="120" fixed="right">
          <template slot-scope="scope">{{scope.row.unliquidatedAmount}}</template>
        </el-table-column>
        <el-table-column prop="statementAmount" width="120px" label="结算金额" fixed="right">
        </el-table-column>
      </el-table>
      <div style="margin-left: 50px;margin-top: 20px" v-has="'statement-audit'">
        <el-button type="success" @click="confirm" v-if="formItem.statementType === '0'">审核通过</el-button>
        <el-button type="primary" @click="noPass" v-if="formItem.statementType === '0'">审核不通过</el-button>
      </div>
    </div>
  </div>
</template>
<script>
  import {closeAccount} from '@/resources';

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
        loading: false
      };
    },
    watch: {
      index(val) {
        if (val !== 1) return;
        this.queryDetail();
      }
    },
    methods: {
      queryDetail() {
        this.loading = true;
        closeAccount.queryDetail({statementId: this.formItem.statementId}).then(res => {
          this.loading = false;
          this.billAccountList = res.data.data.map(m => Object.assign(m.billingOfAccount, {statementAmount: m.statementAmount}));
        });
      },
      formatBillingItemName(item) {
        let bill = this.$store.state.billItemList.find(f => f.id === item.billingItemName);
        if (!bill) return;
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
      }
    }
  };
</script>
