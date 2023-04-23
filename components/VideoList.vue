<template>
    <n-card class="cursor-pointer mb-5 shadow-md !border-0" content-style="padding:0;" footer-style="padding:0;"
        @click="open">
        <template #cover>
            <ClientOnly>
                <UiImage :src="item.cover" class="w-[100%] h-[150px]" />
            </ClientOnly>
        </template>
        <div class="p-2 pb-0">
            <div class="ellipse line-clamp-1" style="font-weight: 660;">{{ item.name }}</div>
        </div>
        <div class="pl-2 pr-2 pb-3 flex items-center overflow-hidden">
            <n-icon>
                <HappyOutline></HappyOutline>
            </n-icon>
            <span>
                {{ item.count }}
            </span>
            <n-icon class="ml-2">
                <TimeOutline></TimeOutline>
            </n-icon>
            <span>
                {{ formatTime(item.createdAt) }}
            </span>
        </div>
    </n-card>
</template>
<script setup>
import {
    NCard,
    NIcon
} from "naive-ui"
import { 
    TimeOutline,
    HappyOutline
} from '@vicons/ionicons5'
const props = defineProps({
    item: Object
})
const open = async () => {
    let path = `/course/detail/${props.item.id}`
    //更新观看次数
    await useUpdateWatchCount(props.item.id)
    navigateTo(path)
}
const formatTime = (time) => {
    return time
}
</script>

<style>
.ellipse {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
</style>
