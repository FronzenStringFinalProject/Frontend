<script lang="ts" setup>

import CheckInIcon from "@/assets/check_in.svg?component";
import ErrorRecordIcon from "@/assets/error_record.svg?component";
import RankIcon from "@/assets/rank.svg?component"
import SelectIcon from "@/assets/select.svg?component";
import SvgIconBtn from "@/components/SvgIconBtn";
import {useRouter} from "vue-router";
import ChildLevel from "@/components/ChildLevel.vue";
import {computed, ref} from "vue";
import CheckIn from "@/components/CheckIn.vue";
import QuizGroupSelection from "@/components/QuizGroupSelection.vue";
import {toParentMode} from "@/apiRequest/parent/modeSwitch.ts";
import AuthorizeManager from "@/utils/authorize.ts";
import ChildWrongRecordList from "@/components/ChildWrongRecordList.vue";

const router = useRouter()
const showCheckIn = ref(false)
const showQuizSelect = ref(false)
const showWrongQuiz = ref(false)

const backParentDialogDisplay = ref(false)
const parentSecret = ref("")
const canReturn = computed(() => parentSecret.value.length > 0)
</script>

<template>
  <v-card class="flex-column align-center d-flex justify-center" style="width: fit-content;align-self: center">
    <v-card-title class="mb-5 d-inline-flex flex-column justify-start align-self-baseline w-100">

      <child-level/>
    </v-card-title>
    <v-card-text>
      <svg-icon-btn :icon="SelectIcon" :on-click="()=>{showQuizSelect=true}" class="mr-5 justify-end" text="题型选择"/>

      <svg-icon-btn :icon="CheckInIcon" :on-click="()=>{showCheckIn = true}"
                    class="mr-5 justify-end" text="打卡"/>
      <svg-icon-btn :icon="ErrorRecordIcon" :on-click="()=>{showWrongQuiz=true}"
                    class="justify-end mr-5" text="错题本"/>
      <SvgIconBtn :icon="RankIcon" :on-click="()=>{}" class="justify-center" text="排行榜"/>

      <!--      <check-in/>-->

    </v-card-text>
    <v-card-actions>
      <v-dialog v-model="backParentDialogDisplay" width="500">
        <template #activator="{props}">
          <v-btn elevation="3" v-bind="props">返回家长模式</v-btn>
        </template>
        <template #default>
          <v-card title="返回家长模式">
            <v-card-text>
              <v-text-field v-model="parentSecret" label="Secret" prepend-icon="mdi mdi-lock" type="password"/>
            </v-card-text>
            <v-card-actions>
              <v-btn :disabled="!canReturn"
                     @click="toParentMode(AuthorizeManager.getToken(),parentSecret).then(()=>{router.push('/parent')})">
                返回
              </v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>
      <v-btn elevation="3" @click="router.push({name:'child-quiz'})">前往练习</v-btn>
    </v-card-actions>
  </v-card>
  <v-dialog v-model="showCheckIn" width="auto">
    <check-in/>
  </v-dialog>
  <v-dialog v-model="showQuizSelect" width="33%">
    <quiz-group-selection/>
  </v-dialog>
  <v-dialog v-model="showWrongQuiz" width="33%">
    <v-card title="错题本">
      <v-card-text>
        <child-wrong-record-list/>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<style scoped>

</style>