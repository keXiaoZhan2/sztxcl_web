<template>
    <div class="p-5">
        <n-space>
            <n-input v-model:value="level" type="text" placeholder="过滤出的年级，如:19"></n-input>
            <n-button @click="filterLevel">
                过滤年级
            </n-button>
            <n-button @click="unfilterLevel">
                取消过滤
            </n-button>
        </n-space>
        <n-data-table :columns="columns" :data="data" :pagination="pagination" />
        <!-- <pre>{{ JSON.stringify(data, null, 2) }}</pre> -->
        <n-button class="absoulete mb-25" type="info" @click="addRow()">添加一行</n-button>
    </div>
</template>

<script setup>
import { NInput, NDataTable, NButton, NSpace, createDiscreteApi, useDialog } from "naive-ui";
const dialog = useDialog();
//获取所有用户
const {
    data: users,
    error,
    pending,
    refresh
} = await useGetAllUsersApi()
//默认过滤年级
let level = ref('');
//指定过滤选项
const LevelColumn = reactive({
    title: "级别",
    key: "level",
    width: "70",
    render(row, index) {
        return h(NInput, {
            value: row.level,
            placeholder: '',
            onUpdateValue(v) {
                data.value[row.key - 1].level = v;
            }
        });
    },
    filterMultiple: false,
    filterOptionValue: null,
    filter(value, row) {
        if (row.level) {
            return !!~row.level.indexOf(value.toString());
        } else {
            return;
        }
    }
});
// const createData = () => [
//     {
//         key: 1,
//         level: '19',
//         name: "John Brown",
//         code: "32",
//         sex: "男",
//         password: "123456"
//     },
//     {
//         key: 2,
//         level: '20',
//         name: "John Brown",
//         code: "32",
//         sex: "男",
//         password: "123456"
//     },
//     {
//         key: 3,
//         level: '15',
//         name: "John Brown",
//         code: "32",
//         sex: "男",
//         password: "123456"
//     },
//     {
//         key: 4,
//         level: '19',
//         name: "John Brown",
//         code: "32",
//         sex: "男",
//         password: "123456"
//     },
// ];

const data = ref(users);
const sendMail = async (rowData, status) => {
    const { message } = createDiscreteApi(["message"])
    if (status) {
        let r = await useUpdateOrCreateApi(rowData)
        if (r) {
            message.success("修改用户信息成功")
        }
    } else {
        message.info("请完成当前行所有字段填写")
    }
}
const deleteStudent = (rowData) => {
    const { message } = createDiscreteApi(["message"])

    dialog.warning({
        title: `删除账户`,
        content: `确定删除学号为${rowData.code}的用户${rowData.nickname}吗？`,
        positiveText: "确定",
        negativeText: "取消",
        maskClosable: false,
        onPositiveClick: async () => {
            let {
                data,
            } = await useDeleteUserApi({
                code: rowData.code
            })
            if (data.value.msg == 'ok') {
                message.success("删除用户成功");
                refresh()
            } else {
                message.error("用户不存在")
            }
        },
        onNegativeClick: () => {
            message.error("取消操作");
        }
    });

}
const filterLevel = () => {
    LevelColumn.filterOptionValue = level ? level : 19;
}
const unfilterLevel = () => {
    LevelColumn.filterOptionValue = null;
}
const createColumns = (sendMail, deleteStudent) => {
    return [
        LevelColumn,
        {
            title: "姓名",
            key: "nickname",
            width: "110",
            render(row, index) {
                return h(NInput, {
                    value: row.nickname,
                    placeholder: '',
                    onUpdateValue(v) {
                        data.value[row.key - 1].nickname = v;
                    }
                });
            }
        },
        {
            title: "学号",
            key: "code",
            width: "160",
            render(row, index) {
                return h(NInput, {
                    value: row.code,
                    placeholder: '',
                    onUpdateValue(v) {
                        data.value[row.key - 1].code = v;
                    }
                });
            }
        },
        {
            title: "性别",
            key: "sex",
            width: '90',
            render(row, index) {
                return h(NInput, {
                    value: row.sex,
                    onUpdateValue(v) {
                        data.value[row.key - 1].sex = v;
                    }
                });
            }
        },
        {
            title: "初始密码",
            key: "password",
            render(row, index) {
                return h(NInput, {
                    value: row.password,
                    placeholder: '默认为学号后6位',
                    onUpdateValue(v) {
                        data.value[row.key - 1].password = v;
                    },
                    disabled: true,
                    defaultValue: "123456"
                });
            }
        },
        {
            title: "注册/修改",
            key: "reg_upd",
            render(row) {
                let status = false
                const { code, key, level, nickname, password, sex } = row
                if (code && level && nickname && password && sex) {
                    status = true
                }
                return h(
                    NButton,
                    {
                        size: "small",
                        type: status ? "primary" : "default",
                        onClick: () => sendMail(row, status)
                    },
                    { default: () => "确定更新" }
                );
            }
        },
        {
            title: "删除学生",
            key: "delete",
            render(row) {
                const flag = (!row.code || row.code == "admin") ? true : false
                return h(
                    NButton,
                    {
                        size: "small",
                        type: "error",
                        disabled: flag,
                        onClick: () => deleteStudent(row)
                    },
                    { default: () => "删除账户" }
                );
            }
        }
    ]
}
const columns = createColumns(sendMail, deleteStudent)
const pagination = {
    pageSize: 10
}
const addRow = () => {
    data.value.push({
        key: data.value.length + 1,
        level: level.value,
        name: "",
        code: "",
        sex: "男",
        password: "默认为学号后6位"
    })
}



</script>