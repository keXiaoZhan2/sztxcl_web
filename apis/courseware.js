export function useCreateFileApi(body) {
    return useHttpPost("createFile","/courseware/create",{
        body
    })
}

export function useDeleteFileApi(body) {
    return useHttpPost("deleteFile","/courseware/delete",{
        body
    })
}

export function getAllFiles() {
    return useHttpGet('getFile',"/courseware/get")
}