<template>
    <n-space vertical :size="12">
        <n-data-table :bordered="false" :columns="columns" :data="data" :pagination="pagination" />
    </n-space>
</template>
<script setup>
import { useNotification, NButton, NDataTable, NSpace, NImage, useDialog, createDiscreteApi, NImageGroup } from 'naive-ui'
const dialog = useDialog();
const notification = useNotification();
definePageMeta({
    middleware: ["admin"]
})
const notify = async (row) => {
    let {
        data,
        refresh,
        error
    } = await useReadPostApi(row.id)
    let type = 'info'
    if (!data.value.content) {
        type = 'error'
        notification[type]({
            content: "获取帖子失败",
            meta: "Error",
            duration: 2500,
            keepAliveOnHover: true
        });
    } else {
        const content = JSON.parse(data.value.content)
        notification[type]({
            content: "获取帖子成功",
            meta: () => {
                return h('div',content.map(v => {
                    return [h('p',{class: 'font'},v.text),h('div',h(NImageGroup,v.images.map(n => {
                        return h(NImage,{src: n})
                    })))]
                }));
            },
            duration: 2500,
            keepAliveOnHover: true,
        });
}

}
const createColumns = ({
    deletePost
}) => {
    return [
        {
            title: "社区",
            key: "bbs",
            width: '70'

        },
        {
            title: "发帖人",
            key: "user",
            width: '100'
        },
        {
            title: "内容",
            key: "text",
            width: 380,
            ellipsis: true
        },
        {
            title: "图片",
            key: "image",
            render(row) {
                return h(
                    NImage,
                    {
                        src: row.image,
                        width: "100"
                    }
                );
            }
        },
        {
            title: "查看帖子",
            key: "view",
            width: '100',
            render(row) {
                return h(
                    NButton,
                    {
                        size: "small",
                        onClick: () => notify(row),
                        type: "success"
                    },
                    { default: () => "查看帖子" }
                );
            }
        },
        {
            title: "删除帖子",
            key: "delete",
            width: '100',
            render(row) {
                return h(
                    NButton,
                    {
                        size: "small",
                        onClick: () => deletePost(row),
                        type: "error"
                    },
                    { default: () => "删除帖子" }
                );
            }
        }
    ];
};
// const createData = () => [
//     {
//         key: 0,
//         bbs: "全部",
//         text: "John Brown",
//         image: "http://dummyimage.com/160x600",
//         user: "李华",
//     },
//     {
//         key: 1,
//         bbs: "全部",
//         text: "John Brown",
//         image: "http://dummyimage.com/160x600",
//         user: "李华",
//     },
//     {
//         key: 2,
//         bbs: "全部",
//         text: "John Brown",
//         image: "http://dummyimage.com/160x600",
//         user: "李华",
//     },
// ];
const {
    data: res,
    error,
    refresh
} = await useGetAllPostsApi()
const data = reactive(res)
const deletePost = (rowData) => {
    const { message } = createDiscreteApi(["message"])
    dialog.warning({
        title: `删除帖子`,
        content: `确定删除用户${rowData.user}的帖子吗？`,
        positiveText: "确定",
        negativeText: "取消",
        maskClosable: false,
        onPositiveClick: async () => {
            let {
                data,
            } = await useAdminDeletePostApi(
                rowData.id
            )
            if (data.value.msg == 'ok') {
                message.success("删除帖子成功");
                refresh()
            } else {
                message.error("帖子不存在")
            }
        },
        onNegativeClick: () => {
            message.info("取消操作");
        },
        onMaskClick: () => {
            // message.success("不能关闭");
        },
        onEsc: () => {
            // message.success("通过 esc 关闭");
        }
    });
}
const columns = createColumns({
    deletePost
})
const pagination = {
    pageSize: 10
}
</script>

<style>
    .font {
        font-size: 14px;
    }
</style>