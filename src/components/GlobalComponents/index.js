
import Vue from 'vue'
function registerAllComponents(requireContext) {
    return requireContext.keys().forEach(comp => {
        const vueComp = requireContext(comp)
        // console.log(vueComp)
        const compName = vueComp.default.name ? vueComp.default.name.toLowerCase() : /\/([\w-] +)\.vue$/.exec(comp)
        Vue.component(compName, vueComp.default)
    })
}

registerAllComponents(require.context('./', false, /\.vue$/))
//组件全局引入
