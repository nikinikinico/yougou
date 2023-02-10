<template>
  <view class="goods-item" @click="gotoItem(goods)">
    <!-- 商品左侧图片 -->
    <view class="goods-item-left">
      <image :src="goods.goods_small_logo||defaultimg" class="goods-pic"></image>
    </view>
    <!-- 商品右侧信息 -->
    <view class="goods-item-right">
      <view class="goods-name">
        {{goods.goods_name}}
      </view>
      <view class="goods-info">
        <view class="goods-price">
          ￥{{goods.goods_price | pricefilter}}
        </view>
      </view>
    </view>
  </view>
  
</template>

<script>
  export default {
    name:"my-goods",
    props:{
      goods:{
        type: Object,
        default: {}
      }
    },
    data() {
      return {
        // 默认显示图片
        defaultimg:'https://img3.doubanio.com/f/movie/8dd0c794499fe925ae2ae89ee30cd225750457b4/pics/movie/celebrity-default-medium.png'
      };
    },
    filters:{
       pricefilter(num){
         return Number(num).toFixed(2)
       }
    },
    methods:{
      gotoItem(item){
        uni.navigateTo({
          url:'/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
        })
      }
    }
  }
</script>

<style lang="scss">
  .goods-item{
    display: flex;
    padding: 10px 5px;
    border-bottom: 1px solid #f0f0f0;
    .goods-item-left{
      margin-right: 5px;
      .goods-pic{
        width: 100px;
        height: 100px;
        display: block;
      }
    }
    .goods-item-right{
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .goods-name{
         font-size: 13px;
      }
      .goods-info{
        .goods-price{
           font-size: 16px;
          color: #c00000;
        }
      }
    }
  }
</style>