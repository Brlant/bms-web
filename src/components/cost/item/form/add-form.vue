<template>
  <dialog-template :btnSavePosition="100">
    <template slot="title">{{actionType}}</template>
    <template slot="btnSave">
      <el-button :disabled="doing" @click="save('form')" plain type="primary">保存</el-button>
    </template>
    <template slot="content">
      <el-form :model="form" :rules="rules" label-width="140px" ref="form">
        <el-form-item label="计费项名称" prop="billingItemName">
          <oms-input placeholder="请输入计费模型名称" type="input" v-model="form.billingItemName"/>
        </el-form-item>
        <el-form-item label="计费类型" prop="billingType">
          <el-select placeholder="请选择计费类型" v-model="form.billingType" clearable>
            <el-option :label="item.label" :value="item.key" :key="item.key" v-for="item in calculateType"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="业务类型">
          <el-select placeholder="请选择计费类型" v-model="form.businessType" clearable>
            <el-option :label="item.label" :value="item.key" :key="item.key" v-for="item in bizType"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否阶梯">
          <el-radio-group v-model="form.ladderState" size="small">
            <el-radio-button label="1">是</el-radio-button>
            <el-radio-button label="0">否</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="单价" prop="unitPrice">
          <oms-input placeholder="请输入单价" type="input" v-model="form.unitPrice"  @blur="formatPrice"/>
        </el-form-item>
        <el-form-item label="上限">
          <oms-input placeholder="请输入上限" type="input" v-model="form.upperLimit"  @blur="formatUpperPrice"/>
        </el-form-item>
        <el-form-item label="下限">
          <oms-input placeholder="请输入下限" type="input" v-model="form.lowerLimit"  @blur="formatLowerPrice"/>
        </el-form-item>
        <el-form-item label="单位" prop="billingUnit">
          <el-select type="text" placeholder="请选择单位" v-model.trim="form.billingUnit">
            <el-option :value="item.key" :key="item.key" :label="item.label"
                       v-for="item in measurementUnitList"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="计费规则">
          <oms-input placeholder="请输入计费规则" type="input" v-model="form.billingRules"  @blur="formatPrice"/>
        </el-form-item>
      </el-form>
    </template>
  </dialog-template>
</template>
<script>
  import {costItem} from '@/resources';
  import methodsMixin from '@/mixins/methodsMixin';
  import utils from '@/tools/utils';

  export default {
    mixins: [methodsMixin],

    data() {
      return {
        form: {},
        doing: false,
        rules: {
          billingItemName: [
            {required: true, message: '请输入计费模型名称', trigger: 'blur'}
          ],
          billingType: [
            {required: true, message: '请选择计费类型', trigger: 'change'}
          ],
          billingItemIds: [
            {required: true, type: 'array', message: '请选择所属部门', trigger: 'change'}
          ],
          ladderState: [
            {required: true, message: '请选择是否阶梯', trigger: 'change'}
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
    computed: {
      calculateType() {
        return this.$getDict('calculateType');
      },
      bizType() {
        return this.$getDict('bizType');
      },
      measurementUnitList() {
        return this.$getDict('measurementUnit');
      },
    },
    watch: {
      index: function (val) {
        this.$refs['form'].clearValidate();
        if (this.formItem.billingItemId) {
          this.actionType = '编辑';
          this.form = Object.assign({}, this.formItem);
        } else {
          this.form = {
            billingItemName: '',
            billingModelTemplate: '',
            companyDepartment: '',
            businessManageId: '',
            ladderState: '0',
            unitPrice: '',
            upperLimit: '',
            lowerLimit: '',
            billingRules: '',
            billingUnit: ''
          };
          this.actionType = '添加';
        }
      }
    },
    methods: {
      formatPrice() {// 格式化单价，保留两位小数
        this.form.unitPrice = utils.autoformatDecimalPoint(this.form.unitPrice);
      },
      formatUpperPrice() {// 格式化单价，保留两位小数
        this.form.upperLimit = utils.autoformatDecimalPoint(this.form.upperLimit);
      },
      formatLowerPrice() {// 格式化单价，保留两位小数
        this.form.lowerLimit = utils.autoformatDecimalPoint(this.form.lowerLimit);
      },
      queryDepartmentUserNew(query) {
        if (!this.form.companyDepartment) {
          this.departmentUserList = [];
          return;
        }
        let params = {
          id: this.form.companyDepartment,
          keyWord: query
        };
        this.queryDepartmentUser(params);
      },
      companyDepartmentChange(val) {
        this.departmentUserList = [];
        this.form.businessManageId = '';
      },
      save(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid && this.doing === false) {
            if (!this.form.billingItemId) {
              this.doing = true;
              this.$httpRequestOpera(costItem.save(this.form), {
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
              this.$httpRequestOpera(costItem.update(this.form), {
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
