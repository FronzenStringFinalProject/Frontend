<script lang="ts" setup>
import ChildInfoCard from "@/components/ChildInfoCard.vue";
import {computed, onMounted, ref} from "vue";
import getChildStataical, {ChildStatical} from "@/apiRequest/parent/childManage/childStatical.ts";
import AuthorizeManager from "@/utils/authorize.ts";
import {Scatter} from "vue-chartjs"
import {
  BarElement,
  CategoryScale,
  Chart as ChartJs,
  Legend,
  LinearScale,
  LineElement,
  LogarithmicScale,
  PointElement,
  TimeScale,
  Title,
  Tooltip
} from "chart.js";
import {useRouter} from "vue-router";

ChartJs.register(TimeScale, Title, Tooltip, Legend, CategoryScale, PointElement, LineElement, LogarithmicScale, LinearScale, BarElement)
const props = defineProps<{
  cid: number
}>()
const router = useRouter()
const childDetail = ref<ChildStatical | null>(null)
const chartData = computed(() => {
  if (childDetail.value) {
    console.log(childDetail.value)
    return {
      labels: childDetail.value.statical.map(data => data.ty),
      datasets: [
        {
          order: 0,
          id: 3,
          type: "line",
          label: "正确率",
          data: childDetail.value.statical.map(data => data.correct_rate)
          ,
          tension: 0.1,
          yAxisID: "rateAxis"
          , backgroundColor: 'rgb(24,75,69)',
          borderColor: 'rgb(24,75,69)',
          borderWidth: 2,
        }, {
          id: 1,
          type: "bar",
          backgroundColor: 'rgb(21,241,250)',
          borderColor: 'rgb(21,241,250)',
          label: "完成题目",
          data: childDetail.value.statical.map(data => data.total),
          borderWidth: 1,
          borderRadius: 5,
          order: 3,
        },
        {
          id: 2,
          order: 1,
          type: "bar",
          backgroundColor: 'rgb(127,255,20)',
          borderColor: 'rgb(127,255,20)',
          label: "正确题目",
          data: childDetail.value.statical.map(data => data.correct),
          borderWidth: 1,
          borderRadius: 5,
        },
        {
          id: 2,
          order: 2,
          type: "bar",
          backgroundColor: 'rgb(250,21,21)',
          borderColor: 'rgb(250,21,21)',
          label: "错误题目",
          data: childDetail.value.statical.map(data => data.wrong),
          borderWidth: 1,
          borderRadius: 5,
        }
      ]
    }
  } else {
    return null
  }
})

const chartJsOptions = {
  responsive: true,
  interaction: {
    intersect: false,
    mode: 'index',
  },

  layout: {
    padding: 5
  },
  plugins: {
    legend: {
      position: "bottom",
    },
    title: {
      display: true,
      text: "学习记录"
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        // Include a dollar sign in the ticks
        callback: function (value, index, ticks) {
          return `${value}题`;
        },
        padding: 5
      },
    },
    rateAxis: {
      beginAtZero: true,
      type: "logarithmic",
      position: "right",
      ticks: {
        callback: (value, _index, _tick) => {
          return `${(value * 100.0).toFixed(2)}%`
        },

      }
      , grid: {
        display: false
      }
    }
  }
}

onMounted(() => {
  getChildStataical(AuthorizeManager.getToken(), props.cid).then((res) => {
    childDetail.value = res.data
  })
})

</script>

<template>
  <child-info-card title="孩子详情">
    <template #body>
      <v-container v-if="childDetail">
        <p class="mb-5">{{ childDetail.name }}</p>
        <v-divider/>
        <scatter :data="chartData" :options="chartJsOptions" class="elevation-3 rounded-lg ma-5 h-50"/>
        <v-btn @click="router.push('/quiz')">开始练习</v-btn>
        <v-list>
          <v-list-item v-for="detail in childDetail.statical" :key="detail.ty_id"
          >
            <template #prepend>
              <v-progress-circular :model-value="detail.correct_rate*100" size="80" width="5">{{ Math.round(detail.correct_rate * 100) }}%
              </v-progress-circular>
            </template>
            <template #title class="d-flex justify-start">题型：{{ detail.ty }}</template>
            <template #subtitle class="d-flex justify-start">正确/错误： {{ detail.correct }}/{{ detail.wrong }}
            </template>


          </v-list-item>
        </v-list>
      </v-container>
      <v-progress-circular v-else indeterminate/>
    </template>

  </child-info-card>
</template>

<style scoped>

</style>