<template>
  <dialog-template :btnSavePosition="100">
    <template slot="title">{{actionType}}</template>
    <template slot="btnSave">
      <el-button :disabled="doing" @click="save('form')" plain type="primary">保存</el-button>
    </template>
    <template slot="content">
      <el-form :model="form" :rules="rules" label-width="120px" ref="form">
        <el-form-item label="计费模板名称" prop="billingModelName">
          <oms-input placeholder="请输入计费模板名称" type="input" v-model="form.billingModelName"/>
        </el-form-item>
      </el-form>
      <el-form :model="currentItem" :rules="rules" label-width="100px" ref="form">
        <cost-form-util :currentItem="currentItem"/>
        <el-form-item>
          <el-button type="primary" @click="addItem">添加</el-button>
        </el-form-item>
        <cost-table-util :data="form.costItemList"/>
      </el-form>
    </template>
  </dialog-template>
</template>
<script>
  import {costModel} from '@/resources';
  import methodsMixin from '@/mixins/methodsMixin';
  import costFormUtil from '../costFormUtil';
  import costTableUtil from '../costTableUtil';
  export default {
    mixins: [methodsMixin],
    components: {costFormUtil, costTableUtil},
    data() {
      return {
        form: {
          billingModelName: '',
          costItemList: []
        },
        doing: false,
        rules: {
          billingModelName: [
            {required: true, message: '名称', trigger: 'blur'}
          ]
        },
        actionType: '添加',
        orgList: [],
        currentItem: {
          businessType: '',
          billingType: '',
          billingItemId: '',
          billingItemName: '',
          billingModelTemplate: '',
          companyDepartment: '',
          businessManageId: '',
          ladderState: '0',
          unitPrice: '',
          upperLimit: '',
          lowerLimit: '',
          billingRules: '',
          billingUnit: '',
          billingItemNo: ''
        },
      };
    },
    props: {
      formItem: Object,
      index: Number
    },
    watch: {
      index: function (val) {
        if (this.formItem.billingModelId) {
          this.form = Object.assign({}, this.formItem);
          this.actionType = '编辑';
        } else {
          this.form = {
            billingModelName: '',
            costItemList: []
          };
          this.actionType = '添加';
        }
        this.$nextTick(() => {
          this.$refs['form'] && this.$refs['form'].clearValidate();
        });
      }
    },
    methods: {
      addItem() {
        this.$refs.addForm.valid(v => {
          if (!v) return;

        });
      },
      save(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid && this.doing === false) {
            if (!this.form.billingModelId) {
              this.doing = true;
              this.$httpRequestOpera(costModel.save(this.form), {
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
              this.$httpRequestOpera(costModel.update(this.form), {
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
