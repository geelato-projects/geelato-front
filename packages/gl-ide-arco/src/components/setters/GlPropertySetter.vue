<!--
  组件的属性配置器
-->
<template>
  <div class="GlPropertySetter gl-table-row"
       v-if="propertySetterMeta.setterComponentName!=='GlEmptySetter'&&propertySetterMeta.show!==false">
    <div class="gl-table-cell gl-label" style="position: relative;width: 7em"
         @dblclick.ctrl="tryClearProp(propertySetterMeta.name)" title="按住Ctrl，双击清除该属性，恢复初始状态">
      <template v-if="displayMode==='Collapse'">
        <GlIconfont type="gl-left-circle" style="cursor: pointer" v-if="propertySetterMeta.expanded!==false"
                    @click="propertySetterMeta.expanded=false"></GlIconfont>
        <GlIconfont type="gl-down-circle" style="cursor: pointer" v-if="propertySetterMeta.expanded===false"
                    @click="propertySetterMeta.expanded=true"></GlIconfont>
      </template>
      <span v-if="propertySetterMeta.description">
        <GlIconfont type="gl-info-circle" :title="propertySetterMeta.description"></GlIconfont>
      </span>
      <span>&nbsp;{{ propertySetterMeta.title }}</span>
    </div>
    <div class="gl-table-cell" v-if="propertySetterMeta.expanded!==false">
      <!-- 1 ========================type为props或默认为空========================-->
      <template v-if="propertySetterMeta.type==='props'||!propertySetterMeta.type">
        <!-- 1.1 ========================GlObjectArraySetter========================-->
        <template v-if="propertySetterMeta.setterComponentName==='GlObjectArraySetter'">
          <!--  若有子属性properties，则迭代子属性 -->
          <GlPropertySetterCard v-slot:default="slotProps" v-model="propertyModel"
                                :maxCount="propertySetterMeta.setterComponentProps.maxCount"
                                :titleField="propertySetterMeta.titleField"
                                :autoAddWhenEmpty="false"
                                :elementTemplate="createChildObjectTemplate()"
                                @selectedElement="selectChildElement"
          >
            <!-- 通过属性元数据，定义每张卡片的内容  -->
            <div class="gl-table" :class="{'gl-table-as-tree':false}">
              <template v-for="property in propertySetterMeta.properties">
                <GlPropertySetter v-if="propertyModel" :propertySetterMeta="property"
                                  :propertyValue="slotProps.item[property.name]"
                                  @update="($event:any)=>{slotProps.item[property.name]=$event}"></GlPropertySetter>
              </template>
            </div>
          </GlPropertySetterCard>

          <!--          <template v-if="propertySetterMeta.properties&&propertySetterMeta.properties.length>0">-->
          <!--            <div class="gl-table" :class="{'gl-table-as-tree':false}" style="margin: 1px;border: 1px solid #e4e4e4">-->
          <!--              <template v-for="property in propertySetterMeta.properties">-->
          <!--                <GlPropertySetter v-if="propertyModel" :propertySetterMeta="property"-->
          <!--                                  :propertyValue="propertyModel[property.name]"-->
          <!--                                  @update="onSubPropertyUpdate(property.name,$event)"></GlPropertySetter>-->
          <!--              </template>-->
          <!--            </div>-->
          <!--          </template>-->
        </template>
        <!-- 1.2 ========================GlJsonObjectSetter========================-->
        <template v-else-if="propertySetterMeta.setterComponentName==='GlSimpleObjectSetter'">
          <template v-if="propertySetterMeta.properties&&propertySetterMeta.properties.length>0">
            <div class="gl-table" :class="{'gl-table-as-tree':false}" style="margin: 1px;border: 1px solid #e4e4e4">
              <template v-for="subPropertySetterMeta in propertySetterMeta.properties">
                <GlPropertySetter v-if="propertyModel" :propertySetterMeta="subPropertySetterMeta"
                                  :propertyValue="propertyModel[subPropertySetterMeta.name]"
                                  @update="onSubPropertyUpdate(subPropertySetterMeta.name,$event)"></GlPropertySetter>
              </template>
            </div>
          </template>
        </template>
        <!-- 1.3 ========================其它Setter========================-->
        <!--        v-model:[propertySetterMeta.setterComponentVModelName]-->
        <component v-else :is="propertySetterMeta.setterComponentName"
                   v-model:[propertySetterMeta.setterComponentVModelName]="propertyModel"
                   v-bind="propertySetterMeta.setterComponentProps"
                   :style="propertySetterMeta.style"
                   :placeholder="propertySetterMeta.placeholder"
        >
        </component>
      </template>
      <!-- 2 ========================type为slots========================-->
      <template v-else-if="propertySetterMeta.type==='slots'">
        <component :is="propertySetterMeta.setterComponentName"
                   v-model:[propertySetterMeta.setterComponentVModelName]="propertyModel.props"
                   v-bind="propertySetterMeta.setterComponentProps"
                   :style="propertySetterMeta.style"
                   :placeholder="propertySetterMeta.placeholder"
        ></component>
      </template>
      <!-- 3 ========================type为children========================-->
      <template v-else-if="propertySetterMeta.type==='children'">
        <GlPropertySetterCard v-slot:default="slotProps" v-model="propertyModel"
                              :maxCount="propertySetterMeta.setterComponentProps.maxCount"
                              :titleField="propertySetterMeta.titleField"
                              :elementTemplate="createChildElementTemplate(propertySetterMeta.name,propertySetterMeta.setterComponentProps.ChildComponentName)"
                              @selectedElement="selectChildElement"
        >
          <!-- 通过属性元数据，定义每张卡片的内容  -->
          <div class="gl-table" :class="{'gl-table-as-tree':false}">
            <template v-for="property in propertySetterMeta.properties">
              <GlPropertySetter v-if="propertyModel" :propertySetterMeta="property"
                                :propertyValue="slotProps.item.props[property.name]"
                                @update="($event:any)=>{slotProps.item.props[property.name]=$event}"></GlPropertySetter>
            </template>
          </div>
        </GlPropertySetterCard>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  name: "GlPropertySetter"
}
</script>
<script setup lang="ts">
import {type PropType, reactive, ref, watch} from 'vue'
import type {PropertySetterMetaImpl} from "@geelato/gl-ui-schema";

