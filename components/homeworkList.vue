<template>
    <section class="bg-white shadow p-5 mb-5 rounded flex flex-col">
        <div class="p-2">
            <h4>{{ item.title }}</h4>
        </div>
        <div class="p-2">
            <h3>{{ item.text }}</h3>
        </div>
        <div class="min-w-100 flex">
            <n-upload  accept=".rar" :action="action" :headers="headers" v-model:file-list="fileList" :default-file-list="fileList" name="file"
                :on-error="handleError" :on-finish="handleSuccess" :show-download-button="true" :file-list-style="{backgroundColor: 'white'}">
                <n-upload-trigger abstract>
                    <n-button :type="item.is_submit ? 'error' : 'primary'" >{{
                        item.is_submit ? '重新提交' : '提交作业'
                    }}</n-button>
                </n-upload-trigger>
            </n-upload>
        </div>
    </section>
</template>

<script setup>
import { NButton, createDiscreteApi, NUpload, NUploadTrigger } from "naive-ui";
const {
    action,
    headers
} = useUploadConfig()
const props = defineProps({
    item: Object
})
const fileList = ref([])

const updateInfo = async (body) => {
    await updateSubmitInfo(body)
}
// 上传成功
const handleSuccess = (...e) => {
    const { file, event } = e[0]
    const response = JSON.parse(event.target.response)
    file.url = response.data.url
    //更新url
    updateInfo({
        id:props.item.id,
        url: file.url,
        name: file.name
    })
    return file
}

// 上传失败
const handleError = (e) => {
    const { message } = createDiscreteApi(["message"])
    message.error("上传失败")
}

</script>

