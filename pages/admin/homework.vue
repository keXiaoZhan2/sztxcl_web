<template>
    <n-card title="" style="margin-bottom: 16px">
        <n-tabs type="line" animated>
            <n-tab-pane name="oasis" tab="已发布">
                <n-thing class="p-3 mb-3 border-5 border-green-100 rounded-3xl" v-for="(item, index) in data"
                    :key="item.id">
                    <template #header>
                        {{ item.title }}
                    </template>
                    {{ item.text }}
                    <template #action>
                        <n-space>
                            <n-button type="error" size="small" @click="toDelete(item.id)">
                                删除
                            </n-button>
                            <n-button type="warning" size="small" @click="activate(item)">
                                修改
                            </n-button>
                            <n-button type="info" size="small" @click="getCensus(item.id)">
                                数据统计
                            </n-button>
                        </n-space>
                    </template>
                </n-thing>
            </n-tab-pane>
            <n-tab-pane name="the beatles" tab="草稿箱">
                <n-thing class="p-3 mb-3 border-5 border-green-100 rounded-3xl" v-for="(item, index) in datas"
                    :key="item.id">
                    <template #header>
                        {{ item.title }}
                    </template>
                    {{ item.text }}
                    <template #action>
                        <n-space>
                            <n-button type="error" size="small" @click="toDelete(item.id)">
                                删除
                            </n-button>
                            <n-button type="warning" size="small" @click="activate(item)">
                                修改
                            </n-button>
                            <n-button type="success" size="small" @click="publish(item)">
                                发布
                            </n-button>
                        </n-space>
                    </template>
                </n-thing>
            </n-tab-pane>
            <n-tab-pane name="eatles" tab="发布作业">
                <n-space vertical>
                    <n-input v-model:value="newTitle" type="text" placeholder="标题" show-count />
                    <n-input style="width: 140px;" v-model:value="newLevel" type="text" placeholder="年级，如：19">
                        <template #suffix>
                            级
                        </template>
                    </n-input>
                    <n-input v-model:value="newText" type="textarea" placeholder="正文" rows="12" show-count />
                    <n-space>
                        <n-button type="info" @click="publishNew(0)">保存草稿</n-button>
                        <n-button type="success" @click="publishNew(1)">发布作业</n-button>
                    </n-space>
                </n-space>
            </n-tab-pane>
        </n-tabs>
        <n-drawer v-model:show="active" :width="502" :placement="placement">
            <n-button type="info" class="absolute right-5 top-3" @click="update">确定更新</n-button>
            <n-drawer-content>
                <template #header>
                    <n-input v-model:value="drawerData.title" class="mb-2"></n-input>
                    <n-input style="width: 140px;" v-model:value="drawerData.level" placeholder="年级，如：19">
                        <template #suffix>
                            级
                        </template>
                    </n-input>
                </template>
                <n-input type="textarea" size="large" v-model:value="drawerData.text" rows="20" />
            </n-drawer-content>
        </n-drawer>
        <n-drawer v-model:show="activeS" placement="left" :width="700">
            <n-drawer-content title="统计数据">
                <n-form :model="CensusData" ref="formRef">
                    <n-space>
                        <n-form-item>
                            <n-input style="width: 400px" :disabled="true" v-model:value="CensusData.title">
                                <template #prefix>
                                    作业:
                                </template>
                            </n-input>
                            <n-input style="width: 120px" :disabled="true" v-model:value="CensusData.level">
                                <template #prefix>
                                    年级:
                                </template>
                            </n-input>
                        </n-form-item>
                    </n-space>
                    <n-space>
                        <n-form-item>
                            <n-popselect :options="CensusData.unSubmit" size="medium" scrollable>
                                <n-button style="margin-right: 8px">
                                    {{ '未完成人数:' + CensusData.unSubmit.length }}
                                </n-button>
                            </n-popselect>
                        </n-form-item>
                        <n-form-item>
                            <n-button style="margin-right: 8px">
                                {{ '总人数:' + CensusData.usersNum }}
                            </n-button>
                        </n-form-item>
                        <n-form-item>
                            <n-button style="margin-right: 8px">
                                完成人数: {{ CensusData.usersNum - CensusData.unSubmit.length }}
                            </n-button>
                        </n-form-item>
                    </n-space>
                    <n-space>
                        <n-form-item>
                            <n-upload :action="action_file" :headers="headers"
                                :default-file-list="defaultFileList">
                            </n-upload>
                            {{ defaultFileList }}
                        </n-form-item>
                    </n-space>
                </n-form>
            </n-drawer-content>
        </n-drawer>
    </n-card>

