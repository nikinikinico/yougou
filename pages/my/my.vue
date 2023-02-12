<template>
  <view class="my-container">
    <!-- 登录界面 -->
    <my-login v-if="!token"></my-login>
    <!-- 用户信息界面 -->
    <my-userInfo v-else></my-userInfo>
  </view>
</template>

<script>
  import { mapState } from 'vuex'
  import badgeMix from '@/mixins/tabbar-badge.js'
  export default {
    mixins:[badgeMix],
    data() {
      return {
        
      };
    },
    computed:{
      ...mapState('m_user',['token'])
    }
  }
</script>

<style lang="scss">
page,
.my-container {
  height: 100%;
}
</style>
