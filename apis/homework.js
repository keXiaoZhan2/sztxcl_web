//发布作业
export function useCreateHomeworkApi(body) {
    return useHttpPost('publishHomework','homework/createHomework',{
        body
    })
}
//已发布作业
export function useGetPublishedHomeworkApi() {
    return useHttpGet('publisedHomework','homework/getHomeworkP')
}

//草稿箱作业
export function useGetSavedHomeworkApi() {
    return useHttpGet('saveddHomework','homework/getHomeworkS')
}

//删除作业
export function usedeleteHomeworkApi(id) {
    return useHttpPost('deleteHomework','homework/deleteHomework',{
        body: {
            id
        }
    })
}

//更新作业
export function useupdateHomeworkApi(body) {
    return useHttpPost('updateHomework','homework/updateHomework',{
        body
    })
}

//提交作业文件地址更新
export function updateSubmitInfo(body){
    return useHttpPost('updateInfo',"homework/updateSubmitInfo",{
        body
    })
}

//或当某id对应作业，用户的最新提交记录
export function getUserSubmitInfo(id) {
    return useHttpPost('getInfo',"homework/getSubmitInfo",{
        body: {
            id
        }
    })
}

//获取某id作业所用提交记录
export function getAllSubmitById(id) {
    return useHttpPost('getAllSubmit',"homework/getAllSubmitById",{
        body: {
            id
        }
    })
}