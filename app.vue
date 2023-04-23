<!-- nuxt3提供了一个页面过度组件Transitions https://nuxt.com/docs/getting-started/transitions -->
<template>
  <!-- 配置navie ui全局化配置主要是因为：如果你需要 SSR，或者想让开发者工具看起来更干净，可以打开 inline-theme-disabled 属性。 https://www.naiveui.com/zh-CN/os-theme/components/config-provider -->
  <NConfigProvider inline-theme-disabled>
    <!--NuxtLayout 默认加载 default -->
    <NuxtLayout>
      <!-- NuxtPage默认加载pages下的index页面 -->
      <NuxtPage />
    </NuxtLayout>
  </NConfigProvider>
</template>
<script setup>
import {
  NConfigProvider
} from "naive-ui"
</script>