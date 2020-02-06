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
        <el-table-column prop="billingCustomName" label="计费项名称" width="200">
          <template slot-scope="scope">{{scope.row.billingCustomName}}</template>
        </el-table-column>
        <el-table-column prop="billingUntilPrice" label="单价" width="150px">
          <template slot-scope="scope">{{scope.row.billingUntilPrice}}</template>
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
      <el-form :model="invoiceForm" label-width="120px" ref="form">
        <el-row>
          <el-col :span="8">
            <el-form-item label="是否含税" label-width="120px">是</el-form-item>
          </el-col>
          <el-col :span="16" style="padding-top: 10px">
            <span class="total-info" v-if="totalInfo">
                <span class="total-info__item">已勾选计费数量总计：{{totalInfo.billingQuantity}}</span>
                <span class="total-info__item">已勾选结算金额总计：{{totalInfo.statementAmount | formatMoney}}</span>
            </span>
          </el-col>
        </el-row>
        <div class="invoice-box" v-for="(item, index) in invoiceForm.invoiceData">
          <el-row>
            <h2>合同：{{item.contractName}}</h2>
            <el-form-item label="已关联发票信息">
              <el-select v-model="item.contractInvoiceId" placeholder="请选择已关联发票信息"
                         @change="val => contractInvoiceIdChange(item, val)" clearable popper-class="selects--custom is-max">
                <el-option :value="invoice.contractInvoiceId" :label="invoice.invoiceContentsLabel"
                           :key="invoice.contractInvoiceId" v-for="invoice in item.invoiceList">
                  <div style="line-height:20px">发票内容：{{invoice.invoiceContentsLabel}}</div>
                  <div style="line-height:20px">发票类型：{{invoice.invoiceTypeLabel}}</div>
                  <div style="line-height:20px">税率：{{invoice.taxRate}}%</div>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="发票类型" :prop="`invoiceData.${index}.invoiceType`"
                          :rules="[{required: true, message: '请选择发票类型', trigger: 'change'}]">
              <el-select v-model="item.invoiceType">
                <el-option :value="item.key" :label="item.label" :key="item.key" v-for="item in invoiceTypes">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="发票内容" :prop="`invoiceData.${index}.invoiceContents`"
                          :rules="[{required: true, message: '请输入发票内容', trigger: 'change'}]">
              <el-select v-model="item.invoiceContents" placeholder="请选择发票内容">
                <el-option :value="item.key" :label="item.label" :key="item.key" v-for="item in invoiceContents">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="税率" :prop="`invoiceData.${index}.taxRate`"
                          :rules="[{required: true, message: '请输入税率', trigger: 'blur'},
                          {required: true, type:'number', max:100, message: '税率不能大于100%', trigger: 'blur'}]">
              <el-input type="number" v-model.number="item.taxRate">
                <span slot="suffix">%</span>
              </el-input>
            </el-form-item>
          </el-row>
        </div>
        <el-form-item label="备注" label-width="120px">
          <el-input type="textarea" v-model="form.statementRemark"></el-input>
        </el-form-item>
      </el-form>
    </template>
  </dialog-template>
</template>
<script>
  import utils from '@/tools/utils';
  import {closeAccount, InvoiceManger} from '@/resources';

  export default {
    props: {
      data: Array,
      formatBillingItemName: Function
    },
    data() {
      return {
        doing: false,
        form: {
          statementRemark: ''
        },
        invoiceForm: {
          invoiceData: []
        }
      };
    },
    computed: {
      totalInfo() {
        if (!this.data || !this.data.length) return;
        let billingQuantity = 0;
        let statementAmount = 0;
        this.data.forEach(i => {
          billingQuantity += i.billingQuantity;
          statementAmount += Number(i.statementAmount || 0);
        });
        return {billingQuantity, statementAmount};
      },
      invoiceTypes() {
        return this.$store.state.invoiceTypes;
      },
      invoiceContents() {
        return this.$getDict('invoiceContent');
      }
    },
    watch: {
      data: {
        handler(val) {
          if (!this.data) {
            this.invoiceForm.invoiceData = [];
            return;
          }
          // 合并相同的合同
          let obj = {};
          this.data.forEach(i => {
            obj[i.contractId] = i;
          });
          this.invoiceForm.invoiceData = Object.values(obj).map(m => {
            let item = Object.assign({}, m, {
              contractInvoiceId: '',
              invoiceType: '',
              taxRate: '',
              invoiceContents: '',
              invoiceList: []
            });
            this.queryInvoice(item);
            return item;
          });
        },
        immediate: true
      }
    },
    methods: {
      queryInvoice(item) {
        let params = {
          contractId: item.contractId
        };
        InvoiceManger.query(params).then(res => {
          res.data.data.forEach(i => {
            i.status = 'view';
            let item = this.invoiceContents.find(f => f.key === i.invoiceContents);
            i.invoiceContentsLabel = item && item.label || i.invoiceContents;
            let invoiceTypeItem = this.invoiceTypes.find(f => f.key === i.invoiceType);
            i.invoiceTypeLabel = invoiceTypeItem && invoiceTypeItem.label || i.invoiceType;
          });
          item.invoiceList = res.data.data;
          if (item.invoiceList.length === 1) {
            item.contractInvoiceId = item.invoiceList[0].contractInvoiceId;
            item.invoiceType = item.invoiceList[0].invoiceType;
            item.invoiceContents = item.invoiceList[0].invoiceContents;
            item.taxRate = item.invoiceList[0].taxRate;
          }
        });
      },
      contractInvoiceIdChange(item, val) {
        if (!val) return;
        let contractInvoice = item.invoiceList.find(f => f.contractInvoiceId === val);
        if (!contractInvoice) return;
        item.invoiceType = contractInvoice.invoiceType;
        item.invoiceContents = contractInvoice.invoiceContents;
        item.taxRate = contractInvoice.taxRate;
        this.$nextTick(() => {
          this.$refs['form'].clearValidate();
        });
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
          let list = this.data.map(m => {
            let contractInvoice = this.invoiceForm.invoiceData.find(f => f.contractId === m.contractId);
            let invoiceContentsItem = this.invoiceContents.find(f => f.key === contractInvoice.invoiceType);
            return {
              billingOfAccountId: m.billingOfAccountId,
              statementAmount: m.statementAmount,
              includeTax: '1',
              invoiceType: contractInvoice.invoiceType,
              invoiceContents: invoiceContentsItem && invoiceContentsItem.label || contractInvoice.invoiceContents,
              taxRate: contractInvoice.taxRate,
              statementRemark: this.form.statementRemark
            };
          });

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
