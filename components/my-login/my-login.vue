<template>
  <view>
    <!-- 获取用户头像窗口 -->
    <view class="avater-box" v-if="avaterShow">
      <!-- 头像 -->
      <view class="avatar-wrapper">
        <button class="avater-btn" open-type="chooseAvatar" @chooseavatar="onChooseAvatar">
          <image class="avatar" :src="avatarUrl" mode="aspectFill"></image>
        </button> 
      </view>
      <!-- 昵称 -->
      <view class="weui-wrapper">
        <text class="weui-title">昵称</text>
        <input ref="input" v-model="nickname" type="nickname" class="weui-input" placeholder="请输入昵称" />
      </view>
      <button class="confirm" type="primary" @click="onComfirm">确认</button>
    </view>

    
    <!-- 登录窗口 -->
    <view class="login-container" v-else>
      <!-- 提示登录的图标 -->
      <uni-icons type="contact-filled" size="100" color="#AFAFAF"></uni-icons>
      <!-- 提示登录的按钮 -->
      <button type="primary" class="btn-login" @click="getUserInfo">一键登录</button>
      <!-- 登录提示 -->
      <view class="tip-text">登录后尽享更多优惠~</view>
    </view>
    
  </view>
</template>

<script>
  import {mapMutations,mapState} from 'vuex'
  export default {
    name:"my-login",
    data() {
      return {
        avatarUrl:'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0',
        avaterShow:false,
        nickname:'',
        // 后台申请的参数
        q:{
          code: '',
          encryptedData: 'res.encryptedData',
          iv: '',
          rawData: '',
          signature: ''
        }
    }
    },
    computed:{
      ...mapState('m_user',['userInfo','token','redirectInfo'])
    },
    methods:{
      async getUserInfo(){
          const [err,res] = await uni.getUserProfile({desc:'获取用户信息'})
          if(err||res.errMsg!=='getUserProfile:ok') return uni.$showMsg('获取用户信息失败！')
          this.updateUserInfo(res.userInfo)
          // 赋值申请token的参数
          this.q ={
            code: '',
            encryptedData: res.encryptedData,
            iv: res.iv,
            rawData: res.rawData,
            signature: res.signature
          }
          this.avaterShow = true
          },
          
      ...mapMutations('m_user',['updateUserInfo','updateToken','updateRedirectInfo']),
      
      onChooseAvatar(e){
        const { avatarUrl } = e.detail 
        this.avatarUrl = avatarUrl
      },
      
      // 确认头像
      onComfirm(){
        let u = JSON.parse(uni.getStorageSync('userInfo'))
        u.avatarUrl = this.avatarUrl
        u.nickName = this.nickname||'匿名用户'
        // 更新用户信息到vuex
        this.updateUserInfo(u)
        // 更新q的内容
        let q1 = JSON.parse(this.q.rawData)
        q1.nickName = this.nickname ||'匿名用户'
        q1.avatarUrl = this.avatarUrl
        this.q.rawData = JSON.stringify(q1)
        this.avaterShow= false
        this.getToken()
      },
      
      // 获取token
      async  getToken(){
        const [err,res] = await uni.login().catch(err=>err)
        if(err||res.errMsg!=='login:ok') return uni.$showMsg('登录失败！')
        this.q.code = res.code
        // 获取token
        const {data:loginResult } = await uni.$http.post('/api/public/v1/users/wxlogin',this.q)
        if (loginResult.meta.status !== 200)  {
          uni.$showMsg('登录失败,将使用临时token')
          const fakeToken = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo'
          this.updateToken(fakeToken)
        }else{
          uni.$showMsg('登录成功')
          this.updateToken(loginResult.message.token)
        }
        // 跳回原先页面
        this.navigateBack()
      },
      navigateBack(){
        if (this.redirectInfo && this.redirectInfo.openType === 'switchTab') {
            // 调用小程序提供的 uni.switchTab() API 进行页面的导航
            uni.switchTab({
              // 要导航到的页面地址
              url: this.redirectInfo.from,
              // 导航成功之后，把 vuex 中的 redirectInfo 对象重置为 null
              complete: () => {
                this.updateRedirectInfo(null)
              }
            })
          }
      }
    },
  }
</script>

<style lang="scss">
.login-container{
  height: 750rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f8f8f8;
  position: relative;
  &::after{
    content: '';
    display: block;
    width: 100%;
    height: 40px;
    background-color:#ffffff;
    position: absolute;
    bottom: 0;
    left: 0;
    border-radius: 100%;
    transform: translateY(50%);
  }
  .btn-login{
    width: 90%;
    border-radius: 100px;
    margin:15px 0;
    background-color: #c00000;
  } 
  .tip-text{
    font-size: 12px;
    color:gray
  }
}

.avater-box{
  height: 750rpx;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .avatar-wrapper{
    .avater-btn{
      width: 80px;
      height: 80px;
      position: relative;
      .avatar{
        position: absolute;
        top:0;
        left: 0;
        width: 80px;
        height: 80px;
      }
    }
  }
  .weui-wrapper{
    display: flex;
    align-items: center;
    margin-top: 20px;
    border-top: 1px solid #f8f8f8;
    border-bottom: 1px solid #f8f8f8 ;
    padding:10px 5px;
    width: 100%;
    font-size: 14px;
    .weui-title{
      line-height: 30px;
      margin-right: 30px;
      padding-left: 10px;
    }
    .weui-input{
      height:30px;
    }
  }
  .confirm{
    width: 90%;
    border-radius: 100px;
    margin:15px 0;
    background-color: #c00000;
    font-size: 14px;
  }
}
</style>