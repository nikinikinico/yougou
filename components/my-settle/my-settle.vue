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
    <view class="btn-settle">
      结算({{getGoodsSeletedAmount}})
    </view>
  </view>
</template>

<script>
import { mapGetters ,mapMutations} from 'vuex'
  export default {
    name:"my-settle",
    data() {
      return {
        
      };
    },
    computed:{
      ...mapGetters('m_cart',['getGoodsSeletedAmount','total','getGoodsSeletedPrice']),
      isFullCheck(){
        return this.getGoodsSeletedAmount === this.total
      }
    },
    methods:{
      selectAll(){
        console.log(!this.isFullCheck)
        this.updateGoodsAllState(!this.isFullCheck)
      },
      ...mapMutations('m_cart',['updateGoodsAllState'])
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