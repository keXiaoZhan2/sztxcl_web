// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    app:{
        head:{
            titleTemplate:"%s - 固定标题",
            title:"数字图像处理",
            charset: "utf-8",
            htmlAttrs:{
                lang:"zh-cn"
            },
            meta:[
                { name:"description",content:"数字图像处理描述" },
                { name:"keywords",content:"数字图像处理关键词" },
            ],
            script:[
                // { src:"http://xxx.js" }
            ],
            link:[
                // { rel:"stylesheet",href:"http://xxx.css" }
            ]
        }
    },
    css: [ //引入全局css
        "@/assets/main.css"
    ],
    modules: [
        'nuxt-windicss',
    ],
    build: {
        transpile:
            process.env.NODE_ENV === 'production'
                ? [
                    'naive-ui',
                    'vueuc',
                    '@css-render/vue3-ssr',
                    '@juggle/resize-observer'
                ]
                : ['@juggle/resize-observer']
    },
    vite: {
        optimizeDeps: {
            include:
                process.env.NODE_ENV === 'development'
                    ? ['naive-ui', 'vueuc', 'date-fns-tz/esm/formatInTimeZone']
                    : []
        }
    },
    imports: {
        dirs:["apis"]
    },
    nitro: {
        //缩小捆绑包
        minify: true,
        //关闭源映射生成
        sourceMap: false
    }
})
