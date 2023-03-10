import type {App,Plugin} from 'vue'
import {GlPlugin, Panel,useIdeStore} from '@geelato/gl-ide'
import GlIdePluginCoreComponents from './components/sidebar/Components.vue'
import GlIdePluginCoreAppTree from './components/sidebar/AppTree.vue'
import GlComponentTree from './components/sidebar/ComponentTree.vue'
//import GlIdePluginCorePanelLayout from './components/sidebar/Layout.vue'
import GlIdePluginCoreHistory from './components/sidebar/History.vue'
import GlIdePluginCoreStageFreePage from './components/stage/FreePage.vue'
import GlComponentBuilder from "./components/builder/GlComponentBuilder.vue";
import GlComponentSetter from "./components/setters/GlComponentSetter.vue";
import GlComponentPropertiesSetter from "./components/setters/GlComponentPropertiesSetter.vue";
import GlComponentStyleSetter from "./components/setters/GlComponentStyleSetter.vue";
import GlComponentActionsSetter from "./components/setters/GlComponentActionsSetter.vue";
import GlSimpleObjectSetter from "./components/setters/property-setters/GlSimpleObjectSetter.vue";
import GlPropertySetter from './components/setters/GlPropertySetter.vue'
import GlPropertySetterCard from './components/setters/GlPropertySetterCard.vue'
import GlIconfontSetter from "./components/setters/property-setters/GlIconfontSetter.vue";
import GlIconfontSetterForSlot from "./components/setters/property-setters/GlIconfontSetterForSlot.vue";
import GlHtmlSetter from "./components/setters/property-setters/GlHtmlSetter.vue";
import GlSelectSetter from "./components/setters/property-setters/GlSelectSetter.vue";
import GlRadioGroupSetter from "./components/setters/property-setters/GlRadioGroupSetter.vue";
import GlFieldSelect from "./components/setters/property-setters/GlFieldSelect.vue";
import GlEntitySelect from "./components/setters/property-setters/GlEntitySelect.vue";
import GlComponentSelect from "./components/setters/property-setters/GlComponentSelect.vue";
import GlEntityReaderSetter from "./components/setters/property-setters/entity-reader-setter/GlEntityReaderSetter.vue";
import GlToolbarBreadcrumbs from './components/gl-toolbar-breadcrumbs/Index.vue'
import GlX from './components/gl-x/GlX.vue'
import GlComponentRecursion from './components/gl-component-recursion/ComponentRecursion.vue'
import "./assets/style.css"

const plugin = new GlPlugin('gl-plugin-arco')

plugin.sidebar.push(new Panel({
    title: '????????????',
    name: '????????????',
    iconType: 'gl-tree',
    componentName: GlIdePluginCoreAppTree.name
}))
plugin.sidebar.push(new Panel({
    title: '??????',
    name: 'components',
    iconType: 'gl-component',
    componentName: 'GlIdePluginCoreComponents'
}))

plugin.sidebar.push(new Panel({
    title: '????????????',
    name: '????????????',
    iconType: 'gl-tree-structure',
    componentName: GlComponentTree.name
}))

plugin.sidebar.push(new Panel({
    title: '????????????',
    name: '????????????',
    iconType: 'gl-history',
    componentName: GlIdePluginCoreHistory.name
}))


plugin.stage.push(new Panel({
    title: '??????',
    name: 'freePage',
    iconType: 'LayoutOutlined',
    componentName: GlIdePluginCoreStageFreePage.name
}))


plugin.stage.push(new Panel({
    title: '??????',
    name: 'Page',
    iconType: 'LayoutOutlined',
    componentName: GlIdePluginCoreStageFreePage.name
}))



// plugin.setter.push(new Panel({
//     title: '??????',
//     name: '??????',
//     iconType: 'LayoutOutlined',
//     componentName: GlIdePluginCoreSettingProperties.name
// }))
//
// plugin.setter.push(new Panel({
//     title: '??????',
//     name: '??????',
//     iconType: 'LayoutOutlined',
//     componentName: GlIdePluginCoreSettingStyle.name
// }))

const component: Plugin = {
    install: function (app: App) {
        // ????????????
        // if (!app.config.globalProperties.$ide) {
        //     console.error('?????????????????????GlIde??????.')
        //     return
        // }

        // ????????????
        app.component('GlIdePluginCoreComponents', GlIdePluginCoreComponents)
        app.component(GlComponentTree.name, GlComponentTree)
        app.component(GlIdePluginCoreAppTree.name, GlIdePluginCoreAppTree)
        app.component(GlIdePluginCoreHistory.name, GlIdePluginCoreHistory)
        // app.component(GlIdePluginCorePanelLayout.name, GlIdePluginCorePanelLayout)
        app.component(GlIdePluginCoreStageFreePage.name, GlIdePluginCoreStageFreePage)
        // app.component(GlIdePluginCoreSettingProperties.name, GlIdePluginCoreSettingProperties)
        // app.component(GlIdePluginCoreSettingStyle.name, GlIdePluginCoreSettingStyle)
        app.component(GlToolbarBreadcrumbs.name, GlToolbarBreadcrumbs)
        app.component(GlX.name, GlX)
        app.component(GlComponentRecursion.name, GlComponentRecursion)
        // app.config.globalProperties.$ide.usePlugin(plugin)

        // ?????????????????????
        app.component(GlComponentBuilder.name, GlComponentBuilder)
        // ????????????????????????
        app.component('GlComponentSetter', GlComponentSetter)
        app.component(GlComponentPropertiesSetter.name, GlComponentPropertiesSetter)
        app.component(GlComponentStyleSetter.name, GlComponentStyleSetter)
        app.component(GlComponentActionsSetter.name, GlComponentActionsSetter)
        app.component(GlSimpleObjectSetter.name, GlSimpleObjectSetter)
        // app.component(GlSettingOptions.name, GlSettingOptions)
        // app.component(GlSettingProperty.name, GlSettingProperty)
        app.component(GlPropertySetter.name, GlPropertySetter)
        app.component(GlPropertySetterCard.name, GlPropertySetterCard)
        app.component('GlIconfontSetter',GlIconfontSetter)
        app.component(GlIconfontSetterForSlot.name, GlIconfontSetterForSlot)
        app.component(GlSelectSetter.name, GlSelectSetter)
        app.component('GlEntitySelect',GlEntitySelect)
        app.component('GlFieldSelect',GlFieldSelect)
        app.component('GlComponentSelect',GlComponentSelect)
        app.component(GlEntityReaderSetter.name,GlEntityReaderSetter)
        app.component(GlRadioGroupSetter.name, GlRadioGroupSetter)
        app.component(GlHtmlSetter.name,GlHtmlSetter)

        // ?????????????????????
        // ide.componentMetaManager.registerManyComponentRuntimeMeta(componentMeta.runtimeMeta)
        // ide.componentMetaManager.registerManyComponentDesignMeta(componentMeta.designMeta)

        // ????????????
        app.config.globalProperties.$gl.alias[GlX.name] = 'glx'
        app.config.globalProperties.$gl.alias[GlToolbarBreadcrumbs.name] = 'crumbs'

        // ????????????
        // useIdeStore().usePlugin(plugin)
    }
}

// ??????????????????
export default component
export {plugin}
