<template>
  <div class="gl-base-tree">
    <ATree v-if="treeData&&treeData.length>0" blockNode
           :data="treeData"
           :draggable="true"
           :selectedKeys="selectedKeys"
           @select="onSelect" show-line>
      <template #switcher-icon="node, { isLeaf }">
        <GlIconfont :type="node.iconType" style="font-size: 1.2em;color:#3370ff"></GlIconfont>
      </template>
      <template #extra="nodeData">
        <a-trigger ref="contextMenu" position="tl" auto-fit-position :click-to-close="true" :show-arrow="true"
                   @popupVisibleChange="()=>onShowContextMenu(nodeData)">
            <span class="gl-more" style="position: absolute; right: 16px; color: #3370ff;">
              <GlIconfont type="gl-more"></GlIconfont>
            </span>
          <template #content>
            <div style="border:1px solid rgb(231,231,231)">
              <a-menu :style="{ width: '180px', height: '100%' }" :default-open-keys="['0']"
                      :default-selected-keys="['0_2']"
                      breakpoint="xl">
                <a-menu-item class="gl-context-menu-item"
                             v-for="(contextMenuItem,contextMenuItemIndex) in filterContextMenuData"
                             :key="contextMenuItemIndex"
                             @click="() => onMenuItemClick(nodeData,contextMenuItem)">
                  <template #icon>
                    <GlIconfont :type="contextMenuItem.iconType"
                                :style="{color:contextMenuItem.iconColor}"></GlIconfont>
                  </template>
                  {{ contextMenuItem.title }}
                </a-menu-item>
              </a-menu>
            </div>
          </template>
        </a-trigger>
      </template>

    </ATree>
    <a-modal :visible="currentAction&&['addNode','renameNode'].includes(currentAction.action)" @ok="saveNode"
             @cancel="closeModal">
      <template #title>
        {{ currentAction.title }}
      </template>
      <div>
        <a-input v-model="currentEditNodeData.title" @keyup.enter="saveNode"></a-input>
      </div>
    </a-modal>
  </div>
</template>
<script lang="ts">
export default {
  name: "GlEntityTree",
};
</script>
<script setup lang="ts">
import {entityApi, utils, Utils,} from "@geelato/gl-ui";
import {PropType, ref} from "vue";

const props = defineProps({
  treeId: {
    type: [String, Number],
    required: true
  },
  contextMenuData: {
    type: Array as PropType<Array<ContextMenuDataType>>,
    default() {
      return [
        {title: '????????????', iconType: 'gl-folder', nodeType: 'folder', useFor: ['folder'], action: 'addNode'},
        {title: '??????????????????', iconType: 'gl-file', nodeType: 'freePage', useFor: ['folder'], action: 'addNode'},
        {title: '??????????????????', iconType: 'gl-form', nodeType: 'formPage', useFor: ['folder'], action: 'addNode'},
        {title: '??????????????????', iconType: 'gl-list', nodeType: 'listPage', useFor: ['folder'], action: 'addNode'},
        {
          title: '???????????????',
          iconType: 'gl-menu',
          nodeType: '*',
          useFor: ['folder', 'freePage', 'formPage', 'listPage'],
          action: 'updateNode',
          updateNode: {type: 'menuItem'}
        },
        {
          title: '?????????',
          iconType: 'gl-edit-square',
          nodeType: 'freePage',
          useFor: ['folder', 'freePage', 'formPage', 'listPage'],
          action: 'renameNode'
        },
        {
          title: '??????',
          iconType: 'gl-delete',
          iconColor: '#cc3636',
          nodeType: 'freePage',
          useFor: ['folder', 'freePage', 'formPage', 'listPage'],
          action: 'deleteNode'
        }
      ]
    }
  },
  loadTreeData: {
    type: Function
  },
  // ??????node??????????????????
  addNode: {
    type: Function
  },
  // ??????node??????????????????
  deleteNode: {
    type: Function
  },
  // ?????????node??????????????????
  renameNode: {
    type: Function
  }
})
// ??????????????????contextMenuitem click????????????clickContextMenuItem????????????????????????addNode?????????????????????addNode?????????
// selectNode:????????????????????????a-tree???select???????????????
const emits = defineEmits(['selectNode', 'addNode', 'updateNode', 'renameNode', 'deleteNode', 'clickContextMenuItem'])
const selectedKeys = ref([])
const treeData = ref(new Array<any>())
const contextMenu = ref()
const currentClickedNodeData = ref({})
const currentEditNodeData = ref({})
const currentAction = ref({action: '', title: ''})

type ContextMenuDataType = { title: String, iconType: String, iconColor?: String, nodeType: String, useFor: Array<String>, action: String, actionParams?: Object }

const refreshTree = () => {
  treeData.value = [...treeData.value]
}

const defaultTreeData = [
  {
    title: '?????????',
    key: '0-0',
    nodeType: 'folder',
    children: [],
  }
];

const dragRules = [{type: 'allow', from: '*', to: 'folder'}]

