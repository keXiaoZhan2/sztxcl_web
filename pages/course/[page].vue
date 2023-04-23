<template>
    <LoadingGroup :pending="pending" :error="error" :is-empty="rows.length === 0">
        <template #loading>
            <LoadingCourseSkeleton />
        </template>
        <n-grid :x-gap="20" :cols="4">
            <n-gi v-for="(item, index) in rows" :key="index">
                <ClientOnly>
                    <VideoList :item="item" />
                </ClientOnly>
            </n-gi>
        </n-grid>
        <div class="flex justify-center items-center mt-5 mb-10">
            <n-pagination size="large" :page="page" :item-count="total" :page-size="limit"
                :on-update:page="handlePageChange" />
        </div>
    </LoadingGroup>
</template>

<script setup>
import { NGrid, NGi, NPagination } from 'naive-ui'
const route = useRoute()
const {
    page,
    limit,
    total,
    handlePageChange,
    rows,
    pending,
    error,
    refresh
} = await usePage(({ page, limit }) => {
    return useListApi("video", {
        page,
        limit
    })
})
</script>

<style>

</style>