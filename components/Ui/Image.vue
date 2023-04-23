<template>
    <img :src="src" v-bind="$attrs" @error="handleImageError" :style="{ 'object-fit':objectFit }"/>
</template>
<script setup>
defineProps({
    src:String,
    objectFit:{
        type:String,
        default:"cover"
    }
})
//更换图片为错误图片地址
const handleImageError = (e)=>{
    e.target.src = "/fail.png"
}
</script>