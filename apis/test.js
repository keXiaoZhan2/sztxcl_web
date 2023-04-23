// 交卷
export function useSubmitTestApi(body){
    return useHttpPost("SubmitTest","/testpaper/save",{
        body
    })
}

// 开始考试
export function useReadTestpaperApi(id){
    return useHttpGet("ReadTestpaper","/testpaper/read?id="+id)
}

//所有已发布考试
export function useGetAllTest() {
    return useHttpGet('GetAllTest',"/testpaper/all")
}

//所有未发布考试
export function useGetAllNoTest() {
    return useHttpGet('GetAllNoTest',"/testpaper/allNo")
}

