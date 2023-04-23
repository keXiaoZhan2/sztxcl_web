<template>
    <div id="aplayer"></div>
</template>
<script setup>
    let ap = ref(null)
    const props = defineProps({
        title:String,
        cover:String,
        url:String
    })
    onMounted(() => {
        ap.value = new APlayer({
            container: document.getElementById('aplayer'),
            audio: [{
                name: props.title,
                artist: '数字图像处理',
                url: props.url,
                cover: props.cover
            }]
        });
    })

    onBeforeUnmount(()=>ap.value.destroy())
</script>