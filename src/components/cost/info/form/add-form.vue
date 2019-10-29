<template>
  <dialog-template :btnSavePosition="120">
    <template slot="title">{{actionType}}计费模板</template>
    <template slot="btnSave">
      <el-button class="mt-10" :disabled="doing" @click="save('form')" plain type="primary">保存</el-button>
    </template>
    <template slot="content">
      <el-form :model="form" :rules="rules" label-width="120px" ref="form">
        <el-form-item label="模板名称" prop="billingModelName">
          <oms-input placeholder="请输入计费模板名称" type="input" v-model="form.billingModelName"/>
        </el-form-item>
        <el-form-item label="绑定货品计费" prop="billingModelType"
                      :rules="[{required: true, message: '请选择绑定货品计费', trigger: 'change'}]">
          <el-switch v-model="form.billingModelType"
                     active-value="1" inactive-value="0" active-text="是" inactive-text="否"
                     @change="billingModelTypeChange"></el-switch>
        </el-form-item>
      </el-form>
      <el-form :model="currentItem" :rules="rules" label-width="120px" ref="addForm">
        <cost-form-util ref="costUtil" :currentItem="currentItem" :billingModelType="form.billingModelType"/>
        <el-form-item>
          <el-button type="primary" @click="addItem">添加</el-button>
        </el-form-item>
        <h2>计费项</h2>
        <cost-table-util :data="form.billingItems" @edit="edit" @remove="remove"/>
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
          billingModelType: '1',
          billingItems: []
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
          proportion: '',
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
          costModel.queryDetail(this.formItem).then(res => {
            if (res.data.code === 200) {
              this.form = Object.assign({}, res.data.data);
            }
          });
          this.actionType = '编辑';
        } else {
          this.form = {
            billingModelName: '',
            billingModelType: '1',
            billingItems: []
          };
          this.actionType = '添加';
        }
        this.resetItem();
        this.$nextTick(() => {
          this.$refs['form'] && this.$refs['form'].clearValidate();
        });
      }
    },
    methods: {
      billingModelTypeChange() {
        this.form.billingItems = [];
      },
      addItem() {
        this.$refs.addForm.validate(v => {
          if (!v) return;
          this.form.billingItems.push(this.currentItem);
          this.resetItem();
        });
      },
      edit(item) {
        this.remove(item);
        this.currentItem = Object.assign({}, item);
        this.$refs.costUtil.currentCostType = this.$refs.costUtil.costTypes.find(f => f.id === item.billingType);
      },
      remove(item) {
        this.form.billingItems = this.form.billingItems.filter(f => f !== item);
      },
      resetItem() {
        this.currentItem = {
          businessType: '',
          billingType: '',
          billingItemId: '',
          billingItemName: '',
          billingModelTemplate: '',
          companyDepartment: '',
          businessManageId: '',
          ladderState: '0',
          unitPrice: '',
          proportion: '',
          upperLimit: '',
          lowerLimit: '',
          billingRules: '',
          billingUnit: '',
          billingItemNo: '',
          billingModelType: '1'
        };
        this.$nextTick(() => {
          this.$refs['addForm'].clearValidate();
        });
      },
      save(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid && this.doing === false) {
            if (!this.form.billingItems.length) {
              return this.$notify.info({message: '请添加计费项'});
            }
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
              this.doing = true;
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
