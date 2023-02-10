<template>
  <view class="goods-info" v-if="goodsInfo.goods_name">
    <!-- 顶部轮播图 -->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
      <swiper-item v-for="(item, i) in goodsInfo.pics" :key="i" >
        <image :src="item.pics_big" @click="preview(i)"></image>
      </swiper-item>
    </swiper>
    
    <!-- 商品名称等信息 -->
    <view class="goods-info-box">
      <!-- 商品价格 -->
      <view class="goods_price">￥{{goodsInfo.goods_price}}</view>
      <!-- 信息主体 -->
      <view class="goods-info-body">
        <!-- 商品名称 -->
        <view class="goods-name"> {{goodsInfo.goods_name}}</view>
        <!-- 收藏 -->
        <view class="favi">
          <uni-icons type="star" size="18" color="gray"></uni-icons>
          <text>收藏</text>
        </view>
      </view>
      <!-- 运费 -->
      <view class="express">快递：免运费</view>
    </view>
  
    <!-- 商品详情图 -->
    <rich-text :nodes="goodsInfo.goods_introduce"></rich-text>
    
    <!-- 商品底部按钮 -->
    <view class="goods-nav">
      <uni-goods-nav  :options="options" :fill="true" :button-group="buttonGroup" @click="onClick" @buttonClick="buttonClick" />
    </view>
  </view>
  
</template>

<script>
  export default {
    data() {
      return {
        goodsInfo:{},
        options: [{
        					icon: 'shop',
        					text: '店铺',
        					infoBackgroundColor: '#007aff',
        					infoColor: "#f5f5f5"
        				}, {
        					icon: 'cart',
        					text: '购物车',
        					info: 5
        				}],
        				buttonGroup: [{
        						text: '加入购物车',
        						backgroundColor: 'linear-gradient(90deg, #FFCD1E, #FF8A18)',
        						color: '#fff'
        					},
        					{
        						text: '立即购买',
        						backgroundColor: 'linear-gradient(90deg, #FE6035, #EF1224)',
        						color: '#fff'
        					}
        				],
      }
    },
    methods: {
      async  getGoodsInfo(goods_id){
      const {data : res} = await uni.$http.get('/api/public/v1/goods/detail',{goods_id})
      if(res.meta.status!==200) return uni.$showMsg()
      res.message.goods_introduce = res.message.goods_introduce.replace(/<img /g,'<img style="display:block;"').replace(/webp/g,'jpg')
      this.goodsInfo = res.message
      },
      
      preview(i){
        uni.previewImage({
          current:i,
          urls:this.goodsInfo.pics.map((item)=>item.pics_big)
        })
      },
      
      onClick(e){
        if(e.content.text==='购物车'){
          uni.switchTab({
            url:'/pages/cart/cart'
          })
        }
      }
        
    },
    onLoad(options){
      const goods_id = options.goods_id
      this.getGoodsInfo(goods_id)
    }
  }
</script>

<style lang="scss">
 swiper {
   height: 750rpx;
   image {
     width: 100%;
     height: 100%;
   }
 }
 .goods-info-box {
   padding: 10px;
   padding-right: 0;
 
   .goods_price {
     color: #c00000;
     font-size: 18px;
     margin: 10px 0;
   }
 
   .goods-info-body {
     display: flex;
     justify-content: space-between;
 
     .goods-name {
       font-size: 13px;
       padding-right: 10px;
     }
     // 收藏区域
     .favi {
       width: 120px;
       font-size: 12px;
       display: flex;
       flex-direction: column;
       justify-content: center;
       align-items: center;
       border-left: 1px solid #efefef;
       color: gray;
     }
   }
 
   // 运费
   .express {
     margin: 10px 0;
     font-size: 12px;
     color: gray;
   }
 }
 .goods-nav{
   position: fixed;
   bottom:0;
   left: 0;
   width:100%
   
 }
 .goods-info{
   padding-bottom: 50px
 }
</style>
