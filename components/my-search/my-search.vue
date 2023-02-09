<template>
    <view class="my-search-container" :style="{'background-color':bgc}" >
      <view class="my-search-box" :style="{'border-radius':radius+'px'}" @click="searchBoxHandler">
        <uni-icons type="search" size="17"></uni-icons>
        <text class="placeholder">搜索</text>
      </view>
    </view>
</template>

<script>
  export default {
    name:"my-search",
    props:{
      bgc:{
        type:String,
        default:'#C00000'
      },
      radius:{
        type:Number,
        default:18
      }
    },
    data() {
      return {
        
      };
    },
    methods:{
      searchBoxHandler(){
        this.$emit('click')
      }
    }
  }
</script>

<style lang="scss">
.my-search-container{
  height:50px;
  padding:0 10px;
  display: flex;
  align-items: center;
  position: sticky;
  top:0;
  z-index:999;
  .my-search-box{
    height:36px;
    width:100%;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    
    .placeholder{
      color:black;
      margin-left:5px;
      font-size:15px
    }
  }
}
</style>