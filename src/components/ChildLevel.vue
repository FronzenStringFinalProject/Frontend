<script lang="ts" setup>
import {onMounted, ref, watch} from "vue";
import {getChildLevelInfo} from "@/apiRequest/child/childLevel.ts";
import AuthorizeManager from "@/utils/authorize.ts";

const childLevel = ref(0)
const childExp = ref(0)
const progress = ref(0)
const ExpReq = 1000
watch(childExp, (value) => {
  progress.value = 100 * (value / ExpReq)
  console.log(progress.value)
})
onMounted(() => {
  getChildLevelInfo(AuthorizeManager.getToken()).then((data) => {
    console.log(data)
    const payload = data.body
    childLevel.value = payload.level
    childExp.value = payload.level_score
  })
})

watch(childExp, (value) => {
  progress.value = 100 * (value / ExpReq)
  console.log(progress.value)
})
</script>

<template>
  <v-row :dense="true" class="w-100" style="width: 100%">
    <strong class="ma-5">Lv:{{ childLevel }}</strong>
    <v-progress-linear v-model="progress"
                       color="light-blue"
                       height="30"
                       rounded striped

    >
      <template #default>
        <strong>

          {{ childExp }} / {{ ExpReq }}
        </strong>
      </template>
    </v-progress-linear>
  </v-row>
</template>

<style scoped>

</style>