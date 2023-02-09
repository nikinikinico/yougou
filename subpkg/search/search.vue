<template>
  <view>
    <!-- 搜索框 -->
    <view class="search-box">
      <uni-search-bar @input="input" cancelButton="none" :radius="100"></uni-search-bar>
    </view>
    <!-- 搜索历史 -->
    <view class="search-history" v-if="tag===0">
       <view class="history-title">
         <text>搜索历史</text>
          <uni-icons type="trash" size="17"@click="cleanHistory" ></uni-icons>
       </view>
       <view class="history-list">
         <uni-tag  :text="item" v-for="(item, i) in histories" :key="i" @click="gotoGoodsItem(item)"></uni-tag>
       </view>
     </view>
     
    <!-- 搜索列表 -->
    <view class="search-list" v-if="" v-else-if="searchResults.length!==0">
      <view class="search-item" v-for="(item,index) in searchResults" :key="index" @click="gotoGoods(item)">
        <view class="goods-name">
          {{item.goods_name}}
        </view>
        <uni-icons type="arrowright" size="16"></uni-icons>
      </view>
    </view>
    
  </view>
</template>

<script>
  export default {
    data() {
      return {
        timer : null,//防抖处理
        kw : '', //关键字
        searchResults:[],//关联结果
        historyList:[] ,//搜索历史
        tag:0
      };
    },
    onLoad(){
     this.historyList = JSON.parse(uni.getStorageSync('kw')||'[]') 
    },
    methods:{
      input(e){
       this.tag=1
       clearTimeout(this.timer)
       this.timer = setTimeout(()=>{
          this.kw = e
          this.getSearchList()
          this.saveHistory()
        },500)
      },
      async  getSearchList(){
      if(this.kw ===''){
        this.searchResults = []
        this.tag=0
        return}
      const {data:res} = await uni.$http.get('/api/public/v1/goods/qsearch',{query:this.kw})
      if(res.meta.status!== 200) return uni.$showMsg()
      this.searchResults = res.message
      },
      gotoGoods(item){
        uni.navigateTo({
          url: '/subpkg/goods_detail/goods_detail?goods_id=' + item.goods_id
        })
      },
      // 处理搜索历史，使用set对象
      saveHistory(){
        const set = new Set(this.historyList)
        if(this.kw.length===0)
        return
        set.delete(this.kw)
        set.add(this.kw)
        this.historyList = Array.from(set)
        uni.setStorageSync('kw',JSON.stringify(this.historyList))
      },
      cleanHistory(){
        this.historyList = []
        uni.setStorageSync('kw','[]')
        console.log('1')
      },
      gotoGoodsItem(kw){
         uni.navigateTo({
           url: '/subpkg/goods_list/goods_list?query=' + kw
         })
      }
    },
    computed:{
      histories(){
        return [...this.historyList].reverse()
      }
    }
  }
</script>

<style lang="scss">
.search-box{
  position: sticky;
  top:0;
  z-index:999
}
.search-list{
  padding:0 5px;
  .search-item{
    font-size:12px;
    padding:13px 0;
    border-bottom: 1px solid #efefef;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .goods-name{
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-right: 3px;
    }
  }
}
.search-history{
  padding: 0 5px;
  .history-title{
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    font-size: 13px;
    border-bottom: 1px solid  #efefef;
  }
  .history-list{
    display: flex;
    flex-wrap: wrap;
    .uni-tag{
      margin-top:5px;
      margin-right: 5px;
    }
  }
}
</style>
