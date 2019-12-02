<template>
  <dialog-template :btnSavePosition="120">
    <template slot="title">生成预计金额结算单</template>
    <template slot="btnSave">
      <el-button class="mt-10" :disabled="doing" @click="save('form')" plain type="primary">生成</el-button>
    </template>
    <template slot="content">
      <el-form :model="form" :rules="rules" label-width="120px" ref="form">
        <el-form-item label="甲方" prop="customerId" :rules="[{required: true, message: '请选择甲方', trigger: 'change'}]">
          <org-select :list="orgList" @change="customerIdChange"
                      :remoteMethod="queryAllOrg"
                      placeholder="请输入名称搜索甲方" v-model="form.customerId"></org-select>
        </el-form-item>

        <el-form-item label="合同" prop="contractId"
                      :rules="[{required: true, message: '请选择合同', trigger: 'change'}]">
          <el-select placeholder="请输入名称搜索合同" v-model="form.contractId"
                     filterable clearable remote :remote-method="queryContractListNew" @focus="queryContractListNew()">
            <el-option :label="item.contractName" :value="item.contractId" :key="item.contractId"
                       v-for="item in contractList"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="预计结算金额" prop="estimatedAmount" label-width="120px"
                      :rules="[{required: true, message: '请输入预计结算金额', trigger: 'blur'}]">
          <oms-input placeholder="请输入预计结算金额" type="number" v-model="form.estimatedAmount" @blur="formatPrice"/>
        </el-form-item>
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
  import {Contact, contractAccountDetail} from '@/resources';
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
          taxRate: ''
        },
        doing: false,
        rules: {
          billingModelName: [
            {required: true, message: '名称', trigger: 'blur'}
          ]
        },
        actionType: '添加',
        loading: false
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
            taxRate: ''
          };
          this.actionType = '添加';
        }
        this.$nextTick(() => {
          this.$refs['form'] && this.$refs['form'].clearValidate();
        });
      }
    },
    methods: {
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
            this.$httpRequestOpera(contractAccountDetail.createAmount(this.form), {
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
