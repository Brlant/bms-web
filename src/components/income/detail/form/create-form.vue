<template>
  <dialog-template :btnSavePosition="120">
    <template slot="title">生成预计金额结算单</template>
    <template slot="btnSave">
      <el-button class="mt-10" :disabled="doing" @click="save('form')" plain type="primary">生成</el-button>
    </template>
    <template slot="content">
      <el-form :model="form" :rules="rules" label-width="150px" ref="form">
        <el-form-item label="甲方" prop="customerId" :rules="[{required: true, message: '请选择甲方', trigger: 'change'}]">
          <org-select :list="orgList" @change="customerIdChange"
                      :remoteMethod="queryAllOrg"
                      placeholder="请输入名称搜索甲方" v-model="form.customerId"></org-select>
        </el-form-item>

        <el-form-item label="合同" prop="contractId"
                      :rules="[{required: true, message: '请选择合同', trigger: 'change'}]">
          <el-select placeholder="请输入名称搜索合同" v-model="form.contractId" @change="contractIdChange"
                     filterable clearable remote :remote-method="queryContractListNew" @focus="queryContractListNew()">
            <el-option :label="item.contractName" :value="item.contractId" :key="item.contractId"
                       v-for="item in contractList"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="预计结算金额" prop="estimatedAmount"
                      :rules="[{required: true, message: '请输入预计结算金额', trigger: 'blur'}]">
          <oms-input placeholder="请输入预计结算金额" type="number" v-model="form.estimatedAmount" @blur="formatPrice"/>
        </el-form-item>
        <el-form-item label="是否含税">是</el-form-item>
        <el-form-item label="合同已关联发票信息" v-if="form.contractId">
          <el-select v-model="form.contractInvoiceId" placeholder="请选择已关联发票信息" popper-class="selects--custom is-max"
                     @change="val => contractInvoiceIdChange(val)" clearable>
            <el-option :value="invoice.contractInvoiceId" :label="invoice.invoiceContentsLabel"
                       :key="invoice.contractInvoiceId" v-for="invoice in invoiceList">
              <div style="line-height:20px">发票内容：{{invoice.invoiceContentsLabel}}</div>
              <div style="line-height:20px">发票类型：{{invoice.invoiceTypeLabel}}</div>
              <div style="line-height:20px">税率：{{invoice.taxRate}}%</div>
            </el-option>
          </el-select>
        </el-form-item>
        <div v-if="form.contractInvoiceId">
          <el-form-item label="发票类型">
            {{invoiceTypes[form.invoiceType] && invoiceTypes[form.invoiceType].label || form.invoiceType }}
          </el-form-item>
          <el-form-item label="发票内容" :span="8">
            <dict :dict-group="'invoiceContent'" :dict-key="form.invoiceContents"></dict>
          </el-form-item>
          <el-form-item label="税率" :span="8">{{ form.taxRate }}%</el-form-item>
        </div>
        <div v-else>
          <el-form-item label="发票类型" prop="invoiceType"
                        :rules="[{required: true, message: '请选择发票类型', trigger: 'change'}]">
            <el-select v-model="form.invoiceType">
              <el-option :value="item.key" :label="item.label" :key="item.key" v-for="item in invoiceTypes">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发票内容" :prop="'invoiceContents'"
                        :rules="[{required: true, message: '请输入发票内容', trigger: 'change'}]">
            <el-select v-model="form.invoiceContents" placeholder="请选择发票内容">
              <el-option :value="item.key" :label="item.label" :key="item.key" v-for="item in invoiceContents">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="税率" :prop="'taxRate'"
                        :rules="[{required: true, message: '请输入税率', trigger: 'blur'},
                       {required: true, type:'number', max:100, message: '税率不能大于100%', trigger: 'blur'}]">
            <el-input  type="number" v-model.number="form.taxRate" :max="100">
              <span slot="suffix">%</span>
            </el-input>
          </el-form-item>
        </div>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="form.statementRemark"></el-input>
        </el-form-item>
      </el-form>
    </template>
  </dialog-template>
