<script lang="ts" setup>
import {onMounted, ref, watch} from "vue";
import {MicVAD} from "@ricky0123/vad-web";
import audioBufferToWav from "audiobuffer-to-wav";
import {QuizAnswerState, RecordState, State, StateForward} from "@/utils/ansCollector.ts";
import {speaking} from "@/utils/speechSynthesis.ts";

type CurrentState = "FetchQuiz" | "WaitingAnsLong" | "WaitingAnsShort"


const emits = defineEmits<{
  mic: [on: boolean, activate: boolean],
  voice: [on: boolean]
}>()


const props = defineProps<{
  nextQuiz: () => Promise<{ id: string, quiz: string, quiz_speak: string }>,
  submitAudio: (audio: Blob) => Promise<{ ans?: number, neg: boolean }>
  submitAnswer: (id: string, ans: number) => Promise<boolean>
}>()

const stateForward = new StateForward()
const VadManager = ref<MicVAD | null>()
const recording = ref(false)
const audio = ref<Blob | null>()
const audioElement = ref<HTMLAudioElement | null>()
const audioSrc = ref("")
const onSpecking = ref(false)
const currentQuiz = ref<{ id: string, quiz: string, quiz_speak: string } | null>()
const quizAns = ref<number | null>()
const currentTimeout = ref<NodeJS.Timeout | null>()
const currentState = ref("Begin")
watch(audioElement, (element) => {
  if (element) {
    element.onplay = () => {
      emits("voice", true)
      if (VadManager) {
        VadManager.value?.pause()
        emits("mic", false, false)
      }
    }
    element.onpause = () => {
      emits("voice", false)
      if (VadManager) {
        VadManager.value?.start()
        emits("mic", true, false)
      }
    }
  }
})

const stateTransform = (state: State) => {
  currentState.value = state
  switch (state) {
    case "Begin":
      break;
    case "FetchQuiz":
      VadManager.value?.pause()
      props.nextQuiz()
          .then((quiz) => {
            currentQuiz.value = quiz
            stateTransform(stateForward.nextState())
          })
      break;
    case "GenQuizSound":
      speaking(`请问 ${currentQuiz.value?.quiz_speak} 等于多少？`,
          () => {
            VadManager.value?.start()
            stateTransform(stateForward.nextState())
          })
      VadManager.value?.pause()
      break;
    case "WaitAns":
      VadManager.value?.start()
      if (audio.value) {
        stateTransform(stateForward.nextState("Recording"))
      }
      currentTimeout.value = setTimeout(() => {
        let rs: RecordState;
        if (recording.value) {
          rs = "Recording"
        } else if (audio.value) {
          rs = "Done"
        } else {
          rs = "Idle"
        }
        stateTransform(stateForward.nextState(rs))
      }, 3000)
      break;
    case "ConvAns":
      if (currentTimeout.value) {
        clearTimeout(currentTimeout.value)
      }
      VadManager.value?.pause();
      props.submitAudio(audio.value!)
          .then((ans) => {
            audio.value = null
            let qs: QuizAnswerState
            if (ans.ans) {
              qs = "Detected"
              quizAns.value = ans.ans
            } else if (ans.neg) {
              qs = "Unknown"
            } else {
              qs = "NoDetect"
            }
            stateTransform(stateForward.nextState("Idle", qs))
          })
      break;
    case "GenAnsCheck":
      speaking(`${currentQuiz.value?.quiz_speak}的答案是
      ${quizAns.value},如需要修改，请回答你的答案`, () => {
        VadManager.value?.start()
        stateTransform(stateForward.nextState())
      })
      VadManager.value?.pause()
      break;
    case "WaitCorrect":
      VadManager.value?.start()
      if (currentTimeout.value) {
        clearTimeout(currentTimeout.value)
      }
      currentTimeout.value= setTimeout(() => {
        let rs: RecordState;
        if (recording.value) {
          rs = "Recording"
        } else if (audio.value) {

          rs = "Done"
        } else {
          rs = "Idle"
        }
        stateTransform(stateForward.nextState(rs))
      }, 2000)
      break;
    case "Submit":
      props.submitAnswer(currentQuiz.value!.id, quizAns.value!)
          .then((ans) => {
            console.log(ans)
            speaking("好的，下一题", () => {
              VadManager.value?.start()
              stateTransform(stateForward.nextState())

            })
            VadManager.value?.pause()
          })
      break;
    case "Unknown":
      speaking("好的，下一题", () => {
        VadManager.value?.start()
        stateTransform(stateForward.nextState())
      })
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
  VadManager.value = await MicVAD.new({
    onSpeechStart() {
      if (currentQuiz) {
        emits("mic", true, true)
        onSpecking.value = true
      }
    },
    onSpeechEnd(aud) {
      if (currentQuiz.value) {
        if (currentTimeout.value)
          clearTimeout(currentTimeout.value)
        emits("mic", true, false)
        onSpecking.value = false
        const wav = audioConv(aud)
        audio.value = wav
        stateTransform(stateForward.nextState("Done"))
      }

    },
  })
}

onMounted(() => {
  props.nextQuiz().then((quiz) => {
    currentQuiz.value = quiz
  })
  vadInit()
  stateTransform(stateForward.nextState())
})

</script>

<template>
  <span v-if="currentQuiz">{{ currentQuiz.quiz }}</span>
  <span>{{ currentState }}</span>
</template>

<style scoped>

</style>