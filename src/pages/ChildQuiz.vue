<script lang="ts" setup>
import CheckInIcon from "@/assets/check_in.svg?component"
import ErrorRecordIcon from "@/assets/error_record.svg?component"
import SvgIconBtn from "@/components/SvgIconBtn.vue";
import {computed, ref, watch} from "vue";
import AnswerInteractive from "@/components/AnswerInteractive.vue";
import QuizArea from "@/components/QuizArea.vue";
import {useRouter} from "vue-router";
import AuthorizeManager from "@/utils/authorize.ts";
import {getNextQuiz} from "@/apiRequest/quiz/getNextQuiz.ts";
import {submitQuizAnswer} from "@/apiRequest/quiz/submitQuizAnswer.ts";
import {toParentMode} from "@/apiRequest/parent/modeSwitch.ts";


const currentQuiz = ref("")
const router = useRouter()
const submitAudio = async (audio: Blob) => {
  try {

    const form = new FormData()
    form.set("file", audio, "record.wav")
    const res = await fetch("http://127.0.0.1:5000/recognition", {
      method: "POST",
      body: form
    })
    const payload: { result?: number, unknown: boolean } = await res.json()
    return {ans: payload.result, neg: payload.unknown}
  } catch (e) {
    console.error(e)
    return {ans: null, neg: false}
  }

}

const nextQuiz = async () => {
  const resp = await getNextQuiz(AuthorizeManager.getToken())
  const payload: { id: number, quiz: string } = await resp.body
  const quiz_speak = payload.quiz
      .replace("-", "减")
      .replace("+", "加")
      .replace("×", "乘")
      .replace("÷", "除以")
  console.log(payload)
  currentQuiz.value = payload.quiz
  return {id: payload.id.toString(), quiz: payload.quiz, quiz_speak}
}

const submitAns = async (id: string, ans: number) => {
  console.log(id, ans)
  const resp = await submitQuizAnswer(AuthorizeManager.getToken(), parseInt(id, 10), ans)
  return resp.body
}

const mic_state = ref<{ enable: boolean, speaking: boolean }>({enable: false, speaking: false})
const micIcon = computed(() => {
  if (mic_state.value.enable) {
    if (mic_state.value.speaking) {
      return "mdi mdi-microphone"
    } else {
      return "mdi mdi-microphone-outline"
    }
  } else {
    return "mdi mdi-microphone-off"
  }
})

const micColor = computed(() => {
  if (mic_state.value.enable) {
    if (mic_state.value.speaking) {
      return "green"
    } else {
      return "white"
    }

  } else {
    return "red"
  }
})

const voiceState = ref(false)

const answer = ref()
const currentState = ref("Begin")
const stopped = ref(false)
const parentSecret = ref("")
const canReturn = computed(() => parentSecret.value.length > 0)
const backParentDialogDisplay=ref(false)

watch(backParentDialogDisplay,(value)=>{
    stopped.value=value
  if (value){
    answer.value.pause()
  }else {
    answer.value.start()
  }

})

</script>

<template>
  <v-container class="d-flex flex-column ma-0 pa-0" fluid>

    <v-row class="w-100 ma-5" no-gutters>
      <v-col class="flex-shrink-1 flex-grow-0" cols="3">

        <v-btn :icon="stopped?'mdi mdi-play':'mdi mdi-pause'" class="elevation-3 mr-5" size="x-large"
               @click="stopped?answer.start():answer.pause();stopped=!stopped"></v-btn>
        <v-btn :color="micColor" :icon="micIcon" class="elevation-3 mr-5" size="x-large"></v-btn>
        <v-btn :color="voiceState?'green':'white'" :icon="voiceState?'mdi mdi-volume-high':'mdi mdi-volume-low'"
               class="elevation-3 mr-5" size="x-large"/>
      </v-col>
      <v-col color="blue" cols="7">

      </v-col>
      <v-col class="d-flex  flex-row " cols="2">
        <v-avatar class="elevation-3 mt-2" icon="mdi mdi-teddy-bear" size="80">A</v-avatar>
        <v-col class="d-flex flex-column mr-5">
          <v-label class="mb-2">孩子姓名</v-label>
          <v-dialog width="500" v-model="backParentDialogDisplay">
            <template #activator="{props}">
              <v-btn v-bind="props">返回家长模式</v-btn>
            </template>
            <template #default="{isActivate}">
              <v-card title="返回家长模式">
                <v-card-text>
                  <v-text-field type="password" label="Secret" prepend-icon="mdi mdi-lock" v-model="parentSecret"/>
                </v-card-text>
                <v-card-actions>
                  <v-btn :disabled="!canReturn" @click="toParentMode(AuthorizeManager.getToken(),parentSecret).then(()=>{router.push('/parent')})">返回</v-btn>
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>
        </v-col>

      </v-col>
    </v-row>
    <v-row id="center-area" class="w-100" no-gutters>
      <answer-interactive ref="answer" :next-quiz="nextQuiz" :submit-answer="submitAns"
                          :submit-audio="submitAudio"
                          @mic="(on:boolean,activate:boolean)=>{mic_state= {enable:on,speaking:activate}}"
                          @state="(state:string)=>currentState=state"
                          @voice="(on:boolean)=>voiceState=on"
      />
      <quiz-area :quiz="currentQuiz"/>

    </v-row>
    <v-row id="button-area" class="w-100" no-gutters style="">
      <v-col cols="2">

        <v-label class="rounded-lg pa-10 elevation-3">{{ currentState }}</v-label>
      </v-col>
      <v-col cols="4" offset="6">

        <svg-icon-btn :icon="CheckInIcon" :on-click="()=>{}"
                      class="mr-5 justify-end" text="打卡"/>
        <svg-icon-btn :icon="ErrorRecordIcon" :on-click="()=>{}"
                      class="justify-end" text="错题本"/>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>

#center-area {
  height: ;
}
</style>