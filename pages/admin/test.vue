<template>
    <n-card title="">
        <ClientOnly>
            <n-tabs type="line" animated>
                <n-tab-pane name="已发布" tab="已发布">
                    <n-space vertical :size="12">
                        <n-data-table :bordered="false" :columns="columns" :data="res.rows" :pagination="pagination" />
                    </n-space>
                </n-tab-pane>
                <n-tab-pane name="未发布" tab="未发布">
                    <n-space vertical :size="12">
                        <n-data-table :bordered="false" :columns="columnso" :data="reso.rows"
                            :pagination="pagination" />
                    </n-space>
                </n-tab-pane>
                <n-tab-pane name="create" tab="创建考卷">
                    <n-form :model="model" ref="formRef">
                        <n-space>
                            <n-button type="error" @click="handleValidateClick">
                                验证
                            </n-button>
                            <n-button :disabled="!active" type="success" @click="publishPaperTest">
                                发布
                            </n-button>
                        </n-space>

                        <n-space>
                            <n-form-item :path="`testInfo.title`" :rule="dynamicInputRule">
                                <n-input style="width: 400px" @keydown.enter.prevent
                                    v-model:value="model.testInfo.title">
                                    <template #prefix>
                                        试卷标题
                                    </template>
                                </n-input>
                            </n-form-item>
                            <n-form-item>
                                <n-button placeholder="" class="w-25">题目总数: {{
                                    model.dynamicInputValue.length
                                }}</n-button>
                            </n-form-item>
                            <n-form-item :path="`testInfo.expire`" :rule="dynamicChoiceRule">
                                <n-select v-model:value="model.testInfo.expire" placeholder="考试时长" :options="times"
                                    class="w-25" />
                            </n-form-item>
                            <n-form-item :path="`testInfo.level`" :rule="dynamicNumberRule">
                                <n-input style="width: 120px" @keydown.enter.prevent
                                    v-model:value="model.testInfo.level">
                                    <template #prefix>
                                        学生年级:
                                    </template>
                                </n-input>
                            </n-form-item>
                        </n-space>
                        <n-dynamic-input v-model:value="model.dynamicInputValue" item-style="margin-bottom: 0;"
                            :on-create="onCreate" #="{ index, value }" :show-sort-button="true">
                            <div style="display: flex; align-items: flex-start; margin-bottom: 10px">
                                <n-form-item ignore-path-change :show-label="false" :rule="dynamicChoiceInputRule"
                                    :path="`dynamicInputValue[${index}].type`">
                                    <n-select placeholder="题目类型" :options="options" size="" class="w-25"
                                        v-model:value="model.dynamicInputValue[index].type" />
                                </n-form-item>
                                <n-space style="width: 270px">
                                    <n-form-item ignore-path-change :show-label="false" :rule="dynamicQuestionInputRule"
                                        :show-feedback="false" :path="`dynamicInputValue[${index}].title`" class="ml-2">
                                        <n-space vertical>
                                            <n-popover trigger="click" :scrollable="true"
                                                style="width: 300px;min-height: 30px;" placement="right-start">
                                                <template #trigger>
                                                    <n-input v-model:value="model.dynamicInputValue[index].title"
                                                        style="width: 260px" @keydown.enter.prevent>
                                                        <template #prefix>
                                                            题目
                                                        </template>
                                                    </n-input>
                                                </template>
                                                <span>{{ model.dynamicInputValue[index].title }}</span>
                                            </n-popover>

                                        </n-space>
                                    </n-form-item>
                                    <n-space style="margin-left: 10px">
                                        <div
                                            v-if="model.dynamicInputValue[index].type == 'radio' || model.dynamicInputValue[index].type == 'checkbox'">
                                            <n-form-item ignore-path-change :show-label="false" :show-feedback="false"
                                                :rule="dynamicChoiceInputRule" :path="`dynamicInputValue[${index}].A`">
                                                <n-popover trigger="click" :scrollable="true"
                                                    style="width: 300px; min-height: 30px;" placement="right-start">
                                                    <template #trigger>
                                                        <n-input v-model:value="model.dynamicInputValue[index].A"
                                                            style="width: 260px" placeholder="选项内容"
                                                            @keydown.enter.prevent>
                                                            <template #prefix>
                                                                A
                                                            </template>
                                                        </n-input>
                                                    </template>
                                                    <span>{{ model.dynamicInputValue[index].A }}</span>
                                                </n-popover>
                                            </n-form-item>
                                            <n-form-item ignore-path-change :show-label="false" :show-feedback="false"
                                                :rule="dynamicChoiceInputRule" :path="`dynamicInputValue[${index}].B`">
                                                <n-popover trigger="click" :scrollable="true"
                                                    style="width: 300px; min-height: 30px;" placement="right-start">
                                                    <template #trigger>
                                                        <n-input v-model:value="model.dynamicInputValue[index].B"
                                                            style="width: 260px" placeholder="选项内容"
                                                            @keydown.enter.prevent>
                                                            <template #prefix>
                                                                B
                                                            </template>
                                                        </n-input>
                                                    </template>
                                                    <span>{{ model.dynamicInputValue[index].B }}</span>
                                                </n-popover>
                                            </n-form-item>
                                            <n-form-item ignore-path-change :show-label="false" :show-feedback="false"
                                                :rule="dynamicChoiceInputRule" :path="`dynamicInputValue[${index}].C`">
                                                <n-popover trigger="click" :scrollable="true"
                                                    style="width: 300px; min-height: 30px;" placement="right-start">
                                                    <template #trigger>
                                                        <n-input v-model:value="model.dynamicInputValue[index].C"
                                                            style="width: 260px" placeholder="选项内容"
                                                            @keydown.enter.prevent>
                                                            <template #prefix>
                                                                C
                                                            </template>
                                                        </n-input>
                                                    </template>
                                                    <span>{{ model.dynamicInputValue[index].C }}</span>
                                                </n-popover>
                                            </n-form-item>
                                            <n-form-item ignore-path-change :show-label="false" :show-feedback="false"
                                                :rule="dynamicChoiceInputRule" :path="`dynamicInputValue[${index}].D`">
                                                <n-popover trigger="click" :scrollable="true"
                                                    style="width: 300px; min-height: 30px;" placement="right-start">
                                                    <template #trigger>
                                                        <n-input v-model:value="model.dynamicInputValue[index].D"
                                                            style="width: 260px" placeholder="选项内容"
                                                            @keydown.enter.prevent>
                                                            <template #prefix>
                                                                D
                                                            </template>
                                                        </n-input>
                                                    </template>
                                                    <span>{{ model.dynamicInputValue[index].D }}</span>
                                                </n-popover>
                                            </n-form-item>
                                        </div>
                                    </n-space>
                                </n-space>

                                <n-form-item ignore-path-change :show-label="false"
                                    v-if="model.dynamicInputValue[index].type == 'answer' || model.dynamicInputValue[index].type == null"
                                    :path="`dynamicInputValue[${index}].ans`" style="margin-left: 10px">
                                    <div>
                                        <n-button disabled placeholder="" class="w-25">答案无标准</n-button>
                                    </div>
                                </n-form-item>
                                <n-form-item v-else ignore-path-change :show-label="false"
                                    :rule="dynamicChoiceInputRule" :path="`dynamicInputValue[${index}].ans`"
                                    style="margin-left: 10px">
                                    <div v-if="model.dynamicInputValue[index].type == 'radio'">
                                        <n-select placeholder="答案" :options="ans_options" size="" class="w-25"
                                            v-model:value="model.dynamicInputValue[index].ans" />
                                    </div>
                                    <div v-else-if="model.dynamicInputValue[index].type == 'checkbox'">
                                        <n-tree-select multiple class="w-25" placeholder="答案" :options="ans_options_mul"
                                            v-model:value="model.dynamicInputValue[index].ans" />
                                    </div>
                                    <div v-else-if="model.dynamicInputValue[index].type == 'trueOrfalse'">
                                        <n-select placeholder="答案" :options="ans_options_judge" size="" class="w-25"
                                            v-model:value="model.dynamicInputValue[index].ans" />
                                    </div>
                                    <div v-else>
                                        <n-button disabled placeholder="" class="w-25">答案无标准</n-button>
                                    </div>
                                </n-form-item>

                            </div>
                        </n-dynamic-input>
                    </n-form>
                    <pre>{{ JSON.stringify(model.testInfo, null, 2) }}</pre>
                    <pre>{{ JSON.stringify(model.dynamicInputValue, null, 2) }}</pre>
                </n-tab-pane>
            </n-tabs>
        </ClientOnly>
        <n-drawer v-model:show="activeD" :width="800" placement="left">
            <n-drawer-content title="修改试卷">
                <n-form :model="modelN" ref="formRef">
                    <n-space>
                        <n-button type="error" @click="handleValidateClickN">
                            验证
                        </n-button>
                        <n-button :disabled="!activeN" type="success" @click="updatePaperTest">
                            更新
                        </n-button>
                    </n-space>

                    <n-space>
                        <n-form-item :path="`testInfo.title`" :rule="dynamicInputRule">
                            <n-input style="width: 400px" @keydown.enter.prevent v-model:value="modelN.testInfo.title">
                                <template #prefix>
                                    试卷标题
                                </template>
                            </n-input>
                        </n-form-item>
                        <n-form-item>
                            <n-button placeholder="" class="w-25">题目总数: {{
                                modelN.dynamicInputValue.length
                            }}</n-button>
                        </n-form-item>
                        <n-form-item :path="`testInfo.expire`" :rule="dynamicChoiceRule">
                            <n-select v-model:value="modelN.testInfo.expire" placeholder="考试时长" :options="times"
                                class="w-25" />
                        </n-form-item>
                        <n-form-item :path="`testInfo.level`" :rule="dynamicNumberRule">
                            <n-input style="width: 120px" @keydown.enter.prevent v-model:value="modelN.testInfo.level">
                                <template #prefix>
                                    学生年级:
                                </template>
                            </n-input>
                        </n-form-item>
                    </n-space>
                    <n-dynamic-input v-model:value="modelN.dynamicInputValue" item-style="margin-bottom: 0;"
                        :on-create="onCreate" #="{ index, value }" :show-sort-button="true">
                        <div style="display: flex; align-items: flex-start; margin-bottom: 10px">
                            <n-form-item ignore-path-change :show-label="false" :rule="dynamicChoiceInputRule"
                                :path="`dynamicInputValue[${index}].type`">
                                <n-select placeholder="题目类型" :options="options" size="" class="w-25"
                                    v-model:value="modelN.dynamicInputValue[index].type" />
                            </n-form-item>
                            <n-space style="width: 270px">
                                <n-form-item ignore-path-change :show-label="false" :rule="dynamicQuestionInputRule"
                                    :show-feedback="false" :path="`dynamicInputValue[${index}].title`" class="ml-2">
                                    <n-space vertical>
                                        <n-popover trigger="click" :scrollable="true"
                                            style="width: 300px;min-height: 30px;" placement="right-start">
                                            <template #trigger>
                                                <n-input v-model:value="modelN.dynamicInputValue[index].title"
                                                    style="width: 260px" @keydown.enter.prevent>
                                                    <template #prefix>
                                                        题目
                                                    </template>
                                                </n-input>
                                            </template>
                                            <span>{{ modelN.dynamicInputValue[index].title }}</span>
                                        </n-popover>

                                    </n-space>
                                </n-form-item>
                                <n-space style="margin-left: 10px">
                                    <div
                                        v-if="modelN.dynamicInputValue[index].type == 'radio' || modelN.dynamicInputValue[index].type == 'checkbox'">
                                        <n-form-item ignore-path-change :show-label="false" :show-feedback="false"
                                            :rule="dynamicChoiceInputRule" :path="`dynamicInputValue[${index}].A`">
                                            <n-popover trigger="click" :scrollable="true"
                                                style="width: 300px; min-height: 30px;" placement="right-start">
                                                <template #trigger>
                                                    <n-input v-model:value="modelN.dynamicInputValue[index].A"
                                                        style="width: 260px" placeholder="选项内容" @keydown.enter.prevent>
                                                        <template #prefix>
                                                            A
                                                        </template>
                                                    </n-input>
                                                </template>
                                                <span>{{ modelN.dynamicInputValue[index].A }}</span>
                                            </n-popover>
                                        </n-form-item>
                                        <n-form-item ignore-path-change :show-label="false" :show-feedback="false"
                                            :rule="dynamicChoiceInputRule" :path="`dynamicInputValue[${index}].B`">
                                            <n-popover trigger="click" :scrollable="true"
                                                style="width: 300px; min-height: 30px;" placement="right-start">
                                                <template #trigger>
                                                    <n-input v-model:value="modelN.dynamicInputValue[index].B"
                                                        style="width: 260px" placeholder="选项内容" @keydown.enter.prevent>
                                                        <template #prefix>
                                                            B
                                                        </template>
                                                    </n-input>
                                                </template>
                                                <span>{{ modelN.dynamicInputValue[index].B }}</span>
                                            </n-popover>
                                        </n-form-item>
                                        <n-form-item ignore-path-change :show-label="false" :show-feedback="false"
                                            :rule="dynamicChoiceInputRule" :path="`dynamicInputValue[${index}].C`">
                                            <n-popover trigger="click" :scrollable="true"
                                                style="width: 300px; min-height: 30px;" placement="right-start">
                                                <template #trigger>
                                                    <n-input v-model:value="modelN.dynamicInputValue[index].C"
                                                        style="width: 260px" placeholder="选项内容" @keydown.enter.prevent>
                                                        <template #prefix>
                                                            C
                                                        </template>
                                                    </n-input>
                                                </template>
                                                <span>{{ modelN.dynamicInputValue[index].C }}</span>
                                            </n-popover>
                                        </n-form-item>
                                        <n-form-item ignore-path-change :show-label="false" :show-feedback="false"
                                            :rule="dynamicChoiceInputRule" :path="`dynamicInputValue[${index}].D`">
                                            <n-popover trigger="click" :scrollable="true"
                                                style="width: 300px; min-height: 30px;" placement="right-start">
                                                <template #trigger>
                                                    <n-input v-model:value="modelN.dynamicInputValue[index].D"
                                                        style="width: 260px" placeholder="选项内容" @keydown.enter.prevent>
                                                        <template #prefix>
                                                            D
                                                        </template>
                                                    </n-input>
                                                </template>
                                                <span>{{ modelN.dynamicInputValue[index].D }}</span>
                                            </n-popover>
                                        </n-form-item>
                                    </div>
                                </n-space>
                            </n-space>

                            <n-form-item ignore-path-change :show-label="false"
                                v-if="modelN.dynamicInputValue[index].type == 'answer' || modelN.dynamicInputValue[index].type == null"
                                :path="`dynamicInputValue[${index}].ans`" style="margin-left: 10px">
                                <div>
                                    <n-button disabled placeholder="" class="w-25">答案无标准</n-button>
                                </div>
                            </n-form-item>
                            <n-form-item v-else ignore-path-change :show-label="false" :rule="dynamicChoiceInputRule"
                                :path="`dynamicInputValue[${index}].ans`" style="margin-left: 10px">
                                <div v-if="modelN.dynamicInputValue[index].type == 'radio'">
                                    <n-select placeholder="答案" :options="ans_options" size="" class="w-25"
                                        v-model:value="modelN.dynamicInputValue[index].ans" />
                                </div>
                                <div v-else-if="modelN.dynamicInputValue[index].type == 'checkbox'">
                                    <n-tree-select multiple class="w-25" placeholder="答案" :options="ans_options_mul"
                                        v-model:value="modelN.dynamicInputValue[index].ans" />
                                </div>
                                <div v-else-if="modelN.dynamicInputValue[index].type == 'trueOrfalse'">
                                    <n-select placeholder="答案" :options="ans_options_judge" size="" class="w-25"
                                        v-model:value="modelN.dynamicInputValue[index].ans" />
                                </div>
                                <div v-else>
                                    <n-button disabled placeholder="" class="w-25">答案无标准</n-button>
                                </div>
                            </n-form-item>

                        </div>
                    </n-dynamic-input>
                </n-form>
            </n-drawer-content>

        </n-drawer>
        <n-drawer v-model:show="activeF" :width="800" placement="left">
            <n-drawer-content title="统计数据">
                <n-form :model="modelD" ref="formRefD">
                    <n-space>
                        <n-form-item :path="`testInfo.title`">
                            <n-input disabled style="width: 400px" @keydown.enter.prevent
                                v-model:value="modelD.testInfo.title">
                                <template #prefix>
                                    试卷标题
                                </template>
                            </n-input>
                        </n-form-item>
                        <n-form-item :path="`testInfo.level`">
                            <n-input disabled style="width: 120px" @keydown.enter.prevent
                                v-model:value="modelD.testInfo.level">
                                <template #prefix>
                                    学生年级:
                                </template>
                            </n-input>
                        </n-form-item>
                        <n-form-item :path="`testInfo.average`">
                            <n-input disabled style="width: 120px" @keydown.enter.prevent
                                v-model:value="modelD.testInfo.average">
                                <template #prefix>
                                    平均分:
                                </template>
                            </n-input>
                        </n-form-item>
                    </n-space>
                    <n-space>
                        <n-form-item>
                            <n-popselect :options="modelD.unfinished" size="medium" scrollable>
                                <n-button style="margin-right: 8px">
                                    {{ '未完成人数:' + modelD.unfinished.length }}
                                </n-button>
                            </n-popselect>
                        </n-form-item>
                        <n-form-item>
                            <n-button style="margin-right: 8px">
                                {{ '总人数:' + modelD.usersNum }}
                            </n-button>
                        </n-form-item>
                        <n-form-item>
                            <n-button style="margin-right: 8px">
                                完成人数: {{ modelD.usersNum - modelD.unfinished.length }}
                            </n-button>
                        </n-form-item>
                    </n-space>
                    <n-space>
                        <template v-for="(item, index) in modelD.questions">
                            <n-form-item>
                                <n-card :title="`第${index + 1}题`" hoverable class="w-80">
                                    {{ '题目:' + item.title }}
                                    <n-divider />
                                    <n-space justify="space-between">
                                        <div>
                                            {{ '答对人数: ' + item.correct }}
                                        </div>
                                        <div>
                                            {{ '答题人数: ' + item.finished }}
                                        </div>
                                    </n-space>
                                    <n-divider />
                                    {{ '正确率:' + Math.round(item.correct / item.finished * 100) + '%' }}
                                </n-card>
                            </n-form-item>
                        </template>
                    </n-space>
                </n-form>
            </n-drawer-content>
        </n-drawer>
    </n-card>

