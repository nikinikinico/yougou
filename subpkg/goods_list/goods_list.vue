<template>
  <view class="goods-list">
    <block v-for="(goods,i) in goodsList" :key = "i">
      <my-goods :goods = "goods"></my-goods>
    </block>
  </view>
</template>

<script>
  export default {
    data() {
      return {
        queryObj:{
          // 关键字
          query:'',
          // 分类id：
          cid:'',
          // 页码值：
          pagenum: 1,
          // 每页显示多少条
          pagesize: 10
          },
          // 总条数
          total: 0,
          // 商品列表
          goodsList:[],
          // 节流阀：
          isLoading: false
      };
    },
    onLoad(options){
      this.queryObj.query = options.query||''
      this.queryObj.cid = options.cid || ''
      this.getGoodsList()
    },
    methods:{
    async  getGoodsList(cb){
        this.isLoading = true
        const {data : res} = await uni.$http.get('/api/public/v1/goods/search',this.queryObj)
        if(res.meta.status!==200) return uni.$showMsg()
        this.goodsList = [...this.goodsList,...res.message.goods]
        this.total = res.message.total
        this.isLoading = false
        cb&&cb()
      }
    },
    onReachBottom(){
      // 页码值自增
      if(this.isLoading) return 
      if(this.queryObj.pagenum*this.queryObj.pagesize>= this.total){
        return uni.$showMsg('数据加载完毕')
      } 
      this.queryObj.pagenum++
      this.getGoodsList()
    },
    onPullDownRefresh(){
      this.queryObj.pagenum = 1
      this.total = 0
      this.isLoading = false
      this.goodsList = []
      this.getGoodsList(()=>{uni.stopPullDownRefresh()})
    }
    
  }
</script>

<style lang="scss">

</style>
