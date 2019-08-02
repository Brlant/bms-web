<template>
  <dialog-template :btnSavePosition="100">
    <template slot="title">{{actionType}}预收款</template>
    <template slot="btnSave">
      <el-button :disabled="doing" @click="save('form')" plain type="primary">保存</el-button>
    </template>
    <template slot="content">
      <el-form :model="form" :rules="rules" label-width="100px" ref="form">
        <el-form-item label="单位" prop="customerId">
          <org-select :list="orgList"
                      :remoteMethod="queryAllOrg"
                      placeholder="请输入名称搜索单位" v-model="form.customerId"></org-select>
        </el-form-item>
        <el-form-item label="余额">
          <oms-input placeholder="请输入余额" type="input" v-model="form.advanceBalance" @blur="formatPrice"/>
        </el-form-item>
      </el-form>
    </template>
  </dialog-template>
</template>
<script>
  import {preBalance} from '@/resources';
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
        this.form.advanceBalance = utils.autoformatDecimalPoint(this.form.advanceBalance);
      },
      save(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid && this.doing === false) {
            if (!this.form.orgAccountId) {
              this.doing = true;
              this.$httpRequestOpera(preBalance.save(this.form), {
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
              this.$httpRequestOpera(preBalance.update(this.form), {
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
