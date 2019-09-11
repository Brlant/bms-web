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
          <oms-row label="对账单号" :span="8">{{ formItem.accountCheckNo }}</oms-row>
          <oms-row label="创建时间" :span="8">{{ formItem.accountCheckTime | time }}</oms-row>
          <oms-row label="对账单状态" :span="8">{{ orgType[formItem.accountCheckType].title }}</oms-row>
        </el-col>
        <el-col :span="12">
          <oms-row label="对账单金额" :span="8">{{ formItem.accountCheckAmount }}</oms-row>
          <oms-row label="是否含税" :span="8">{{ formItem.includeTax === '0' ? '否' : '是' }}</oms-row>
          <oms-row label="税率" :span="8">{{ formItem.taxRate }}</oms-row>
          <oms-row label="优惠金额" :span="8">{{ formItem.preferentialAmount }}</oms-row>
          <oms-row label="折扣金额" :span="8">{{ formItem.discountAmount }}</oms-row>
          <oms-row label="待回款金额" :span="8">{{ formItem.unreturnedAmount }}</oms-row>
        </el-col>
      </el-row>
      <div style="margin-left: 50px">
        <el-button type="primary" v-has="'account-check-confirm'" @click="confirm"
                   v-if="formItem.accountCheckType === '0'">确认帐单
        </el-button>

        <el-button type="danger" v-has="'account-check-cancel'" @click="cancel"
                   v-if="formItem.accountCheckType === '0'">取消帐单
        </el-button>

        <el-button type="primary" v-has="'account-check-audit'"
                   @click="audit" v-if="formItem.accountCheckType === '1'">审核通过
        </el-button>
        <el-button type="primary" v-has="'account-check-audit'"
                   @click="auditNoPass" v-if="formItem.accountCheckType === '1'">审核不通过
        </el-button>
      </div>
    </div>
  </div>
</template>
<script>
  import {accountBill} from '@/resources';

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
        this.$confirmOpera('是否确认账单', () => {
          this.$httpRequestOpera(accountBill.confirm(this.formItem), {
            successTitle: '确认账单成功',
            errorTitle: '确认账单失败',
            success: (res) => {
              this.$emit('change');
            }
          });
        });
      },
      cancel() {
        this.$confirmOpera('是否取消账单', () => {
          this.$httpRequestOpera(accountBill.cancel(this.formItem), {
            successTitle: '取消账单成功',
            errorTitle: '取消账单失败',
            success: (res) => {
              this.$emit('change');
            }
          });
        });
      },
      audit() {
        this.$confirmOpera('是否审核通过此账单', () => {
          this.formItem.accountCheckType = '2';
          this.$httpRequestOpera(accountBill.audit(this.formItem), {
            successTitle: '审核账单完成',
            errorTitle: '审核账单失败',
            success: (res) => {
              this.$emit('change');
            }
          });
        });
      },
      auditNoPass() {
        this.$confirmOpera('是否审核不通过此账单', () => {
          this.formItem.accountCheckType = '3';
          this.$httpRequestOpera(accountBill.audit(this.formItem), {
            successTitle: '审核账单完成',
            errorTitle: '审核账单失败',
            success: (res) => {
              this.$emit('change');
            }
          });
        });
      }
    }
  };
</script>
