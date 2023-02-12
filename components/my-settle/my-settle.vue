<!-- 结算区域组件 -->
<template>
  <view class="my-settle-container">
    <!-- 全选区域 -->
    <label class="radio" @click="selectAll">
      <radio :checked="isFullCheck" color="#c00000"/><text>全选</text>
    </label>
    
    <!-- 合计区域 -->
    <view class="amount-box">
      合计：<text class="amount">￥{{getGoodsSeletedPrice}}</text>  
    </view>
    
    <!-- 结算区域 -->
    <view class="btn-settle" @click="settlement">
      结算({{getGoodsSeletedAmount}})
    </view>
  </view>
</template>

<script>
import { mapGetters ,mapMutations, mapState} from 'vuex'
  export default {
    name:"my-settle",
    data() {
      return {
        seconds:3.,
        timer:null
      };
    },
    computed:{
      ...mapGetters('m_cart',['getGoodsSeletedAmount','total','getGoodsSeletedPrice']),
      ...mapState('m_user',['address','token']),
      ...mapState('m_cart',['cart']),
      isFullCheck(){
        return this.getGoodsSeletedAmount === this.total
      }
    },
    methods:{
      selectAll(){
        console.log(!this.isFullCheck)
        this.updateGoodsAllState(!this.isFullCheck)
      },
      ...mapMutations('m_cart',['updateGoodsAllState']),
      ...mapMutations('m_user',['updateRedirectInfo']),
      // 结算
      settlement(){
        if(!this.getGoodsSeletedAmount) return uni.$showMsg('请选择商品!')
        if(!this.address) return uni.$showMsg('请选择收货地址!')
        if(!this.token) return this.delayNavigate()
        
        // 实现微信支付功能
        this.payOrder()
      },
      // 展示倒计时消息
      showTip(n){
        uni.showToast({
          icon:'none',
          title:'请登录后再结算!'+n+'秒后自动跳转',
          mask:true,
          // 1.5秒后自动消失
          duration:1500
        })
      },
      
      // 延迟跳转
      delayNavigate(){
        this.seconds = 3
        this.showTip(this.seconds)
        this.timer = setInterval(()=>{
          this.seconds--
          if(this.seconds<=0){
            clearInterval(this.timer)
            uni.switchTab({
               url:'/pages/my/my',
               // 页面跳转成功之后的回调函数
               success: () => {
                 // 调用 vuex 的 updateRedirectInfo 方法，把跳转信息存储到 Store 中
                 this.updateRedirectInfo({
                   // 跳转的方式
                   openType: 'switchTab',
                   // 从哪个页面跳转过去的
                   from: '/pages/cart/cart'
                 })
               }
            })
            return
          }
          this.showTip(this.seconds)
        },1000)
        
      },
      // 实现支付
     async payOrder(){
        // 1. 创建订单
        // 1.1 组织订单的信息对象
        const orderInfo = {
          // order_price:this.getGoodsSeletedPrice,
          order_price: 0.01,
          consignee_addr: this.address,
          goods:this.cart.filter(item=>item.goods_state).map(x => ({ goods_id: x.goods_id, goods_number: x.goods_count, goods_price: x.goods_price }))
        }
        // 发起请求创建订单
        const {data:res} = await uni.$http.post('/api/public/v1/my/orders/create',orderInfo)
        if(res.meta.status!==200) return uni.$showMsg('创建订单失败!')
        // 得到服务器响应的订单编号
        const orderNumber = res.message.order_number
        
        // 订单预支付
        // 2.1 发起请求获取订单的支付信息
        const { data: res2 } = await uni.$http.post('/api/public/v1/my/orders/req_unifiedorder', { order_number: orderNumber })
        // 2.2 预付订单生成失败
        if (res2.meta.status !== 200) return uni.$showError('预付订单生成失败！')
        // 2.3 得到订单支付相关的必要参数
        const payInfo = res2.message.pay
         // 3. 发起微信支付
         // 3.1 调用 uni.requestPayment() 发起微信支付
        const [err, succ] = await uni.requestPayment(payInfo)
         // 3.2 未完成支付
        if (err) return uni.$showMsg('订单未支付！')
         // 3.3 完成了支付，进一步查询支付的结果
        const { data: res3 } = await uni.$http.post('/api/public/v1/my/orders/chkOrder', { order_number: orderNumber })
         // 3.4 检测到订单未支付
        if (res3.meta.status !== 200) return uni.$showMsg('订单未支付！')
         // 3.5 检测到订单支付完成
        uni.showToast({
           title: '支付完成！',
           icon: 'success'
         })
      }
    }
  }
</script>

<style lang="scss">
.my-settle-container{
  position: fixed;
  bottom:0;
  left:0;
  width:100%;
  height:50px;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  .radio{
    padding-left: 5px;
    display: flex;
    align-items: center;
  }
  .amount-box{
    .amount{
      color:#c00000;
      font-weight: bold;
    }
  }
  .btn-settle{
    height: 50px;
    min-width: 100px;
    background-color: #c00000;
    color:white;
    padding:0 10px;
    line-height: 50px;
    text-align: center;
  }
}
</style>