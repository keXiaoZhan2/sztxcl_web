// 路由跳转中间件
export default defineNuxtRouteMiddleware((to,from)=>{
    // 通过to确定跳转页面带有的参数
    // navigateTo({
    //     name:"search-type-page",
    //     params:{
    //         type:"course",
    //         page:1
    //     },
    //     query:{
    //         keyword:keyword.value
    //     }
    // })
    const { type,page } = to.params
    const { keyword } = to.query

    if(!keyword){
        return abortNavigation("搜索关键词不能为空")
    }

    if(!(["course","column"].includes(type)) || isNaN(+page)){
        return abortNavigation("页面不存在")
    }

})