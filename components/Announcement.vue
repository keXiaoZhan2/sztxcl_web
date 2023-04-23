<template>
    <ClientOnly>
        <span class="text-lg"> 公告栏 </span>
        <n-carousel class="mb-6 mt-4"  :interval="5000" :autoplay="true" :slides-per-view="3" :space-between="20" :loop="true" draggable :show-dots="false">
            <n-thing class="p-3 mb-3 border-5 border-slate-400 rounded-3xl h-50 max-h-50 overflow-auto"
                v-for="(item, index) in data" :key="item.id">
                <template #header>
                    {{ item.title }}
                </template>
                {{ item.text }}
            </n-thing>
        </n-carousel>
    </ClientOnly>
</template>

<script setup>
import { NCarousel, NThing } from 'naive-ui'
const {
    data,
    pending,
    error
} = await useGetPublishedApi()
</script>