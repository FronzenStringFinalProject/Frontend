<script lang="ts" setup>
import {onMounted, ref, watch} from "vue";
import {ChildLevelInfo, getChildLevelInfo} from "@/apiRequest/child/childLevel.ts";
import AuthorizeManager from "@/utils/authorize.ts";
import {ResponseResult} from "@/apiRequest/baseRequest.ts";
import {childName} from "@/apiRequest/child/child_base.ts";

const childLevel = ref(0)
const childExp = ref(0)
const progress = ref(0)
const name = ref("")
const ExpReq = 1000
watch(childExp, (value) => {
  progress.value = 100 * (value / ExpReq)
  console.log(progress.value)
})
onMounted(() => {
  getChildLevelInfo(AuthorizeManager.getToken()).then((data: ResponseResult<ChildLevelInfo>) => {
    console.log(data)
    const payload = data.expect()
    childLevel.value = payload.level
    childExp.value = payload.level_score
  })
  childName(AuthorizeManager.getToken()).then((resp: ResponseResult<string>) => {
    name.value = resp.expect();
  })
})

watch(childExp, (value) => {
  progress.value = 100 * (value / ExpReq)
  console.log(progress.value)
})
</script>

<template>
  <div class="d-flex flex-row">
    <v-col cols="1">
      <v-row >
        <v-avatar color="primary" size="64">
          <span style="font-size: 32px">{{name[0]}}</span>
        </v-avatar>
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
  </div>
</template>

<style scoped>

</style>
