<script lang="ts" setup>
import {onMounted, ref, watch,defineExpose} from "vue";
import {MicVAD} from "@ricky0123/vad-web";
import audioBufferToWav from "audiobuffer-to-wav";
import {QuizAnswerState, RecordState, State, StateForward} from "@/utils/ansCollector.ts";
import {speaking} from "@/utils/speechSynthesis.ts";


const emits = defineEmits<{
  mic: [on: boolean, activate: boolean],
  voice: [on: boolean]
}>()


const props = defineProps<{
  nextQuiz: () => Promise<{ id: string, quiz: string, quiz_speak: string }>,
  submitAudio: (audio: Blob) => Promise<{ ans?: number, neg: boolean }>
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
    element.onplay = () => {
      emits("voice", true)
    }
    element.onpause = () => {
      emits("voice", false)
      setVadState(true)

    }
  }
})

watch(stop, (sta) => {
  if (!sta) {
    if (stateForward.getState()=="Pause")
    handleStateAction(stateForward.nextState("Recording","Unknown",sta))
  }
})

const speakingCallback = (play: boolean = true, record: RecordState = "Idle", quiz: QuizAnswerState = "Unknown", stop: boolean = false) => {
  return () => {
    const newState = stateForward.nextState(record, quiz, stop)
    if (play)
      audioElement.value?.play()
    handleStateAction(newState)
  }
}

const handleStateAction = (state: State) => {
  currentState.value = state
  switch (state) {
    case "Begin":
      setVadState(false)
      handleStateAction(stateForward.nextState())
      break;
    case "FetchQuiz":
      setVadState(false)
      props.nextQuiz()
          .then((quiz) => {
            currentQuiz.value = quiz
            console.log(quiz)
            handleStateAction(stateForward.nextState())
          })
      break;
    case "GenQuizSound":
      setVadState(false)
      speaking(`请问 ${currentQuiz.value?.quiz_speak} 等于多少`,
          speakingCallback())
      VadManager.value?.pause()
      break;
    case "WaitAns":
      setVadState(true)
      if (audioBlob.value) {
        handleStateAction(stateForward.nextState("Recording"))
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
        handleStateAction(stateForward.nextState(rs))
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
            handleStateAction(stateForward.nextState("Idle", qs))
          })
      break;
    case "UndetectedAns":
      speaking("抱歉，没听清", speakingCallback(false))
      VadManager.value?.pause()
      break
    case "GenAnsCheck":
      speaking(`${currentQuiz.value?.quiz_speak}的答案是
      ${quizAns.value},如需要修改，请回答你的答案`, speakingCallback())
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
        handleStateAction(stateForward.nextState(rs))
      }, 2000)
      break;
    case "Submit":
      setVadState(false)
      props.submitAnswer(currentQuiz.value!.id, quizAns.value!)
          .then((ans) => {
            console.log(ans)
            speaking("好的，下一题", speakingCallback(false, "Recording", "Unknown", stop.value))
            VadManager.value?.pause()
          })
      break;
    case "Unknown":
      speaking("好的，下一题", speakingCallback(false, "Recording", "Unknown", stop.value))
      VadManager.value?.pause()
      break;
    case "Pause":
      if (!stop.value){
        handleStateAction(stateForward.nextState("Recording","Unknown",stop.value))
      }
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
      emits("mic", true, false)
      if (currentQuiz.value) {
        if (currentTimeout.value)
          clearTimeout(currentTimeout.value)
        onSpecking.value = false
        audioBlob.value = audioConv(aud)
        handleStateAction(stateForward.nextState("Done"))
      }

    },
  })
}

onMounted(() => {
  vadInit()
  handleStateAction(stateForward.nextState())
})

</script>

<template>
  <audio ref="audioElement" src="/di.mp3"/>
  <span v-if="currentQuiz">{{ currentQuiz.quiz }}</span>
  <span>{{ currentState }}</span>
</template>

<style scoped>

</style>