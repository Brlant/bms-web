<template>
  <dialog-template :btnSavePosition="120">
    <template slot="title">编辑对账单</template>
    <template slot="btnSave">
      <el-button class="mt-10" :disabled="doing" @click="save('form')" plain type="primary">保存</el-button>
    </template>
    <template slot="content">
      <el-form :model="form" label-width="120px" ref="form">
        <el-form-item label="合同">{{form.contractName}}</el-form-item>
        <el-form-item label="甲方">{{form.customerName}}</el-form-item>
        <el-form-item label="是否含税" prop="billingUntilPrice" label-width="120px">
          <el-switch
            v-model="form.includeTax"
            active-text="是" inactive-text="否" active-color="#13ce66"
            inactive-color="#ff4949" active-value="1" inactive-value="0">
          </el-switch>
        </el-form-item>
        <el-form-item label="税率" label-width="120px" v-if="form.includeTax === '1'">
          <oms-input placeholder="请输入税率" type="input" v-model="form.taxRate"/>
        </el-form-item>
        <el-form-item label="优惠金额"  label-width="120px">
          <oms-input placeholder="请输入优惠金额" type="input" v-model="form.preferentialAmount" @blur="formatPrice"/>
        </el-form-item>
        <el-form-item label="折扣" label-width="120px">
          <oms-input placeholder="请输入折扣" type="input" v-model="form.discountAmount">
            <span slot="append">%</span>
          </oms-input>
        </el-form-item>
      </el-form>
    </template>
  </dialog-template>
</template>
<script>
  import {accountBill} from '@/resources';
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
          orgGoodsId: ''
        },
        doing: false,
        actionType: '添加',
        loading: false
      };
    },
    props: {
      formItem: Object,
      index: Number
    },
    watch: {
      index: function (val) {
        if (this.formItem.accountCheckId) {
          this.form = Object.assign({}, this.formItem);
          this.actionType = '编辑';
        } else {
          this.form = {
            billingModelName: '',
            billingItems: []
          };
          this.actionType = '添加';
        }
      }
    },
    methods: {
      formatPrice() {
        this.formItem.preferentialAmount = utils.autoformatDecimalPoint(this.formItem.preferentialAmount);
      },
      formatDisPrice() {
        this.formItem.discountAmount = utils.autoformatDecimalPoint(this.formItem.discountAmount);
      },
      save(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid && this.doing === false) {
            this.doing = true;
            this.$httpRequestOpera(accountBill.update(this.form), {
              errorTitle: '编辑失败',
              success: res => {
                if (res.data.code === 200) {
                  this.$notify.success({message: '编辑成功'});
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
