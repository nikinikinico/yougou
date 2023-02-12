
// #ifndef VUE3
import Vue from 'vue'
import App from './App'
import { $http } from '@escook/request-miniprogram'
import store from './store/store.js'
uni.$http = $http
// 请求开始之前做一些事情
$http.baseUrl = "https://api-hmugo-web.itheima.net"
$http.beforeRequest = function (options) {
  uni.showLoading({
    title: '数据加载中...',
  })
  // 判断是否为有权限的借口
  if(options.url.indexOf('/my/')!==-1){
    // 为请求头添加字段
    options.header = {
      Authorization: store.state.m_user.token,
    }
  }
}
$http.afterRequest = function(options){
  uni.hideLoading()
}
// 为uni挂载数据toast
uni.$showMsg = function( title = '数据加载失败', duration = 1500 ){
  uni.showToast({
    title,
    duration,
    icon:'none'
  })
}
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App,
    store
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif