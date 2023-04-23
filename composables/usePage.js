// 分页混合式api
export async function usePage(initListApiCallback){
    const route = useRoute()
    //页码
    const page = ref(parseInt(route.params.page))
    //每页条数
    const limit = ref(5)
    const {
        data,
        pending,
        error,
        refresh
    } = await initListApiCallback({
        page:page.value,
        limit:limit.value
    })
    //分页数
    const rows = computed(()=>data.value?.rows ?? [])
    //总条数
    const total = computed(()=>data.value?.count ?? 0)

    const handlePageChange = (p)=>{
        navigateTo({
            params:{
                ...route.params,
                page:p
            },
            query:{
                ...route.query
            }
        })
    }

    return {
        page,
        limit,
        data,
        pending,
        error,
        refresh,
        rows,
        total,
        handlePageChange
    }
}