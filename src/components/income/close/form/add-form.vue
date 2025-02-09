<template>
  <dialog-template :btnSavePosition="120">
    <template slot="title">{{addType === 0 ? '编辑结算单' : addType === 1 ? '开具发票' : '编辑发票'}}</template>
    <template slot="btnSave">
      <el-button class="mt-10" :disabled="doing" @click="save('form')" plain type="primary">保存</el-button>
    </template>
    <template slot="content">
      <el-form :model="form" label-width="120px" ref="form">
        <el-form-item label="合同" style="margin-bottom: 0">{{form.contractName}}</el-form-item>
        <el-form-item label="甲方" style="margin-bottom: 0">{{form.customerName}}</el-form-item>
        <el-form-item label="结算单号" style="margin-bottom: 0">{{form.statementNo}}</el-form-item>
        <el-row>
          <el-col :span="8">
            <el-form-item label="结算单金额" >{{form.statementAmount | formatMoney}}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="待回款金额" >{{form.unreturnedAmount | formatMoney}}</el-form-item>
          </el-col>
        </el-row>
        <div v-if="addType === 0">
          <el-form-item label="是否含税" prop="includeTax"
                        :rules="[{required: true, message: '请选择是否含税', trigger: 'change'}]"
                        label-width="120px">
            <el-switch
              v-model="form.includeTax"
              active-text="是" inactive-text="否" active-color="#13ce66"
              inactive-color="#ff4949" active-value="1" inactive-value="0">
            </el-switch>
          </el-form-item>
          <el-form-item label="税率" prop="taxRate" label-width="120px"
                        :rules="[{required: true, message: '请输入税率', trigger: 'blur'},
                         {required: true, type:'number', max:100, message: '税率不能大于100%', trigger: 'blur'}]">
            <oms-input placeholder="请输入税率" type="number" v-model.number="form.taxRate">
              <span slot="append">%</span>
            </oms-input>
          </el-form-item>
          <el-form-item label="折扣" label-width="120px">
            <oms-input placeholder="请输入折扣" type="number" v-model="form.discountAmount">
              <span slot="append">%</span>
            </oms-input>
          </el-form-item>
        </div>
        <div v-if="addType === 1 || addType === 2">
          <el-form-item label="发票类型" label-width="120px" prop="invoiceType"
                        :rules="[{required: true, message: '请选择发票类型', trigger: 'blur'}]">
            <el-radio-group v-model="form.invoiceType">
              <el-radio-button :label="item.key" :key="item.key" v-for="item in invoiceTypes">{{item.label}}</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="发票内容" label-width="120px" prop="invoiceContents"
                        :rules="[{required: true, message: '请输入发票内容', trigger: 'blur'}]">
            <oms-input placeholder="请输入发票内容" type="input" v-model="form.invoiceContents"/>
          </el-form-item>
          <el-form-item label="发票号" label-width="120px" prop="invoiceNo"
                        :rules="[{required: true, message: '请输入发票号', trigger: 'blur'}]">
            <oms-input placeholder="请输入发票号" type="input" v-model="form.invoiceNo"/>
          </el-form-item>
          <el-form-item label="发票金额" label-width="120px" prop="invoiceAmount"
                        :rules="[{required: true, message: '请输入发票金额', trigger: 'blur'}]">
            <oms-input placeholder="请输入发票金额" type="input" v-model="form.invoiceAmount"
                       @blur="formatInvoiceAmountPrice"/>
          </el-form-item>
          <el-form-item label="开票日期" label-width="120px"  prop="invoiceTime"
                        :rules="[{required: true, message: '请选择开票日期', trigger: 'blur'}]">
            <el-date-picker v-model="form.invoiceTime" type="date" placeholder="选择日期" style="width: 200px"></el-date-picker>
          </el-form-item>
        </div>
      </el-form>
    </template>
  </dialog-template>
</template>
<script>
  import {closeAccount} from '@/resources';
  import methodsMixin from '@/mixins/methodsMixin';
  import utils from '@/tools/utils';

  export default {
    mixins: [methodsMixin],
    data() {
      return {
        form: {
          contractId: '',
          customerId: '',
          customerName: '',
          projectId: '',
          projectName: '',
          orderNumber: '',
          orgGoodsId: '',
          invoiceTime: ''
        },
        doing: false,
        actionType: '添加',
        loading: false
      };
    },
    props: {
      formItem: Object,
      index: Number,
      addType: Number
    },
    watch: {
      index: function (val) {
        if (this.formItem.statementId) {
          this.form = Object.assign({}, this.formItem);
          this.form.preferentialAmount = utils.autoformatDecimalPoint(this.form.preferentialAmount, true);
          this.form.invoiceAmount = utils.autoformatDecimalPoint(this.form.invoiceAmount);
          this.actionType = '编辑';
        } else {
          this.form = {
            billingModelName: '',
            invoiceTime: '',
            billingItems: []
          };
          this.actionType = '添加';
        }
      }
    },
    computed: {
      invoiceTypes() {
        return this.$store.state.invoiceTypes;
      }
    },
    methods: {
      formatPrice() {
        this.form.preferentialAmount = utils.autoformatDecimalPoint(this.form.preferentialAmount, true);
      },
      formatInvoiceAmountPrice() {
        this.form.invoiceAmount = utils.autoformatDecimalPoint(this.form.invoiceAmount);
      },
      save(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid && this.doing === false) {
            this.doing = true;
            if (this.addType === 0) {
              this.form.invoiceType = undefined;
              this.form.invoiceNo = undefined;
              this.form.invoiceAmount = undefined;
            }
            this.$httpRequestOpera(closeAccount.update(this.form), {
              errorTitle: '保存失败',
              success: res => {
                if (res.data.code === 200) {
                  this.$notify.success({message: '成功保存'});
                  this.doing = false;
                  this.$emit('change');
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
