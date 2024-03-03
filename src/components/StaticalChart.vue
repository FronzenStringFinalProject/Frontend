<script lang="ts" setup>

import {Line, Scatter} from "vue-chartjs";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJs,
  Legend,
  LinearScale,
  LineElement,
  LogarithmicScale,
  PointElement, Ticks,
  TimeScale,
  Title,
  Tooltip
} from "chart.js";
import {computed, onMounted, ref} from "vue";
import {ChartInputItem} from "@/utils/chartInput.ts";

ChartJs.register(TimeScale, Title, Tooltip, Legend, CategoryScale, PointElement, LineElement, LogarithmicScale, LinearScale, BarElement)
const props = defineProps<{
  title: string,
  fetchStatical: () => Promise<ChartInputItem[]>
}>()

const chartStatical = ref<ChartInputItem[]>([])

onMounted(() => {
  props.fetchStatical().then((resp: ChartInputItem[]) => {
    chartStatical.value = resp
  })
})


const chartData = computed(() => {
  console.log(chartStatical.value)
  if (chartStatical.value.length != 0) {
    return {
      labels: chartStatical.value.map(data => data.columnName),
      datasets: [
        {
          order: 0,
          id: 3,
          type: "line",
          label: "正确率",
          data: chartStatical.value.map(data => data.correctRate),
          tension: 0.1,
          yAxisID: "rateAxis",
          backgroundColor: 'rgb(24,75,69)',
          borderColor: 'rgb(24,75,69)',
          borderWidth: 2,
        }, {
          id: 1,
          type: "bar",
          backgroundColor: 'rgb(21,241,250)',
          borderColor: 'rgb(21,241,250)',
          label: "完成题目",
          data: chartStatical.value.map(data => data.total),
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
          data: chartStatical.value.map(data => data.correctNumber),
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
          data: chartStatical.value.map(data => data.wrongNumber),
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
      text: props.title
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        // Include a dollar sign in the ticks
        callback: function (value: any,idx,tick) {
          console.log(`${value}题`)
          return `${value}题`;
        },
        padding: 5
      },
    },
    rateAxis: {
      beginAtZero: true,
      // type: "line",
      position: "right",
      ticks: {
        callback: (value,idx,tick) => {
          console.log(value)
          return `${(value * 100.0).toFixed(2)}%`
        },

      }
      , grid: {
        display: false
      }
    }
  }
}
</script>

<template>
  <scatter v-if="chartData" :data="chartData" :options="chartJsOptions" class="elevation-3 rounded-lg ma-5 h-50"/>
</template>

<style scoped>

</style>