import {
    createDiscreteApi
} from "naive-ui"
// 组合式api，在composables文件下被使用时会自动引入
export const fetchConfig = {
    baseURL: process.env.NODE_ENV === 'production' ? "http://121.37.201.127:3000/api/pc" : "http://localhost:3000/api/pc",
    headers: {
        appid: "bd9d01ecc75dbbaaefce"
    },
}
//请求拦截器
function useGetFetchOptions(options = {}) {
    options.baseURL = options.baseURL ?? fetchConfig.baseURL
    options.headers = options.headers ?? {
        appid: fetchConfig.headers.appid
    }
    options.initialCache = options.initialCache ?? false
    options.lazy = options.lazy ?? false

    // 用户登录，默认传token
    const token = useCookie("token")
    //如果cookie内有token，从cookie拿token
    if(token.value){
        options.headers.token = token.value
        options.headers.Authorization = 'Bearer ' + token.value
    }

    return options
}
//请求
export async function useHttp(key, url, options = {}) {
    options = useGetFetchOptions(options)
    options.key = key
    //如果option内有$字段，使用$fetch, 不使用useFetch
    if(options.$){
        const data = ref(null)
        const error = ref(null)
        return await $fetch(url,options).then(res=>{
            data.value = res.data
            return {
                data,
                error
            }
        }).catch(err=>{
            const msg = err?.data?.data
            if(process.client){
                const { message } = createDiscreteApi(["message"])
                message.error(msg || '服务端错误')
            }
            error.value = msg
            return {
                data,
                error
            }
        })
    }
    let res = await useFetch(url, {
        ...options,
        // 相当于响应拦截器
        transform: (res) => {
            return res.data
        },
    })
    
    // 客户端错误处理
    if (process.client && res.error.value) {
        const msg = res.error.value?.data?.data
        if (!options.lazy) {
            const { message } = createDiscreteApi(["message"])
            message.error(msg || '服务端错误')
        }
    }

    return res
}

// GET请求
export function useHttpGet(key, url, options = {}) {
    options.method = "GET"
    return useHttp(key, url, options)
}

// POST请求
export function useHttpPost(key, url, options = {}) {
    options.method = "POST"
    return useHttp(key, url, options)
}