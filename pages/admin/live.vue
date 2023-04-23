<template>
    <n-space class="min-h-[75vh]" v-if="active" align="center" justify="center">
        <n-button @click="open()" type="info">开启直播</n-button>
    </n-space>
    <n-card v-else :bordered="false">
        <n-form class="p-10 border " label-placement="left" ref="formRef">
            <n-form-item label="直播间信息">
            </n-form-item>
            <n-form-item label="推流地址">
                {{ form.value.publishUrl }}
            </n-form-item>
            <n-form-item label="封面">
                <uploader v-model="form.value.cover" style="height;: 500px" />
            </n-form-item>
            <n-form-item label="房间名">
                <n-input v-model:value="form.value.title" />
            </n-form-item>
            <n-form-item>
                <n-button type="info" @click="update()">保存</n-button>
            </n-form-item>
        </n-form>
    </n-card>
</template>

<script setup>
import { createDiscreteApi, NForm, NFormItem, NSpace, NButton, NInput, NCard } from 'naive-ui'

const formRef = ref(null)
const form = reactive({
    // cover: "https://sztxcl-scau-1306847942.cos.ap-guangzhou.myqcloud.com/01.jpg",
    // name: `${user.value.nickname?  user.value.nickname :  user.value.name}的直播间`,
    // publishUrl:  `rtmp://localhost/live/${user.name}`
    cover: "",
    name: ``,
    publishUrl: ``
})
const {
    data,
    error,
    refresh
} = await useGetLiveApi()

const active = ref(true)
if(data.value) {
    form.value = data
    active.value = false
}
const { message } = createDiscreteApi(["message"])


const open = async () => {
    const {
        data
    } = await useGetOrCreateLiveApi()
    if (data.value) {
        form.value = data
        active.value = false
        message.success("开启直播成功")
    } else {
        message.error("开启直播失败")
    }
}
const close = async () => {
    const {
        data
    } = await useCloseLiveApi()
    if (data.value) {
        active.value = true
        message.success("关闭直播成功")
    } else {
        message.error("关闭直播失败")
    }
}
const update = async () => {
    const {
        data
    } = await useUpdateLiveApi({
        title: form.value.title,
        cover: form.value.cover
    })

    if (data.value) {
        message.success("更新直播信息成功")
    } else {
        message.error("更新直播信息失败")
    }
}


</script>

<style lang="scss" scoped>

</style>