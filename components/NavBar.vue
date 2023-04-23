<template>
    <div class="navbar">
        <div class="container flex items-center h-[60px]">
            <n-button text class="!text-xl !font-bold">数字图像处理</n-button>
            <ui-menu>
                <ui-menu-item v-for="(item, index) in menus" :key="index" @click="handleOpen(item.path)"
                    :active="isMenuItemActive(item)">
                    {{ item.name }}
                </ui-menu-item>
            </ui-menu>

            <!-- <n-button circle class="ml-auto mr-3" @click="openSearch">
                <template #icon>
                    <n-icon>
                        <Search />
                    </n-icon>
                </template>
            </n-button> -->
            <nuxt-link to="/login" v-if="!user" class="ml-auto mr-10">
                <n-button secondary strong>登录</n-button>
            </nuxt-link>
            <n-dropdown v-else :options="userOptions" @select="handleSelect" >
                <n-avatar round size="small" class="ml-auto mr-10"
                    :src="user.avatar || 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg'" />
            </n-dropdown>
        </div>
    </div>
    <div class="w-[100%] h-[80px]"></div>
    <SearchBar ref="SearchBarRef" />
</template>
<script setup>
import {
    NButton,
    NIcon,
    NDropdown,
    NAvatar,
    createDiscreteApi
} from "naive-ui"
import {
    Search
} from "@vicons/ionicons5"
//使用用户的全局共享状态
const user = useUser()
//route.path拿到的是当前页面的route
const route = useRoute()
//在pages中构造指定结构就可以形成动态路由
const menus = [{
    name: "首页",
    path: "/"
}, {
    name: "考试",
    path: "/paper/1",
    match: [{
        name: "paper-page"
    }]
}, {
    name: "作业",
    path: "/homework/1",
    match: [{
        name: "homework-page"
    }]
},  {
    name: "直播",
    path: "/live/index",
    match: [{
        name: "live-page",
    }]
},  {
    name: "社区",
    path: "/bbs/1/1",
    match: [{
        name: "bbs-bbs_id-page"
    }]
}, {
    name: "课件",
    path: "/courseware/index",
    match: [{
        name: "courseware-page"
    }]
},{
    name: "课程",
    path: "/course/1",
    match: [{
        name: "course-page"
    }]
}]
function handleOpen(path) {
    navigateTo(path)
}
// 匹配路由，相同的导航栏item就改编为激活状态
const isMenuItemActive = (item) => {
    //先对比route.name字段
    if (item.match) {
        let i = item.match.findIndex(o => {
            let res = true
            //再比对route.params，这里是为了处理route.name相同的情况下区别不同页面
            if (o.params && typeof o.params === "object") {
                res = (Object.keys(o.params).findIndex(k => route.params[k] == o.params[k])) != -1
            }
            return o.name == route.name && res
        })
        return i != -1
    }
    //没有就对比route.path字段
    return route.path == item.path
}
const userOptions = user.value?.id == 1 ? [{
    label: "用户中心",
    key: "center",
},{
    label: "后台管理",
    key: "admin",
}, {
    label: "退出",
    key: "logout",
}] : [{
    label: "用户中心",
    key: "center",
},{
    label: "退出",
    key: "logout",
}]

const SearchBarRef = ref(null)
const openSearch = () => SearchBarRef.value.open();
const handleSelect = (k) => {
    switch (k) {
        case "logout":
            const { dialog } = createDiscreteApi(["dialog"])
            dialog.warning({
                content: "是否要退出登录？",
                positiveText: "退出",
                negativeText: "取消",
                onPositiveClick: async () => {
                    await useLogout()
                },
            });
            break;
        case "center":
            navigateTo({
                path: "/user/edit"
            })
            break;
        case "admin": 
            navigateTo({
                path: "/admin/student"
            })
            break;
    }
}
</script>
<style>
.navbar {
    z-index: 1000;
    @apply bg-white fixed top-0 left-0 right-0 shadow-sm;
}
</style>