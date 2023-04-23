export function useIndexDataApi(){
    return useHttpGet("IndexData","/index",{
        lazy:true
    })
}

//请求团购数据
export function useGroupDataApi(query){
    let q = useQueryToString(query)
    return useHttpGet("groupData",`/group/list${q}`)
}