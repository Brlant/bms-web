<template>
  <dialog-template :btnSavePosition="100">
    <template slot="title">{{actionType}}</template>
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
        <el-form-item label="" prop="billingModelTemplate">
          <el-radio-group v-model="form.billingModelTemplate" size="small" @change="billingModelTemplateChange">
            <el-radio-button label="0">普通计费模型</el-radio-button>
            <el-radio-button label="1">计费模板</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <el-form :model="currentItem" label-width="120px" ref="addForm">
        <el-form-item label="计费模型名称" prop="contractName" v-if="form.billingModelTemplate === '1'"
                      :rules="[{required: true, message: '请输入计费模型名称', trigger: 'blur'}]">
          <oms-input placeholder="请输入计费模型名称" type="input" v-model="currentItem.contractName"/>
        </el-form-item>
        <el-form-item :label="`计费模${title}`" prop="billingItemIds"
                      :rules="[{required: true, message: `请选择计费模${title}`, trigger: 'change'}]">
          <el-select :placeholder="`请选择计费模${title}`" v-model="currentItem.billingItemIds"
                     filterable clearable remote :remote-method="queryCostModelListNew">
            <el-option :label="item.billingModelName" :value="item.billingModelId" :key="item.billingModelId"
                       v-for="item in costModelList"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="计费项" prop="billingItemIds"
                      :rules="[{required: true, message: '请选择计费项', trigger: 'change'}]">
          <el-select placeholder="请选择计费项" v-model="currentItem.billingItemIds"
                     filterable clearable multiple remote :remote-method="queryCostItem">
            <el-option :label="item.billingItemName" :value="item.billingItemId" :key="item.billingItemId"
                       v-for="item in costItemList"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="addItem">添加</el-button>
        </el-form-item>
        <el-table :data="form.billingModelItemRelations" border class="clearfix" ref="orderDetail">
          <el-table-column prop="operationTime" label="计费模型" width="200">
            <template slot-scope="scope">{{scope.row.name}}</template>
          </el-table-column>
          <el-table-column prop="actionType" label="计费项">
            <template slot-scope="scope">{{scope.row.name}}</template>
          </el-table-column>
        </el-table>
      </el-form>

    </template>
  </dialog-template>
</template>
<script>
  import {costModel} from '@/resources';
  import methodsMixin from '@/mixins/methodsMixin';

  export default {
    mixins: [methodsMixin],

    data() {
      return {
        form: {
          contractId: '',
          billingModelTemplate: '0',
          billingModelItemRelations: []
        },
        doing: false,
        actionType: '添加',
        orgList: [],
        currentItem: {
          billingModelName: '',
          billingModelId: '',
          billingItemIds: []
        }
      };
    },
    props: {
      formItem: Object,
      index: Number
    },
    computed: {
      title() {
        return this.form.billingModelTemplate === '0' ? '型' : '板';
      }
    },
    watch: {
      index: function (val) {
        if (this.formItem.billingModelId) {
          this.form = Object.assign({}, this.formItem);
          this.actionType = '编辑';
        } else {
          this.form = {
            contractId: '',
            billingModelTemplate: '0',
            billingModelItemRelations: []
          };
          this.actionType = '添加';
        }
        this.$nextTick(() => {
          this.$refs['form'] && this.$refs['form'].clearValidate();
        });
      }
    },
    methods: {
      queryCostModelListNew(query) {
        let params = {
          keyWord: query,
          billingModelTemplate: this.form.billingModelTemplate
        };
        this.queryCostModelList(params);
      },
      billingModelTemplateChange(val) {
        this.costModelList = [];
        this.billingItemIds = [];
        this.currentItem = {
          billingModelName: '',
          billingModelId: '',
          billingItemIds: []
        };
        this.$refs['addForm'].clearValidate();
      },
      addItem() {

      },
      save(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid && this.doing === false) {
            if (!this.form.billingModelId) {
              this.doing = true;
              this.$httpRequestOpera(costModel.save(this.form), {
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
              this.$httpRequestOpera(costModel.update(this.form), {
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
