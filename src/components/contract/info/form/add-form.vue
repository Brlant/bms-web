<template>
  <dialog-template :btnSavePosition="100">
    <template slot="title">{{actionType}}</template>
    <template slot="btnSave">
      <el-button :disabled="doing" @click="save('form')" plain type="primary">保存</el-button>
    </template>
    <template slot="content">
      <el-form :model="form" :rules="rules" label-width="140px" ref="form">
        <el-form-item label="合同名称" prop="projectName">
          <oms-input placeholder="请输入合同名称" type="input" v-model="form.projectName"/>
        </el-form-item>
        <el-form-item label="合同编号" prop="projectNumber">
          <oms-input placeholder="请输入合同编号" type="input" v-model="form.projectNumber"/>
        </el-form-item>
        <el-form-item label="所属部门" prop="orgId">
          <el-select filterable remote placeholder="请输入名称搜所属部门" :remote-method="queryDepartment"
                     :clearable="true" v-model="form.companyDepartment" popperClass="good-selects"
                     @change="companyDepartmentChange">
            <el-option :label="item.name" :value="item.id" :key="item.id" v-for="item in departmentList">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="业务员" prop="queryDepartmentUserNew">
          <el-select placeholder="请选择业务员" v-model="form.businessManageId"
                     filterable clearable remote :remote-method="queryDepartmentUserNew">
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
      </el-form>
    </template>
  </dialog-template>
</template>
<script>
  import {Contact} from '@/resources';
  import methodsMixin from '@/mixins/methodsMixin';

  export default {
    mixins: [methodsMixin],

    data() {
      return {
        form: {},
        doing: false,
        rules: {
          projectName: [
            {required: true, message: '请输入合同名称', trigger: 'blur'}
          ],
          projectNumber: [
            {required: true, message: '请输入合同编号', trigger: 'blur'}
          ],
          orgId: [
            {required: true, message: '请选择所属部门', trigger: 'change'}
          ],
          queryDepartmentUserNew: [
            {required: true, message: '请选择业务员', trigger: 'change'}
          ],
          contractTime: [
            {required: true, message: '请选择合同日期', type: 'array', trigger: 'change'}
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
            projectName: '',
            projectNumber: '',
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
            this.form.contractSignTime = this.form.contractTime[0];
            this.form.contractOverTime = this.form.contractTime[1];
            if (!this.form.id) {
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
