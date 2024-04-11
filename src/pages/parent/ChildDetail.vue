<script lang="ts" setup>
import ChildInfoCard from "@/components/ChildInfoCard.vue";
import {onMounted, ref} from "vue";
import AuthorizeManager from "@/utils/authorize.ts";
import {useRouter} from "vue-router";
import {
  getChildCorrectTrendStatical,
  getChildQuizGroupStatical,
  QuizGroupStaticalItem,
  ResentCorrectStaticalItem
} from "@/apiRequest/parent/childManage/childStatical.ts";
import {ChildBase, getChildBaseInfo} from "@/apiRequest/parent/childManage/childBase.ts";
import StaticalChart from "@/components/StaticalChart.vue";
import {ChartInputItem} from "@/utils/chartInput.ts";
import {toChildMode} from "@/apiRequest/parent/modeSwitch.ts";

const props = defineProps<{
  cid: number
}>()
const router = useRouter()
const childBaseInfo = ref<ChildBase | null>(null)

const getQuizGroupStatical = async () => {
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


onMounted(() => {
  getChildBaseInfo(AuthorizeManager.getToken(), props.cid).then((res) => {
    childBaseInfo.value = res.expect()
  })
})

const gotoChildQuizMode = () => {
  toChildMode(AuthorizeManager.getToken(), props.cid)
      .then(
          () => {
            router.push({name:"child-manage"})
          }
      )
}

</script>

<template>
  <child-info-card title="孩子详情">
    <template #title class="d-flex w-100">
      孩子详情
      <v-btn class="ma-1 justify-end" @click="gotoChildQuizMode">
        开始练习
      </v-btn>

    </template>
    <template #body>
      <router-view v-slot="Component">
        <component
            :is="Component"
            :cid="props.cid"/>
      </router-view>
      <v-container v-if="childBaseInfo">
        <p class="mb-5">{{ childBaseInfo.name }}</p>
        <v-divider/>
        <statical-chart :fetch-statical="getQuizGroupStatical" title="各题型正确率"/>
        <statical-chart :fetch-statical="getCorrectRateStatical" title="近期正确率变化"/>

      </v-container>
      <v-progress-circular v-else indeterminate/>
    </template>

  </child-info-card>
</template>

<style scoped>

</style>