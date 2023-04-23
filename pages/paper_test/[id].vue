<template>
    <n-grid :x-gap="20">
        <n-grid-item :span="18">
            <n-card>
                <template #header>
                    <h3 class="text-center font-bold">{{ data.title }}</h3>
                    <n-divider />
                    <p class=" space-x-5 text-sm text-center">
                        <span>题目总数：{{ data.testpaper_question.length }}</span>
                        <span>总分数：{{ data.total_score }}</span>
                        <span>时间：{{ data.expire }}分钟</span>
                    </p>
                </template>

                <!-- 题目组件 -->
                <PaperTestItem v-for="(item, index) in testpaper_question" :key="index" :item="item" :index="index"
                    @change="handleUserValueChange(item, $event)" :id="'question_' + index" />

            </n-card>
        </n-grid-item>
        <n-grid-item :span="6">
            <n-card>
                <template #header>
                    <div class="flex flex-col items-center justify-center">
                        <small class="text-gray-500 mb-1">剩余时间</small>
                        <TimeBox :expire="data.expire" class="text-3xl text-light-blue-600" @end="autoSubmit" />
                    </div>
                </template>
                <n-grid :x-gap="12" :cols="4">
                    <n-grid-item v-for="(item, index) in testpaper_question" :key="index">
                        <n-tag class="mb-2 w-full cursor-pointer flex items-center justify-center"
                            :type="item.isTest ? 'success' : ''" @click="scrollToDom(index)">{{ index + 1 }}</n-tag>
                    </n-grid-item>
                </n-grid>
                <n-divider />
                <div>
                    <n-button type="primary" class="w-full" @click="submit" :loading="loading">交 卷</n-button>
                </div>
            </n-card>
        </n-grid-item>
    </n-grid>
</template>
<script setup>
import { onBeforeRouteLeave } from "vue-router"
import {
    NGrid,
    NGridItem,
    NButton,
    NTag,
    NCard,
    NDivider,
    createDiscreteApi
} from "naive-ui"

const route = useRoute()

let {
    data
} = await useReadTestpaperApi(route.params.id)
// 题目列表
const testpaper_question = computed(() => {
    return data.value ? data.value.testpaper_question.map(o => {
        o.isTest = false
        return o
    }) : []
})

// 监听题目值变化
function handleUserValueChange(item, val) {
    item.user_value = val
    updateIsTest()
}

// 检查题目是否填写
function updateIsTest() {
    testpaper_question.value.forEach(item => {
        let t = false
        // 问答和填空
        if (item.type == 'answer' || item.type == 'completion') {
            t = !!item.user_value[0]
        }
        // 单选
        else if (item.type == 'radio' || item.type == 'trueOrfalse') {
            t = item.user_value != -1
        }
        // 多选
        else {
            t = item.user_value.length > 0
        }

        item.isTest = t
    })
}

// 滚动到指定位置
function scrollToDom(index) {
    const dom = document.getElementById("question_" + index)
    window.scrollTo(0, dom.offsetTop)
}

// 阻止切换其他页面
const disableBack = ref(true)
onBeforeRouteLeave((to, from, next) => {
    if (!disableBack.value) {
        next()
    } else {
        const { dialog } = createDiscreteApi(["dialog"])
        dialog.warning({
            content: "是否要放弃考试？",
            positiveText: "确定",
            negativeText: "取消",
            onPositiveClick() {
                disableBack.value = false
                navigateTo(to.fullPath || '/', { replace: true })
            }
        })

        next(false)
    }
})

// 交卷
const loading = ref(false)
async function submit() {
    const { message } = createDiscreteApi(["message"])
    let l = (testpaper_question.value.filter(v => !v.isTest)).length
    if (l > 0) {
        return message.warning("还有题目没有完成，请检查")
    }

    loading.value = true

    const {
        data: submitData,
        error: submitError
    } = await useSubmitTestApi({
        user_test_id: data.value.user_test_id,
        value: testpaper_question.value.map(o => o.user_value)
    })

    loading.value = false

    if (submitError.value) return

    // 跳转之前先把disableBack设为false
    disableBack.value = false
    message.success("交卷成功")
    navigateTo("/paper/1", { replace: true })

}

// 自动交卷
function autoSubmit() {
    const { dialog } = createDiscreteApi(["dialog"])
    //提交填写数据
    autoSubmitData()
    dialog.success({
        content: "考试时间到，试卷已强制提交",
        positiveText: "确认",
        closable: false,
        onPositiveClick() {

        }
    })
}
const autoSubmitData = async () => {
    const { message } = createDiscreteApi(["message"])
    loading.value = true
    const {
        data: submitData,
        error: submitError
    } = await useSubmitTestApi({
        user_test_id: data.value.user_test_id,
        value: testpaper_question.value.map(o => o.user_value)
    })
    loading.value = false
    if (submitError.value) return
    message.success("自动交卷成功")
    disableBack.value = false
    navigateTo("/paper/1", { replace: true })
}

definePageMeta({
    middleware: ["auth"]
})

</script>
