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
      <h3 class="clearfix">对账单详情</h3>
      <h2 class="detail-title">
        基础信息
        <span class="pull-right">
           <el-button size="mini" type="primary" @click="exportExcel" :loading="exportLoading">导出excel</el-button>
           <el-button size="mini" type="primary" @click="exportGoodsTotal"
                      :loading="exportGoodsLoading">导出货品合计</el-button>
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
          <oms-row label="对账单金额" :span="8">{{ formItem.accountCheckAmount | formatMoney}}</oms-row>
          <oms-row label="是否含税" :span="8">{{ formItem.includeTax === '0' ? '否' : '是' }}</oms-row>
          <oms-row label="税率" :span="8" v-show="formItem.includeTax === '1'">{{ formItem.taxRate }}%</oms-row>
          <oms-row label="优惠金额" :span="8" v-show="formItem.preferentialAmount">{{
              formItem.preferentialAmount |
                formatMoney
            }}
          </oms-row>
          <oms-row label="折扣" :span="8" v-show="formItem.discountAmount">{{ formItem.discountAmount }}%</oms-row>
          <oms-row label="实际对账金额" :span="8">{{ formItem.unreturnedAmount | formatMoney }}</oms-row>
        </el-col>
      </el-row>

      <h2 class="detail-title">对账单明细</h2>
      <el-table :data="billAccountList" :maxHeight="bodyHeight" border class="clearfix" ref="orderDetail"
                v-loading="loading">
        <el-table-column label="项目" prop="actionType" width="140">
          <template slot-scope="scope">{{ scope.row.projectName }}</template>
        </el-table-column>
        <el-table-column label="创建时间" prop="billingTime" width="160">
          <template slot-scope="scope">{{ scope.row.billingTime | time }}</template>
        </el-table-column>
        <el-table-column label="订单号" prop="actionType" width="140">
          <template slot-scope="scope">{{ scope.row.orderNumber }}</template>
        </el-table-column>
        <el-table-column label="对账单号" prop="actionType" width="150">
          <template slot-scope="scope">{{ scope.row.accountCheckNo }}</template>
        </el-table-column>
        <el-table-column label="货品" prop="actionType" width="200">
          <template slot-scope="scope">
            {{ scope.row.orgGoodsName }}
            <div v-show="scope.row.goodsSpecification">规格：{{ scope.row.goodsSpecification }}</div>
          </template>
        </el-table-column>
        <el-table-column label="批号" prop="batchNumber" width="120">
          <template slot-scope="scope">{{ scope.row.batchNumber }}</template>
        </el-table-column>
        <el-table-column label="计费项" prop="billingItemName" width="200">
          <template slot-scope="scope">{{ formatBillingItemName(scope.row) }}</template>
        </el-table-column>
        <el-table-column label="计费项名称" prop="billingCustomName" width="200">
          <template slot-scope="scope">{{ scope.row.billingCustomName }}</template>
        </el-table-column>
        <el-table-column label="单价" prop="billingUntilPrice" width="150px">
          <template slot-scope="scope">{{ scope.row.billingUntilPrice }}</template>
        </el-table-column>
        <el-table-column label="数量" prop="billingQuantity">
          <template slot-scope="scope">{{ scope.row.billingQuantity }}</template>
        </el-table-column>
        <el-table-column label="计费合计" prop="billingTotal">
          <template slot-scope="scope">{{ scope.row.billingTotal | formatMoney }}</template>
        </el-table-column>
        <el-table-column label="实际计费合计" prop="realityBillingTotal" width="120px">
        </el-table-column>
        <el-table-column fixed="right" label="待回款金额" prop="unreturnedAmount" width="120">
          <template slot-scope="scope">{{ scope.row.unreturnedAmount | formatMoney }}</template>
        </el-table-column>
        <el-table-column fixed="right" label="未结算金额" prop="unliquidatedAmount" width="120">
          <template slot-scope="scope">{{ scope.row.unliquidatedAmount | formatMoney }}</template>
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
      exportGoodsLoading: false,
      pager: {
        currentPage: 1,
        count: 0,
        pageSize: 20
      }
    };
    },
    watch: {
      formItem: {
        handler(val) {
          this.billAccountList = [];
          if (!val.accountCheckId) return;
          this.queryList(1);
        },
        immediate: true
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
        if (!this.formItem.accountCheckId) return;
        this.pager.currentPage = pageNo;
        let params = Object.assign({}, {
          pageNo: pageNo,
          pageSize: this.pager.pageSize,
        });
        this.loading = true;
        let nowTime = new Date();
        this.nowTime = nowTime;
        let url = `bms-ad/${this.formItem.accountCheckId}/detail`;
        this.$http.get(url, {params}).then(res => {
          this.billAccountList = res.data.list || [];
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
      },
      bodyHeight: function () {
        let height = parseInt(this.$store.state.bodyHeight, 10);
        height = (height - 320);
        if (height < 280) {
          height = 280;
        }
        return height + 'px';
      }
    }
  };
</script>
