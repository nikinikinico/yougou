<template>
  <view>
    <my-search @click="getSearch"></my-search>
    <view class="scroll-view-container">
      <scroll-view class="left-scroll-view" scroll-y="true" :style="{height:wh+'px'}">
        <block v-for="(item,index) in cateList" :key="index">
          <view :class="['left-scroll-item',index === active?'active':'']" @click="activeChange(index)">{{item.cat_name}}</view>
        </block>
      </scroll-view>
      <scroll-view class="right-scroll-view" scroll-y="true" :style="{height:wh+'px'}" :scroll-top="scrollTop">
        <view class="cate-lv2" v-for="(item2,index2) in cateLevel2" :key="index2">
          <!-- 二级分类的标题 -->
          <view class="cate-lv2-title">/ {{item2.cat_name}} /</view>
          <!-- 二级分类下的三级分类 -->
          <view class="cate-lv3-list">
            <view class="cata-lv3-item" v-for="(item3,index3) in item2.children" :key="index3" @click="gotoGoodList(item3)">
              <image :src="item3.cat_icon" ></image>
              <text>{{item3.cat_name}}</text>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        // 设备的高度
        wh:0,
        cateList:[],
        active:0,
        cateLevel2:[], //二级分类
        scrollTop:0
      };
    },
    onLoad() {
    const sysInfo =  uni.getSystemInfoSync()
    this.wh = sysInfo.windowHeight-50
    // 获取分类列表数据
    this.getCateList()
    },
    methods:{
      async getCateList(){
        const {data:res} = await uni.$http.get('/api/public/v1/categories')
        if(res.meta.status!==200) return uni.$showMsg()
        this.cateList = res.message
        this.cateLevel2 = res.message[0].children
      },
      activeChange(index){
        this.active = index
        this.cateLevel2 = this.cateList[index].children
        this.scrollTop = this.scrollTop === 0? 1:0
      },
      gotoGoodList(item){
        uni.navigateTo({
          url:'/subpkg/goods_list/goods_list?cid='+item.cat_id
        })
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
.scroll-view-container{
  display: flex;
  background-color: #fff;
  padding-bottom: 10px;
  .left-scroll-view{
    width: 120px;
    .left-scroll-item{
      line-height: 60px;
      background-color: #f7f7f7;
      text-align: center;
      font-size: 12px;
      
      // 激活的样式
      &.active{
        background-color: #ffffff;
        position: relative;
        // 激活项的左边红色竖条
        &::before{
          content: '';
          display: block;
          width: 3px;
          height: 30px;
          background-color: #c00000;
          position: absolute;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
        }
      }
    }
  }
}
  
.cate-lv2-title{
   font-size: 12px;
    font-weight: bold;
    text-align: center;
    padding: 15px 0;
}
.cate-lv3-list{
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 5px;
  .cata-lv3-item{
    width:33.33%;
    display: flex;
    flex-direction: column;
    align-items: center;
    image{
      width: 60px;
            height: 60px;
    }
     text {
          font-size: 12px;
        }
  }

}
</style>
