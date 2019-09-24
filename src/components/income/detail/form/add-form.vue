<template>
  <dialog-template :btnSavePosition="120">
    <template slot="title">{{actionType}}计费明细</template>
    <template slot="btnSave">
      <el-button class="mt-10" :disabled="doing" @click="save('form')" plain type="primary">保存</el-button>
    </template>
    <template slot="content">
      <el-form :model="form" :rules="rules" label-width="120px" ref="form">
        <el-form-item label="合同" prop="contractId"
                      :rules="[{required: true, message: '请选择合同', trigger: 'change'}]">
          <el-select placeholder="请输入名称搜索合同" v-model="form.contractId" @change="contractIdChange"
                     filterable clearable remote :remote-method="queryContractList" @focus="queryContractList()">
            <el-option :label="item.contractName" :value="item.contractId" :key="item.contractId"
                       v-for="item in contractList"></el-option>
          </el-select>
        </el-form-item>
        <div v-show="form.contractId" v-loading="loading">
          <div v-if="contractItem.contractId">
            <el-form-item label="甲方">{{contractItem.orgName}}</el-form-item>
            <el-form-item label="项目">{{contractItem.projectName}}</el-form-item>
            <el-form-item label="订单号" prop="orderNumber"
                          :rules="[{required: true, message: '请输入订单号', trigger: 'blur'}]">
              <el-input v-model="form.orderNumber"></el-input>
            </el-form-item>
            <el-form-item label="货品" prop="orgGoodsId" :rules="[{required: true, message: '请选择货品', trigger: 'change'}]">
              <el-select filterable placeholder="请选择货品" :clearable="true" v-model="form.orgGoodsId"
                         popperClass="good-selects" @change="orgGoodsIdChange">
                <el-option v-for="item in contractItem.orgGoodsList" :key="item.orgGoodsId"
                           :label="item.orgGoodsName"
                           :value="item.orgGoodsId">
                  <div style="overflow: hidden">
                    <span class="pull-left">{{item.orgGoodsName}}</span>
                  </div>
                  <div style="overflow: hidden">
                  <span class="select-other-info pull-left">
                    规格:{{item.goodsSpecification}}
                  </span>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="批号">
              <el-select filterable placeholder="请输入名称搜索批号" :clearable="true"
                         remote :remote-method="queryBatchNumberListNew" @focus="queryBatchNumberListNew()"
                         v-model="form.batchNumber" popperClass="good-selects">
                <el-option v-for="item in batchNumberList" :key="item.id"
                           :label="item.batchNumber" :value="item.batchNumber">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="计费项" prop="billingItemId"
                          :rules="[{required: true, message: '请输入选择计费项', trigger: 'change'}]">
              <el-select filterable placeholder="请选择计费项" :clearable="true" @change="billingItemIdChange"
                         v-model="form.billingItemId" popperClass="good-selects">
                <el-option v-for="item in contractItem.billingItems" :key="item.billingItemId"
                           :label="formatBillingItemName(item)" :value="item.billingItemId">
                </el-option>
              </el-select>
            </el-form-item>
            <el-row>
              <el-col :span="8">
                <el-form-item label="单价" prop="billingUntilPrice" label-width="120px"
                              :rules="[{required: true, message: '请输入单价', trigger: 'blur'}]">
                  <oms-input placeholder="请输入单价" type="input" v-model="form.billingUntilPrice" @blur="formatPrice"/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="数量" label-width="80px" prop="billingQuantity"
                              :rules="[{required: true, message: '请输入数量', trigger: 'blur'}]">
                  <oms-input placeholder="请输入数量" type="input" v-model="form.billingQuantity"/>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="计费合计" label-width="100px" prop="billingTotal"
                              :rules="[{required: true, message: '请输入计费合计', trigger: 'blur'}]">
                  <oms-input placeholder="请输入计费合计" type="input" v-model="form.billingTotal"/>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <div v-else>
            <el-form-item label="">
              合同未绑定货品和项目, 请先绑定货品和项目
            </el-form-item>
          </div>
        </div>
      </el-form>
    </template>
  </dialog-template>
</template>
<script>
  import {contractAccountDetail, contractBindGoods, costModel} from '@/resources';
  import methodsMixin from '@/mixins/methodsMixin';
  import utils from '@/tools/utils';

  export default {
    mixins: [methodsMixin],
    data() {
      return {
        form: {
          contractId: '',
          customerId: '',
          customerName: '',
          projectId: '',
          projectName: '',
          orderNumber: '',
          orgGoodsId: ''
        },
        doing: false,
        rules: {
          billingModelName: [
            {required: true, message: '名称', trigger: 'blur'}
          ]
        },
        contractItem: {},
        actionType: '添加',
        loading: false
      };
    },
    props: {
      formItem: Object,
      index: Number
    },
    watch: {
      index: function (val) {
        if (this.formItem.billingModelId) {
          this.form = Object.assign({}, val);
          this.actionType = '编辑';
        } else {
          this.form = {
            billingModelName: '',
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
      formatPrice() {// 格式化单价，保留两位小数
        this.form.billingUntilPrice = utils.autoformatDecimalPoint(this.form.billingUntilPrice);
      },
      formatBillingItemName(item) {
        let bill = this.$store.state.costTypes.find(f => f.id === item.billingType);
        let billIem = bill.items.find(f => f.id === item.billingItemNo) || {};
        return billIem.name;
      },
      contractIdChange(val) {
        this.contractItem = {};
        if (!val) return;
        let item = this.contractList.find(f => f.contractId === val);
        this.loading = true;
        contractBindGoods.query({contractId: val}).then(res => {
          this.loading = false;
          if (res.data.data.projectId) {
            res.data.data.orgName = item.orgName;
            res.data.data.orgId = item.orgId;
            res.data.data.billingItems = [];
            this.contractItem = res.data.data;
            costModel.queryDetail(this.contractItem).then(res => {
              this.contractItem.billingItems = res.data.data.billingItems;
            });
          } else {
            this.contractItem = {};
          }
        });
      },
      orgGoodsIdChange(val) {
        this.form.goodsId = '';
        if (!val) return;
        let item = this.contractItem.orgGoodsList.find(f => f.orgGoodsId === val);
        if (!item) return;
        this.form.goodsId = item.goodsId;
        this.queryBatchNumberListNew();
      },
      billingItemIdChange(val) {
        if (!val) return;
        let item = this.contractItem.billingItems.find(f => f.billingItemId === val);
        this.form.billingUntilPrice = item.unitPrice;
      },
      queryBatchNumberListNew(query) {
        let params = {
          keyWord: query,
          goodsId: this.form.goodsId,
          batchStatus: '1'
        };
        this.queryBatchNumberList(params);
      },
      save(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid && this.doing === false) {
            this.form.customerId = this.contractItem.orgId;
            this.form.projectId = this.contractItem.projectId;
            this.doing = true;
            this.$httpRequestOpera(contractAccountDetail.save(this.form), {
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
          }
        });
      }
    }
  };
</script>
