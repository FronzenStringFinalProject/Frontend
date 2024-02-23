<script lang="ts" setup>
import CheckInIcon from "@/assets/check_in.svg?component"
import ErrorRecordIcon from "@/assets/error_record.svg?component"
import SvgIconBtn from "@/components/SvgIconBtn.vue";
import {computed, ref} from "vue";
import AnswerInteractive from "@/components/AnswerInteractive.vue";
import QuizArea from "@/components/QuizArea.vue";
import {useRouter} from "vue-router";


const currentQuiz = ref("")
const router= useRouter()
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

const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzM4NCJ9.eyJleHAiOjE3MjQyMjgzOTQsInBhcmVudF9pZCI6MiwicHdkX3ZlcnNpb24iOjAsIm" +
    "NoaWxkIjo1MDF9.FHdbWe79IJ-ZXPubb76y8akcjCI0VMyRReo5dMCOPUjyxaYApnXxlOl-29QMWKYS"
const nextQuiz = async () => {
  const url = "http://127.0.0.1:8000/api/v0/child/quiz"
  const resp = await fetch(url, {
    headers: {
      "Authorization": token,
      "content-type": "application/json"
    }
  })
  const payload: { body: { id: number, quiz: string } } = await resp.json()
  const quiz_speak = payload.body.quiz.replace("-", "减").replace("+", "加")
  console.log(payload)
  currentQuiz.value = payload.body.quiz
  return {id: payload.body.id.toString(), quiz: payload.body.quiz, quiz_speak}
}

const submitAns = async (id: string, ans: number) => {
  console.log(id, ans)
  const url = "http://127.0.0.1:8000/api/v0/child/quiz/submit"
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": token
    },
    body: JSON.stringify({id: parseInt(id, 10), ans})
  })
  const payload: { body: boolean } = await resp.json()
  return payload.body
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
        <v-avatar icon="mdi mdi-teddy-bear" size="60" class="elevation-3 mt-2">A</v-avatar>
        <v-col class="d-flex flex-column mr-5">
          <v-label class="mb-2">孩子姓名</v-label>
          <v-btn @click="router.push('/parent')">返回家长模式</v-btn>
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

        <v-label class="rounded-lg pa-10 elevation-3 align-center">{{ currentState }}</v-label>
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