</template>
<script setup>
import { NDivider, NPopselect, NDrawer, NDrawerContent, useMessage, NTreeSelect, NPopover, NDynamicInput, NSelect, NForm, NFormItem, NInput, NTabs, NCard, NTabPane, useNotification, NButton, NDataTable, NSpace, NImage, useDialog, createDiscreteApi, NImageGroup } from 'naive-ui'
const message = useMessage();
const dialog = useDialog();
const formRef = ref(null);
const formRefD = ref(null);
//创建试卷的值
const model = reactive({
    dynamicInputValue: [{ type: null, title: "", A: "", B: "", C: "", D: "", ans: null }],
    testInfo: { title: null, expire: null, level: "" }
})
//数据统计的值
let modelD = ref({
    testInfo: { title: "kaoshi", average: "89", level: "19" },
    unfinished: [
        {
            label: "柯晓展-201934910211",
        },
        {
            label: "柯晓展-201934910211",
        },
        {
            label: "柯晓展-201934910211",
        },
        {
            label: "柯晓展-201934910211",
        },
        {
            label: "柯晓展-201934910211",
        },
        {
            label: "柯晓展-201934910211",
        },
        {
            label: "柯晓展-201934910211",
        },
        {
            label: "柯晓展-201934910211",
        },
        {
            label: "柯晓展-201934910211",
        },
        {
            label: "柯晓展-201934910211",
        },
        {
            label: "柯晓展-201934910211",
        },
        {
            label: "柯晓展-201934910211",
        },
        {
            label: "柯晓展-201934910211",
        },
        {
            label: "柯晓展-201934910211",
        },
        {
            label: "柯晓展-201934910211",
        },
        {
            label: "柯晓展-201934910211",
        },
    ],
    //总人数
    usersNum: '30',
    questions: [
        {
            title: 'XXX',
            finished: 30,
            correct: 10
        },
        {
            title: 'XXX',
            finished: 30,
            correct: 10
        },
        {
            title: 'XXX',
            finished: 30,
            correct: 10
        },
        {
            title: 'XXX',
            finished: 30,
            correct: 10
        },
        {
            title: 'XXX',
            finished: 30,
            correct: 10
        },
        {
            title: 'XXX',
            finished: 30,
            correct: 10
        },
    ]
})
//修改试卷抽屉按钮
let activeD = ref(false)
//统计数据抽屉按钮
let activeF = ref(false)
//发布试卷按钮
let active = ref(false)
//更新试卷的按钮
let activeN = ref(false)
//更新试卷的值
let modelN = ref({
    dynamicInputValue: [{ type: null, title: "", A: "", B: "", C: "", D: "", ans: null }],
    testInfo: { title: null, expire: null, level: "" }
})
//更新试卷的ID
let updatePaperID = ref(0)
//修改试卷抽屉
const activate = async (row) => {
    updatePaperID = row.id
    const {
        data
    } = await useGetPaperApi(row.id)
    if (data) {
        modelN = data.value
    } else {
    }
    activeD.value = true
}
const onCreate = () => {
    return {
        type: null,
        title: "",
        A: "",
        B: "",
        C: "",
        D: "",
        ans: null
    };
}
const handleValidateClick = (e) => {
    e.preventDefault();
    formRef.value?.validate((errors) => {
        if (!errors) {
            active.value = true
            message.success("试卷填写完成");
        } else {
            active.value = false
            message.error("试卷填写缺失");
        }
    });
}
const handleValidateClickN = (e) => {
    e.preventDefault();
    formRef.value?.validate((errors) => {
        if (!errors) {
            activeN.value = true
            message.success("试卷填写完成");
        } else {
            activeN.value = false
            message.error("试卷填写缺失");
        }
    });
}
const publishPaperTest = () => {
    const { message } = createDiscreteApi(["message"])
    active.value = false
    dialog.info({
        title: `发布试卷`,
        content: `确定发布试卷吗？`,
        positiveText: "确定",
        negativeText: "取消",
        maskClosable: false,
        onPositiveClick: async () => {
            let {
                data,
            } = await useCreatePaperApi(model)
            if (data.value.msg == 'ok') {
                message.success("发布试卷成功");
                refresh()
                refresho()
            } else {
                message.error("发布试卷失败")
            }
        },
        onNegativeClick: () => {
            message.error("取消操作");
        }
    });
}
const updatePaperTest = () => {
    const { message } = createDiscreteApi(["message"])
    activeN.value = false
    dialog.info({
        title: `更新试卷`,
        content: `确定更新试卷吗？`,
        positiveText: "确定",
        negativeText: "取消",
        maskClosable: false,
        onPositiveClick: async () => {
            let {
                data,
            } = await useUpdatePaperApi(modelN, updatePaperID)
            if (data.value.msg == 'ok') {
                message.success("更新试卷成功");
                refresh()
                refresho()
            } else {
                message.error("更新试卷失败")
            }
        },
        onNegativeClick: () => {
            message.error("取消操作");
        }
    });
}
const dynamicInputRule = {
    trigger: "blur",
    required: true,
    validator(rule, value) {
        if (value == null || value.length == 0)
            return new Error("请输入试卷标题");
        return true;
    }
}
const dynamicChoiceRule = {
    trigger: "blur",
    required: true,
    validator(rule, value) {
        if (value == null)
            return new Error("请选择考试时长");
        return true;
    }
}
const dynamicNumberRule = {
    trigger: "blur",
    required: true,
    validator(rule, value) {
        let f = isNaN(value)
        if (f || value.length != 2 || value.length == 0)
            return new Error("请输入2位数字");
        return true;
    }
}
const dynamicQuestionInputRule = {
    trigger: "blur",
    required: true,
    validator(rule, value) {
        if (value == null || value.length == 0)
            return new Error("请输入题目内容");
        return true;
    }
}
const dynamicChoiceInputRule = {
    trigger: "blur",
    required: true,
    validator(rule, value) {
        if (value == null || value.length == 0)
            return new Error("请输入选项内容");
        return true;
    }
}

