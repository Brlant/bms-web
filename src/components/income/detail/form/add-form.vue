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
        <el-form-item label="甲方" v-show="form.contractId">{{form.customerName}}</el-form-item>

        <el-form-item label="项目" prop="projectId" :rules="[{required: true, message: '请选择项目', trigger: 'change'}]">
          <el-select filterable remote placeholder="请选择项目" :remote-method="queryProjectList" @focus="queryProjectList()"
                     :clearable="true" v-model="form.projectId" popperClass="good-selects">
            <el-option :label="item.projectName" :value="item.projectId" :key="item.projectId"
                       v-for="item in projectList">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="货品">
          <el-select filterable remote placeholder="请输入名称搜货品" :remote-method="queryOrgGoodsListNew"
                     @focus="queryOrgGoodsListNew()" @change="orgGoodsIdChange"
                     :clearable="true" v-model="form.orgGoodsId" popperClass="good-selects">
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

        <el-form-item label="订单号">
          <el-input v-model="form.orderNumber"></el-input>
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
        <el-form-item label="计费项" prop="billingItemName"
                      :rules="[{required: true, message: '请输入计费项', trigger: ['blur', 'change']}]">
          <el-autocomplete style="width: 100%"
            class="inline-input" v-model="form.billingItemName" :fetch-suggestions="querySearch"
            placeholder="请输入计费项" clearable></el-autocomplete>
        </el-form-item>
        <el-row>
          <el-col :span="8">
            <el-form-item label="单价" prop="billingUntilPrice" label-width="120px"
                          :rules="[{required: true, message: '请输入单价', trigger: 'blur'}]">
              <oms-input placeholder="请输入单价" type="number" v-model="form.billingUntilPrice" @blur="formatPrice"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="数量" label-width="80px" prop="billingQuantity"
                          :rules="[{required: true, message: '请输入数量', trigger: 'blur'}]">
              <oms-input placeholder="请输入数量" type="number" v-model="form.billingQuantity" @blur="setBillingTotal"/>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="计费合计" label-width="100px" prop="billingTotal"
                          :rules="[{required: true, message: '请输入计费合计', trigger: 'blur'}]">
              <oms-input placeholder="请输入计费合计" type="number" v-model="form.billingTotal" @blur="formatTotalPrice"/>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </template>
  </dialog-template>
</template>
<script>
  import {contractAccountDetail} from '@/resources';
  import methodsMixin from '@/mixins/methodsMixin';
  import utils from '@/tools/utils';

  export default {
    props: {
      formItem: Object,
      index: Number
    },
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
          orgGoodsId: '',
          batchNumber: '',
          billingItemName: '',
          billingTotal: '',
          billingUntilPrice: '',
          billingQuantity: ''
        },
        doing: false,
        rules: {
          billingModelName: [
            {required: true, message: '名称', trigger: 'blur'}
          ]
        },
        actionType: '添加',
        loading: false
      };
    },
    computed: {
      costTypes() {
        let costTypes = this.$store.state.costTypes;
        let values = [];
        costTypes.forEach(i => {
          i.items.forEach(f => {
            values.push({value: f.name});
          });
        });
        return values;
      }
    },
    watch: {
      index: function (val) {
        if (this.formItem.billingModelId) {
          this.form = Object.assign({}, val);
          this.actionType = '编辑';
        } else {
          this.form = {
            contractId: '',
            customerId: '',
            customerName: '',
            projectId: '',
            projectName: '',
            orderNumber: '',
            orgGoodsId: '',
            batchNumber: '',
            billingItemName: '',
            billingTotal: '',
            billingUntilPrice: '',
            billingQuantity: ''
          };
          this.actionType = '添加';
        }
        this.$nextTick(() => {
          this.$refs['form'] && this.$refs['form'].clearValidate();
        });
      }
    },
    methods: {
      querySearch(queryString, cb) {
        var restaurants = this.costTypes;
        var results = queryString ? restaurants.filter(f => f.value.includes(queryString)) : restaurants;
        cb(results);
      },
      queryOrgGoodsListNew(query) {
        if (!this.form.customerId) return;
        let params = {
          orgId: this.form.customerId,
          keyWord: query,
          auditedStatus: '1'
        };
        this.queryOrgGoodsList(params);
      },
      formatPrice() {// 格式化单价，保留两位小数
        this.form.billingUntilPrice = utils.autoformatDecimalPoint(this.form.billingUntilPrice);
        this.setBillingTotal();
      },
      formatTotalPrice() {// 格式化单价，保留两位小数
        this.form.billingTotal = utils.autoformatDecimalPoint(this.form.billingTotal);
      },
      setBillingTotal() {
        if (!this.form.billingUntilPrice || !this.form.billingQuantity) return;
        this.form.billingTotal = (this.form.billingUntilPrice * this.form.billingQuantity).toFixed(2);
      },
      contractIdChange(val) {
        this.form.customerId = '';
        this.form.customerName = '';
        this.form.orgGoodsId = '';
        this.form.goodsId = '';
        this.orgGoodsList = [];
        this.orgGoodsIdChange(this.form.orgGoodsId);
        if (!val) return;
        let item = this.contractList.find(f => f.contractId === val);
        if (!item) return;
        this.form.customerId = item.orgId;
        this.form.customerName = item.orgName;
      },
      orgGoodsIdChange(val) {
        this.form.goodsId = '';
        this.form.batchNumber = '';
        this.batchNumberList = [];
        if (!val) return;
        let item = this.orgGoodsList.find(f => f.orgGoodsDto.id === val);
        if (!item) return;
        this.form.goodsId = item.orgGoodsDto.goodsId;
        this.queryBatchNumberListNew();
      },
      queryBatchNumberListNew(query) {
        if (!this.form.goodsId) return;
        let params = {
          keyWord: query,
          goodsId: this.form.goodsId
        };
        this.queryBatchNumberList(params);
      },
      save(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid && this.doing === false) {
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
