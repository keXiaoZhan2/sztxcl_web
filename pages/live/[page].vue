<template>
    <ClientOnly>
        <n-grid :x-gap="26">
            <n-grid-item :span="17">
                <div class="container bg-white rounded  !min-h-[10vh] flex items-center">
                    <n-avatar :size="48" :src="info.cover" />
                    <div class="ml-6">
                        <div style="font-size: 18px;">{{ info.title }}</div>
                        <p style="color: #938e9e">{{ info.title }}</p>
                    </div>
                </div>
                <div class="max-h-[60vh]" id="dplayer"></div>
                <!-- <div v-else class="min-h-[60vh] flex justify-center items-center bg-dark-500 text-yellow-50">老师还没开启直播哦！
                </div> -->
            </n-grid-item>
            <n-grid-item :span="7">
                <div class="border rounded mb-10 !min-h-[70vh] rounded-3xl">
                    <div class="container p-1 bg-gray-200">
                        弹幕列表
                    </div>
                    <div>
                        <div id="danRef" class="container max-h-[45vh] min-h-[45vh] overflow-auto">
                            <p v-for="(msg, index) in message" :key="index">
                                <span style="color: #FF5D23"> {{ user.nickname ? user.nickname : user.name }}</span>
                                {{ msg.msg }}
                            </p>
                        </div>
                        <div class="container p-3 relative h-33">
                            <n-input :disabled="!flag" placeholder="发送弹幕" type="textarea" maxlength="30" show-count
                                v-model:value="textarea" @keyup.enter.native="sendDanMu"></n-input>
                            <n-button :disabled="!flag" class="mt-2 absolute right-4 bottom-0" @click="sendDanMu"
                                type="info">发送</n-button>
                        </div>
                    </div>
                </div>
            </n-grid-item>
        </n-grid>
    </ClientOnly>
</template>

<script setup>
import { NGrid, NGridItem, NAvatar, NInput, NButton } from 'naive-ui'
let dp = ref(null)
const flag = ref(true)
let textarea = ref('')
let ws = reactive({})
const message = reactive([])
const user = useUser()
const info = ref({
    cover: '',
    title: ''
})
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
const initWebSocket = async (wsUrl) => {
    ws = await new WebSocket(wsUrl)
    ws.onmessage = msg => {
        let result = JSON.parse(msg.data)
        message.push(result)
        const danmaku = {
            text: result.msg,
            color: '#fff',
            type: 'right',
        };
        dp.value.danmaku.draw(danmaku);
    }
}
let init = () => {
    // let wsUrl = 'ws://localhost:9100?room=' + this.live.user._id
    let wsUrl = process.env.NODE_ENV === 'production' ? 'ws://121.37.201.127:9100?room=' + 1 : 'ws://localhost:9100?room=' + 1
    initWebSocket(wsUrl)
    useInitHead()
}
init()

const {
    data,
    error,
    refresh
} = await useGetLiveApi()
if (data.value) {
    info.value = data.value
}
const sendDanMu = () => {
    if (textarea.value.trim()) {
        ws.send(JSON.stringify({ id: user.id, nickname: user.nickname, msg: textarea.value }))
    } else {
        console.log('请输入弹幕')
    }
    textarea.value = ''
}

onMounted(async () => {
    const {
        data,
        error,
        refresh
    } = await useGetLiveApi()
    if (!data.value) {
        flag.value = false
    }
    //如果开启直播了
    if (data.value) {
        dp.value = await new DPlayer({
            container: document.getElementById('dplayer'),
            video: {
                url: process.env.NODE_ENV === 'production' ? 'http://121.37.201.127:9000/live/admin.flv' : 'http://localhost:9000/live/admin.flv',
                type: 'flv'
            },
            live: true,
            autoplay: true,
            danmaku: true,
            apiBackend: {
                read: function (options) {
                    console.log('Pretend to connect WebSocket', dp);
                    options.success([]);
                },
                send: function (options) {
                    console.log('Pretend to send danmaku via WebSocket', options.data);
                    options.success();
                },
            }
        })
    }

})
definePageMeta({
    middleware: ["auth"]
})
</script>

<style>

</style>