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
                 filterable clearable @change="businessTypeChange">
        <el-option :label="item.name" :value="item.id" :key="item.id"
                   v-for="item in currentCostType.bizTypes"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="计费项名称" prop="billingCustomName" label-width="120px"
                  :rules="[{required: true, message: '请输入计费项名称', trigger: 'blur'}]">
      <oms-input placeholder="请输入计费项名称" type="input" v-model="currentItem.billingCustomName"/>
    </el-form-item>
    <el-form-item label="计费项" prop="billingItemNo"
                  :rules="[{required: true, message: '请选择计费项', trigger: 'change'}]">
      <el-select placeholder="请选择计费项" v-model="currentItem.billingItemNo"
                 filterable clearable @change="billingItemNoChange">
        <el-option :label="item.name" :value="item.id" :key="item.id"
                   v-for="item in curCostItems"></el-option>
      </el-select>
    </el-form-item>
    <el-row v-show="currentItem.billingItemNo">
      <el-col :span="14">
        <el-form-item label="计费规则">{{currentItem.billingRules}}</el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6" v-show="currentCostType.ladderState">
        <el-form-item label="是否阶梯">
          <el-radio-group v-model="currentItem.ladderState" size="small" @change="ladderStateChange">
            <el-radio-button label="1">是</el-radio-button>
            <el-radio-button label="0">否</el-radio-button>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span="5" v-if="currentItem.ladderState === '1'">
        <el-form-item label="下限" label-width="80px" prop="lowerLimit"
                      :rules="[{required: true, message: '请输入下限', trigger: 'blur'}]">
          <oms-input placeholder="请输入下限" type="input" v-model="currentItem.lowerLimit"/>
        </el-form-item>
      </el-col>
      <el-col :span="5" v-if="currentItem.ladderState === '1'">
        <el-form-item label="上限" label-width="80px" prop="upperLimit"
                      :rules="[{required: true, message: '请输入上限', trigger: 'blur'}]">
          <oms-input placeholder="请输入上限" type="input" v-model="currentItem.upperLimit"/>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="10">
        <el-form-item label="单价" prop="unitPrice" label-width="120px"
                      :rules="[{required: true, message: '请输入单价', trigger: 'blur'}]">
          <oms-input placeholder="请输入单价" type="input" v-model="currentItem.unitPrice" @blur="formatPrice">
            <span slot="append" v-if="currentItem.billingUnit">
             {{ currentItem.billingUnit}}
            </span>
          </oms-input>
        </el-form-item>
      </el-col>
    </el-row>
  </div>
</template>
<script>
  import utils from '@/tools/utils';

  export default {
    props: ['currentItem', 'billingModelType'],
    data() {
      return {
        currentCostType: {
          bizTypes: [],
          items: []
        }
      };
    },
    computed: {
      costTypes() {
        return this.$store.state.costTypes;
      },
      curCostItems() {
        if (!this.currentItem.billingType) return [];
        if (!this.currentCostType.bizTypes.length) return this.currentCostType.items.filter(f => (f.bind === (this.billingModelType === '1')));
        if (!this.currentItem.businessType) return [];
        let bizItem = this.currentCostType.bizTypes.find(f => f.id === this.currentItem.businessType);
        if (!bizItem) return [];
        if (!bizItem.itemId) return this.currentCostType.items.filter(f => (f.bind === (this.billingModelType === '1')));
        return this.currentCostType.items.filter(f => (f.bind === (this.billingModelType === '1') && f.id === bizItem.itemId));
      }
    },
    watch: {
      billingModelType() {
        this.currentItem.billingItemNo = '';
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
        let item = this.currentCostType.items.find(f => f.id === val);
        this.currentItem.billingItemName = item.name;
        this.currentItem.billingRules = item.rule;
        this.currentItem.billingUnit = item.unit;
      },
      formatPrice() {// 格式化单价，保留两位小数
        this.currentItem.unitPrice = utils.autoformatDecimalPoint(this.currentItem.unitPrice);
      },
      ladderStateChange() {
        this.currentItem.upperLimit = '';
        this.currentItem.lowerLimit = '';
      },
      businessTypeChange() {
        this.currentItem.billingItemNo = '';
      }
    }
  };
</script>
