<script lang="ts" setup>

import {onMounted, ref} from "vue";
import {getWrongRecord, WrongRecordItem} from "@/apiRequest/child/childWrongRecord.ts";
import AuthorizeManager from "@/utils/authorize.ts";
import {getChildWrongRecord} from "@/apiRequest/parent/childManage/wrongRecord.ts";

const props = defineProps<{ cid?: number }>()

const errorRecords = ref<WrongRecordItem[]>([])

const loadList = async () => {
  let resp;
  if (props.cid) {
    resp = await getChildWrongRecord(AuthorizeManager.getToken(), props.cid)
  } else {
    resp = await getWrongRecord(AuthorizeManager.getToken())
  }
  errorRecords.value = resp.expect()
}

onMounted(() => {
  loadList()
})

</script>

<template>
  <v-list v-if="errorRecords" class="d-inline-flex justify-start text-justify flex-column w-100">
    <v-list-item v-for="error in errorRecords" :key="`${error.qid}-${error.date}`">
      <v-list-item-title>{{ error.quiz }}</v-list-item-title>
      <v-list-item-subtitle>{{ error.group }} | {{ error.date }}</v-list-item-subtitle>
    </v-list-item>
  </v-list>
  <v-progress-circular v-else indeterminate/>
</template>

<style scoped>

</style>