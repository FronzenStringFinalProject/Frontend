<script lang="ts" setup>
import {defineExpose, onMounted, onUnmounted, ref} from "vue";
import {RecordState} from "@/utils/ansCollector.ts";
import {AudioResult, FetchedQuiz, QuizTrainManager} from "@/QuizInteractive/quizTrainManager.ts";


const emits = defineEmits<{
  mic: [on: boolean, activate: boolean],
  voice: [on: boolean],
  state: [state: string]
}>()


const props = defineProps<{
  nextQuiz: () => Promise<FetchedQuiz>,
  submitAudio: (audio: Blob) => Promise<AudioResult>
  submitAnswer: (id: number, ans?: number) => Promise<boolean>
}>()

const audioElement = ref<HTMLAudioElement | null>()

const stateHandler = (state: RecordState) => {
  emits("state", state)
}

const manager = ref<QuizTrainManager | null>()

// const stop = ref(false)

const pause = () => {
  manager.value?.pause()
}
const start = () => {
  manager.value?.resume()
}
defineExpose({pause, start})


onMounted(() => {
  QuizTrainManager.create(
      stateHandler,
      audioElement,
      props.nextQuiz,
      props.submitAnswer,
      props.submitAudio,
      (enable: boolean, activate: boolean) => {
        emits("mic", enable, activate)
      },
      (activate: boolean) => {
        emits("voice", activate)
      }
  ).then((man: QuizTrainManager) => {
    console.log("manager init")
    man.nextState({})
    manager.value = man
  })
})

onUnmounted(() => {
  if (manager.value) {
    manager.value?.exit()
  }
})

</script>

<template>
  <audio ref="audioElement" src="/di.mp3"/>
  <!--  <span v-if="currentQuiz">{{ currentQuiz.quiz }}</span>-->
  <!--  <span>{{ currentState }}</span>-->
</template>

<style scoped>

</style>