<template>
    <n-card>
        <n-tabs>
            <n-tab-pane name="已发布" tab="已发布">
                <n-space vertical :size="12">
                    <n-data-table :bordered="false" :columns="columns" :data="publish.value" :pagination="pagination" />
                </n-space>
            </n-tab-pane>
            <n-tab-pane name="未发布" tab="未发布">
                <n-space vertical :size="12">
                    <n-data-table :bordered="false" :columns="columns" :data="unpublish.value"
                        :pagination="pagination" />
                </n-space>
            </n-tab-pane>
            <n-tab-pane name="上传视频" tab="上传视频">
                <n-upload accept=".mp4" :action="action_file" :headers="headers" v-model:file-list="fileList"
                    :default-file-list="fileList" name="file" :on-error="handleError" :on-finish="handleSuccess"
                    :on-remove="handleRemove" :multiple="true" list-type="image"
                    :file-list-style="{ backgroundColor: 'white' }" :disabled="user.id == 1 ? false : true"
                    :show-retry-button="true">
                    <n-upload-trigger abstract>
                        <n-button>
                            上传
                        </n-button>
                    </n-upload-trigger>
                </n-upload>
            </n-tab-pane>
        </n-tabs>
        <n-modal v-model:show="showModal">
            <n-card style="width: 600px" title="模态框" :bordered="false" size="huge" role="dialog" aria-modal="true">
                <n-form :model="form" ref="formRef" :rules="rules" label-width="80" label-placement="left">
                    <n-form-item label="视频标题" path="name">
                        <n-input v-model:value="form.name" />
                    </n-form-item>
                    <n-form-item label="视频封面" path="cover">
                        <uploader v-model="form.cover" />
                    </n-form-item>
                    <n-form-item label="是否发布" path="publish">
                        <n-radio-group v-model:value="form.publish">
                            <n-space>
                                <n-radio v-for="song in options" :key="song.value" :value="song.value">
                                    {{ song.value }}
                                </n-radio>
                            </n-space>
                        </n-radio-group>
                    </n-form-item>
                    <div class="flex justify-end">
                        <n-button type="primary" @click="onSubmit" :loading="loading">提交修改</n-button>
                    </div>
                </n-form>
            </n-card>
        </n-modal>
    </n-card>
</template>

<script setup>
import {
    NButton,
    NUpload,
    NUploadTrigger,
    createDiscreteApi,
    useDialog,
    NTabs,
    NTabPane,
    NCard,
    NSpace,
    NDataTable,
    NImage,
    NModal,
    NForm,
    NFormItem,
    NRadioGroup,
    NRadio,
    NInput
} from "naive-ui"
const dialog = useDialog();
//获取所有视频
const {
    data: videos,
    error,
    refresh
} = await getAllVideos()
const publish = reactive([])
const unpublish = reactive([])
publish.value = videos.value.filter(item => {
    if (item.publish == 1) {
        item.publish == '发布'
        return item
    }
})
unpublish.value = videos.value.filter(item => {
    if (item.publish == 0) {
        item.publish == '不发布'
        return item
    }
})
watch(videos, async (newQuestion, oldQuestion) => {
    publish.value = videos.value.filter(item => {
        if (item.publish == 1) {
            item.publish == '发布'
            return item
        }
    })
    unpublish.value = videos.value.filter(item => {
        if (item.publish == 0) {
            item.publish == '不发布'
            return item
        }
    })
})
const formRef = ref(null)
// const form = reactive({
//     cover: "",
//     name: "",
//     publish: "发布"
// })
const form = ref({})
const loading = ref(false)
const rules = {
    cover: [{
        required: true,
        message: "封面不能为空"
    }],
    name: [{
        required: true,
        message: "标题不能为空"
    }]
}

const options = [{
    value: "发布",
}, {
    value: "不发布",
}]
const onSubmit = () => {
    formRef.value.validate(async (errors) => {
        if (errors) {
            return
        }
        loading.value = true
        const {
            data,
            error
        } = await useUpdateVideoInfoApi(form)
        refresh()
        loading.value = false

        if (error.value) {
            return
        }
        const { message } = createDiscreteApi(["message"])
        message.success("修改成功")
    })
}
//获取当前登陆用户信息，只有管理员可以上传和删除文件
let user = useUser()
const showModal = ref(false)
const fileList = ref([])
const {
    action_file,
    headers
} = useUploadConfig()
const updateVideoInfo = (row) => {
    form.value = row
    form.value.publish = form.value.publish == 1 ? '发布' : '不发布'
    showModal.value = true
}
const createColumns = ({
    changeStatus
}) => {
    return [
        {
            title: "视频标题",
            key: "name",
        },
        {
            title: "上传时间",
            key: "createdAt",
        },
        {
            title: "封面",
            key: "cover",
            render(row) {
                return h(
                    NImage,
                    {
                        src: row.cover,
                        width: "100"
                    }
                )
            }
        },
        {
            title: "修改信息",
            key: "update",
            width: '100',
            render(row) {
                return h(
                    NButton,
                    {
                        size: "small",
                        onClick: () => updateVideoInfo(row),
                        type: "success"
                    },
                    { default: () => "修改信息" }
                )
            }
        }
    ];
};

fileList.value = videos.value
//创建
async function createVideo(file) {
    await useCreateVideoApi({ file })
}
//删除
async function deleteVideo(file) {
    const { message } = createDiscreteApi(["message"])
    let res = false
    res = await new Promise((resolve, reject) => {
        dialog.warning({
            title: `删除视频`,
            content: `确定删除视频吗？`,
            positiveText: "确定",
            negativeText: "取消",
            maskClosable: false,
            onPositiveClick: async () => {
                let {
                    data,
                } = await useDeleteVideoApi({ file })
                if (data.value) {
                    flag = true
                    message.success("删除视频成功");
                    resolve(true)
                } else {
                    message.error("视频不存在")
                }
            },
            onNegativeClick: () => {
                message.info("取消操作");
            }
        });
    }).then((res) => {
        return res
    })
    return res
}
// 上传成功
const handleSuccess = (...e) => {
    const { message } = createDiscreteApi(["message"])
    message.success("上传成功")
    const { file, event } = e[0]
    const response = JSON.parse(event.target.response)
    file.url = response.data.url
    createVideo(file)
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
const handleRemove = async (...e) => {
    const { file } = e[0]
    let res = await deleteVideo(file)
    return res
}
const changeStatus = (rowData) => {
    const { message } = createDiscreteApi(["message"])
    dialog.warning({
        title: `取消发布`,
        content: `确定取消该试卷的发布吗？`,
        positiveText: "确定",
        negativeText: "取消",
        maskClosable: false,
        onPositiveClick: async () => {
            let {
                data,
            } = await useChangePaperStatusApi({
                id: rowData.id,
                status: 0
            })
            if (data.value.msg == 'ok') {
                message.success("取消发布成功");
            } else {
                message.error("试卷不存在")
            }
        },
        onNegativeClick: () => {
            message.info("取消操作");
        }
    });
}
const pagination = {
    pageSize: 10
}
const columns = createColumns({
    changeStatus
})
definePageMeta({
    middleware: ["admin"]
})
</script>

<style lang="scss" scoped>

</style>