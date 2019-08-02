<template>
  <dialog-template :btnSavePosition="120">
    <template slot="title">{{actionType}}预收款</template>
    <template slot="btnSave">
      <el-button :disabled="doing" @click="save('form')" plain type="primary">保存</el-button>
    </template>
    <template slot="content">
      <el-form :model="form" :rules="rules" label-width="120px" ref="form">
        <el-form-item label="单位" prop="customerId">
          <org-select :list="orgList"
                      :remoteMethod="queryAllOrg"
                      placeholder="请输入名称搜索单位" v-model="form.customerId"></org-select>
        </el-form-item>
        <el-form-item label="预收金额" label-width="120px" prop="advanceAmount"
                      :rules="[{required: true, message: '请输入预收金额', trigger: 'blur'}]">
          <oms-input placeholder="请输入预收金额" type="input" v-model="form.advanceAmount"
                     @blur="formatPrice"/>
        </el-form-item>
        <el-form-item label="发票号" label-width="120px" prop="invoiceNumber"
                      :rules="[{required: true, message: '请输入发票号', trigger: 'blur'}]">
          <oms-input placeholder="请输入发票号" type="input" v-model="form.invoiceNumber"/>
        </el-form-item>
        <el-form-item label="发票日期" label-width="120px" prop="invoiceTime"
                      :rules="[{required: true, message: '请选择发票日期', trigger: 'change'}]">
          <el-date-picker v-model="form.invoiceTime" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="回款日期" label-width="120px" prop="backAmountTime"
                      :rules="[{required: true, message: '请选择回款日期', trigger: 'change'}]">
          <el-date-picker v-model="form.backAmountTime" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <el-form-item label="银行名称" label-width="120px" prop="bankName"
                      :rules="[{required: true, message: '请输入银行名称', trigger: 'blur'}]">
          <oms-input placeholder="请输入银行名称" type="input" v-model="form.bankName"/>
        </el-form-item>
      </el-form>
    </template>
  </dialog-template>
</template>
<script>
  import {preRecords} from '@/resources';
  import methodsMixin from '@/mixins/methodsMixin';
  import utils from '@/tools/utils';

  export default {
    mixins: [methodsMixin],

    data() {
      return {
        form: {},
        doing: false,
        rules: {
          customerId: [
            {required: true, message: '请选择单位', trigger: 'change'}
          ],
          advanceBalance: [
            {required: true, message: '请输入余额', trigger: 'blur'}
          ]
        },
        actionType: '添加',
        orgList: []
      };
    },
    props: {
      formItem: Object,
      index: Number
    },
    watch: {
      index: function (val) {
        this.$refs['form'].clearValidate();
        if (this.formItem.orgAccountId) {
          this.orgList = [
            {name: this.formItem.orgName, id: this.formItem.customerId}
          ];
          this.form = Object.assign({}, this.formItem);
          this.actionType = '编辑';
        } else {
          this.form = {
            orgName: '',
            advanceBalance: ''
          };
          this.actionType = '添加';
        }
      }
    },
    methods: {
      formatPrice() {// 格式化单价，保留两位小数
        this.form.advanceAmount = utils.autoformatDecimalPoint(this.form.advanceAmount);
      },
      save(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid && this.doing === false) {
            this.orgList.forEach(i => {
              if (i.id === this.form.customerId) {
                this.form.customerName = i.name;
              }
            });
            if (!this.form.advanceCollectionJobsId) {
              this.doing = true;
              this.$httpRequestOpera(preRecords.save(this.form), {
                errorTitle: '添加失败',
                success: res => {
                  if (res.data.code === 200) {
                    this.$notify.success({message: '添加成功'});
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
            } else {
              this.$httpRequestOpera(preRecords.update(this.form), {
                errorTitle: '修改失败',
                success: res => {
                  if (res.data.code === 200) {
                    this.$notify.success({message: '修改成功'});
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
          }
        });
      }
    }
  };
</script>
