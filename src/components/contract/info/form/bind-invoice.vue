<style lang="scss">
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
    }

    .is-view.el-form {
      .el-form-item {
        margin-bottom: 0;
      }
    }
  }
</style>
<template>
  <dialog-template :btnSavePosition="100">
    <template slot="title">发票信息管理1</template>
    <template slot="content">
      <div class="mb-10">
        <des-btn @click="add()" v-has="'add-contract-invoice'" icon="plus" class="ml-10" v-show="!showAdd">添加发票</des-btn>
      </div>
      <el-form :model="form" label-width="100px" ref="form" v-if="showAdd">
        <el-form-item label="发票类型" prop="invoiceType"
                      :rules="[{required: true, message: '请选择发票类型', trigger: 'change'}]">
          <el-select v-model="form.invoiceType" placeholder="请选择发票类型">
            <el-option :value="item.key" :label="item.label" :key="item.key" v-for="item in invoiceTypes">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发票内容" prop="invoiceContents"
                      :rules="[{required: true, message: '请选择发票内容', trigger: 'change'}]">
          <el-select v-model="form.invoiceContents" placeholder="请选择发票内容">
            <el-option :value="item.key" :label="item.label" :key="item.key" v-for="item in invoiceContents">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="税率"
                      :rules="[{required: true, message: '请输入税率', trigger: 'blur'}]">
          <el-input type="number" v-model.number="form.taxRate">
            <span slot="suffix">%</span>
          </el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="save('form')">添加</el-button>
          <el-button @click="showAdd = false">取消</el-button>
        </el-form-item>
      </el-form>
      <div class="invoice-box" v-for="(item, index) in listForm.list">
        <el-form :class="{'is-view': item.status === 'view'}" :model="listForm" label-width="100px"
                 :ref="'listForm' + index">
          <el-row>
            <el-form-item label="发票类型" :prop="`list.${index}.invoiceType`"
                          :rules="[{required: true, message: '请选择发票类型', trigger: 'change'}]">
              <span v-if="item.status === 'view'">
                 {{invoiceTypes[item.invoiceType] && invoiceTypes[item.invoiceType].label }}
              </span>
              <el-select v-model="item.invoiceType" v-else>
                <el-option :value="item.key" :label="item.label" :key="item.key" v-for="item in invoiceTypes">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="发票内容" :prop="`list.${index}.invoiceContents`"
                          :rules="[{required: true, message: '请输入发票内容', trigger: 'blur'}]">
              <span v-if="item.status === 'view'">
                <dict :dict-group="'invoiceContent'" :dict-key="item.invoiceContents"></dict>
              </span>
              <el-select v-model="item.invoiceContents" placeholder="请选择发票内容" v-else>
                <el-option :value="item.key" :label="item.label" :key="item.key" v-for="item in invoiceContents">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="税率" :prop="`list.${index}.taxRate`"
                          :rules="[{required: true, message: '请输入发票内容', trigger: 'blur'}]">
              <span v-if="item.status === 'view'">{{item.taxRate}}%</span>
              <el-input type="number" v-model.number="item.taxRate" v-else>
                <span slot="suffix">%</span>
              </el-input>
            </el-form-item>
            <el-form-item label="" v-show="item.status === 'edit'">
              <el-button type="primary"  @click="editSave('listForm' + index, item)">保存</el-button>
              <el-button @click="cancel(item, 'listForm' + index)">取消</el-button>
            </el-form-item>
            <div class="invoice-box-btn" v-show="item.status === 'view'">
              <el-button v-has="'edit-contract-invoice'" type="primary" size="mini" @click="edit(item, index)">编辑</el-button>
              <el-button v-has="'delete-contract-invoice'" type="danger" size="mini" @click="del(item)">删除</el-button>
            </div>
          </el-row>
        </el-form>
      </div>
    </template>
  </dialog-template>
</template>
<script>
  import {InvoiceManger} from '@/resources';

  export default {

    data() {
      return {
        form: {
          invoiceType: '',
          taxRate: '',
          invoiceContents: '',
        },
        showAdd: false,
        listForm: {
          list: []
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
      },
      invoiceContents() {
        return this.$getDict('invoiceContent');
      }
    },
    watch: {
      index: function (val) {
        if (val !== 4) return;
        this.showAdd = false;
        this.listForm.list = [];
        this.query();
        this.$nextTick(() => {
          this.$refs['form'] && this.$refs['form'].clearValidate();
        });
      }
    },
    methods: {
      query() {
        let params = {
          contractId: this.formItem.contractId
        };
        InvoiceManger.query(params).then(res => {
          res.data.data.forEach(i => {
            i.status = 'view';
          });
          this.listForm.list = res.data.data;
        });
      },
      add() {
        this.showAdd = true;
        this.$nextTick(() => {
          this.$refs['form'].clearValidate();
        });
      },
      del(item) {
        this.$confirm('是否确定删除？', '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          invoiceType: 'warning'
        }).then(() => {
          this.$httpRequestOpera(InvoiceManger.delete(item.contractInvoiceId), {
            errorTitle: '删除失败',
            success: res => {
              if (res.data.code === 200) {
                this.$notify.success({message: '删除成功'});
                this.doing = false;
                let index = this.listForm.list.indexOf(item);
                index !== -1 && this.listForm.list.splice(index, 1);
              } else {
                this.doing = false;
              }
            },
            error: () => {
              this.doing = false;
            }
          });
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
          if (i.status === 'edit') {
            this.$refs['listForm' + index][0].clearValidate();
            Object.assign(i, this.saveForm);
          }
          i.status = curIndex === index ? 'edit' : 'view';
        });
      },
      save(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid && this.doing === false) {
            this.form.contractId = this.formItem.contractId;
            this.doing = true;
            this.$httpRequestOpera(InvoiceManger.save(this.form), {
              errorTitle: '添加失败',
              success: res => {
                if (res.data.code === 200) {
                  this.$notify.success({message: '添加成功'});
                  this.doing = false;
                  this.$refs[formName].resetFields();
                  this.query();
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
      },
      editSave(formName, item) {
        this.$refs[formName][0].validate((valid) => {
          if (valid && this.doing === false) {
            this.doing = true;
            this.$httpRequestOpera(InvoiceManger.update(item), {
              errorTitle: '编辑失败',
              success: res => {
                if (res.data.code === 200) {
                  this.$notify.success({message: '编辑成功'});
                  this.doing = false;
                  item.status = 'view';
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
