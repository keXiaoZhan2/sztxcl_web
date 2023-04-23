// 获取所有用户
export function useGetAllUsersApi(){
    return useHttpGet("getAllUsers","/admin/getUsers")
}

//创建或更新用户数据
export function useUpdateOrCreateApi(body) {
    return useHttpPost('updateOrCreate',"/admin/updateOrcreate",{
        body
    })
}

//删除用户
export function useDeleteUserApi(body) {
    return useHttpPost("deleteUser","/admin/deleteUser",{
        body
    })
}

//获取所有文章
export function useGetAllPostsApi() {
    return useHttpGet("getAllPosts","/admin/allPosts")
}

//删除文章
export function useAdminDeletePostApi(id) {
    return useHttpPost('deletePost',"admin/deletePost",{
        body:{
            id
        }
    })
}

//发布公告
export function useCreateAnnouncemnetApi(body) {
    return useHttpPost('publish','admin/createAnnouncement',{
        body
    })
}
//已发布公告
export function useGetPublishedApi() {
    return useHttpGet('publisedAnnouncement','admin/getAnnouncementP')
}

//草稿箱公告
export function useGetSavedApi() {
    return useHttpGet('saveddAnnouncement','admin/getAnnouncementS')
}

//删除公告
export function usedeleteAnnouncementApi(id) {
    return useHttpPost('deleteAnnouncement','admin/deleteAnnouncement',{
        body: {
            id
        }
    })
}

//更新公告
export function useupdateAnnouncementApi(body) {
    return useHttpPost('updateAnnouncement','admin/updateAnnouncement',{
        body
    })
}


//更改试卷发布状态
export function useChangePaperStatusApi(body) {
    return useHttpPost('changeStatus','admin/changePaperStatus',{
        body
    })
}

//删除试卷
export function usedeletePaperApi(id) {
    return useHttpPost('deletePaper','admin/deletePaper',{
        body: {
            id
        }
    })
}

//创建试卷
export function useCreatePaperApi(body) {
    return useHttpPost('createPaper','admin/createPaper',{
        body: {
            paper: body.testInfo,
            questions: body.dynamicInputValue
        }
    })
}

//获取要修改的试卷
export function useGetPaperApi(id) {
    return useHttpGet('getPaper','admin/getPaper?id=' + id)
}

//修改试卷
export function useUpdatePaperApi(body,id) {
    return useHttpPost('updatePaper','admin/updatePaper',{
        body: {
            paper: body.testInfo,
            questions: body.dynamicInputValue,
            id: id
        }
    })
}

//获取试卷答题情况数据
export function useCensorPaperApi(id) {
    return useHttpPost('censorPaper','admin/censorData',{
        body: {
            id:id
        }
    })
}

