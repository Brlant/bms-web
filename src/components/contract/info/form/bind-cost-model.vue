<template>
  <dialog-template :btnSavePosition="100">
    <template slot="title">绑定非货品计费模型</template>
    <template slot="btnSave">
      <el-button :disabled="doing" @click="save('form')" plain type="primary">保存</el-button>
    </template>
    <template slot="content">
      <el-form :model="form" :rules="rules" label-width="100px" ref="form">
        <el-form-item label="合同名称">{{formItem.contractName}}</el-form-item>
        <el-form-item label="合同编号">{{formItem.contractNo}}</el-form-item>
        <el-form-item label="甲方">{{formItem.orgName}}</el-form-item>
        <el-form-item label="计费模型" prop="billingModelId">
          <el-select filterable remote placeholder="请输入名称搜计费模型" :remote-method="queryContractCostModelList"
                     :clearable="true" v-model="form.billingModelId" popperClass="good-selects">
            <el-option :label="item.billingModelName" :value="item.billingModelId" :key="item.billingModelId"
                       v-for="item in contractCostModelList">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </template>
  </dialog-template>
</template>
<script>
  import {contractBindGoods} from '@/resources';
  import methodsMixin from '@/mixins/methodsMixin';

  export default {
    mixins: [methodsMixin],
    data() {
      return {
        form: {
          orgGoodsIdList: [],
          billingModelId: '',
          projectId: ''
        },
        doing: false,
        rules: {
          billingModelId: [
            {required: true, message: '请选择计费模型', trigger: 'change'}
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
        if (val !== 1) return;
        this.form = {
          orgGoodsIdList: [],
          billingModelId: '',
          projectId: ''
        };
        this.$nextTick(() => {
          this.$refs['form'].clearValidate();
        });
        contractBindGoods.queryCostModel({contractId: this.formItem.contractId}).then(res => {
          if (!res.data.data.projectId) return;
          res.data.data.orgGoodsIdList = res.data.data.orgGoodsList.map(m => m.orgGoodsId);
          this.contractCostModelList = [
            {billingModelName: res.data.data.billingModelName, billingModelId: res.data.data.billingModelId}
          ];
          this.form = res.data.data;
        });
      }
    },
    methods: {
      queryCostModelListNew(query) {
        let params = {
          id: this.formItem.contractId,
          keyWord: query,
          billingModelState: '1'
        };
        this.queryCostModelList(params);
      },
      companyDepartmentChange(val) {
        this.departmentUserList = [];
        this.form.businessManageId = '';
      },
      save(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid && this.doing === false) {
            this.doing = true;
            this.form.contractId = this.formItem.contractId;
            this.$httpRequestOpera(contractBindGoods.bindCost(this.form), {
              errorTitle: '绑定失败',
              success: res => {
                if (res.data.code === 200) {
                  this.$notify.success({message: '绑定成功'});
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
        });
      }
    }
  };
</script>
