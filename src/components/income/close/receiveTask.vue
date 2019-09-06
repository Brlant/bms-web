<template>
  <dialog-template :btnSavePosition="120">
    <template slot="title">生成收款作业</template>
    <template slot="btnSave">
      <el-button class="mt-10" :disabled="doing" @click="save" plain type="primary">生成收款作业</el-button>
    </template>
    <template slot="content">
      <h2 style="padding: 10px 0;">结算单</h2>
      <el-table :data="data" border class="clearfix" ref="orderDetail">
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
        <el-table-column prop="unreturnedAmount" label="使用预收款余额支付" width="160" fixed="right">
          <template slot-scope="scope">
            <span v-if="!scope.row.advanceCollectionType">否</span>
            <el-switch
              v-else v-model="scope.row.collectionType"
              active-text="是" inactive-text="否" active-value="0" inactive-value="1">
            </el-switch>
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
        <el-table-column prop="operate" label="操作" width="120" fixed="right" v-if="data.length > 1">
          <template slot-scope="scope">
            <des-btn icon="delete" @click="deleteItem(scope.row)">删除</des-btn>
          </template>
        </el-table-column>
      </el-table>
      <el-form :model="form" label-width="120px" ref="form">
        <el-form-item label="结算方式" label-width="120px" prop="statementMode"
                      :rules="[{required: true, message: '请选择结算方式', trigger: 'change'}]">
          <el-radio-group v-model="form.statementMode" size="small">
            <el-radio-button :label="item.key" :key="item.key" v-for="item in closeTypes">{{item.label}}
            </el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="回款日期" label-width="120px" prop="backAmountTime"
                      :rules="[{required: true, message: '请选择回款日期', trigger: 'change'}]">
          <el-date-picker v-model="form.backAmountTime" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
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
  import {receiveTask} from '@/resources';

  export default {
    props: {
      data: Array,
      orgType: Object
    },
    data() {
      return {
        form: {},
        doing: false
      };
    },
    computed: {
      closeTypes() {
        return this.$store.state.closeTypes;
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
        let index = this.data.indexOf(item);
        index > -1 && this.data.splice(index, 1);
      },
      save() {
        this.$refs.form.validate(v => {
          if (!v || this.doing) return;
          this.doing = true;
          this.form.collectionJobsStatementInfos = this.data.map(m => ({
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
