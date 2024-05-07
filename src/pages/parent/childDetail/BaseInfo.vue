<script lang="ts" setup>
import {computed, nextTick, onMounted, ref, watch} from "vue";
import AuthorizeManager from "@/utils/authorize.ts";
import {ResponseResult} from "@/apiRequest/baseRequest.ts";
import {ChildBase, deleteChild, getChildBaseInfo} from "@/apiRequest/parent/childManage/childBase.ts";
import {ChildLevelInfo, getChildLevelInfo} from "@/apiRequest/parent/childManage/sore.ts";
import {CalendarHeatmap} from "vue3-calendar-heatmap";
import {parentGetChildActiveMap} from "@/apiRequest/parent/childManage/childStatical.ts";
import {useRouter} from "vue-router";

const props = defineProps<{ cid: number }>()
const router = useRouter();
const childLevel = ref(0)
const childExp = ref(0)
const progress = ref(0)
const base = ref<ChildBase | null>(null)
const activateMap = ref<{ date: Date, count: number }[]>([])
const name = computed(() => {
  return base.value ? base.value.name : "x"
})
const ExpReq = 1000
watch(childExp, (value) => {
  progress.value = 100 * (value / ExpReq)
  console.log(progress.value)
})
onMounted(() => {
  getChildLevelInfo(AuthorizeManager.getToken(), props.cid).then((data: ResponseResult<ChildLevelInfo>) => {
    console.log(data)
    const payload = data.expect()
    childLevel.value = payload.level
    childExp.value = payload.level_score
  })
  getChildBaseInfo(AuthorizeManager.getToken(), props.cid).then((resp: ResponseResult<ChildBase>) => {
    base.value = resp.expect();
  })
  parentGetChildActiveMap(AuthorizeManager.getToken(), props.cid).then((resp: ResponseResult<Record<string, number>>) => {
    let dict = {}
    let vec = []
    const today = new Date();
    for (let i = 0; i < 372; i++) {
      let thatDay = new Date(today)
      dict[`${thatDay.getFullYear()}-${thatDay.getMonth()}-${thatDay.getDate()}`] = vec.length
      vec.push({date: thatDay, count: 0})
      today.setDate(today.getDate() - 1)
    }

    let record: Record<string, number> = resp.expect()
    for (const expectKey in record) {
      const count = record[expectKey]
      const theDay = new Date(expectKey)
      vec[dict[`${theDay.getFullYear()}-${theDay.getMonth()}-${theDay.getDate()}`]] = {date: expectKey, count: count}
    }
    activateMap.value = vec
  })
})

watch(childExp, (value) => {
  progress.value = 100 * (value / ExpReq)
  console.log(progress.value)
})

const tooltips = (value: { date: Date | string; count: number; }): string => {
  let showDate
  if (typeof value.date == "string") {
    showDate = value.date
  } else {
    showDate = `${value.date.getFullYear()}-${value.date.getMonth() + 1}-${value.date.getDate()}`
  }
  return value.count == 0 ? `${showDate} 未进行练习` : `${showDate} 完成练习 ${value.count} 次`
}

const MonthMap: Record<string, string> = {
  "May": "五月",
  "Jun": "六月",
  "Jul": "七月",
  "Aug": "八月",
  "Sep": "九月",
  "Oct": "十月",
  "Nov": "十一",
  "Dec": "十二",
  "Jan": "一月",
  "Feb": "二月",
  "Mar": "三月",
  "Apr": "四月"
}

const WeekMap: Record<string, string> = {
  "Mon": "周一 ", "Wed": "周三 ", "Fri": "周五 "
}

nextTick(() => {
  const element = document.getElementById("heatmap")
  console.log(element)
  if (element) {
    let month = element.getElementsByClassName("vch__month__label")
    for (let i = 0; i < month.length; i++) {
      month[i].innerHTML = MonthMap[month[i].innerHTML]
    }
    let week = element.getElementsByClassName("vch__day__label")
    // console.log(week)
    for (let i = 0; i < week.length; i++) {
      week[i].innerHTML = WeekMap[week[i].innerHTML]
    }
  }

  const markElement = document.getElementsByClassName("vch__legend-right")[0]
  const innerElement = markElement.getElementsByClassName("vch__legend")[0]
  innerElement.className += " d-flex flex-row align-center justify-end"
  const tags = innerElement.getElementsByTagName("div")
  tags[0].innerHTML = "更少练习"
  tags[1].innerHTML = "更多练习"

  const svg = innerElement.getElementsByTagName("svg")[0]
  svg.setAttribute("height", "15")

})
</script>

<template>
  <div class="d-flex flex-row ">

    <v-col cols="1">
      <v-row>
        <div class="w-100">

          <v-avatar color="primary" size="64">
            <span style="font-size: 32px">{{ name[0] }}</span>
          </v-avatar>
        </div>
        <strong style="align-content: center;width: 100%">Lv:{{ childLevel }}</strong>
      </v-row>

    </v-col>
    <v-col class="d-flex">
      <v-row>

        <strong style="height: 64px;align-content: center;line-height: 64px">{{ name }} </strong>
        <v-progress-linear v-model="progress"
                           color="light-blue"
                           height="15"
                           rounded striped

        >
          <template #default>
            <strong>

              {{ childExp }} / {{ ExpReq }}
            </strong>
          </template>
        </v-progress-linear>
      </v-row>
    </v-col>
    <v-col cols="1">
      <v-dialog class="w-33">
        <template #activator="{props}">
          <v-btn color="red" prepend-icon="mdi mdi-delete" v-bind="props">移除</v-btn>
        </template>
        <template #default="{isActive}">

          <v-card title="确认信息">
            <v-card-text>确实要删除孩子“{{ base.name }}”吗？ 这一过程不可逆</v-card-text>
            <v-card-actions>
              <v-btn @click="isActive.value = false">取消</v-btn>
              <v-btn color="red" prepend-icon="mdi mdi-delete"
                     @click="deleteChild(AuthorizeManager.getToken(),cid).then(()=>{isActive.value=false;router.push({name:'parent-base'})})">
                删除
              </v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>
    </v-col>


  </div>
  <v-divider class="mt-8"/>
  <v-col class="pa-3">
    <span>练习热力图</span>
    <calendar-heatmap id="heatmap" :end-date="'2024-4-14'"
                      :range-color="['#ebedf0','#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39']"
                      :tooltip-formatter="tooltips"
                      :values="activateMap"
                      class="mt-4 ms-4 me-4"
                      round="3"
                      style="font-size: smaller !important;"
                      tooltip-unit="练习"
    />
  </v-col>
</template>

<style scoped>

</style>