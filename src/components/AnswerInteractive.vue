<script lang="ts" setup>
import {defineExpose, onMounted, onUnmounted, ref, watch} from "vue";
import {MicVAD} from "@ricky0123/vad-web";
import audioBufferToWav from "audiobuffer-to-wav";
import {QuizAnswerState, RecordState, State, StateForward} from "@/utils/ansCollector.ts";
import {speaking} from "@/utils/speechSynthesis.ts";


const emits = defineEmits<{
  mic: [on: boolean, activate: boolean],
  voice: [on: boolean],
  state: [state: string]
}>()


const props = defineProps<{
  nextQuiz: () => Promise<{ id: string, quiz: string, quiz_speak: string }>,
  submitAudio: (audio: Blob) => Promise<{ ans?: number, neg: boolean, pos: boolean }>
  submitAnswer: (id: string, ans: number) => Promise<boolean>
}>()

const stop = ref(false)

const pause = () => {
  stop.value = true
}
const start = () => {
  stop.value = false
}
defineExpose({pause, start})


const stateForward = new StateForward()
const VadManager = ref<MicVAD | null>()
const audioBlob = ref<Blob | null>()
const audioElement = ref<HTMLAudioElement | null>()
const onSpecking = ref(false)
const onPlaying = ref(false)
const currentQuiz = ref<{ id: string, quiz: string, quiz_speak: string } | null>()
const quizAns = ref<number | null>()
const currentTimeout = ref<NodeJS.Timeout | null>()
const currentState = ref("Begin")


const setVadState = (enable: boolean) => {
  if (enable) {
    VadManager.value?.start()
    emits("mic", true, false)
  } else {
    VadManager.value?.pause()
    emits("mic", false, false)
  }
}

watch(audioElement, (element) => {
  if (element) {

    element.onpause = () => {
      onPlaying.value = false
      setVadState(true)

    }
  }
})

watch(onPlaying, (value) => {
  emits("voice", value)
})


watch(stop, (sta) => {
  if (!sta) {
    if (stateForward.getState() == "Pause")
      handleStateAction(stateForward.nextState({requestPause: sta}))
  }
})

const speakingCallback = (play: boolean = true) => {
  return () => {
    const newState = stateForward.nextState({requestPause: stop.value})
    if (play)
      audioElement.value?.play()
    else
      onPlaying.value = false
    handleStateAction(newState)
  }
}

