export default {
    scrollBehavior (to, from, savedPosition) {
        // 在按下 后退/前进 按钮时。就会像浏览器的原生表现那样自动返回原来的位置
        if(savedPosition){
            return savedPosition
        }
        //返回顶部
        return {
            top:0
        }
    }
}