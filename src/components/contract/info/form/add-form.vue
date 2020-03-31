<template>
  <dialog-template :btnSavePosition="120">
    <template slot="title">{{actionType}}</template>
    <template slot="btnSave">
      <el-button :disabled="doing" @click="save('form')" plain type="primary">保存</el-button>
    </template>
    <template slot="content">
      <el-form :model="form" :rules="rules" label-width="120px" ref="form">
        <el-form-item label="合同名称" prop="contractName">
          <oms-input placeholder="请输入合同名称" type="input" v-model="form.contractName"/>
        </el-form-item>
        <el-form-item label="合同编号" prop="contractNo">
          <oms-input placeholder="请输入合同编号" type="input" v-model="form.contractNo"/>
        </el-form-item>
        <el-form-item label="甲方" prop="orgId">
          <org-select :list="orgList" @change="orgIdChange"
                      :remoteMethod="queryAllOrg"
                      placeholder="请输入名称搜索甲方" v-model="form.orgId"></org-select>
        </el-form-item>
        <el-form-item label="所属部门" prop="companyDepartment">
          <el-select filterable remote placeholder="请输入名称搜所属部门" :remote-method="queryDepartment"
                     @focus="queryDepartment()"
                     :clearable="true" v-model="form.companyDepartment" popperClass="good-selects"
                     @change="companyDepartmentChange">
            <el-option :label="item.name" :value="item.id" :key="item.id" v-for="item in departmentList">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="业务员" prop="businessManageId">
          <el-select placeholder="请选择业务员" v-model="form.businessManageId"
                     filterable clearable remote :remote-method="queryDepartmentUserNew"
                     @focus="queryDepartmentUserNew()">
            <el-option :label="item.name" :value="item.id" :key="item.id"
                       v-for="item in departmentUserList"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="合同日期" prop="contractTime">
          <el-date-picker v-model="form.contractTime" range-separator="至" type="daterange"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="合同下限金额" prop="lowerLimitAmount">
          <oms-input placeholder="请输入合同下限金额" type="number" @blur="amountChange('lowerLimitAmount')"
                     v-model.number="form.lowerLimitAmount"/>
        </el-form-item>
        <el-form-item label="合同上限金额" prop="upperLimitAmount">
          <oms-input placeholder="请输入合同上限金额" type="number" @blur="amountChange('upperLimitAmount')"
                     v-model.number="form.upperLimitAmount"/>
        </el-form-item>
      </el-form>
    </template>
  </dialog-template>
</template>
<script>
  import {Contact} from '@/resources';
  import methodsMixin from '@/mixins/methodsMixin';
  import utils from '@/tools/utils';

  export default {
    mixins: [methodsMixin],

    data() {
      const validatePass = (rule, value, callback) => {
        if (value === '') {
          callback();
        } else if (value) {
          if (value <= 0) {
            return callback(new Error('输入的金额必须大于0'));
          }
          callback();
        } else {
          callback();
        }
      };
      return {
        form: {},
        doing: false,
        rules: {
          contractName: [
            {required: true, message: '请输入合同名称', trigger: 'blur'}
          ],
          contractNo: [
            {required: true, message: '请输入合同编号', trigger: 'blur'}
          ],
          orgId: [
            {required: true, message: '请选择甲方', trigger: 'change'}
          ],
          companyDepartment: [
            {required: true, message: '请选择所属部门', trigger: 'change'}
          ],
          businessManageId: [
            {required: true, message: '请选择业务员', trigger: 'change'}
          ],
          contractTime: [
            {required: true, message: '请选择合同日期', type: 'array', trigger: 'change'}
          ],
          lowerLimitAmount: [
            {validator: validatePass, trigger: 'blur'}
          ],
          upperLimitAmount: [
            {validator: validatePass, trigger: 'blur'}
          ]
        },
        actionType: '添加'
      };
    },
    props: {
      formItem: Object,
      index: Number
    },
    watch: {
      index: function (val) {
        if (this.formItem.contractId) {
          this.departmentUserList = [
            {id: this.formItem.businessManageId, name: this.formItem.businessManageName}
          ];
          this.departmentList = [
            {id: this.formItem.companyDepartment, name: this.formItem.companyDepartmentName}
          ];
          this.orgList = [
            {id: this.formItem.orgId, name: this.formItem.orgName}
          ];
          this.form = Object.assign({}, this.formItem, {
            contractTime: [this.formItem.contractSignTime, this.formItem.contractOverTime]
          });
          this.actionType = '编辑';
        } else {
          this.form = {
            contractName: '',
            contractNo: '',
            companyDepartment: '',
            businessManageId: '',
            contractTime: ''
          };
          this.actionType = '添加';
        }
        this.$nextTick(() => {
          this.$refs['form'].clearValidate();
        });
      }
    },
    methods: {
      amountChange(val) {
        if (this.form[val] === '') return;
        let str = utils.autoformatDecimalPoint(this.form[val] + '');
        this.form[val] = parseFloat(str);
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
      orgIdChange(val) {
        if (!val) {
          this.form.orgName = '';
          return;
        }
        let item = this.orgList.find(f => f.id === val);
        this.form.orgName = item.name;
      },
      save(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid && this.doing === false) {
            if (this.form.lowerLimitAmount && this.form.upperLimitAmount && this.form.lowerLimitAmount > this.form.upperLimitAmount) {
              return this.$notify.info('下限金额不能大于上限金额');
            }
            this.form.contractSignTime = this.form.contractTime[0];
            this.form.contractOverTime = this.form.contractTime[1];
            if (!this.form.contractId) {
              this.doing = true;
              this.$httpRequestOpera(Contact.save(this.form), {
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
              this.$httpRequestOpera(Contact.update(this.form), {
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
