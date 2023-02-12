export default {
  // 为当前模块开启命名空间
  namespaced: true,
  // 模块的state数据
  state(){
    return{
      // 购物车具体数据
        cart:JSON.parse(uni.getStorageSync('cart')||'[]')
    }
  },
  
  mutations:{
    addToCart(state,goods){
      const findResult = state.cart.find((item)=>item.goods_id === goods.goods_id)
      if(!findResult){
        state.cart.push(goods)
      }else{
        findResult.goods_count++
      }
      this.commit('m_cart/saveToStorage')
    },
    saveToStorage(state){
      uni.setStorageSync('cart',JSON.stringify(state.cart))
    },
    updateGoodsState(state,goods){
      const findResult = state.cart.find(item=>item.goods_id===goods.goods_id)
      if(findResult){
        findResult.goods_state = goods.goods_state
      }
      this.commit('m_cart/saveToStorage')
    },
    updateGoodsCount(state,goods){
      const findResult = state.cart.find(item=>item.goods_id===goods.goods_id)
      if(findResult){
        findResult.goods_count = goods.value
      }
      this.commit('m_cart/saveToStorage')
    },
    removeGoodsById(state,goods){
      state.cart = state.cart.filter(item=>item.goods_id!==goods.goods_id)
      this.commit('m_cart/saveToStorage')
    },
    // 商品全选/反选
    updateGoodsAllState(state,newState){
      state.cart.forEach(item=>item.goods_state=newState) //forEach会改变自身数组
      this.commit('m_cart/saveToStorage')
    }
  },
  
  getters:{
    // 获取购物车总数
    total(state){
    return  state.cart.reduce((total,item)=>total+=item.goods_count,0)
    },
    // 返回选中商品的数量
    getGoodsSeletedAmount(state){
      return state.cart.filter(item=>item.goods_state).reduce((total,item)=>total+=item.goods_count,0)
    },
    // 获取选取商品的总价
    getGoodsSeletedPrice(state){
      return state.cart.filter(item=>item.goods_state).reduce((total,item)=>total+=item.goods_count*item.goods_price,0).toFixed(2)
    }
  }
  
}