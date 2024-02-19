<script lang="ts" setup>
import RankIcon from "./assets/rank.svg?component"
import CheckInIcon from "./assets/check_in.svg?component"
import ErrorRecordIcon from "./assets/error_record.svg?component"
import StaticalIcon from "./assets/statical.svg?component"
import SvgIconBtn from "@/components/SvgIconBtn.vue";
import QuizArea from "@/components/QuizArea.vue";
import AnswerInteractive from "@/components/AnswerInteractive.vue";
import {computed, ref} from "vue";

const questions = [
  "1 + 8", "4 + 6",
  "9 + 1",
  "2 + 7", "5 + 4", "8 + 2",
  "6 + 3", "4 + 5", "1 + 9",
  "7 + 3",
  "5 + 2", "8 + 1", "3 + 6", "9 + 0", "2 + 8",
  "6 + 4",
  "4 + 3", "7 + 1", "5 + 5",
  "9 + 0", "2 + 6", "8 + 1",
  "16 - 5",
  "7 + 13",
  "20 - 11",  "9 + 10",
  "15 - 4",
  "3 + 17",
  "8 - 2",  "6 + 13",
  "14 - 6",  "18 + 3",
  "9 - 1",  "4 + 16",
]
const idx = ref(0)
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

const token ="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzM4NCJ9.eyJleHAiOjE3MjM3MzA3MzAsInBhcmVudF9pZCI6MiwicHdkX3ZlcnNpb24iOjAs" +
    "ImNoaWxkIjo1MDN9.QmQ9M8Xx9bvb8TMY80x-gxlnSggY2hsk4dAiQCPbnzcJYRNRYKAeqHPEkZ3KQaCk"
const nextQuiz = async () => {
  const url = "http://127.0.0.1:8000/api/v0/child/quiz"
  const resp = await fetch(url,{
    headers:{
      "Authorization":token
    }
  })
  const payload:{body:{id:number,quiz:string}} = await resp.json()
  const quiz_speak = payload.body.quiz.replace("-","减").replace("+","加")
  console.log(payload)
  return {id:payload.body.id.toString(),quiz:payload.body.quiz,quiz_speak}
}

const submitAns = async (id: string, ans: number) => {
  console.log(id, ans)
  const url = "http://127.0.0.1:8000/api/v0/child/quiz/submit"
  const resp = await fetch(url,{
    method:"POST",
    headers:{
        "Content-Type": "application/json",
      "Authorization":token
    },
    body:JSON.stringify({id:parseInt(id,10),ans})
  })
  const payload:{body:boolean} = await resp.json()
  return payload.body
}

const mic_state=ref<{enable:boolean,speaking:boolean}>({enable:false,speaking:false})
const micIcon=computed(()=>{
  if (mic_state.value.enable){
    if (mic_state.value.speaking){
      return "mdi mdi-microphone"
    }else {
      return "mdi mdi-microphone-outline"
    }
  }else {
    return "mdi mdi-microphone-off"
  }
})

const micColor = computed(()=>{
  if (mic_state.value.enable){
    if (mic_state.value.speaking){
      return "green"
    }else {
      return "black"
    }

  }else {
    return "red"
  }
})

const answer = ref()
const stopped = ref(false)
</script>
<template>
  <v-app>

    <v-main class="w-100">
      <v-icon :icon="micIcon" :color="micColor"></v-icon>
      <v-btn @click="stopped?answer.start():answer.pause();stopped=!stopped" :icon="stopped?'mdi mdi-play':'mdi mdi-pause'"></v-btn>
      <answer-interactive ref="answer" :next-quiz="nextQuiz" :submit-answer="submitAns"
                          :submit-audio="submitAudio" @mic="(on:boolean,activate:boolean)=>{mic_state= {enable:on,speaking:activate}}"/>
      <quiz-area/>

      <v-container class="d-flex ms-5 mb-5" style="position: absolute ; bottom: 0 ;left: 0;width: fit-content">

        <svg-icon-btn :icon="RankIcon" :on-click="()=>{}"
                      class="me-5"
                      text="排行榜"/>
        <svg-icon-btn :icon="CheckInIcon" :on-click="()=>{}"
                      text="打卡"/>
      </v-container>
      <v-container class="d-flex me-5 mb-5" style="position: absolute ; bottom: 0 ;right: 0;width: fit-content">

        <svg-icon-btn :icon="ErrorRecordIcon" :on-click="()=>{}"
                      text="错题本"/>
        <svg-icon-btn :icon="StaticalIcon" :on-click="()=>{}"
                      class="ms-5"
                      text="统计"/>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>

</style>
