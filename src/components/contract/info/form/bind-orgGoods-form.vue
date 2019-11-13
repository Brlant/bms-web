<template>
  <dialog-template :btnSavePosition="100">
    <template slot="title">绑定货品计费模型</template>
    <template slot="btnSave">
      <el-button :disabled="doing" @click="save('form')" plain type="primary"
                 style="margin-bottom: 20px;margin-top: 10px">保存
      </el-button>
    </template>
    <template slot="content">
      <el-form :model="form" :rules="rules" label-width="100px" ref="form">
        <el-row>
          <el-col :span="14">
            <el-form-item label="合同名称" class="is-content-center">
              <div style="line-height: normal"> {{formItem.contractName}}</div>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="合同编号" label-width="80px" class="is-content-center">
              <div style="line-height: normal" class="R">{{formItem.contractNo}}</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="甲方">{{formItem.orgName}}</el-form-item>
        <el-form-item label="计费模型" prop="billingModelId">
          <el-select filterable remote placeholder="请输入名称搜计费模型" :remote-method="queryContractCostModelListNew"
                     @focus="queryContractCostModelListNew()"
                     :clearable="true" v-model="form.billingModelId" popperClass="good-selects">
            <el-option :label="item.billingModelName" :value="item.billingModelId" :key="item.billingModelId"
                       v-for="item in contractCostModelList">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目" prop="projectId">
          <el-select filterable remote placeholder="请选择项目" :remote-method="queryProjectList"
                     @focus="queryProjectList()"
                     :clearable="true" v-model="form.projectId" popperClass="good-selects">
            <el-option :label="item.projectName" :value="item.projectId" :key="item.projectId"
                       v-for="item in projectList">
            </el-option>
          </el-select>
        </el-form-item>
        <el-row type="flex">
          <el-col :span="2">
          </el-col>
          <el-col :span="10">
            <el-form-item label="储存条件" prop="storageConditionId">
              <el-select placeholder="请选择储存条件" v-model="search.goodsStorageConditionId">
                <el-option :label="item.label" :value="item.key" :key="item.key"
                           v-for="item in storageCondition"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" style="margin-left: 20px">
            <el-button type="primary" @click="searchGoods">查询货品</el-button>
            <el-button @click="resetGoods">重置</el-button>
          </el-col>
        </el-row>

        <el-form-item label="货品" prop="orgGoodsIdList">
          <el-transfer ref="elTransfer" v-model="form.orgGoodsIdList"
                       :props="{key: 'id',label: 'name'}"
                       filter-placeholder="请输入名称货品"
                       :data="orgGoodsList"
                       filterable
                       :titles="['未选货品', '已选货品']"
                       class="transfer-list">
          </el-transfer>
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
        search: {
          goodsStorageConditionId: ''
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
        this.queryOrgGoodsListNew();
        this.$nextTick(() => {
          this.$refs['form'].clearValidate();
        });
      }
    },
    computed: {
      storageCondition() {
        return this.$getDict('storageCondition');
      }
    },
    methods: {
      searchGoods() {
        this.queryOrgGoodsListNew();
      },
      resetGoods() {
        this.search.goodsStorageConditionId = '';
        this.queryOrgGoodsListNew();
      },
      queryContractCostModelListNew(query) {
        let params = {
          contractId: this.formItem.contractId,
          bindingGoodStatus: '1',
          keyWord: query
        };
        this.queryContractCostModelList(params);
      },
      queryOrgGoodsListNew(query) {
        let params = {
          orgId: this.formItem.orgId,
          pageSize: 100000,
          keyWord: query,
          auditedStatus: '1',
          goodsStorageConditionId: this.search.goodsStorageConditionId
        };
        this.$http.post('/bms-boa/query-org-goods', params).then(res => {
          this.orgGoodsList = res.data.map(m => m.orgGoodsDto);
        });
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
