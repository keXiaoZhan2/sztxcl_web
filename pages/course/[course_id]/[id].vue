<template>
    <div class="mb-5">
        <div class="max-h-[80vh] min-h-[80vh]" id="dplayer"></div>
    </div>
</template>

<script setup>
const route = useRoute()
let video_id = route.params.id
console.log(route.params.id)
let dp = ref(null)
// 初始化head
function useInitHead() {
    useHead({
        link: [{
            rel: "stylesheet",
            href: "/dplayer/DPlayer.min.css"
        }],
        script: [{
            src: "/flv/flv.min.js",
        }, {
            src: "/dplayer/DPlayer.min.js",
        }]
    })
}
useInitHead()
onMounted(async () => {
    //获取视频资源
    console.log(video_id)
    const {
        data,
        error,
        refresh
    } = await useGetVideoByIdApi(video_id)
    console.log(data)
    if (data.value) {
        dp.value = await new DPlayer({
            container: document.getElementById('dplayer'),
            video: {
                url: data.value.url,
            },
            autoplay: true,
        })
    }
})
definePageMeta({
    middleware: ["auth"]
})
</script>

<style>

</style>