const emits = defineEmits(['update'])
const props = defineProps({
  /**
   *  属性的配置展示模式
   */
  displayMode: String,
  propertySetterMeta: {
    type: Object as PropType<PropertySetterMetaImpl>,
    required: true
  },
  propertyValue: [String, Number, Boolean, Array, Object, Date, Function, Symbol]
})

const propertyModel = ref(props.propertyValue)

watch(() => {
  return propertyModel
}, (val, oval) => {
  console.log('update property', props.propertySetterMeta?.name, ' and set value as ', val)
  emits("update", val)
}, {deep: true})


const setPropertyModel = () => {
  // @ts-ignore
  propertyModel.value = props.propertyValue
  if (!propertyModel.value) {
    if (props.propertySetterMeta.type === 'slots') {
      // @ts-ignore
      propertyModel.value = {componentName: props.propertySetterMeta.slotComponentName, props: {}}
    } else {
      if (props.propertySetterMeta.properties && props.propertySetterMeta.properties.length > 0) {
        if (props.propertySetterMeta.type === 'children' || props.propertySetterMeta.setterComponentName === 'GlObjectArraySetter') {
          // @ts-ignore
          propertyModel.value = []
        } else {
          // @ts-ignore
          propertyModel.value = {}
        }
      }
    }
  }
  console.log('setPropertyModel>', props.propertySetterMeta, props.propertyValue, propertyModel.value)
}

setPropertyModel()

/**
 * 属性设置之后会影响原组件的默认值设置，可以该将改属性删除，需要时再添加
 * @param propertyName
 */
const tryClearProp = (propertyName: String) => {
  // delete props.propertyModel[propertyName]
}
const onSubPropertyUpdate = (name: String, value: any) => {
  console.log('onSubPropertyUpdate>', name, value)
  // TODO
  // @ts-ignore
  propertyModel.value[name] = value
}
/**
 * 用于创建子对象
 */
const createChildObjectTemplate = () => {
  return reactive({})
}
/**
 * 用于创建子组件
 * @param childName
 * @param childComponentName
 */
const createChildElementTemplate = (childName: String, childComponentName: String) => {
  return reactive({
    id: '',
    groupName: childName,
    componentName: childComponentName,
    props: {},
    slots: {},
    children: []
  })
}
const selectChildElement = () => {

}
</script>

<style>

.gl-table.gl-table-as-tree > .gl-table-row > .gl-table-cell.gl-label {
  padding-left: 1em;
  width: 100% !important;
  height: 32px;
  line-height: 32px;
  background-color: #FFF;
  font-weight: 700;
}

.gl-table.gl-table-as-tree > .gl-table-row > .gl-table-cell {
  height: auto;
  text-align: left;
  display: block;
}

.GlPropertySetter .ant-select {
  width: 100%
}

.GlPropertySetter .triangle-top-left {
  /*position: absolute;*/
  /*top: -8px;*/
  /*left: 10px;*/
  width: 0;
  height: 0;
  border-top: 100px solid red;
  border-right: 100px solid transparent;
}
</style>
