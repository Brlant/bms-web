<template>
  <dialog-template :btnSavePosition="120">
    <template slot="title">生成结算单</template>
    <template slot="btnSave">
      <el-button class="mt-10" :disabled="doing" @click="save" plain type="primary">生成结算单</el-button>
    </template>
    <template slot="content">
      <el-table :data="data" border class="clearfix mt-20" ref="orderDetail">
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
        <el-table-column prop="realityBillingTotal" width="120px" label="结算金额" fixed="right">
          <template slot-scope="scope">
            <oms-input v-model="scope.row.statementAmount" @blur="editItem(scope.row)"/>
          </template>
        </el-table-column>
        <el-table-column prop="operate" label="操作" width="120" fixed="right" v-if="data.length > 1">
          <template slot-scope="scope">
            <des-btn icon="delete" @click="deleteItem(scope.row)">删除</des-btn>
          </template>
        </el-table-column>
      </el-table>
      <el-form :model="form" label-width="120px" ref="form">
        <el-form-item label="是否含税" label-width="120px">是</el-form-item>
        <el-form-item label="税率" prop="taxRate" label-width="120px"
                      :rules="[{required: true, message: '请输入税率', trigger: 'blur'}]">
          <oms-input placeholder="请输入税率" type="number" style="width: 240px" v-model="form.taxRate">
            <span slot="append">%</span>
          </oms-input>
        </el-form-item>
      </el-form>
    </template>
  </dialog-template>
</template>
<script>
  import utils from '@/tools/utils';
  import {closeAccount} from '@/resources';

  export default {
    props: {
      data: Array,
      formatBillingItemName: Function
    },
    data() {
      return {
        doing: false,
        form: {
          taxRate: ''
        }
      };
    },
    methods: {
      formatPrice(item) {
      },
      editItem(item) {
        if (item.unliquidatedAmount >= 0) {
          if (item.statementAmount > item.unliquidatedAmount) {
            item.statementAmount = item.unliquidatedAmount || '0.00';
          }
        } else {
          if (item.statementAmount < item.unliquidatedAmount) {
            item.statementAmount = item.unliquidatedAmount || '0.00';
          }
        }
        item.statementAmount = utils.autoformatDecimalPoint(item.statementAmount);
      },
      deleteItem(item) {
        let index = this.data.indexOf(item);
        index > -1 && this.data.splice(index, 1);
      },
      save() {
        this.$refs['form'].validate((valid) => {
          if (!valid || this.doing) return;
          let list = this.data.map(m => ({
            billingOfAccountId: m.billingOfAccountId,
            statementAmount: m.statementAmount,
            includeTax: '1',
            taxRate: this.form.taxRate
          }));
          this.doing = true;
          this.$httpRequestOpera(closeAccount.batchCreate(list), {
            errorTitle: '生成结算单完成',
            success: res => {
              this.$emit('change');
              this.doing = false;
            },
            error: () => {
              this.doing = false;
            }
          });
        });
      }
    }
  };
</script>
