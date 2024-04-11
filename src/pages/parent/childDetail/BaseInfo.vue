<script setup lang="ts">
import {computed, onMounted, ref, watch} from "vue";
import AuthorizeManager from "@/utils/authorize.ts";
import {ResponseResult} from "@/apiRequest/baseRequest.ts";
import {ChildBase, getChildBaseInfo} from "@/apiRequest/parent/childManage/childBase.ts";
import {ChildLevelInfo, getChildLevelInfo} from "@/apiRequest/parent/childManage/sore.ts";

const props = defineProps<{cid:number}>()

const childLevel = ref(0)
const childExp = ref(0)
const progress = ref(0)
const base = ref<ChildBase | null>(null)
const name = computed(()=>{return base.value? base.value.name : "x"})
const ExpReq = 1000
watch(childExp, (value) => {
  progress.value = 100 * (value / ExpReq)
  console.log(progress.value)
})
onMounted(() => {
  getChildLevelInfo(AuthorizeManager.getToken(),props.cid).then((data: ResponseResult<ChildLevelInfo>) => {
    console.log(data)
    const payload = data.expect()
    childLevel.value = payload.level
    childExp.value = payload.level_score
  })
  getChildBaseInfo(AuthorizeManager.getToken(),props.cid).then((resp: ResponseResult<ChildBase>) => {
    base.value = resp.expect();
  })
})

watch(childExp, (value) => {
  progress.value = 100 * (value / ExpReq)
  console.log(progress.value)
})
</script>

<template>
  <div class="d-flex flex-row " >
    <v-col cols="1">
      <v-row >
        <div class="w-100">

        <v-avatar  color="primary" size="64">
          <span style="font-size: 32px">{{name[0]}}</span>
        </v-avatar>
        </div>
        <strong style="align-content: center;width: 100%">Lv:{{ childLevel }}</strong>
      </v-row>

    </v-col>
    <v-col class="d-flex">
      <v-row>

        <strong style="height: 64px;align-content: center;line-height: 64px">{{name }} </strong>
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
      <v-btn color="red" prepend-icon="mdi mdi-delete">移除</v-btn>
    </v-col>
  </div>
</template>

<style scoped>

</style>