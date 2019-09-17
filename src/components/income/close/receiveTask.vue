<template>
  <dialog-template :btnSavePosition="120">
    <template slot="title">生成收款作业</template>
    <template slot="btnSave">
      <el-button class="mt-10" :disabled="doing" @click="save" plain type="primary">生成收款作业</el-button>
    </template>
    <template slot="content">
      <h2 style="padding: 10px 0;">结算单</h2>
      <el-table :data="dataList" border class="clearfix" ref="orderDetail">
        <el-table-column prop="customerName" label="甲方" width="200">
          <template slot-scope="scope">{{scope.row.customerName}}</template>
        </el-table-column>
        <el-table-column prop="contractName" label="合同" width="200">
          <template slot-scope="scope">{{scope.row.contractName}}</template>
        </el-table-column>
        <el-table-column prop="accountCheckNo" label="结算单号" width="150">
          <template slot-scope="scope">{{scope.row.statementNo}}</template>
        </el-table-column>
        <el-table-column prop="accountCheckAmount" label="结算单金额" width="120">
          <template slot-scope="scope">{{scope.row.collectionAmount | formatMoney}}</template>
        </el-table-column>
        <el-table-column prop="unreturnedAmount" label="结算日期" width="170">
          <template slot-scope="scope">{{scope.row.statementTime | time}}</template>
        </el-table-column>
        <el-table-column prop="unreturnedAmount" label="回款日期" width="170">
          <template slot-scope="scope">{{scope.row.backAmountTime | time}}</template>
        </el-table-column>
        <el-table-column prop="statementType" label="状态" width="120">
          <template slot-scope="scope">
            {{orgType[scope.row.statementType].title}}
          </template>
        </el-table-column>
        <el-table-column prop="unreturnedAmount" label="待回款金额" width="120" fixed="right">
          <template slot-scope="scope">{{scope.row.unreturnedAmount | formatMoney}}</template>
        </el-table-column>
        <el-table-column prop="unreturnedAmount" label="收款金额" width="120" fixed="right">
          <template slot-scope="scope">
            <oms-input v-model="scope.row.collectionAmount" @blur="editItem(scope.row)"/>
          </template>
        </el-table-column>
        <el-table-column prop="operate" label="操作" width="120" fixed="right" v-if="dataList.length > 1">
          <template slot-scope="scope">
            <des-btn icon="delete" @click="deleteItem(scope.row)">删除</des-btn>
          </template>
        </el-table-column>
      </el-table>
      <el-form :model="form" label-width="120px" ref="form">
        <el-row class="mt-10" v-show="advancePayAmount">
          <el-col :span="12">
            <el-form-item label="是否使用预收款" label-width="120px">
              <el-switch v-model="form.collectionType" active-text="是" inactive-text="否" active-value="1"
                         inactive-value="0" @change="collectionTypeChange"></el-switch>
              <span style="margin-left: 20px" v-show="form.collectionType === '1'">预收款余额：{{advancePayAmount}}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="预收款抵扣金额" label-width="130px" prop="advancePayAmount" v-if="form.collectionType === '1'"
                          :rules="[{required: true, message: '请输入预收款抵扣金额', trigger: 'blur'}]">
              <oms-input v-model="form.advancePayAmount" style="width: 200px" @blur="formatAdvancePayAmount"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="收款作业总额" label-width="120px">{{collectionTotal | formatMoney}}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="收欠款金额" label-width="120px">{{owedAmount| formatMoney}}</el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="结算方式" label-width="120px" prop="statementMode"
                          :rules="[{required: true, message: '请选择结算方式', trigger: 'change'}]">
              <el-radio-group v-model="form.statementMode" size="small">
                <el-radio-button :label="item.key" :key="item.key" v-for="item in closeTypes">{{item.label}}
                </el-radio-button>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="回款日期" label-width="120px" prop="backAmountTime"
                          :rules="[{required: true, message: '请选择回款日期', trigger: 'change'}]">
              <el-date-picker v-model="form.backAmountTime" type="date" placeholder="选择日期"
                              style="width: 200px"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="银行名称" label-width="120px" prop="bankName"
                      :rules="[{required: true, message: '请输入银行名称', trigger: 'blur'}]">
          <oms-input placeholder="请输入银行名称" type="input" v-model="form.bankName"/>
        </el-form-item>
      </el-form>
    </template>
  </dialog-template>
</template>
<script>
  import utils from '@/tools/utils';
  import {preBalance, receiveTask} from '@/resources';

  export default {
    props: {
      dataList: Array,
      orgType: Object
    },
    data() {
      return {
        form: {
          advancePayAmount: 0,
          collectionType: '0',
          statementMode: '',
          backAmountTime: '',
          bankName: ''
        },
        doing: false,
        advancePayAmount: 0,
        balanceList: []
      };
    },
    computed: {
      closeTypes() {
        return this.$store.state.closeTypes;
      },
      collectionTotal() {
        let total = 0;
        this.dataList.forEach(i => {
          total += Number(i.collectionAmount) || 0;
        });
        return total;
      },
      owedAmount() {
        return this.collectionTotal - (Number(this.form.advancePayAmount) || 0);
      }
    },
    watch: {
      dataList: {
        handler(val) {
          if (!val || !val.length) {
            this.advancePayAmount = 0;
            this.form = {
              advancePayAmount: 0,
              collectionType: '0',
              statementMode: '',
              backAmountTime: '',
              bankName: ''
            };
            return;
          }
          this.queryBalance(val[0].customerId);
        },
        immediate: true
      }
    },
    methods: {
      editItem(item) {
        if (item.collectionAmount > item.unliquidatedAmount) {
          item.collectionAmount = item.unliquidatedAmount;
        }
        item.collectionAmount = utils.autoformatDecimalPoint(item.collectionAmount);
      },
      deleteItem(item) {
        let index = this.dataList.indexOf(item);
        index > -1 && this.dataList.splice(index, 1);
      },
      formatAdvancePayAmount() {
        if (this.form.advancePayAmount > this.advancePayAmount) {
          this.form.advancePayAmount = this.advancePayAmount;
        }
        this.form.advancePayAmount = utils.autoformatDecimalPoint(this.form.advancePayAmount);
      },
      collectionTypeChange(val) {
        this.form.advancePayAmount = val === '1' ? this.advancePayAmount : 0;
      },
      queryBalance(customerId) {
        let params = {customerId};
        preBalance.query(params).then(res => {
          this.advancePayAmount = res.data.data.list.length && res.data.data.list[0].advanceBalance || 0;
        });
      },
      save() {
        this.$refs.form.validate(v => {
          if (!v || this.doing) return;
          this.doing = true;
          this.form.collectionJobsStatementInfos = this.dataList.map(m => ({
            collectionType: m.collectionType,
            statementId: m.statementId,
            collectionAmount: m.collectionAmount
          }));
          this.$httpRequestOpera(receiveTask.batchCreate(this.form), {
            errorTitle: '生成收款作业完成',
            success: res => {
              this.doing = false;
              this.$emit('change');
            },
            error: () => {
              this.doing = false;
            }
          });
        });
      }
    }
  };
</script>
