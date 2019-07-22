<template>
  <dialog-template :btnSavePosition="100">
    <template slot="title">{{actionType}}</template>
    <template slot="btnSave">
      <el-button :disabled="doing" @click="save('form')" plain type="primary">保存</el-button>
    </template>
    <template slot="content">
      <el-form :model="form" :rules="rules" label-width="140px" ref="form">
        <el-form-item label="项目名称" prop="projectName">
          <oms-input placeholder="请输入项目名称" type="input" v-model="form.projectName"/>
        </el-form-item>
        <el-form-item label="项目编号" prop="projectNumber">
          <oms-input placeholder="请输入项目编号" type="input" v-model="form.projectNumber"/>
        </el-form-item>
        <el-form-item label="所属部门" prop="companyDepartment">
          <el-select filterable remote placeholder="请输入名称搜所属部门" :remote-method="queryDepartment"
                     :clearable="true" v-model="form.companyDepartment" popperClass="good-selects"
                     @change="companyDepartmentChange">
            <el-option :label="item.name" :value="item.id" :key="item.id" v-for="item in departmentList">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="业务员" prop="businessManageId">
          <el-select placeholder="请选择业务员" v-model="form.businessManageId"
                     filterable clearable remote :remote-method="queryDepartmentUserNew">
            <el-option :label="item.name" :value="item.id" :key="item.id"
                       v-for="item in departmentUserList"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </template>
  </dialog-template>
</template>
<script>
  import {project} from '@/resources';
  import methodsMixin from '@/mixins/methodsMixin';

  export default {
    mixins: [methodsMixin],

    data() {
      return {
        form: {},
        doing: false,
        rules: {
          projectName: [
            {required: true, message: '请输入项目名称', trigger: 'blur'}
          ],
          projectNumber: [
            {required: true, message: '请输入项目编号', trigger: 'blur'}
          ],
          orgId: [
            {required: true, message: '请选择所属部门', trigger: 'change'}
          ],
          businessManageId: [
            {required: true, message: '请选择业务员', trigger: 'change'}
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
        if (this.formItem.projectId) {
          this.departmentUserList = [
            {id: this.formItem.businessManageId, name: this.formItem.businessManageName}
          ];
          this.departmentList = [
            {id: this.formItem.companyDepartment, name: this.formItem.companyDepartmentName}
          ];
          this.form = Object.assign({}, this.formItem);
          this.actionType = '编辑';

        } else {
          this.form = {
            projectName: '',
            projectNumber: '',
            companyDepartment: '',
            businessManageId: ''
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
            if (!this.form.id) {
              this.doing = true;
              this.$httpRequestOpera(project.save(this.form), {
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
              this.$httpRequestOpera(project.update(this.form), {
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
