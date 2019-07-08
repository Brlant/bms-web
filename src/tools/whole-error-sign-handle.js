// 全局错误标志
export default {
  add() {
    window.localStorage.setItem('wholeError', '1');
  },
  clear() {
    window.localStorage.removeItem('wholeError');
  },
  has() {
    return !!window.localStorage.getItem('wholeError');
  }
};
