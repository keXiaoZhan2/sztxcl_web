// 这里配置了页面加载过程中生成加载条，利用了页面生命周期钩子https://nuxt.com/docs/guide/going-further/hooks#usage-with-plugins
// createDiscreteApi可以以api方式创建组件 https://www.naiveui.com/zh-CN/os-theme/components/discrete   https://www.naiveui.com/zh-CN/os-theme/components/loading-bar
import {
    createDiscreteApi
} from "naive-ui"
export default defineNuxtPlugin((nuxtApp)=>{
    const bar = ref(null)
    nuxtApp.hook("app:mounted",(e)=>{
        if(!bar.value){
            //加载loadingbar组件
            const { loadingBar } = createDiscreteApi(["loadingBar"])
            bar.value = loadingBar
        }
        // console.log("app:mounted");
    })
    nuxtApp.hook("page:start",(e)=>{
        bar.value?.start()
        // console.log("page:start");
    })
    nuxtApp.hook("page:finish",(e)=>{
        setTimeout(() => {
            bar.value?.finish()
        }, 150);
        // console.log("page:finish");
    })
    nuxtApp.hook("app:error",(e)=>{
        // console.log("app:error");
        //加载条是基于客户端的，服务端没有windows对象，为了防止报错，判断当前环境是客户端还是服务端
        if(process.client){  //process.server 处于服务端
            setTimeout(() => {
                bar.value?.finish()
            }, 150);
        }
    })
})