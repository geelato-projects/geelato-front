<template>
  <div class="gl-ide-sidebar-components gl-scrollbar-small">
    <div v-for="componentMaterialGroup in componentMaterialGroups">
      <div class="gl-group-title" @click="componentMaterialGroup.opened=!componentMaterialGroup.opened"
           style="border-bottom: 1px solid #04559f;width: 90%">
        <span>{{ componentMaterialGroup.text }} {{ toUpperCase(componentMaterialGroup.name) }}</span>
        <span class="gl-tag">{{ componentMaterialGroup.items?.length }}</span>
      </div>
      <div class="gl-group-cards" v-if="componentMaterialGroup.opened">
          <gl-draggable
              v-model="componentMaterialGroup.items"
              handle=".gl-dnd-item-template-handle"
              :group="{ name: 'layoutItems', pull: 'clone', put: false }"
              ghostClass="ghost"
              :sort="false"
              :clone="($event:any)=>getCloneItem($event,componentMaterialGroup.items)"
              @start="drag=true"
              @end="drag=false"
              @change="onChange"
              @choose="($event:any)=>onChoose($event,componentMaterialGroup.items)"
              itemKey="id"
          >
            <template #item="{element}">
              <div class="gl-card"
                   :class="{'gl-dnd-item-template-handle':element.meta.properties?.length>0}"
                   :style="{'cursor':element.meta.properties?.length>0?'move':''}"
                   @mousedown="onStartNodeDrag($event,element)">
                <div class="gl-image">
                  <GlIconfont :type="element.iconType"
                              :iconStyle="{fontSize:'3em',color:(element.meta.properties?.length>0?'#1890ff':'#e7e7e7')}"></GlIconfont>
                </div>
                <div class="gl-title">{{ element.title }}</div>
              </div>
            </template>
          </gl-draggable>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
export default {
  name: 'GlIdePluginCoreComponents'
}
</script>

<script setup lang="ts">
import {type PropType, ref} from "vue";
import {useIdeStore} from "@geelato/gl-ide";
import {utils} from "@geelato/gl-ui";
import  {type ComponentMaterial,ComponentMaterialGroup,type ComponentInstance} from "@geelato/gl-ui-schema";
import {useComponentMaterialStore} from "@geelato/gl-ui-schema-arco";
const props = defineProps({
  componentGroups: {
    type: Array as PropType<Array<ComponentMaterialGroup>>,
    default() {
      return [
        {name: 'general', text: '??????', opened: true},
        {name: 'layout', text: '??????', opened: true},
        {name: 'navigation', text: '??????', opened: false},
        {name: 'dataEntry', text: '????????????', opened: false},
        {name: 'dataDisplay', text: '????????????', opened: true},
        {name: 'feedback', text: '??????', opened: true},
        {name: 'chart', text: '??????', opened: true},
        {name: 'other', text: '??????', opened: true}]
    }
  }
})

const ideStore = useIdeStore()
const componentMaterialStore = useComponentMaterialStore()
componentMaterialStore.initRegisterComponentMetas()
const drag = ref(false)
const chooseIndex = ref(-1)


const toUpperCase = (str: String) => {
  return str[0].toUpperCase() + str.substring(1)
}

const onChoose = (event: any, fromItems: Array<ComponentMaterial>) => {
  chooseIndex.value = event.oldIndex
  const item = JSON.parse(JSON.stringify(fromItems[chooseIndex.value].instance))
}
const onChange = () => {
}
const componentMaterialGroups = ref(new Array<ComponentMaterialGroup>())

const resetComponentMaterialGroups = () => {
  componentMaterialGroups.value = []
  for (let index in props.componentGroups) {
    const componentMaterialItems = componentMaterialStore.componentMaterials.filter((compoentMaterial:ComponentMaterial)=>{
      return compoentMaterial.group === props.componentGroups[index].name
    })
    const componentMaterialGroup = new ComponentMaterialGroup()
    componentMaterialGroup.name = props.componentGroups[index].name
    componentMaterialGroup.text = props.componentGroups[index].text
    componentMaterialGroup.opened = props.componentGroups[index].opened
    componentMaterialGroup.items = componentMaterialItems
    componentMaterialGroups.value.push(componentMaterialGroup)
  }
}
resetComponentMaterialGroups()
const onStartNodeDrag = (e: MouseEvent, element: Object) => {
  // this.$gl.bus.$emit('GlPluginCore_onStartNodeDrag', {e: e, element: element})
}

/**
 * ??????????????????
 * @param event clone??????
 * @param fromItems clone???????????????????????????
 */
const getCloneItem = (event: any, fromItems: Array<ComponentMaterial>) => {
  const item = JSON.parse(JSON.stringify(fromItems[chooseIndex.value].instance))

  // ??????id
  function generateId(item: ComponentInstance) {
    // @ts-ignore
    let alias = ideStore.componentAlias[item.componentName]
    if (!alias) {
      console.warn('??????[', item.componentName, ']???????????????????????????????????????????????????????????????id???')
    }
    item.id = utils.gid(alias || '')
    // console.log('gl-runtime > gl-x > clone > generateId > new id:', item.id, 'for', item.componentName)
    if (item.children && item.children.length > 0) {
      for (let i in item.children) {
        item.children[i] = generateId(item.children[i])
        // console.log('gl-runtime > gl-x > clone > child item:', item.children[i])
      }
    }
    console.log('gl-runtime > gl-x > getCloneItem return', item)
    // console.log(JSON.stringify(item))
    return item
  }

  let result = generateId(item)
  // console.log('gl-runtime > gl-x > clone > return', result)
  return result
}


resetComponentMaterialGroups()
</script>

<style>
</style>