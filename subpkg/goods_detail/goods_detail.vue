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
      <view class="express">快递：免运费{{cart.length}}</view>
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
  import { mapState, mapMutations, mapGetters } from 'vuex'
  export default {
    computed: {
        // 调用 mapState 方法，把 m_cart 模块中的 cart 数组映射到当前页面中，作为计算属性来使用
        // ...mapState('模块的名称', ['要映射的数据名称1', '要映射的数据名称2'])
        ...mapState('m_cart', ['cart']),
        ...mapGetters('m_cart',['total'])
      },
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
    watch:{
      total:{
        handler(newVal){
          const findResult = this.options.find(item=>item.text === '购物车')
          if(findResult){
            findResult.info = newVal
          }
        },
        immediate:true
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
      },
      ...mapMutations('m_cart', ['addToCart']),
      buttonClick(e){
        if(e.content.text === '加入购物车'){
          const goods = {
             goods_id: this.goodsInfo.goods_id,       // 商品的Id
             goods_name: this.goodsInfo.goods_name,   // 商品的名称
             goods_price: this.goodsInfo.goods_price, // 商品的价格
             goods_count: 1,                           // 商品的数量
             goods_small_logo: this.goodsInfo.goods_small_logo, // 商品的图片
             goods_state: true                         // 商品的勾选状态
          }
          this.addToCart(goods)
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
