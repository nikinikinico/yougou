<template>
  <view >
    <!-- 搜索区域 -->
    <my-search @click="getSearch"></my-search>
    <!-- 轮播图区域 -->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" :circular="true">
      <swiper-item v-for="(item,index) in swiperList" :key="index">
        <navigator class="swiper-item" :url="'/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id">
          <image :src="item.image_src" ></image>
        </navigator>
      </swiper-item>
    </swiper>
    <!-- 分类区域 -->
    <view class="nav-list">
      <view class="nav-item" v-for="(item,index) in navList" :key="index" @click="navClickHandler(item)">
        <image :src="item.image_src" class="nav-img"></image>
      </view>
    </view>
   <!-- 楼层区域 --> 
   <view class="floor-list">
     <view class="floor-item" v-for="(item,index) in floorList" :key="index">
       <!-- 楼层标题 -->
       <image :src="item.floor_title.image_src" class="floor-title"></image>
       <!-- 楼层图片 -->
       <view class="floor-img-box">
         <!-- 左边图片 -->
         <navigator class="left-img-box" :url="item.product_list[0].url">
           <image :src="item.product_list[0].image_src" mode="widthFix" :style="{width:item.product_list[0].image_width+'rpx'}"></image>
         </navigator>
         <!-- 右边图片-->
         <view class="right-img-box">
           <navigator class="right-img-item" v-for="(item2,index2) in item.product_list" :key="index2" v-if = "index2 !== 0" :url="item2.url">
             <image :src="item2.image_src" :style="{width:item2.image_width+'rpx'}" mode="widthFix"></image>
           </navigator>
         </view>
       </view>
     </view>
   </view>
  </view>
  
</template>

<script>
 import badgeMix from '@/mixins/tabbar-badge.js'
 export default {
    mixins:[badgeMix],
    data() {
      return {
        swiperList: [],
        navList: [],
        // 楼层数据
        floorList:[]
      };
    },
    onLoad() {
      this.getSwiperList()
      this.getNavList()
      this.getFloorList()
    },
    methods:{
      async getSwiperList(){
      const {data:res} = await uni.$http.get('/api/public/v1/home/swiperdata')
      if(res.meta.status!==200) return uni.$showMsg()
      this.swiperList = res.message
      },
      
      async getNavList(){
      const {data: res} = await uni.$http.get('/api/public/v1/home/catitems')
      if(res.meta.status!==200) return uni.$showMsg()
      this.navList = res.message
      },
      
      navClickHandler(item){
        if(item.name==='分类'){
          uni.switchTab({
            url:"/pages/cate/cate"
          })
        } 
      },
      
      async  getFloorList(){
        const { data:res } = await uni.$http.get('/api/public/v1/home/floordata')
        if(res.meta.status!== 200) return uni.$showMsg()
        res.message.forEach(floor=>{
          floor.product_list.forEach(prod=>{
            prod.url='/subpkg/goods_list/goods_list?'+prod.navigator_url.split('?')[1]
          })
        })
        this.floorList =  res.message
      },
      
      getSearch(){
          uni.navigateTo({
        url: '/subpkg/search/search'
      })
       }
    }
  }
</script>

<style lang="scss">
  swiper{
    height:330rpx;
  }
  .swiper-item,
  image{
    width:100%;
    heigth:100%
  }
  .nav-list{
    display: flex;
    justify-content: space-around;
    margin: 15px 0;
    .nav-img{
      width: 128rpx;
      height: 140rpx;
    }
  }
  .floor-title{
    width: 100%;
    height:60rpx
  }
  .right-img-box{
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
  }
  .floor-img-box{
    display: flex;
    padding-left:10rpx
  }
</style>
