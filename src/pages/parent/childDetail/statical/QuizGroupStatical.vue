<script setup lang="ts">

import StaticalChart from "@/components/StaticalChart.vue";
import {getChildQuizGroupStatical, QuizGroupStaticalItem} from "@/apiRequest/parent/childManage/childStatical.ts";
import AuthorizeManager from "@/utils/authorize.ts";
import {ChartInputItem} from "@/utils/chartInput.ts";

const props = defineProps<{cid:number}>()

const getQuizGroupStatical = async () => {
  console.log("loading")
  const resp = await getChildQuizGroupStatical(AuthorizeManager.getToken(), props.cid)
  return resp.expect().map<ChartInputItem>((data: QuizGroupStaticalItem) => {
    return {
      columnName: data.quiz_ty,
      correctRate: data.correct_rate,
      total: data.total,
      correctNumber: data.correct,
      wrongNumber: data.wrong
    }
  })
}

</script>

<template>
  <statical-chart :fetch-statical="getQuizGroupStatical" title="各题型正确率"/>
</template>

<style scoped>

</style>