<template>
    <div class="body">
        <NavBar/>
        <main class="container ">
            <!-- pages中页面渲染位置 -->
            <slot/>
        </main>
        <PageFooter/>
    </div>
</template>
<style>
.body {
    min-width: 1000px;
    @apply bg-gray-100 flex flex-col min-h-screen;
}
</style>
