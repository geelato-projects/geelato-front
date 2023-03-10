import type {App, Plugin} from 'vue'
import ComponentMeta from "./entity/ComponentMeta";
import ComponentInstance from "./entity/ComponentInstance";
import ComponentMaterial from "./entity/ComponentMaterial";
import ComponentMaterialGroup from "./entity/ComponentMaterialGroup";
import {PropertySetterMetaImpl} from "./entity/IPropertySetterMeta";
import type IPropertySetterMeta from "./entity/IPropertySetterMeta";
import {ComponentSetterMetaImpl} from "./entity/ComponentSetterMeta";
import {PropertySetterBuilderMeta, PropertySetterSelectOption} from "./entity/PropertySetterBuilderMeta";
import {schema} from "./components/schema";

const component: Plugin = {
    install: function (app: App) {
        console.log('gl-ui-schema > install()', app)
    }
}
export {
    schema,
    ComponentMaterial,
    ComponentMaterialGroup,
    ComponentMeta,
    ComponentInstance,
    ComponentSetterMetaImpl,
    IPropertySetterMeta,
    PropertySetterMetaImpl,
    PropertySetterBuilderMeta,
    PropertySetterSelectOption,
}
// 默认导出组件
export default component