const handleStateAction = (state: State) => {
  currentState.value = state
  emits("state", state)
  console.log(state)
  switch (state) {
    case "Begin":
      setVadState(false)
      handleStateAction(stateForward.nextState({
        requestPause: stop.value
      }))
      break;
    case "GenIntroAsk":
      setVadState(false)
      speaking("欢迎使用盲算练习平台，请问是否需要介绍练习过程？", onPlaying, speakingCallback())
      VadManager.value?.pause()
      break
    case "ConvIntroRequire":
      setVadState(false)
      if (currentTimeout.value) clearTimeout(currentTimeout.value)
      props.submitAudio(audioBlob.value!).then((resp) => {
        let needIntro: boolean
        needIntro = resp.pos;
        audioBlob.value = null
        handleStateAction(stateForward.nextState({requestPause: stop.value, needIntro: needIntro}))
      })
      break
    case "GenIntro":
      setVadState(false)
      speaking("练习过程中，首先会通过语音将题目告知你，然后你需要在“叮”声后开始作答。请确保咬字清晰。现在将开始练习。。。", onSpecking, speakingCallback(true))
      VadManager.value?.pause()
      break
    case "FetchQuiz":
      setVadState(false)
      props.nextQuiz()
          .then((quiz) => {
            currentQuiz.value = quiz
            console.log(quiz)
            handleStateAction(stateForward.nextState({
              requestPause: stop.value
            }))
          })
      break;
    case "GenQuizSound":
      setVadState(false)
      speaking(`请问 ${currentQuiz.value?.quiz_speak} 等于多少`, onPlaying,
          speakingCallback())
      VadManager.value?.pause()
      break;
    case "WaitIntro":
    case "WaitAns":
      setVadState(true)
      if (audioBlob.value) {
        handleStateAction(stateForward.nextState({
          requestPause: stop.value,
          recordState: "Recording"
        }))
      }
      currentTimeout.value = setTimeout(() => {
        let rs: RecordState;
        console.log(onSpecking.value)
        if (onSpecking.value) {
          rs = "Recording"
        } else if (audioBlob.value) {
          rs = "Done"
        } else {
          rs = "Idle"
        }
        handleStateAction(stateForward.nextState({
          recordState: rs,
          requestPause: stop.value
        }))
      }, 3000)
      break;
    case "ConvAns":
      setVadState(false)
      if (currentTimeout.value) {
        clearTimeout(currentTimeout.value)
      }
      props.submitAudio(audioBlob.value!)
          .then((ans) => {
            audioBlob.value = null
            let qs: QuizAnswerState
            if (ans.ans) {
              qs = "Detected"
              quizAns.value = ans.ans
            } else if (ans.neg) {
              qs = "Unknown"
            } else {
              qs = "NoDetect"
            }
            handleStateAction(stateForward.nextState({quizState: qs, requestPause: stop.value}))
          })
      break;
    case "UndetectedAns":
      speaking("抱歉，没听清", onPlaying, speakingCallback(false))
      VadManager.value?.pause()
      break
    case "GenAnsCheck":
      speaking(`${currentQuiz.value?.quiz_speak}的答案是
      ${quizAns.value},如需要修改，请回答你的答案`, onPlaying, speakingCallback())
      break;
    case "WaitCorrect":
      setVadState(true)
      if (currentTimeout.value) {
        clearTimeout(currentTimeout.value)
      }
      currentTimeout.value = setTimeout(() => {
        let rs: RecordState;
        if (onSpecking.value) {
          rs = "Recording"
        } else if (audioBlob.value) {

          rs = "Done"
        } else {
          rs = "Idle"
        }
        handleStateAction(stateForward.nextState({recordState: rs, requestPause: stop.value}))
      }, 2000)
      break;
    case "Submit":
      setVadState(false)
      props.submitAnswer(currentQuiz.value!.id, quizAns.value!)
          .then((ans) => {
            console.log(ans)
            speaking("好的，下一题", onPlaying, speakingCallback(false))
            VadManager.value?.pause()
          })
      break;
    case "Unknown":
      speaking("好的，下一题", onPlaying, speakingCallback(false))
      VadManager.value?.pause()
      break;
    case "Pause":

      if (!stop.value) {
        handleStateAction(stateForward.nextState({requestPause: stop.value}))
      } else {
        VadManager.value?.pause()
      }
      break;
    case "Exit":
      VadManager.value?.pause()
      break;
  }
}

const audioConv = (audio: Float32Array, rate: number = 16000) => {
  const ctx = new AudioContext()
  const buff = ctx.createBuffer(1, audio.length, rate)
  const channelBuff = buff.getChannelData(0)
  for (let i = 0; i < audio.length; i++) {
    channelBuff[i] = audio[i]
  }
  const waveAudio = audioBufferToWav(buff)

  return new Blob([waveAudio], {type: "audio/wav"})
}

const vadInit = async () => {
  emits("mic", true, true)
  VadManager.value = await MicVAD.new({
    onSpeechStart() {
      emits("mic", true, true)
      if (currentQuiz) {
        onSpecking.value = true
      }
    },
    onSpeechEnd(aud) {
      console.log("ending")
      emits("mic", true, false)
      onSpecking.value = false
      audioBlob.value = audioConv(aud)
      handleStateAction(stateForward.nextState({recordState: "Done", requestPause: stop.value}))
      if (currentTimeout.value)
        clearTimeout(currentTimeout.value)

    },
  })
}

onMounted(() => {
  vadInit()
  handleStateAction(stateForward.nextState({requestPause: stop.value}))
})

onUnmounted(() => {
  handleStateAction(stateForward.nextState({exit: true}))
})

</script>

<template>
  <audio ref="audioElement" src="/di.mp3"/>
  <!--  <span v-if="currentQuiz">{{ currentQuiz.quiz }}</span>-->
  <!--  <span>{{ currentState }}</span>-->
</template>

<style scoped>

</style>