const options = [
    {
        label: '单选题',
        value: 'radio'
    },
    {
        label: '多选题',
        value: 'checkbox'
    },
    {
        label: '判断题',
        value: 'trueOrfalse'
    },
    {
        label: '问答题',
        value: 'answer'
    }
]
const ans_options_judge = [
    {
        label: '正确',
        value: 'true'
    },
    {
        label: '错误',
        value: 'false'
    }
]
const ans_options = [
    {
        label: 'A',
        value: 'A'
    },
    {
        label: 'B',
        value: 'B'
    },
    {
        label: 'C',
        value: 'C'
    },
    {
        label: 'D',
        value: 'D'
    },
]
const ans_options_mul = [
    {
        label: 'A',
        key: 'A'
    },
    {
        label: 'B',
        key: 'B'
    },
    {
        label: 'C',
        key: 'C'
    },
    {
        label: 'D',
        key: 'D'
    },
]
const times = [
    {
        label: '20分钟',
        value: '20'
    },
    {
        label: '30分钟',
        value: '30'
    },
    {
        label: '40分钟',
        value: '40'
    },
    {
        label: '50分钟',
        value: '50'
    },
    {
        label: '60分钟',
        value: '60'
    },
]

const {
    data: res,
    error,
    refresh
} = await useGetAllTest()
const {
    data: reso,
    error: erroro,
    refresh: refresho
} = await useGetAllNoTest()

