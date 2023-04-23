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
            <n-tab-pane name="eatles" tab="发布公告">
                <n-space vertical>
                    <n-input v-model:value="newTitle" type="text" placeholder="标题" show-count />
                    <n-input v-model:value="newText" type="textarea" placeholder="正文" rows="12" show-count />
                    <n-space>
                        <n-button type="info" @click="publishNew(0)">保存草稿</n-button>
                        <n-button type="success" @click="publishNew(1)">发布公告</n-button>
                    </n-space>
                </n-space>
            </n-tab-pane>
        </n-tabs>
        <n-drawer v-model:show="active" :width="502" :placement="placement">
            <n-button type="info" class="absolute right-5 top-3" @click="update">确定更新</n-button>
            <n-drawer-content>
                <template #header>
                    <n-input v-model:value="drawerData.title"></n-input>
                </template>
                <n-input type="textarea" size="large" v-model:value="drawerData.text" rows="20" />
            </n-drawer-content>
        </n-drawer>
    </n-card>

</template>
<script setup>
import { NInput, NCard, NTabs, NTabPane, NThing, NSpace, NButton, useDialog, createDiscreteApi, NDrawer, NDrawerContent } from 'naive-ui'
const {
    data,
    error,
    refresh,
} = await useGetPublishedApi()
const {
    data:datas,
    error:errors,
    refresh:refreshs,
} = await useGetSavedApi()
const dialog = useDialog();
const active = ref(false);
const placement = ref("right");
const drawerData = ref({})
let newTitle = ref("")
let newText = ref("")
const toDelete = (id) => {
    const { message } = createDiscreteApi(["message"])
    dialog.warning({
        title: `删除公告`,
        content: `确定删除公告吗？`,
        positiveText: "确定",
        negativeText: "取消",
        maskClosable: false,
        onPositiveClick: async () => {
            let { data } = await usedeleteAnnouncementApi(id)
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
            let { data } = await useupdateAnnouncementApi(drawerData.value)
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
        title: `发布公告`,
        content: `确定发布公告吗？`,
        positiveText: "确定",
        negativeText: "取消",
        maskClosable: false,
        onPositiveClick: async () => {
            let { data } = await useupdateAnnouncementApi({
                id: item.id,
                text: item.text,
                title: item.title,
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
    if(newText.value.trim() == "" || newTitle.value.trim() == "") {
        message.error("标题和内容不能为空")
        return;
    }
    dialog.info({
        title: status == 0 ? `存入草稿箱` : `发布公告`,
        content: status == 0 ? `确定存入草稿箱吗？` : `确定发布公告吗？`,
        positiveText: "确定",
        negativeText: "取消",
        maskClosable: false,
        onPositiveClick: async () => {
            let { data } = await useCreateAnnouncemnetApi({
                title: newTitle.value,
                text: newText.value,
                status
            })
            if (data.value.id) {
                status == 0 ? message.success("存入草稿箱成功") :  message.success("发布成功")
                active.value = false;
                newTitle.value = "";
                newText.value = "";
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
definePageMeta({
    middleware: ["admin"]
})

</script>
