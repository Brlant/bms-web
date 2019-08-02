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
          <oms-row label="结算方式" :span="8">{{ closeTypes[formItem.statementMode].label}}</oms-row>
        </el-col>
        <el-col :span="12">
          <oms-row label="回款日期" :span="8">{{ formItem.backAmountTime | date }}</oms-row>
          <oms-row label="银行" :span="8">{{ formItem.bankName}}</oms-row>
        </el-col>
      </el-row>
      <h2 class="detail-title">结算单</h2>
      <el-table :data="closeAccountList" border class="clearfix" ref="orderDetail">
        <el-table-column prop="customerName" label="甲方" width="200">
          <template slot-scope="scope">{{scope.row.customerName}}</template>
        </el-table-column>
        <el-table-column prop="contractName" label="合同" width="200">
          <template slot-scope="scope">{{scope.row.contractName}}</template>
        </el-table-column>
        <el-table-column prop="accountCheckNo" label="结算单号" width="150">
          <template slot-scope="scope">{{scope.row.statementNo}}</template>
        </el-table-column>
        <el-table-column prop="accountCheckAmount" label="结算单金额" width="120">
          <template slot-scope="scope">{{scope.row.collectionAmount | formatMoney}}</template>
        </el-table-column>
        <el-table-column prop="unreturnedAmount" label="结算日期" width="170">
          <template slot-scope="scope">{{scope.row.statementTime | time}}</template>
        </el-table-column>
        <el-table-column prop="unreturnedAmount" label="回款日期" width="170">
          <template slot-scope="scope">{{scope.row.backAmountTime | time}}</template>
        </el-table-column>
        <el-table-column prop="unreturnedAmount" label="使用预收款余额支付" width="160" fixed="right">
          <template slot-scope="scope">{{scope.row.collectionType === '1' ? '否' : '是'}}</template>
        </el-table-column>
        <el-table-column prop="unreturnedAmount" label="待回款金额" width="120" fixed="right">
          <template slot-scope="scope">{{scope.row.unreturnedAmount | formatMoney}}</template>
        </el-table-column>
        <el-table-column prop="unreturnedAmount" label="收款金额" width="120" fixed="right">
          <template slot-scope="scope">
            {{scope.row.collectionAmount | formatMoney}}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
  import {receiveTask} from '@/resources';

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
        closeAccountList: []
      };
    },
    computed: {
      closeTypes() {
        return this.$store.state.closeTypes;
      }
    },
    watch: {
      index(val) {
        if (val !== 1) return;
        this.queryDetail();
      }
    },
    methods: {
      queryDetail() {
        receiveTask.queryDetail({collectionJobsId: this.formItem.collectionJobsId}).then(res => {
          this.closeAccountList = res.data.data;
        });
      },
      formatBillingItemName(item) {
        let bill = this.$store.state.billItemList.find(f => f.id === item.billingItemName);
        if (!bill) return;
        return bill.name;
      }
    }
  };
</script>
