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
      <el-row>
        <el-col :span="12">
          <oms-row label="甲方" :span="8">{{ formItem.customerName }}</oms-row>
          <oms-row label="合同" :span="8">{{ formItem.contractName }}</oms-row>
          <oms-row label="结算单号" :span="8">{{ formItem.statementNo }}</oms-row>
          <oms-row label="发票类型" :span="8">{{ formItem.invoiceType}}</oms-row>
          <oms-row label="发票号" :span="8">{{ formItem.invoiceNo }}</oms-row>
          <oms-row label="结算单状态" :span="8">{{ orgType[formItem.statementType].title }}</oms-row>
        </el-col>
        <el-col :span="12">
          <oms-row label="结算单金额" :span="8">{{ formItem.statementAmount }}</oms-row>
          <oms-row label="结算日期" :span="8">{{ formItem.statementTime | time }}</oms-row>
          <oms-row label="待回款金额" :span="8">{{ formItem.unreturnedAmount }}</oms-row>
          <oms-row label="回款日期" :span="8">{{ formItem.backAmountTime | time }}</oms-row>
          <oms-row label="是否含税" :span="8">{{ formItem.includeTax === '0' ? '否' : '是' }}</oms-row>
          <oms-row label="税率" :span="8" v-show="formItem.taxRate">{{ formItem.taxRate }}</oms-row>
          <oms-row label="优惠金额" :span="8" v-show="formItem.preferentialAmount">{{ formItem.preferentialAmount }}</oms-row>
          <oms-row label="折扣金额" :span="8" v-show="formItem.discountAmount">{{ formItem.discountAmount }}</oms-row>
        </el-col>
      </el-row>
      <div style="margin-left: 50px;margin-top: 20px">
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
    methods: {
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
