<template>
    <n-upload
        accept=".ppt,.pptx,.pdf,.doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        :action="action_file" :headers="headers" v-model:file-list="fileList" :default-file-list="fileList" name="file"
        :on-error="handleError" :on-finish="handleSuccess" :on-download="handleDownload" :on-remove="handleRemove" :multiple="true"
        :show-download-button="true" list-type="image" :file-list-style="{backgroundColor: 'white'}" :disabled="user.id == 1 ? false : true" >
        <n-button-group>
            <n-button>文件列表</n-button>
            <n-upload-trigger abstract>
                <n-button >
                    上传
                </n-button>
            </n-upload-trigger>
        </n-button-group>
        <!-- <n-card style="margin-top: 12px; width: 1000px" title="文件列表">
            <n-upload-file-list  />
        </n-card> -->
    </n-upload>
</template>

<script setup>
import {
    NButton,
    NUpload,
    NUploadTrigger,
    NButtonGroup,
    createDiscreteApi,
} from "naive-ui"
//获取当前登陆用户信息，只有管理员可以上传和删除文件
let user =  useUser()

const fileList = ref([])
const {
    action_file,
    headers
} = useUploadConfig()


const { data } = await getAllFiles()
fileList.value = data.value
//创建
async function createFile(file) {
    await useCreateFileApi({ file })
}
//删除
async function deleteFile(file) {
    await useDeleteFileApi({ file })
}
// 上传成功
const handleSuccess = (...e) => {
    const { message } = createDiscreteApi(["message"])
    message.success("上传成功")
    const { file, event } = e[0]
    const response = JSON.parse(event.target.response)
    file.url = response.data.url
    createFile(file)
    return file
}

const handleDownload = (e) => {
    const { message } = createDiscreteApi(["message"])
    message.info("下载成功")
}

// 上传失败
const handleError = (e) => {
    const { message } = createDiscreteApi(["message"])
    message.error("上传失败")
}

//移除文件
const handleRemove = (...e) => {
    const { file } = e[0]
    deleteFile(file)
}
definePageMeta({
    middleware:["auth"]
})
</script>
