<style lang="scss" scoped>
  .invoice-box {
    position: relative;
    padding: 10px 10px 0 10px;
    margin-bottom: 20px;
    border: 1px solid #e8e8e8;
    border-radius: 4px;
    .invoice-box-btn {
      position: absolute;
      top: 0;
      right: 10px;
      .el-button {
        padding: 0;
        &.is-danger {
          color: #ff3300
        }
      }
    }
  }
</style>
<template>
  <dialog-template :btnSavePosition="100">
    <template slot="title">发票信息管理</template>
    <template slot="content">
      <div class="mb-10">
        <des-btn @click="add()" icon="plus" class="ml-10" v-show="!showAdd">添加发票</des-btn>
      </div>
      <el-form :model="form" label-width="100px" ref="form" v-if="showAdd">
        <el-form-item label="发票类型" prop="type"
                      :rules="[{required: true, message: '请选择发票类型', trigger: 'change'}]">
          <el-select v-model="form.type" placeholder="请选择发票类型">
            <el-option :value="item.key" :label="item.label" :key="item.key" v-for="item in invoiceTypes">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发票内容" prop="content"
                      :rules="[{required: true, message: '请输入发票内容', trigger: 'blur'}]">
          <el-input v-model="form.content"></el-input>
        </el-form-item>
        <el-form-item label="税率"
                      :rules="[{required: true, message: '请输入发票内容', trigger: 'blur'}]">
          <el-input type="number" v-model.number="form.rate">
            <span slot="suffix">%</span>
          </el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary">添加</el-button>
          <el-button @click="showAdd = false">取消</el-button>
        </el-form-item>
      </el-form>
      <div class="invoice-box" v-for="(item, index) in listForm.list">
        <el-form :model="listForm" label-width="100px" :ref="'listForm' + index">
          <el-row>
            <el-form-item label="发票类型" :prop="`list.${index}.type`"
                          :rules="[{required: true, message: '请选择发票类型', trigger: 'change'}]">
              <span v-if="item.status === 'view'">
                 {{invoiceTypes[item.type] && invoiceTypes[item.type].label }}
              </span>
              <el-select v-model="item.type" v-else>
                <el-option :value="item.key" :label="item.label" :key="item.key" v-for="item in invoiceTypes">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="发票内容" :prop="`list.${index}.content`"
                          :rules="[{required: true, message: '请输入发票内容', trigger: 'blur'}]">
              <span v-if="item.status === 'view'">{{item.content}}</span>
              <el-input v-model="item.content" v-else></el-input>
            </el-form-item>
            <el-form-item label="税率" :prop="`list.${index}.rate`"
                          :rules="[{required: true, message: '请输入发票内容', trigger: 'blur'}]">
              <span v-if="item.status === 'view'">{{item.rate}}%</span>
              <el-input type="number" v-model.number="item.rate" v-else>
                <span slot="suffix">%</span>
              </el-input>
            </el-form-item>
            <el-form-item label="" v-show="item.status === 'edit'">
              <el-button type="primary" @click="editSave('listForm' + index, item)">保存</el-button>
              <el-button @click="cancel(item, 'listForm' + index)">取消</el-button>
            </el-form-item>
            <div class="invoice-box-btn" v-show="item.status === 'view'">
              <el-button type="text" @click="edit(item, index)">编辑</el-button>
              <el-button type="text" class="is-danger" @click="del(item)">删除</el-button>
            </div>
          </el-row>
        </el-form>
      </div>
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
          type: '',
          rate: '',
          content: '',
        },
        showAdd: false,
        listForm: {
          list: [
            {
              type: '1',
              rate: 2,
              content: '测试数据',
              status: 'view'
            },
            {
              type: '2',
              rate: 3,
              content: '阿斯顿发士大夫',
              status: 'view'
            },
            {
              type: '0',
              rate: 4,
              content: '阿斯顿发士大夫',
              status: 'view'
            }
          ]
        },
        saveForm: {},
        doing: false
      };
    },
    props: {
      formItem: Object,
      index: Number
    },
    computed: {
      invoiceTypes() {
        return this.$store.state.invoiceTypes;
      }
    },
    watch: {
      index: function (val) {
        if (val !== 3) return;
        this.$nextTick(() => {
          this.$refs['form'].clearValidate();
        });
      }
    },
    methods: {
      queryContractCostModelListNew(query) {
        let params = {
          contractId: this.formItem.contractId,
          bindingGoodStatus: '0',
          keyWord: query
        };
        this.queryContractCostModelList(params);
      },
      add() {
        this.showAdd = true;
        this.$nextTick(() => {
          this.$refs['form'].clearValidate();
        });
      },
      del(item) {
        this.$confirm('是否删除发票"' + item.content + '"?', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {

        });
      },
      cancel(item, form) {
        this.$refs[form][0].clearValidate();
        Object.assign(item, this.saveForm);
        item.status = 'view';
      },
      edit(item, curIndex) {
        this.saveForm = JSON.parse(JSON.stringify(item));
        this.listForm.list.forEach((i, index) => {
            if(i.status === 'edit') {
              this.$refs['listForm' + index][0].clearValidate();
              Object.assign(i, this.saveForm);
            }
            i.status = curIndex === index ? 'edit' : 'view';
        });
      },
      save(formName, item) {
        this.$refs[formName].validate((valid) => {
          if (valid && this.doing === false) {

          }
        });
      },
      editSave(formName, item) {
        this.$refs[formName][0].validate((valid) => {
          if (valid && this.doing === false) {

          }
        });
      }
    }
  };
</script>