</template>
<script setup>
import { NUpload,NPopselect, NForm, NFormItem, NInput, NCard, NTabs, NTabPane, NThing, NSpace, NButton, useDialog, createDiscreteApi, NDrawer, NDrawerContent } from 'naive-ui'
const {
    action_file,
    headers
} = useUploadConfig()
const defaultFileList = ref([])
const {
    data,
    error,
    refresh,
} = await useGetPublishedHomeworkApi()
const {
    data: datas,
    error: errors,
    refresh: refreshs,
} = await useGetSavedHomeworkApi()
const dialog = useDialog();
const active = ref(false);
const activeS = ref(false);
const formRef = ref(null);
const CensusData = ref({
    level: "",
    title: ""
});
const placement = ref("right");
const drawerData = ref({})
let newTitle = ref("")
let newText = ref("")
let newLevel = ref("")
const toDelete = (id) => {
    const { message } = createDiscreteApi(["message"])
    dialog.warning({
        title: `删除作业`,
        content: `确定删除作业吗？`,
        positiveText: "确定",
        negativeText: "取消",
        maskClosable: false,
        onPositiveClick: async () => {
            let { data } = await usedeleteHomeworkApi(id)
            if (data.value.msg == "ok") {
                message.success("删除成功")
                refresh()
                refreshs()
            } else {
                message.error("删除失败")
            }
        },
        onNegativeClick: () => {
            message.info("取消操作");
        }
    });
}
const update = () => {
    const { message } = createDiscreteApi(["message"])
    dialog.info({
        title: `修改公告`,
        content: `确定修改公告吗？`,
        positiveText: "确定",
        negativeText: "取消",
        maskClosable: false,
        onPositiveClick: async () => {
            let { data } = await useupdateHomeworkApi(drawerData.value)
            if (data.value.msg == "ok") {
                message.success("修改成功")
                active.value = false;
                refresh()
                refreshs()
            } else {
                message.error("修改失败")
            }
        },
        onNegativeClick: () => {
            message.info("取消操作");
        }
    });
}
//这个发布其实是update，只是把status改为1
const publish = (item) => {
    const { message } = createDiscreteApi(["message"])
    dialog.info({
        title: `发布作业`,
        content: `确定发布作业吗？`,
        positiveText: "确定",
        negativeText: "取消",
        maskClosable: false,
        onPositiveClick: async () => {
            let { data } = await useupdateHomeworkApi({
                id: item.id,
                text: item.text,
                title: item.title,
                level: item.level,
                status: 1
            })
            if (data.value.msg == "ok") {
                message.success("发布成功")
                active.value = false;
                refresh()
                refreshs()
            } else {
                message.error("发布失败")
            }
        },
        onNegativeClick: () => {
            message.info("取消操作");
        }
    });
}
const publishNew = (status) => {
    const { message } = createDiscreteApi(["message"])
    if (newText.value.trim() == "" || newTitle.value.trim() == "") {
        message.error("标题和内容不能为空")
        return;
    }
    console.log(newTitle,newText,newLevel)
    dialog.info({
        title: status == 0 ? `存入草稿箱` : `发布作业`,
        content: status == 0 ? `确定存入草稿箱吗？` : `确定发布作业吗？`,
        positiveText: "确定",
        negativeText: "取消",
        maskClosable: false,
        onPositiveClick: async () => {
            let { data } = await useCreateHomeworkApi({
                title: newTitle.value,
                text: newText.value,
                level: newLevel.value,
                status
            })
            if (data.value.id) {
                status == 0 ? message.success("存入草稿箱成功") : message.success("发布成功")
                active.value = false;
                newTitle.value = "";
                newText.value = "";
                newLevel.value = ""
                refresh()
                refreshs()
            } else {
                message.error("操作失败")
            }
        },
        onNegativeClick: () => {
            message.info("取消操作");
        }
    });
}
const activate = (item) => {
    drawerData.value = item;
    active.value = true;
};
const getCensus = async (id) => {
    const { message } = createDiscreteApi(["message"])
    let { data } = await getAllSubmitById(id);
    if (data) {
        activeS.value = true;
        CensusData.value = data.value
        defaultFileList.value = data.value.submit
        message.success("获取统计数据成功");
    } else {
        message.error("获取统计数据失败")
    }
    console.log(CensusData)
}
definePageMeta({
    middleware: ["admin"]
})

</script>
