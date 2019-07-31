<template>
  <div>
    <el-form-item label="计费类型" prop="billingType"
                  :rules="[{required: true, message: '请选择计费类型', trigger: 'change'}]">
      <el-select placeholder="请选择计费类型" v-model="currentItem.billingType"
                 filterable clearable @change="billingTypeChange">
        <el-option :label="item.name" :value="item.id" :key="item.id" v-for="item in costTypes"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="业务类型" prop="businessType" v-if="currentCostType.bizTypes.length"
                  :rules="[{required: true, message: '请选择业务类型', trigger: 'change'}]">
      <el-select placeholder="请选择计费项" v-model="currentItem.businessType"
                 filterable clearable>
        <el-option :label="item.name" :value="item.id" :key="item.id"
                   v-for="item in currentCostType.bizTypes"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="计费项" prop="billingItemNo"
                  :rules="[{required: true, message: '请选择计费项', trigger: 'change'}]">
      <el-select placeholder="请选择计费项" v-model="currentItem.billingItemNo"
                 filterable clearable @change="billingItemNoChange">
        <el-option :label="item.name" :value="item.id" :key="item.id"
                   v-for="item in currentCostType.items"></el-option>
      </el-select>
    </el-form-item>
    <el-row v-show="currentItem.billingItemNo">
      <el-col :span="14">
        <el-form-item label="计费规则" label-width="80px">{{currentItem.billingRules}}</el-form-item>
      </el-col>
      <el-col :span="6">
        <el-form-item label="单位" label-width="80px">{{currentItem.billingUnit}}</el-form-item>
      </el-col>
      <el-col :span="4" v-show="!currentCostType.ladderState">
        <el-form-item label="是否阶梯" label-width="80px">否</el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6">
        <el-form-item label="单价" prop="unitPrice" label-width="100px"
                      :rules="[{required: true, message: '请输入单价', trigger: 'blur'}]">
          <oms-input placeholder="请输入单价" type="input" v-model="currentItem.unitPrice" @blur="formatPrice"/>
        </el-form-item>
      </el-col>
      <el-col :span="6" v-show="currentCostType.ladderState">
        <el-form-item label="是否阶梯">
          <el-radio-group v-model="currentItem.ladderState" size="small">
            <el-radio-button label="1">是</el-radio-button>
            <el-radio-button label="0">否</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span="6" v-if="currentItem.ladderState === '1'">
        <el-form-item label="上限" label-width="80px" :rules="[{required: true, message: '请输入上限', trigger: 'blur'}]">
          <oms-input placeholder="请输入单价上限" type="input" v-model="currentItem.upperLimit"/>
        </el-form-item>
      </el-col>
      <el-col :span="6" v-if="currentItem.ladderState === '1'">
        <el-form-item label="下限" label-width="80px" :rules="[{required: true, message: '请输入下限', trigger: 'blur'}]">
          <oms-input placeholder="请输入单价下限" type="input" v-model="currentItem.lowerLimit"/>
        </el-form-item>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import utils from '@/tools/utils';
  export default {
    props: ['currentItem'],
    data() {
      return {
        currentCostType: {
          bizTypes: [],
          items: []
        }
      }
    },
    computed: {
      costTypes() {
        return this.$store.state.costTypes;
      }
    },
    methods: {
      billingTypeChange(val) {
        this.currentItem.businessType = '';
        this.currentItem.billingItemNo = '';
        this.currentItem.billingRules = '';
        this.currentItem.billingUnit = '';
        this.currentItem.ladderState = '0';
        this.currentItem.upperLimit = '';
        this.currentItem.lowerLimit = '';
        if (!val) {
          return;
        }
        this.currentCostType = this.costTypes.find(f => f.id === val);
        this.currentItem.ladderState = this.currentCostType.ladderState ? '1' : '0';

      },
      billingItemNoChange(val) {
        if (!val) {
          return;
        }
        let item =  this.currentCostType.items.find(f => f.id === val);
        this.currentItem.billingItemName = item.name;
        this.currentItem.billingRules = item.rule;
        this.currentItem.billingUnit = item.unit;
      },
      formatPrice() {// 格式化单价，保留两位小数
        this.currentItem.unitPrice = utils.autoformatDecimalPoint(this.currentItem.unitPrice);
      }
    }
  }
</script>
