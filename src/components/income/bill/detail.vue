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
           <el-button size="mini" type="primary" @click="exportExcel" :loading="exportLoading">导出excel</el-button>
           <el-button size="mini" type="primary" @click="exportGoodsTotal" :loading="exportGoodsLoading">导出货品合计</el-button>
        </span>
      </h2>
      <el-row>
        <el-col :span="12">
          <oms-row label="甲方" :span="8">{{ formItem.customerName }}</oms-row>
          <oms-row label="合同" :span="8">{{ formItem.contractName }}</oms-row>
          <oms-row label="对账单号" :span="8">{{ formItem.accountCheckNo }}</oms-row>
          <oms-row label="创建时间" :span="8">{{ formItem.accountCheckTime | time }}</oms-row>
          <oms-row label="对账单状态" :span="8">{{ orgType[formItem.accountCheckType].title }}</oms-row>
        </el-col>
        <el-col :span="12">
          <oms-row label="对账单金额" :span="8">{{ formItem.accountCheckAmount  | formatMoney}}</oms-row>
          <oms-row label="是否含税" :span="8">{{ formItem.includeTax === '0' ? '否' : '是' }}</oms-row>
          <oms-row label="税率" :span="8" v-show="formItem.includeTax === '1'">{{ formItem.taxRate }}%</oms-row>
          <oms-row label="优惠金额" :span="8" v-show="formItem.preferentialAmount">{{ formItem.preferentialAmount  | formatMoney}}
          </oms-row>
          <oms-row label="折扣" :span="8" v-show="formItem.discountAmount">{{ formItem.discountAmount }}%</oms-row>
          <oms-row label="实际对账金额" :span="8">{{ formItem.unreturnedAmount  | formatMoney}}</oms-row>
        </el-col>
      </el-row>
      <h2 class="detail-title">对账单明细</h2>

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
        <el-table-column prop="billingTime" label="创建时间" width="160">
          <template slot-scope="scope">{{scope.row.billingTime | time}}</template>
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
            <div v-show="scope.row.goodsSpecification">规格：{{scope.row.goodsSpecification}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="batchNumber" label="批号" width="120">
          <template slot-scope="scope">{{scope.row.batchNumber}}</template>
        </el-table-column>
        <el-table-column prop="billingItemName" label="绑定货品计费项" width="200">
          <template slot-scope="scope">{{formatBillingItemName(scope.row)}}</template>
        </el-table-column>
        <el-table-column prop="billingUntilPrice" label="单价" width="150px">
          <template slot-scope="scope">{{scope.row.billingUntilPrice | formatMoney}}</template>
        </el-table-column>
        <el-table-column prop="billingQuantity" label="数量">
          <template slot-scope="scope">{{scope.row.billingQuantity}}</template>
        </el-table-column>
        <el-table-column prop="billingTotal" label="计费合计">
          <template slot-scope="scope">{{scope.row.billingTotal | formatMoney}}</template>
        </el-table-column>
        <el-table-column prop="realityBillingTotal" width="120px" label="实际计费合计">
        </el-table-column>
        <el-table-column prop="unreturnedAmount" label="待回款金额" width="120" fixed="right">
          <template slot-scope="scope">{{scope.row.unreturnedAmount | formatMoney}}</template>
        </el-table-column>
        <el-table-column prop="unliquidatedAmount" label="未结算金额" width="120" fixed="right">
          <template slot-scope="scope">{{scope.row.unliquidatedAmount | formatMoney}}</template>
        </el-table-column>
      </el-table>

      <div style="margin-left: 50px;margin-top: 50px">
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
        exportLoading: false,
        exportGoodsLoading: false
      };
    },
    watch: {
      formItem: {
        handler(val) {
          this.billAccountList = [];
          if (!val.accountCheckId) return;
          this.queryDetail(val.accountCheckId);
        },
        immediate: true
      }
    },
    methods: {
      queryDetail(accountCheckId) {
        this.loading = true;
        accountBill.queryDetail(accountCheckId).then(res => {
          this.loading = false;
          this.billAccountList = res.data.data || [];
        }).catch(() => {
          this.loading = false;
        });
      },
      formatBillingItemName(item) {
        let bill = this.$store.state.billItemList.find(f => f.id === item.billingItemName);
        if (!bill) return item.billingItemName;
        return bill.name;
      },
      exportExcel() {
        this.exportLoading = true;
        accountBill.exportExcel({accountCheckId: this.formItem.accountCheckId}).then(res => {
          utils.download(res.data.data.path);
          this.exportLoading = false;
        }).catch(() => {
          this.exportLoading = false;
        });
      },
      exportGoodsTotal() {
        this.exportGoodsLoading = true;
        accountBill.exportGoodsExcel({accountCheckId: this.formItem.accountCheckId}).then(res => {
          utils.download(res.data.data.path);
          this.exportGoodsLoading = false;
        }).catch(() => {
          this.exportGoodsLoading = false;
        });
      },
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
