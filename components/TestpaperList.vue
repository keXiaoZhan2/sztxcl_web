<template>
    <section class="bg-white shadow p-5 mb-5 rounded">
        <div class="flex justify-between">
            <h4>{{ item.title }}</h4>
            <small class="text-xs text-rose-500">时长:{{ item.expire }}分钟</small>
        </div>
        <p class="py-5 text-sm text-gray-500">
            题目总数：{{ item.question_count }} 总分数：{{ item.total_score }} 及格分：{{ item.pass_score }}
        </p>
        <div class="flex justify-end">
            <n-button type="primary" @click="test()" :disabled="item.is_test">{{ item.is_test ? '考试结束' : '进入考试' }}</n-button>
        </div>
    </section>
</template>

<script setup>
import { NButton, createDiscreteApi } from "naive-ui";

const props = defineProps({
    item: Object
})
const test = () => {
    const { dialog } = createDiscreteApi(["dialog"])
    dialog.create({
        content: "是否要参与考试啦？",
        positiveText: "立即考试",
        negativeText: "取消",
        onPositiveClick: async () => {
            navigateTo(`/paper_test/${props.item.id}`)
        },
    });
}
</script>

