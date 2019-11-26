<template>
  <div :style="`height: ${height}px;overflow-y:auto`" @scroll="scrollEvent">
    <slot :children="children">sdfsdf</slot>
  </div>
</template>
<script>
  export default {
    name: 'largeDataList',
    props: {
      height: {
        type: Number,
        default: 400
      },
      limit: {
        type: Number,
        default: 50
      },
      dataList: Array,
      pageSize: {
        type: Number,
        default: 10
      },
      lineWidth: {
        type: Number,
        default: 50
      }
    },
    data() {
      return {
        children: [],
        preScrollTop: 0,
        loading: false
      };
    },
    watch: {
      dataList(val) {
        if (!val) return;
        if (val.length < this.limit) {
          this.children = this.dataList;
        }
        this.children = this.dataList.slice(0, this.limit);
        this.$nextTick(() => {
          this.$el.scrollTop = 0;
        });
      }
    },
    methods: {
      scrollEvent(e) {
        if (this.dataList.length < this.limit) return;
        if (this.loading) return;
        let preScrollTop = this.preScrollTop;
        let curScrollTop = e.target.scrollTop;
        this.preScrollTop = curScrollTop;
        let direction = curScrollTop - preScrollTop;
        let dif = this.$el.scrollHeight - curScrollTop - this.height;
        let pageSize = this.pageSize;
        if (direction > 0) {
          if (dif > 100) return;
          let index = this.dataList.indexOf(this.children.pop());
          let list = this.dataList.slice(index, index + pageSize);
          if (!list.length) return;
          this.loading = true;
          this.children.push(...list);
          this.children = this.children.slice(list.length - 1);
          setTimeout(() => {
            this.$emit('change');
            e.target.scrollTop = e.target.scrollTop - pageSize * this.lineWidth;
            this.loading = false;
          }, 100);
        } else {
          if (curScrollTop > 100) return;
          let index = this.dataList.indexOf(this.children[0]);
          let start = index - pageSize > 0 ? index - pageSize : 0;
          let list = this.dataList.slice(start, index);
          if (!list.length) return;
          this.loading = true;
          this.children = list.concat(this.children);
          this.children = this.children.slice(0, this.children.length - pageSize);
          setTimeout(() => {
            this.$emit('change');
            e.target.scrollTop = e.target.scrollTop + pageSize * this.lineWidth;
            this.loading = false;
          }, 100);
        }
      }
    }
  };
</script>
