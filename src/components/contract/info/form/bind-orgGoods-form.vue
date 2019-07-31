<template>
  <dialog-template :btnSavePosition="100">
    <template slot="title">绑定货品</template>
    <template slot="btnSave">
      <el-button :disabled="doing" @click="save('form')" plain type="primary">保存</el-button>
    </template>
    <template slot="content">
      <el-form :model="form" :rules="rules" label-width="100px" ref="form">
        <el-form-item label="合同名称">{{formItem.contractName}}</el-form-item>
        <el-form-item label="合同编号">{{formItem.contractNo}}</el-form-item>
        <el-form-item label="甲方">{{formItem.orgName}}</el-form-item>
        <el-form-item label="货品" prop="orgGoodsIds">
          <el-select filterable remote multiple placeholder="请输入名称搜货品" :remote-method="queryOrgGoodsListNew"
                     :clearable="true" v-model="form.orgGoodsIds" popperClass="good-selects">
            <el-option :label="item.name" :value="item.id" :key="item.id" v-for="item in orgGoodsList">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="计费模型" prop="costModelIds">
          <el-select filterable remote placeholder="请输入名称搜计费模型" :remote-method="queryCostModelList"
                     :clearable="true" v-model="form.costModelIds" popperClass="good-selects">
            <el-option :label="item.name" :value="item.id" :key="item.id" v-for="item in costModelList">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目" prop="projectId">
          <el-select filterable remote  placeholder="请选择项目" :remote-method="queryProjectList"
                     :clearable="true" v-model="form.projectId" popperClass="good-selects">
            <el-option :label="item.projectName" :value="item.projectId" :key="item.projectId" v-for="item in projectList">
            </el-option>
          </el-select>
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
        form: {
          orgGoodsIds: [],
          costModelIds: [],
          projectId: ''
        },
        doing: false,
        rules: {
          orgGoodsIds: [
            {required: true, type: 'array', message: '请选择货主货品', trigger: 'change'}
          ],
          costModelIds: [
            {required: true, type: 'array', message: '请选择计费模型', trigger: 'change'}
          ],
          projectId: [
            {required: true, message: '请选择项目', trigger: 'change'}
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
        this.$refs['form'].clearValidate();
        if (this.formItem.contractId) {
          this.actionType = '编辑';
        } else {
          this.form = {
            orgGoodsIds: [],
            costModelIds: [],
            projectId: ''
          };
          this.actionType = '添加';
        }
      }
    },
    methods: {
      queryOrgGoodsListNew(query) {
        let params = {
          keyWord: query
        };
        this.queryOrgGoodsList(params)
      },
      queryCostModelListNew(query) {
        let params = {
          id: this.formItem.contractId,
          keyWord: query
        };
        this.queryCostModelList(params)
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
