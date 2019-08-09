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
        <el-form-item label="货品" prop="orgGoodsIdList">
          <el-select filterable remote multiple placeholder="请输入名称搜货品" :remote-method="queryOrgGoodsListNew"
                     :clearable="true" v-model="form.orgGoodsIdList" popperClass="good-selects">
            <el-option v-for="item in orgGoodsList" :key="item.orgGoodsDto.id"
                       :label="item.orgGoodsDto.name"
                       :value="item.orgGoodsDto.id">
              <div style="overflow: hidden">
                <span class="pull-left">{{item.orgGoodsDto.name}}</span>
              </div>
              <div style="overflow: hidden">
                <span class="select-other-info pull-left"><span
                  v-show="item.orgGoodsDto.goodsNo">货品编号:</span>{{item.orgGoodsDto.goodsNo}}
                </span>
                <span class="select-other-info pull-left"><span
                  v-show="item.orgGoodsDto.salesFirmName">供货厂商:</span>{{ item.orgGoodsDto.salesFirmName }}
                </span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="计费模型" prop="billingModelId">
          <el-select filterable remote placeholder="请输入名称搜计费模型" :remote-method="queryContractCostModelList"
                     :clearable="true" v-model="form.billingModelId" popperClass="good-selects">
            <el-option :label="item.billingModelName" :value="item.billingModelId" :key="item.billingModelId"
                       v-for="item in contractCostModelList">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目" prop="projectId">
          <el-select filterable remote placeholder="请选择项目" :remote-method="queryProjectList"
                     :clearable="true" v-model="form.projectId" popperClass="good-selects">
            <el-option :label="item.projectName" :value="item.projectId" :key="item.projectId"
                       v-for="item in projectList">
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
          orgGoodsIdList: [
            {required: true, type: 'array', message: '请选择货主货品', trigger: 'change'}
          ],
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
        contractBindGoods.query({contractId: this.formItem.contractId}).then(res => {
          if (!res.data.data.projectId) return;
          this.orgGoodsList = [];
          res.data.data.orgGoodsList.forEach(i => {
            this.orgGoodsList.push({
              orgGoodsDto: {id: i.orgGoodsId, name: i.orgGoodsName}
            });
          });
          res.data.data.orgGoodsIdList = res.data.data.orgGoodsList.map(m => m.orgGoodsId);
          this.projectList = [
            {projectName: res.data.data.projectName, projectId: res.data.data.projectId}
          ];
          this.contractCostModelList = [
            {billingModelName: res.data.data.billingModelName, billingModelId: res.data.data.billingModelId}
          ];
          this.form = res.data.data;
        });
      }
    },
    methods: {
      queryOrgGoodsListNew(query) {
        let params = {
          orgId: this.formItem.orgId,
          keyWord: query,
          auditedStatus: '1'
        };
        this.queryOrgGoodsList(params);
      },
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
            this.$httpRequestOpera(contractBindGoods.save(this.form), {
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
