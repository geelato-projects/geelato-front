<template>
  <div>
    <div class="gl-history-item" v-for="(item,index) in reverseItems">
      <span>{{ index + 1 }}. {{ item.type }}</span>
      <span style="float: right">{{ item.createAt }}</span>
    </div>
  </div>
</template>
<script setup lang="ts">
import {computed, ref} from "vue";
import {useHistoryStore} from "@geelato/gl-ide";
const historyStore = useHistoryStore()
const reverseItems = computed(()=>{
  return historyStore.steps.reverse()
})
</script>
<script lang="ts">
export default {
  name: "GlIdePluginCoreHistory"
}
</script>

<style>
.gl-history-item {
  padding: 0.2em;
}

.gl-history-item:hover {
  cursor: pointer;
  background-color: #e6e6e6;
}
</style>
