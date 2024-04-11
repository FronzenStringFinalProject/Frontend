<script lang="ts" setup>
import {onMounted, ref, watch} from "vue";
import {getChildSpecMonthCheckRecord} from "@/apiRequest/child/spec_month_info.ts";
import AuthorizeManager from "@/utils/authorize.ts";
import {Page} from "v-calendar/dist/types/src/utils/page";
import {child_can_check, child_check} from "@/apiRequest/child/check.ts";
import {getChildCheckInfo} from "@/apiRequest/child/check_info.ts";
import {ResponseResult} from "@/apiRequest/baseRequest.ts";
import {parentGetCheckinInfo, parentGetChildSpecMonthCheckRecord} from "@/apiRequest/parent/childManage/checkIn.ts";

const props = defineProps<{ inParent?: boolean, cid?: number }>()

const date_attr = ref<{ key: string, highlight: boolean, dates: any }[]>([])
const needUpdate = ref(true)
const currentMonth = ref<{ month: number, year: number } | null>(null)
const canCheckIn = ref(false)
const continualCheckIn = ref(0)
const totalCheckIn = ref(0)

watch(currentMonth, (value, oldValue) => {
  if (oldValue == null) {
    needUpdate.value = true
  } else {
    needUpdate.value = value?.month != oldValue.month || value.year != oldValue.year
  }
})
onMounted(() => {
  if (!props.inParent) {
    child_can_check(AuthorizeManager.getToken()).then((can: ResponseResult<boolean>) => {
      canCheckIn.value = can.expect()
    })
  }

  getCheckRecord()
})

const onPageSwitch = (page: Page[]) => {
  const thisPage = page[0]
  console.log(thisPage.month)
  console.log(thisPage.year)
  currentMonth.value = {month: thisPage.month, year: thisPage.year}
  if (needUpdate.value)
    if (props.inParent && props.cid) {
      parentGetChildSpecMonthCheckRecord(AuthorizeManager.getToken(), props.cid, thisPage.month, thisPage.year)
          .then((dates: ResponseResult<string[]>) => {
                date_attr.value = [{
                  key: "checked",
                  highlight: true,
                  dates: dates.expect().map((date: string) => new Date(date))
                }]
                console.log(date_attr)
                needUpdate.value = false
              }
          )
    } else {

      getChildSpecMonthCheckRecord(AuthorizeManager.getToken(), thisPage.month, thisPage.year)
          .then((dates: ResponseResult<string[]>) => {
                date_attr.value = [{
                  key: "checked",
                  highlight: true,
                  dates: dates.expect().map((date: string) => new Date(date))
                }]
                console.log(date_attr)
                needUpdate.value = false
              }
          )
    }
}

const onCheckIn = () => {
  child_check(AuthorizeManager.getToken()).then(() => {
    const now = new Date()
    date_attr.value.push({key: "checked", highlight: true, dates: now})
    canCheckIn.value = false
    getCheckRecord()
  })
}

const getCheckRecord = async () => {

  let data
  if (props.inParent && props.cid) {
    data = await parentGetCheckinInfo(AuthorizeManager.getToken(), props.cid)
  } else {
    data = await getChildCheckInfo(AuthorizeManager.getToken())
  }

  const payload = data.expect()
  continualCheckIn.value = payload.continual
  totalCheckIn.value = payload.total
}

</script>

<template>
  <v-card class="d-flex flex-column elevation-0">
    <v-card-title><strong>

      每日打卡
    </strong>
    </v-card-title>
    <v-card-subtitle>
      已经连续打卡 {{ continualCheckIn }} 天 <br>
      已经累计打卡 {{ totalCheckIn }} 天
    </v-card-subtitle>
    <v-card-text>
      <VCalendar :attributes="date_attr" class="pa-5" locale="zh-cn" title-position="left" @update:pages="onPageSwitch">
      </VCalendar>
    </v-card-text>
    <v-card-actions v-if="!inParent" class="d-flex" style="justify-content: end">
      <v-btn :disabled="!canCheckIn" @click="onCheckIn">{{ canCheckIn ? "打卡" : "今日已打卡" }}</v-btn>

    </v-card-actions>
  </v-card>

</template>

<style scoped>

</style>