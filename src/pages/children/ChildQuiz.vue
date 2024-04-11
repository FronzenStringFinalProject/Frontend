<script lang="ts" setup>
import {computed, ref} from "vue";
import AnswerInteractive from "@/components/AnswerInteractive.vue";
import QuizArea from "@/components/QuizArea.vue";
import {useRouter} from "vue-router";
import AuthorizeManager from "@/utils/authorize.ts";
import {getNextQuiz, Quiz} from "@/apiRequest/quiz/getNextQuiz.ts";
import {submitQuizAnswer} from "@/apiRequest/quiz/submitQuizAnswer.ts";
import {FetchedQuiz, SubmitQuiz} from "@/QuizInteractive/quizTrainManager.ts";
import {base64Encoder} from "@/utils/base64Encoder.ts";
import {ResponseResult} from "@/apiRequest/baseRequest.ts";


const currentQuiz = ref("")
const router = useRouter()
const submitAudio = async (audio: Blob) => {
  try {
    const base64Audio = await base64Encoder(audio)

    const form = new FormData()
    form.set("file", audio, "record.wav")
    const res = await fetch("http://127.0.0.1:5000/recognition", {
      method: "POST",
      body: JSON.stringify({
        base64_voice:base64Audio,
      }),
      headers:{
        "Content-Type": "application/json"
      }
    })
    const payload: { result?: number, negative: boolean, positive: boolean } = await res.json()
    console.log(payload)
    return {ans: payload.result, negative: payload.negative, positive: payload.positive}

  } catch (e) {
    console.error(e)
    return {ans: null, negative: false, positive: false}
  }

}

const nextQuiz: () => Promise<FetchedQuiz> = async () => {
  const resp:ResponseResult<Quiz> = await getNextQuiz(AuthorizeManager.getToken())
  const payload: { id: number, quiz: string } =resp.expect()
  const quiz_speak = payload.quiz
      .replace("-", "减")
      .replace("+", "加")
      .replace("*", "乘")
      .replace("/", "除以")
  const quiz_display = payload.quiz
      .replace("*", "×")
      .replace("/", "÷")
  console.log(payload)
  currentQuiz.value = payload.quiz
  return {id: payload.id, quiz_speak, quiz_display}
}

const submitAns = async (id: number, ans?: number) => {
  console.log(id, ans)
  const resp:ResponseResult<boolean> = await submitQuizAnswer(AuthorizeManager.getToken(), id, ans)
  return resp.expect()
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
        <v-avatar class="elevation-3 mt-2" icon="mdi mdi-teddy-bear" size="80">A</v-avatar>
        <v-col class="d-flex flex-column mr-5">
          <v-label class="mb-2">孩子姓名</v-label>
          <v-btn @click="router.push({name:'child-manage'});">退出练习</v-btn>

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

    </v-row>
  </v-container>
</template>

<style scoped>
</style>