import {inBrowser} from 'vitepress';
import DefaultTheme from 'vitepress/theme'
import draggable from 'vuedraggable'
import GlUi from '@geelato/gl-ui'
import {entityApi} from "@geelato/gl-ui";
import GlUiArco from '@geelato/gl-ui-arco'
import GlUiSchemaCore from '@geelato/gl-ui-schema'
import GlUiSchemaArco,{useComponentMaterialStore} from '@geelato/gl-ui-schema-arco'
import GlIde,{useIdeStore}  from '@geelato/gl-ide'
import GlIdeArco from '@geelato/gl-ide-arco'
import ComponentBuilderExample from '../components/setter/ComponentBuilderExample.vue'
import SetterExample from '../components/setter/SetterExample.vue'
// import i18n from '../locale/index';
import {createPinia} from "pinia";
import ArcoVue from '@arco-design/web-vue';
import '@arco-design/web-vue/dist/arco.css';
import './custom.css'
import {createI18n} from "vue-i18n";
import en from "../locale/en-US";
import cn from "../locale/zh-CN";

export default {
    ...DefaultTheme,
    // root component to wrap each page
    // Layout,

    // this is a Vue 3 functional component
    NotFound: () => 'custom 404',

    enhanceApp({app, router, siteData}) {
        app.component('gl-draggable', draggable)
        app.component('ComponentBuilderExample', ComponentBuilderExample)
        app.component('SetterExample', SetterExample)

        // app is the Vue 3 app instance from `createApp()`.
        // router is VitePress' custom router. `siteData` is
        // a `ref` of current site-level metadata.
        app.use(createPinia())
        if (inBrowser) {
            const i18n = createI18n({
                locale: localStorage.getItem('arco-locale') || 'zh-CN',
                fallbackLocale: 'en-US',
                allowComposition: true,
                messages: {
                    'en-US': en,
                    'zh-CN': cn,
                },
            });
            app.use(i18n)
            const componentMaterialStore = useComponentMaterialStore()
            componentMaterialStore.init()
            const ideStore = useIdeStore()
            ideStore.addComponentMetas(componentMaterialStore.componentMetas)
        }
        app.use(ArcoVue)
        app.use(GlUi)
        entityApi.reCreate({baseURL:"https://localhost:8080"})
        app.use(GlUiArco)
        app.use(GlUiSchemaCore)
        app.use(GlUiSchemaArco)
        // app.use(GlIde)
        app.use(GlIdeArco)

        // 需要在调用时手动传入 AppContext，或者为组件全局指定 AppContext
        // Modal._context = app._context;
    },
}