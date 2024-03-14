<script lang="ts" setup>
import {onMounted, ref, watch} from "vue";
import {getChildSpecMonthCheckRecord} from "@/apiRequest/child/spec_month_info.ts";
import AuthorizeManager from "@/utils/authorize.ts";
import {ServiceResponse} from "@/apiRequest/baseRequest.ts";
import {Page} from "v-calendar/dist/types/src/utils/page";

const date_attr = ref([])
const needUpdate = ref(true)
const currentMonth = ref<{ month: number, year: number } | null>(null)
const canCheckIn = ref(true)
watch(currentMonth, (value, oldValue) => {
  if (oldValue == null) {
    needUpdate.value = true
  } else {
    needUpdate.value = value?.month != oldValue.month || value.year != oldValue.year
  }
})
onMounted(() => {
  const now = new Date()
  console.log(now, now.getMonth(), now.getFullYear())
  getChildSpecMonthCheckRecord(AuthorizeManager.getToken(), now.getMonth() + 1, now.getFullYear())
      .then((dates: ServiceResponse<string[]>) => {
        date_attr.value = [{
          key: "checked",
          highlight: true,
          dates: dates.body.map((date: string) => new Date(date))
        }]
        console.log(date_attr)
      })
})

const onPageSwitch = (page: Page[]) => {
  const thisPage = page[0]
  console.log(thisPage.month)
  console.log(thisPage.year)
  currentMonth.value = {month: thisPage.month, year: thisPage.year}
  if (needUpdate.value)
    getChildSpecMonthCheckRecord(AuthorizeManager.getToken(), thisPage.month, thisPage.year)
        .then((dates: ServiceResponse<string[]>) => {
              date_attr.value = [{
                key: "checked",
                highlight: true,
                dates: dates.body.map((date: string) => new Date(date))
              }]
              console.log(date_attr)
              needUpdate.value = false
            }
        )
}

</script>

<template>
  <VCalendar :attributes="date_attr" class="pa-5" locale="zh-cn" title-position="left" @update:pages="onPageSwitch">
    <template #footer>
      <v-container>

        <v-btn>打卡</v-btn>
        <p>已经连续打卡 30 天</p>
      </v-container>
    </template>
  </VCalendar>

</template>

<style scoped>

</style>