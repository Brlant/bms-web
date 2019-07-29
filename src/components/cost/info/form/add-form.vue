<template>
  <dialog-template :btnSavePosition="100">
    <template slot="title">{{actionType}}</template>
    <template slot="btnSave">
      <el-button :disabled="doing" @click="save('form')" plain type="primary">保存</el-button>
    </template>
    <template slot="content">
      <el-form :model="form" :rules="rules" label-width="140px" ref="form">
        <el-form-item label="计费模型名称" prop="billingModelName">
          <oms-input placeholder="请输入计费模型名称" type="input" v-model="form.billingModelName"/>
        </el-form-item>
        <el-form-item label="计费模型类型" prop="billingModelTemplate">
          <el-radio-group v-model="form.billingModelTemplate" size="small" @change="billingModelTemplateChange">
            <el-radio-button label="0">普通计费模型</el-radio-button>
            <el-radio-button label="1">计费模板</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="计费项" v-if="form.billingModelTemplate === '1'" prop="billingItemIds">
          <el-select placeholder="请选择计费项" v-model="form.billingItemIds"
                     filterable clearable multiple remote :remote-method="queryCostItem">
            <el-option :label="item.billingItemName" :value="item.billingItemId" :key="item.billingItemId"
                       v-for="item in costItemList"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </template>
  </dialog-template>
</template>
<script>
  import {costModel} from '@/resources';
  import methodsMixin from '@/mixins/methodsMixin';

  export default {
    mixins: [methodsMixin],

    data() {
      return {
        form: {},
        doing: false,
        rules: {
          billingModelName: [
            {required: true, message: '请输入计费模型名称', trigger: 'blur'}
          ],
          billingModelTemplate: [
            {required: true, message: '请输入计费模型类型', trigger: 'change'}
          ],
          billingItemIds: [
            {required: true, type: 'array', message: '请选择计费项', trigger: 'change'}
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
        if (this.formItem.billingModelId) {
          this.form = Object.assign({}, this.formItem);
          this.actionType = '编辑';
        } else {
          this.form = {
            billingModelName: '',
            billingModelTemplate: '',
            companyDepartment: '',
            businessManageId: '',
            contractTime: ''
          };
          this.actionType = '添加';
        }
        this.$nextTick(() => {
          this.$refs['form'] && this.$refs['form'].clearValidate();
        });
      }
    },
    methods: {
      billingModelTemplateChange(val) {
        this.$refs['form'].clearValidate();
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
