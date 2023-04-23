export default defineNuxtPlugin((nuxtApp)=>{
    //通用的网页打开方法
    nuxtApp.provide("commonOpen",(item)=>{
        // 接口规范里如果type是带webview的，需要打开第三方网站
        if(item.type == "webview"){
            window.open(item.url)
        } else if(item.type == "course"){
            navigateTo(`/detail/course/${item.course_id}`)
        }
    })
})