</template>
<script>
  import {Contact, contractAccountDetail, InvoiceManger} from '@/resources';
  import methodsMixin from '@/mixins/methodsMixin';
  import utils from '@/tools/utils';

  export default {
    props: {
      formItem: Object,
      index: Number
    },
    mixins: [methodsMixin],
    data() {
      return {
        form: {
          contractId: '',
          customerId: '',
          estimatedAmount: '',
          includeTax: '1',
          taxRate: '',
          invoiceType: '',
          invoiceContents: '',
          statementRemark: '',
          contractInvoiceId: ''
        },
        doing: false,
        rules: {
          billingModelName: [
            {required: true, message: '名称', trigger: 'blur'}
          ]
        },
        actionType: '添加',
        loading: false,
        invoiceList: []
      };
    },
    computed: {
      costTypes() {
        let costTypes = this.$store.state.costTypes;
        let values = [];
        costTypes.forEach(i => {
          i.items.forEach(f => {
            values.push({value: f.name});
          });
        });
        return values;
      },
      invoiceTypes() {
        return this.$store.state.invoiceTypes;
      },
      invoiceContents() {
        return this.$getDict('invoiceContent');
      }
    },
    watch: {
      index: function (val) {
        if (this.formItem.billingModelId) {
          this.form = Object.assign({}, val);
          this.actionType = '编辑';
        } else {
          this.form = {
            contractId: '',
            customerId: '',
            estimatedAmount: '',
            includeTax: '1',
            taxRate: '',
            invoiceType: '',
            invoiceContents: '',
            statementRemark: '',
            contractInvoiceId: ''
          };
          this.actionType = '添加';
        }
        this.$nextTick(() => {
          this.$refs['form'] && this.$refs['form'].clearValidate();
        });
      }
    },
    methods: {
      contractIdChange(val) {
        this.invoiceList = [];
        this.form.contractInvoiceId = '';
        this.form.invoiceType = '';
        this.form.invoiceContents = '';
        this.form.taxRate = '';
        this.$nextTick(() => {
          this.$refs['form'].clearValidate();
        });
        if(!val) return;
        this.queryInvoice();
      },
      queryInvoice() {
        let params = {
          contractId: this.form.contractId
        };
        InvoiceManger.query(params).then(res => {
          res.data.data.forEach(i => {
            i.status = 'view';
            let item = this.invoiceContents.find(f => f.key === i.invoiceContents);
            i.invoiceContentsLabel = item && item.label || i.invoiceContents;
            let invoiceTypeItem = this.invoiceTypes.find(f => f.key === i.invoiceType);
            i.invoiceTypeLabel = invoiceTypeItem && invoiceTypeItem.label || i.invoiceType;
          });
          this.invoiceList = res.data.data;
          if (this.invoiceList.length === 1) {
            this.form.contractInvoiceId = this.invoiceList[0].contractInvoiceId;
            this.form.invoiceType = this.invoiceList[0].invoiceType;
            this.form.invoiceContents = this.invoiceList[0].invoiceContents;
            this.form.taxRate = this.invoiceList[0].taxRate;
          }
        });
      },
      contractInvoiceIdChange(val) {
        if (!val) return;
        let contractInvoice = this.invoiceList.find(f => f.contractInvoiceId === val);
        if (!contractInvoice) return;
        this.form.invoiceType = contractInvoice.invoiceType;
        this.form.invoiceContents = contractInvoice.invoiceContents;
        this.form.taxRate = contractInvoice.taxRate;
        this.$nextTick(() => {
          this.$refs['form'].clearValidate();
        });
      },
      customerIdChange(val) {
        this.contractList = [];
        if (!val) return;
        this.queryContractListNew();
      },
      queryContractListNew(query) {
        if (!this.form.customerId) return this.$notify.info('请选择甲方');
        let params = {keyWord: query, orgId: this.form.customerId};
        Contact.query(params).then(res => {
          if (res.data.code === 200) {
            this.contractList = res.data.data.list;
          } else {
            this.contractList = [];
          }
        });
      },
      formatPrice() {// 格式化单价，保留两位小数
        this.form.estimatedAmount = utils.autoformatDecimalPoint(this.form.estimatedAmount);
      },
      save(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid && this.doing === false) {
            this.doing = true;
            let form = JSON.parse(JSON.stringify(this.form));
            let invoiceContentsItem = this.invoiceContents.find(f => f.key === this.form.invoiceType);
            if(invoiceContentsItem) {
              form.invoiceContents = invoiceContentsItem.label;
            }
            this.$httpRequestOpera(contractAccountDetail.createAmount(form), {
              errorTitle: '失败',
              success: res => {
                if (res.data.code === 200) {
                  this.$notify.success({message: '生成成功'});
                  this.doing = false;
                  this.$emit('change', res.data);
                } else {
                  this.doing = false;
                }
              },
              error: () => {
                this.doing = false;
              }
            });
          }
        });
      }
    }
  };
</script>
