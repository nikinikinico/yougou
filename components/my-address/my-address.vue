<template>
  <view>
    <!-- 顶部选择收货地址 -->
    <view class="address-choose-box" v-if="JSON.stringify(address)==='{}'">
      <button type="primary" size="mini" @click="btnAddressChoose">请选择收货地址+</button>
    </view>
    <!-- 渲染收货地址横条 -->
    <view class="address-info-box" @click="btnAddressChoose" v-else>
      <view class="row1">
        <view class="row1-left">
          <view class="username">收货人：<text>{{address.userName}}</text></view>
        </view>
        <view class="row1-right">
          <view class="phone">电话：<text>{{address.telNumber}}</text></view>
          <uni-icons type="arrowright" size="16"></uni-icons>
        </view>
      </view>
      <view class="row2">
        <view class="row2-left">收货地址：</view>
        <view class="row2-right">{{addStr}}</view>
      </view>
    </view>
    <!-- 底部横条 -->
    <image src="../../static/cart_border@2x.png" class="address-border"></image>
  </view>
</template>

<script>
  import { mapState, mapMutations, mapGetters } from 'vuex'
  export default {
    name:"my-address",
    data() {
      return {
        
      };
    },
    computed:{
      ...mapState('m_user',['address']),
      ...mapGetters('m_user',['addStr'])
    },
    methods:{
     async btnAddressChoose(){
       const [err,succ] = await uni.chooseAddress().catch(err=>err)
       if(err===null && succ.errMsg === 'chooseAddress:ok'){
         this.updateAddress(succ)
       }
       // 用户没有授权
       if (err && (err.errMsg === 'chooseAddress:fail auth deny' || err.errMsg === 'chooseAddress:fail authorize no response')) {
           this.reAuth() // 调用 this.reAuth() 方法，向用户重新发起授权申请
         }
     },
    async reAuth(){
       const [err,confirmResult] = await uni.showModal({
         content:'检测你没有打开地址权限，是否去打开?',
         confirmText:"确认",
         cancelText:'取消'
       })
       if(err) return
       if(confirmResult.cancel) return uni.$showMsg('您取消了地址权限')
       if(confirmResult.confirm){
         // return uni.openSetting({
         //   success(res){
         //     if(res.authSetting['scope.address']) return uni.$showMsg('授权成功，请选择地址！')
         //     if(!res.authSetting['scope.address']) return uni.$showMsg('您取消了地址授权')
         //   }
         // })
          return uni.authorize({
            scope:'scope.address',
            success(res){
              if(res.errMsg==='authorize:ok')
              return uni.$showMsg('授权成功，请选择地址！')
            }
          })
       }
     },
     ...mapMutations('m_user',['updateAddress'])
    }
  }
</script>

<style lang="scss">
.address-border{
  display: block;
  width:100%;
  height:5px;
}
.address-choose-box{
  height: 90px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.address-info-box{
  font-size: 12px;
  height: 90px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 5px;
  
  .row1{
    display: flex;
    justify-content: space-between;
    .row1-left{
      .username{
        
      }
    }
    .row1-right{
      display: flex;
      align-items: center;
      .phone{
        margin-right: 5px;
      }
    }
  }
  .row2{
    display: flex;
    align-items: center;
    margin-top: 10px;
    .row2-left{
      white-space: nowrap;
    }
    .row2-right{
      
    }
  }
}
</style>