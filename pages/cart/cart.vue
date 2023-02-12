<template>
  <view>
    <view class="cart-container" v-if="cart.length!==0">
      <!-- 购物车收货地址 -->
      <my-address></my-address>
      <!-- 购物车标题区域 -->
      <view class="cart-title">
        <!-- 左侧的图标 -->
        <uni-icons type="shop" size="18"></uni-icons>
        <!-- 右侧的文本 -->
        <text class="cart-title-text">购物车</text>
      </view>
      
      <!-- 商品内容区域 -->
      <uni-swipe-action>
        <block v-for="(goods,i) in cart" :key="i">
           <uni-swipe-action-item :right-options="options" @click="swipeActionClickHandler(goods)">
              <my-goods :goods="goods" :showRadio="true" :showNumberBox="true" @radioChange="radioChange" @goodsCountHandler="goodsCountHandler"></my-goods>
           </uni-swipe-action-item>
        </block>
      </uni-swipe-action>
      
      <!-- 结算区域 -->
      <my-settle></my-settle>
    </view>
    
    <!-- 购物车空空如也 -->
    <view class="empty-cart" v-else>
      <image src="../../static/cart_empty@2x.png" class="empty-img"></image>
      <text clas="tip-text">空空如也~</text>
    </view>
  </view>
  
</template>

<script>
  import badgeMix from '@/mixins/tabbar-badge.js'
  import { mapState ,mapMutations,mapGetters} from 'vuex'
  export default {
    mixins:[badgeMix],
    data() {
      return {
        options:[{
          text:'删除',
          style:{
            backgroundColor:'#c00000'
          }
        }]
      };
    },
    computed:{
      ...mapState('m_cart',['cart']),
      ...mapGetters('m_cart',['total'])
    },
    methods:{
      ...mapMutations('m_cart',['updateGoodsState','updateGoodsCount','removeGoodsById']),
      radioChange(e){
        this.updateGoodsState(e)
      },
      goodsCountHandler(e){
        this.updateGoodsCount(e)
      },
      swipeActionClickHandler(e){
        this.removeGoodsById(e)
      }
    }
  }
</script>

<style lang="scss">
.cart-title {
  height: 40px;
  display: flex;
  align-items: center;
  font-size: 14px;
  padding-left: 5px;
  border-bottom: 1px solid #efefef;
  .cart-title-text {
    margin-left: 10px;
  }
}
.cart-container{
  padding-bottom: 50px;
}
.empty-cart {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 150px;

  .empty-img {
    width: 90px;
    height: 90px;
  }

  .tip-text {
    font-size: 12px;
    color: gray;
    margin-top: 15px;
  }
}
</style>
