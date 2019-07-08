export default {
  computed: {
    times() {
      return this.$store.state.times;
    }
  },
  methods: {
    /**
     * 清除所有定时器
     */
    clearAllTimes() {
      let {times} = this;
      if (!times.length) return;
      times.map(m => clearInterval(m));
      this.$store.commit('initTimes', []);
    },
    /**
     * 记录新的定时器Id
     * @param time
     */
    setTimes(time) {
      let {times} = this;
      times.push(time);
      this.$store.commit('initTimes', times);
    }
  }
};
