//开启直播间
export function useGetOrCreateLiveApi() {
    return useHttpGet('getOrCreateLive','live/add')
}

//关闭直播间
export function useCloseLiveApi() {
    return useHttpGet('CloseLive','live/close')
}

//更新直播间信息
export function useUpdateLiveApi(body) {
    return useHttpPost('updateLive','live/update',{
        body
    })
}

//获取直播间
export function useGetLiveApi() {
    return useHttpGet('getLive','live/getLive')
}