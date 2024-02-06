<script setup lang="ts">
import  "vue";
import {Component as ComponentType} from "vue";

const props = defineProps<{
  icon:ComponentType,
  text:string,
  onClick:()=>void
}>()

</script>

<template>
<v-btn style="height: fit-content ;width: fit-content" @click="props.onClick()">
<v-col class="">
  <component :is="props.icon" width="150" height="150"/>
  <p>{{props.text}}</p>
</v-col>
</v-btn>
</template>

<style scoped>
p {
  font-family: '黑体', system-ui;
  font-size: 2.55vh;
  font-weight: 900;
}
</style>