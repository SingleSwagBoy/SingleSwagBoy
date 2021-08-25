<!--
 * @Description: API请求等待状态
 * @Author: HuangQS
 * @Date: 2021-08-20 19:18:21
 * @LastEditors: HuangQS
 * @LastEditTime: 2021-08-20 19:20:31
-->


<template>
  <div class="mock">
    <div class="main">
      <img src="./loading.gif" alt />
      <span>加载中..</span>
    </div>
  </div>
</template>

<script>
export default {
  name: "LOADING",
  data() {
    return {};
  },
};
</script>
<style lang="scss" scoped>
.mock {
  width: 100vw;
  height: 100vh;
  background: rgba(153, 153, 153, 0.35);
  position: absolute;
  z-index: 99999;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-content: center;
  align-items: center;

  .main {
    width: 150px;
    height: 150px;
    margin: 0 auto;
    text-align: center;
    border-radius: 10px;
    background: #ffffff;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    align-items: center;

    img {
      width: 80px;
      height: 80px;
    }
    span {
      margin-top: 10px;
      font-size: 16px;
    }
  }
}
</style>
