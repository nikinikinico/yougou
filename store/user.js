export default {
  namespaced:true,
  state(){
    return{
      address: JSON.parse(uni.getStorageSync('address') || '{}'),
      token: uni.getStorageSync('token')||'',
      userInfo: JSON.parse(uni.getStorageSync('userInfo') || '{}'),
      redirectInfo:null,
      // 储存redictInfo的原因是：在登录后可以判断是否由其他页面重定位过来，以便可以直接转过去，如果没有，就不需要跳转
    }
  },
  mutations:{
    updateAddress(state,address){
      state.address = address
      this.commit('m_user/saveAddressToLocal')
    },
    saveAddressToLocal(state){
      uni.setStorageSync('address',JSON.stringify(state.address))
    },
    // 更新用户信息
    updateUserInfo(state,userInfo){
      state.userInfo = userInfo
      this.commit('m_user/saveUserInfoToLocal')
    },
    // 存储用户信息
    saveUserInfoToLocal(state){
      uni.setStorageSync('userInfo',JSON.stringify(state.userInfo))
    },
    // 更改token
    updateToken(state,token){
      state.token = token
      this.commit('m_user/saveTokenToStorage')
    },
    saveTokenToStorage(state){
      uni.setStorageSync('token',state.token)
    },
    // 更新重定向的信息对象
      updateRedirectInfo(state, info) {
        state.redirectInfo = info
      }
  },
  getters:{
    addStr(state){
      if(!state.address.provinceName) return ''
      // 拼接 省，市，区，详细地址 的字符串并返回给用户
      return state.address.provinceName + state.address.cityName + state.address.countyName + state.address.detailInfo
    }
  }
}