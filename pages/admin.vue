<template>
    <n-message-provider>
        <n-notification-provider placement="top-left">
            <n-dialog-provider>
                <n-grid :x-gap="20">
                    <n-grid-item :span="5">
                        <ul class="center-menu">
                            <li :class="{
                                'active': (item.name == activeName)
                            }" v-for="(item, index) in menus" :key="index" @click="navigate(item)">
                                {{ item.title }}
                            </li>
                        </ul>
                    </n-grid-item>
                    <n-grid-item :span="19">
                        <div class="bg-white rounded mb-10 !min-h-[75vh]">
                            <NuxtPage :page-key="pageKey" />
                        </div>
                    </n-grid-item>
                </n-grid>
            </n-dialog-provider>
        </n-notification-provider>
    </n-message-provider>
</template>
<script setup>
import {
    NGrid,
    NGridItem,
    NDialogProvider,
    NNotificationProvider,
    NMessageProvider
} from "naive-ui"

const route = useRoute()
const pageKey = computed(() => route.fullPath)
const activeName = computed(() => route.name)

const menus = [{
    title: "学生管理",
    name: "admin-student"
}, {
    title: "考试管理",
    name: "admin-test"
}, {
    title: "社区管理",
    name: "admin-community"
}, {
    title: "发布公告",
    name: "admin-public"
},{
    title: "开启直播",
    name: "admin-live"
},{
    title: "视频管理",
    name: "admin-video"
},{
    title: "作业管理",
    name: "admin-homework"
}]


const navigate = (item) => {
    navigateTo({
        name: item.name,

    })
}

definePageMeta({
    middleware: ["admin"]
})

</script>
<style>
.center-menu {
    @apply list-none bg-white rounded;
}

.center-menu li {
    @apply px-5 py-3 text-sm cursor-pointer hover: (bg-blue-50);
}

.center-menu .active {
    @apply font-bold text-blue-500 bg-gray-200;
}
</style>