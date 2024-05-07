<script setup lang="ts">
import {ChildRank} from "@/apiRequest/child/childRank.ts";

const props = defineProps<{
  childRank:ChildRank,
  color?:string
}>()
</script>

<template>
  <v-list-item elevation="1" class="ma-3 rounded-lg" height="80"  >
    <template #prepend>
      <v-avatar :color="color?color:'primary'" size="60"  style="font-size: xx-large;align-content: center">{{childRank.name[0]}}</v-avatar>
      <v-divider vertical class="ms-4"></v-divider>
    </template>
    <template #title class="ma-3" >
      <strong class="font-weight-medium" style="font-size: xx-large;line-height: normal">{{childRank.name}}</strong>
    </template>
    <template #subtitle>累计积分：{{childRank.value}} | 超过{{Math.round(childRank.rank_range * 10000)/100}}%的用户</template>
    <template #append class="h-100">

      <v-divider vertical class="me-4"></v-divider>
      第 {{childRank.rank}} 名
    </template>
  </v-list-item>
</template>

<style scoped>

</style>