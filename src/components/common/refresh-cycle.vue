<template>
  <el-dropdown @command="menuChange" class="refresh-cycle-dropdown" trigger="click">
          <span class="el-dropdown-link">
            <i class="i-btn"/><i class="i-btn"/><i class="i-btn"/>
          </span>
    <el-dropdown-menu class="refresh-cycle-menu" slot="dropdown">
      <el-dropdown-item :command="item.cycle" :key="key" v-for="(item, key) in refreshCycles">
        {{item.title}}
        <i class="el-icon-check" v-show="cycle === item.cycle"/>
      </el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>
<script>
  export default {
    name: 'refreshCycle',
    data() {
      return {
        refreshCycles: {
          0: {title: '没有刷新', cycle: null},
          1: {title: '10秒', cycle: 1000 * 10},
          2: {title: '30秒', cycle: 1000 * 30},
          3: {title: '1分', cycle: 1000 * 60},
          4: {title: '2分', cycle: 1000 * 60 * 2},
          5: {title: '10分', cycle: 1000 * 60 * 10},
          6: {title: '30分', cycle: 1000 * 60 * 30}
        },
        cycle: 1000 * 60
      };
    },
    mounted() {
      this.$emit('change', this.cycle);
    },
    methods: {
      menuChange(cycle) {
        this.cycle = cycle;
        this.$emit('change', this.cycle);
      }
    }
  };
</script>
