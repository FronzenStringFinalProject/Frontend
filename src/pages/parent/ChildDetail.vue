<script lang="ts" setup>
import ChildInfoCard from "@/components/ChildInfoCard.vue";
import {onMounted, ref} from "vue";
import AuthorizeManager from "@/utils/authorize.ts";
import {useRouter} from "vue-router";
import {ChildBase, getChildBaseInfo} from "@/apiRequest/parent/childManage/childBase.ts";
import {toChildMode} from "@/apiRequest/parent/modeSwitch.ts";

const props = defineProps<{
  cid: number
}>()
const router = useRouter()
const childBaseInfo = ref<ChildBase | null>(null)




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
  <child-info-card >
    <template #title class="d-flex w-100">
      孩子详情-{{ childBaseInfo?childBaseInfo.name : "x" }}
    </template>
    <template #body>
      <router-view v-slot="{Component}">
        <component
            :is="Component"
            :cid="props.cid"/>
      </router-view>
    </template>
  <template #actions>
    <div >
      <v-btn elevation="2" @click="router.go(-1)">返回</v-btn>
      <v-btn elevation="2" @click="router.push({name:'child-base'})">首页</v-btn>
      <v-btn elevation="2"  @click="router.push({name:'quizGroup'})">各题型错题统计</v-btn>
      <v-btn elevation="2"  @click="router.push({name:'correctTrend'})">近期正确率变化统计</v-btn>
      <v-btn elevation="2" @click="router.push({name:'wrongRecord'})">错题统计</v-btn>
      <v-btn elevation="2"  @click="router.push({name:'checkRecord'})">打卡统计</v-btn>
    <v-btn elevation="2"  @click="gotoChildQuizMode">开始练习</v-btn>
    </div>
  </template>
  </child-info-card>
</template>

<style scoped>

</style>