definePageMeta({
    middleware: ["admin"]
})

const createColumns = ({
    changeStatus
}) => {
    return [
        {
            title: "试卷名",
            key: "title",
        },
        {
            title: "题目总数",
            key: "question_count",
        },
        {
            title: "发布时间",
            key: "update_time",
        },
        {
            title: "考试时长",
            key: "expire",
        },
        {
            title: "年级",
            key: "level",
        },
        {
            title: "修改试卷",
            key: "update",
            width: '100',
            render(row) {
                return h(
                    NButton,
                    {
                        size: "small",
                        onClick: () => activate(row),
                        type: "success"
                    },
                    { default: () => "修改试卷" }
                );
            }
        },
        {
            title: "取消发布",
            key: "delete",
            width: '100',
            render(row) {
                return h(
                    NButton,
                    {
                        size: "small",
                        onClick: () => changeStatus(row),
                        type: "error"
                    },
                    { default: () => "取消发布" }
                );
            }
        },
        {
            title: "数据统计",
            key: "census",
            width: '100',
            render(row) {
                return h(
                    NButton,
                    {
                        size: "small",
                        onClick: () => getCensus(row),
                        type: "info"
                    },
                    { default: () => "数据统计" }
                );
            }
        }
    ];
};
const createColumnso = ({
    deletePaper
}) => {
    return [
        {
            title: "试卷名",
            key: "title",
        },
        {
            title: "题目总数",
            key: "question_count",
        },
        {
            title: "发布时间",
            key: "update_time",
        },
        {
            title: "考试时长",
            key: "expire",
        },
        {
            title: "年级",
            key: "level",
        },
        {
            title: "修改试卷",
            key: "update",
            width: '100',
            render(row) {
                return h(
                    NButton,
                    {
                        size: "small",
                        onClick: () => activate(row),
                        type: "success"
                    },
                    { default: () => "修改试卷" }
                );
            }
        },
        {
            title: "彻底删除",
            key: "delete",
            width: '100',
            render(row) {
                return h(
                    NButton,
                    {
                        size: "small",
                        onClick: () => deletePaper(row),
                        type: "error"
                    },
                    { default: () => "彻底删除" }
                );
            }
        },
        {
            title: "数据统计",
            key: "census",
            width: '100',
            render(row) {
                return h(
                    NButton,
                    {
                        size: "small",
                        onClick: () => getCensus(row),
                        type: "info"
                    },
                    { default: () => "数据统计" }
                );
            }
        }
    ];
};
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
                refresh()
                refresho()
            } else {
                message.error("试卷不存在")
            }
        },
        onNegativeClick: () => {
            message.info("取消操作");
        }
    });
}
const deletePaper = (rowData) => {
    const { message } = createDiscreteApi(["message"])
    dialog.warning({
        title: `删除试卷`,
        content: `确定删除该试卷吗？`,
        positiveText: "确定",
        negativeText: "取消",
        maskClosable: false,
        onPositiveClick: async () => {
            let {
                data,
            } = await usedeletePaperApi(rowData.id)
            if (data.value.msg == 'ok') {
                message.success("删除试卷成功");
                refresh()
                refresho()
            } else {
                message.error("试卷不存在")
            }
        },
        onNegativeClick: () => {
            message.info("取消操作");
        }
    });
}
const getCensus = async (rowData) => {
    const { message } = createDiscreteApi(["message"])
    let {
        data,
    } = await useCensorPaperApi(rowData.id)
    console.log(data)
    if (data) {
        activeF.value = true
        modelD.value = data.value
        message.success("获取统计数据成功");
    } else {
        message.error("获取统计数据失败")
    }
}
const columns = createColumns({
    changeStatus
})
const columnso = createColumnso({ deletePaper })
const pagination = {
    pageSize: 10
}

</script>

<style>
.font {
    font-size: 14px;
}
</style>