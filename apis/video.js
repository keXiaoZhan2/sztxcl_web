export function useCreateVideoApi(body) {
    return useHttpPost("createVideo","/video/create",{
        body
    })
}

export function useDeleteVideoApi(body) {
    return useHttpPost("deleteVideo","/video/delete",{
        body
    })
}

export function getAllVideos() {
    return useHttpGet('getVideos',"/video/get")
}

export function useUpdateVideoInfoApi(body) {
    return useHttpPost('updateVideo',"/video/update",{
        body
    })
}
//更新观看次数
export function useUpdateWatchCount(id) {
    return useHttpPost('updateWatchCount',"/video/watchCount",{
        body: {
            id
        }
    })
}

//获取单条视频
export function useGetVideoByIdApi(id) {
    return useHttpPost('getOneVideo',"/video/getOneVideo",{
        body: {
            id
        }
    })
}

