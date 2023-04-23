<!--nuxt-link是nuxt提供的用来做页面跳转的，不用再配置路由了  -->
<template>
    <LoadingGroup :pending="pending" :error="error">
        <template v-for="(item, index) in data" :key="index">
            <!-- <Banner :data="item.data" v-if="item.type == 'swiper'" /> -->
            <Announcement v-if="item.type == 'swiper'"></Announcement>
            <!-- <ImageNav :data="item.data" v-else-if="item.type == 'icons'" /> -->
            <!-- <ImageAd :data="item.data" v-else-if="item.type == 'imageAd'" /> -->
            <ListCard :title="item.title" :data="item.data" v-else-if="item.type == 'list'" />
            <!-- <ListCard :title="item.title" :type="item.listType" :data="item.data"
                v-else-if="item.type == 'promotion'" /> -->
        </template>
    </LoadingGroup>
</template>
<script setup>
useHead({
    title: "首页"
})
// 初始化head
function useInitHead() {
    useHead({
        link: [{
            rel: "stylesheet",
            href: "/aplayer/APlayer.min.css"
        }],
        script: [{
            src: "/flv/flv.min.js",
        }, {
            src: "/dplayer/DPlayer.min.js",
        }]
    })
}
useInitHead()
const {
    pending,
    data,
    refresh,
    error
} = await useIndexDataApi()
// 服务端时直接报错
if (process.server && error.value) {
    throwError(error.value?.data?.data)
}
</script>
