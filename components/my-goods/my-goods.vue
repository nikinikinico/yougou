<template>
  <view class="goods-item">
    <!-- 商品左侧图片 -->
    <view class="goods-item-left">
      <radio :checked="goods.goods_state" color="#c00000" v-if="showRadio" @click="radioHandler"></radio>
      <image :src="goods.goods_small_logo||defaultimg" class="goods-pic"  @click="gotoItem(goods)"></image>
    </view>
    <!-- 商品右侧信息 -->
    <view class="goods-item-right"  >
      <view class="goods-name" @click="gotoItem(goods)">
        {{goods.goods_name}}
      </view>
      <view class="goods-info">
        <view class="goods-price">
          ￥{{goods.goods_price | pricefilter}}
        </view>
        <uni-number-box :min="1" @change="bindChange" v-if="showNumberBox" :value="goods.goods_count"></uni-number-box>
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
      },
      showRadio:{
        type:Boolean,
        default:false
      },
      showNumberBox:{
        type:Boolean,
        default:false
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
      },
      radioHandler(){
        this.$emit('radioChange',{
          goods_id: this.goods.goods_id,
          goods_state: !this.goods.goods_state
        })
      },
      bindChange(value){
        this.$emit('goodsCountHandler',{
          goods_id: this.goods.goods_id,
          value:+value
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
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-right: 5px;
      .goods-pic{
        width: 100px;
        height: 100px;
        display: block;
      }
    }
    .goods-item-right{
      display: flex;
      flex:1;
      flex-direction: column;
      justify-content: space-between;
      .goods-name{
         font-size: 13px;
      }
      .goods-info{
        display: flex;
        justify-content: space-between;
        align-items: center;
        .goods-price{
           font-size: 16px;
          color: #c00000;
        }
      }
    }
  }
</style>