const filterContextMenuData = ref(new Array<ContextMenuDataType>())
const onShowContextMenu = (clickedNodeData: any) => {
  filterContextMenuData.value = props.contextMenuData.filter((item: ContextMenuDataType) => {
    return item.useFor.includes(clickedNodeData.nodeType)
  })
}

/**
 * ?????????????????????????????????????????????????????????????????????????????????
 * @param clickedNodeData
 * @param contextMenuItemData
 */
const onMenuItemClick = (clickedNodeData: any, contextMenuItemData: ContextMenuDataType) => {
  console.log('onMenuItemClick:', clickedNodeData)
  currentClickedNodeData.value = clickedNodeData
  if (contextMenuItemData.action === 'addNode') {
    currentEditNodeData.value = {
      title: contextMenuItemData.title,
      iconType: contextMenuItemData.iconType,
      nodeType: contextMenuItemData.nodeType
    }
    currentAction.value = {action: 'addNode', title: '????????????'}
  } else if (contextMenuItemData.action === 'renameNode') {
    currentEditNodeData.value = JSON.parse(JSON.stringify(clickedNodeData))
    currentAction.value = {action: 'renameNode', title: '????????????'}
  } else if (contextMenuItemData.action === 'updateNode') {
    currentEditNodeData.value = JSON.parse(JSON.stringify(clickedNodeData))
    currentAction.value = {action: 'updateNode', title: '????????????'}
    // updateNode(currentClickedNodeData.value,)
  } else if (contextMenuItemData.action === 'deleteNode') {
    currentAction.value = {action: 'deleteNode', title: '????????????'}
    console.log('currentAction deleteNode', clickedNodeData)
    deleteNode(currentClickedNodeData.value)
  } else {
    // custom click event
  }
  // ????????????????????????????????????
  emits('clickContextMenuItem', {clickedNodeData, contextMenuItemData})
}

/**
 *  ????????????????????????????????????????????????????????????????????????????????????????????????saveNode??????
 */
const saveNode = () => {
  console.log('saveNode', currentEditNodeData)
  // @ts-ignore
  if (currentEditNodeData.value.key) {
    // ??????
    renameNode(currentClickedNodeData.value, currentEditNodeData.value)
  } else {
    // ??????
    addNode(currentClickedNodeData.value, currentEditNodeData.value)
  }
  currentAction.value = {action: '', title: ''}
}

const renameNode = (clickedNodeData: any, editNodeData: any) => {
  clickedNodeData.title = editNodeData.title
  const params = {clickedNodeData, editNodeData: editNodeData}
  if (props.renameNode) {
    props.renameNode(params).then((res: any) => {
      refreshTree()
      emits('renameNode', params)
    })
  } else {
    emits('renameNode', params)
  }
}

const updateNode = (clickedNodeData: any, editNodeData: any) => {

}
const addNode = (clickedNodeData: any, addNodeData: any) => {
  const children = clickedNodeData.children || []
  const node = JSON.parse(JSON.stringify(addNodeData))
  node.treeId = props.treeId
  console.log('addNode:', node)
  const params = {clickedNodeData, addNodeData: node}
  if (props.addNode) {
    props.addNode(params).then((res: any) => {
      // console.log('res:',res.data)
      // ?????????????????????id??????key
      node.key = res.data.data
      children.push(node)
      clickedNodeData.children = children
      refreshTree()
      selectNode(node)
      emits('addNode', params)
    })
  } else {
    emits('addNode', params)
  }
}

const deleteNode = (clickedNodeData: any) => {
  const params = {clickedNodeData}
  if (props.deleteNode) {
    props.deleteNode(params).then((res: any) => {
      console.log('delete node from remote and return res:', res)
      reloadTreeData()
    })
  }
  emits('deleteNode', params)
}


/**
 *  ???????????????????????????????????????????????????????????????????????????
 *  ?????????selectNode???????????????????????????????????????
 */
const selectNode = (node:any) => {
  // ????????????????????????
  selectedKeys.value = []
  // @ts-ignore
  selectedKeys.value.push(node.key)
  emits('selectNode', {selectedNode:node})
}

const onSelect = (selectedKeys: any, data: any) => {
  console.log('onSelect', selectedKeys, data.node)
  selectNode(data.node)
}


const closeModal = () => {
  currentAction.value = {action: '', title: ''}
}

const reloadTreeData = () => {
  if (props.loadTreeData) {
    props.loadTreeData().then((res: any) => {
      console.log('platform_tree_node:', res)
      treeData.value = []
      treeData.value.push(...Utils.ConvertUtil.listToTree(res.data.result || res.data.data, props.treeId, 'key'))
      console.log('treeData', treeData)
    })
  }
}
// ???????????????
reloadTreeData()
// ??????????????????
// defineExpose(['reloadTreeData'])
</script>
<style>
.gl-base-tree .arco-tree-node-drag-icon {
  display: none !important;
}

.gl-base-tree .gl-more {
  /*display: none;*/
}

.gl-base-tree:hover .gl-more {
  display: inline-block;
}

.gl-context-menu-item {
  line-height: 2em !important;
  /*padding: 0 !important;*/
  /*margin: 0 !important;*/
}
</style>
