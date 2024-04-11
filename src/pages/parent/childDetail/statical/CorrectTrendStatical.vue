<script setup lang="ts">

import StaticalChart from "@/components/StaticalChart.vue";
import {
  getChildCorrectTrendStatical,
  ResentCorrectStaticalItem
} from "@/apiRequest/parent/childManage/childStatical.ts";
import AuthorizeManager from "@/utils/authorize.ts";
import {ChartInputItem} from "@/utils/chartInput.ts";
const props = defineProps<{cid:number}>()
const getCorrectRateStatical = async () => {
  const resp = await getChildCorrectTrendStatical(AuthorizeManager.getToken(), props.cid)
  return resp.expect().map<ChartInputItem>((data: ResentCorrectStaticalItem) => {
    return {
      columnName: data.date,
      correctRate: data.correct_rate,
      total: data.total,
      correctNumber: data.correct,
      wrongNumber: data.wrong
    }
  })
}

</script>

<template>
  <statical-chart :fetch-statical="getCorrectRateStatical" title="近期正确率变化"/>
</template>

<style scoped>

</style>