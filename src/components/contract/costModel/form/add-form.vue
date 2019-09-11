<template>
  <dialog-template :btnSavePosition="120">
    <template slot="title">{{actionType}}</template>
    <template slot="btnSave">
      <el-button class="mt-10" :disabled="doing" @click="save('form')" plain type="primary">保存</el-button>
    </template>
    <template slot="content">
      <el-form :model="form" label-width="120px" ref="form">
        <el-form-item label="合同" prop="contractId"
                      :rules="[{required: true, message: '请选择合同', trigger: 'change'}]">
          <el-select placeholder="请选择合同" v-model="form.contractId"
                     filterable clearable remote :remote-method="queryContractList">
            <el-option :label="item.contractName" :value="item.contractId" :key="item.contractId"
                       v-for="item in contractList"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="计费模型名称" prop="billingModelName" label-width="120px"
                      :rules="[{required: true, message: '请输入计费模型名称', trigger: 'blur'}]">
          <oms-input placeholder="请输入计费模型名称" type="input" v-model="form.billingModelName"/>
        </el-form-item>
        <el-form-item label="" prop="billingModelTemplate">
          <el-radio-group v-model="form.billingModelTemplate" size="small" @change="billingModelTemplateChange">
            <el-radio-button label="0">从计费模型模板选择</el-radio-button>
            <el-radio-button label="1">手动添加</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <el-form :model="currentItem" label-width="120px" ref="addForm">
        <div v-if="form.billingModelTemplate === '0'">
          <el-form-item label="计费模型模板" prop="billingModelId"
                        :rules="[{required: true, message: '计费模型模板', trigger: 'change'}]">
            <el-select placeholder="计费模型模板" v-model="currentItem.billingModelId"
                       filterable clearable remote :remote-method="queryCostModelListNew">
              <el-option :label="item.billingModelName" :value="item.billingModelId" :key="item.billingModelId"
                         v-for="item in costModelList"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div v-else>
          <cost-form-util :currentItem="currentItem"/>
        </div>
        <el-form-item label="">
          <el-button type="primary" @click="addItem">添加</el-button>
        </el-form-item>
        <h2>计费项</h2>
        <cost-table-util :data="form.billingItems" :isShowEdit="false" @remove="remove"/>
      </el-form>
    </template>
  </dialog-template>
</template>
<script>
  import {contractCostModel, costModel} from '@/resources';
  import methodsMixin from '@/mixins/methodsMixin';
  import utils from '@/tools/utils';
  import costFormUtil from '../../../cost/info/costFormUtil';
  import costTableUtil from '../../../cost/info/costTableUtil';

  export default {
    mixins: [methodsMixin],
    components: {costFormUtil, costTableUtil},
    data() {
      return {
        form: {
          contractId: '',
          billingModelName: '',
          billingModelTemplate: '0',
          billingItems: []
        },
        doing: false,
        actionType: '添加',
        orgList: [],
        currentItem: {
          businessType: '',
          billingType: '',
          billingItemId: '',
          billingItemName: '',
          billingModelTemplate: '',
          companyDepartment: '',
          businessManageId: '',
          ladderState: '0',
          unitPrice: '',
          upperLimit: '',
          lowerLimit: '',
          billingRules: '',
          billingUnit: '',
          billingItemNo: ''
        },
        currentCostType: {
          bizTypes: [],
          items: []
        }
      };
    },
    props: {
      formItem: Object,
      index: Number
    },
    computed: {
      costTypes() {
        return this.$store.state.costTypes;
      }
    },
    watch: {
      index: function (val) {
        if (this.formItem.billingModelId) {
          this.contractList = [
            {contractId: this.formItem.contractId, contractName: this.formItem.contractName}
          ];
          contractCostModel.queryDetail(this.formItem).then(res => {
            this.form = Object.assign({}, res.data.data, {billingModelTemplate: '0'});
          });
          this.actionType = '编辑';
        } else {
          this.form = {
            contractId: '',
            billingModelName: '',
            billingModelTemplate: '0',
            billingItems: []
          };
          this.actionType = '添加';
        }
        this.$nextTick(() => {
          this.$refs['form'] && this.$refs['form'].clearValidate();
        });
      }
    },
    methods: {
      billingTypeChange(val) {
        if (!val) {
          return;
        }
        this.currentCostType = this.costTypes.find(f => f.id === val);
        this.currentItem.ladderState = this.currentCostType.ladderState ? '1' : '0';
      },
      formatPrice() {// 格式化单价，保留两位小数
        this.currentItem.unitPrice = utils.autoformatDecimalPoint(this.currentItem.unitPrice);
      },
      queryCostModelListNew(query) {
        let params = {
          keyWord: query,
          billingModelTemplate: this.form.billingModelTemplate,
          billingModelState: '1'
        };
        this.queryCostModelList(params);
      },
      billingModelTemplateChange(val) {
        this.costModelList = [];
        this.billingItems = [];
        this.resetItem();
      },
      addItem() {
        this.$refs.addForm.validate(v => {
          if (!v) return;
          if (this.form.billingModelTemplate === '0') {
            costModel.queryDetail(this.currentItem).then(res => {
              res.data.data.billingItems.forEach(i => {
                let isHas = this.form.billingItems.find(f => f.billingItemId === i.billingItemId);
                if (!isHas) {
                  this.form.billingItems.push(i);
                }
              });
              this.resetItem();
            });
          } else {
            this.form.billingItems.push(this.currentItem);
            this.resetItem();
          }
        });
      },
      remove(item) {
        this.form.billingItems = this.form.billingItems.filter(f => f !== item);
      },
      resetItem() {
        this.currentItem = {
          billingModelId: '',
          businessType: '',
          billingType: '',
          billingItemId: '',
          billingItemName: '',
          billingModelTemplate: '',
          companyDepartment: '',
          businessManageId: '',
          ladderState: '0',
          unitPrice: '',
          upperLimit: '',
          lowerLimit: '',
          billingRules: '',
          billingUnit: '',
          billingItemNo: ''
        };
        this.$nextTick(() => {
          this.$refs['addForm'].clearValidate();
        });
      },
      save(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid && this.doing === false) {
            if (!this.form.billingItems.length) {
              return this.$notify.info({message: '请添加计费项'});
            }
            if (!this.form.billingModelId) {
              this.doing = true;
              this.$httpRequestOpera(contractCostModel.save(this.form), {
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
              this.form.contractBillingModelId = this.formItem.contractBillingModelId;
              this.$httpRequestOpera(contractCostModel.update(this.form), {
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
