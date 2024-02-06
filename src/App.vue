<script lang="ts" setup>
import RankIcon from "./assets/rank.svg?component"
import CheckInIcon from "./assets/check_in.svg?component"
import ErrorRecordIcon from "./assets/error_record.svg?component"
import StaticalIcon from "./assets/statical.svg?component"
import SvgIconBtn from "@/components/SvgIconBtn.vue";
import QuizArea from "@/components/QuizArea.vue";
import {onMounted, ref, watch} from "vue";
import {MicVAD} from "@ricky0123/vad-web";
import audioBufferToWav from "audiobuffer-to-wav"
const thisVad = ref<MicVAD|null>(null)
const wav_url = ref("")
const audio = ref<HTMLAudioElement|null>()
const vad_activate = ref(false)
const t = ref("")
watch(audio,(v)=>{
  if (v){
    v.onplay=()=>{
      if (thisVad){
        thisVad.value?.pause()
      }
    }
    v.onpause=()=>{
      thisVad.value?.start()
    }
  }
})

onMounted(()=>{

  MicVAD.new({
    onSpeechStart() {
      console.log("starting")
    },
    onSpeechEnd:(audio)=> {
      console.log("caputure Voice")
        let ctx = new AudioContext()
      const audioBuf =ctx.createBuffer(1,audio.length,16000)
      const channelData = audioBuf.getChannelData(0);
      for (let i = 0; i <audio.length; i++) {
        channelData[i] = audio[i]
      }
      console.log(audioBufferToWav)
      const wav = audioBufferToWav(audioBuf);
      //https://stackoverflow.com/questions/61253805/whats-the-best-way-to-get-an-audio-buffer-into-a-blob-that-can-be-played-by-an
      wav_url.value = URL.createObjectURL(new Blob([wav],{ type: "audio/wav" }))

      const form =new FormData()
      form.set("file",new Blob([wav],{ type: "audio/wav" }),"record.wav")

      fetch("http://127.0.0.1:8000/recognition",{
        method:"POST",
        body:form
      }).then((res)=>{
        res.json().then(({result}:{result:string})=>{
          t.value += `${result}。`
        })
      })

    },
  }).then((vad)=>{thisVad.value=vad;vad.start();vad_activate.value=true})
})

function transVadState(){
  if (thisVad.value){
    if (vad_activate.value){
      thisVad.value.pause()
    }else {
      thisVad.value.start()
    }
  }
}
</script>

<template>
  <v-app>

    <v-main class="w-100">
      <span>{{t}}</span>
      <v-btn @click="transVadState">Stop</v-btn>
<!--      <audio ref="audio" :src="wav_url" controls autoplay/>-->
      <quiz-area/>

      <v-container style="position: absolute ; bottom: 0 ;left: 0;width: fit-content" class="d-flex ms-5 mb-5">

      <svg-icon-btn :icon="RankIcon" :on-click="()=>{}"
                    class="me-5"
                     text="排行榜"/>
      <svg-icon-btn :icon="CheckInIcon" :on-click="()=>{}"
                    text="打卡"/>
      </v-container>
      <v-container style="position: absolute ; bottom: 0 ;right: 0;width: fit-content" class="d-flex me-5 mb-5">

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
