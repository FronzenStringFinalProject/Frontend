<script lang="ts" setup>

import {onMounted, ref} from "vue";
import {getWrongRecord, WrongRecordItem} from "@/apiRequest/child/childWrongRecord.ts";
import AuthorizeManager from "@/utils/authorize.ts";

const errorRecords = ref<WrongRecordItem[]>([])

const loadList = async () => {
  const resp = await getWrongRecord(AuthorizeManager.getToken())
  errorRecords.value=resp.expect()
}

onMounted(()=>{
  loadList()
})

</script>

<template>
  <v-list v-if="errorRecords">
    <v-list-item v-for="error in errorRecords" :key="`${error.qid}-${error.date}`">
      <v-list-item-title>{{error.quiz}}</v-list-item-title>
      <v-list-item-subtitle>{{error.group}}-{{error.date}}</v-list-item-subtitle>
    </v-list-item>
  </v-list>
  <v-progress-circular v-else indeterminate/>
</template>

<style scoped>

</style>