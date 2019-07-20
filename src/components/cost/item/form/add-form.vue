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
        <el-form-item label="计费项" v-if="form.billingModelTemplate === '1'">
          <el-select placeholder="请选择计费项" v-model="form.billingItemIds"
                     filterable clearable remote :remote-method="queryDepartmentUserNew">
            <el-option :label="item.name" :value="item.id" :key="item.id"
                       v-for="item in departmentUserList"></el-option>
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
      </el-form>
    </template>
  </dialog-template>
</template>
<script>
  import {costItem} from '@/resources';
  import methodsMixin from '@/mixins/methodsMixin';

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
      }
    },
    watch: {
      index: function (val) {
        this.$refs['form'].clearValidate();
        if (this.formItem.id) {
          this.orgList = [
            {name: this.formItem.orgName, id: this.formItem.orgId}
          ];
          this.form = Object.assign({}, this.formItem, {
            contractTime: [this.formItem.contractSignTime, this.formItem.contractOverTime]
          });
          this.actionType = '编辑';
        } else {
          this.form = {
            billingItemName: '',
            billingModelTemplate: '',
            companyDepartment: '',
            businessManageId: '',
            contractTime: ''
          };
          this.actionType = '添加';
        }
      }
    },
    methods: {
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
            this.form.contractSignTime = this.contractTime[0];
            this.form.contractOverTime = this.contractTime[1];
            if (!this.form.id) {
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
