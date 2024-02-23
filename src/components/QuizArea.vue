<script lang="ts" setup>
import LionIcon from "../assets/lion.svg?component"

const props = defineProps<{
  quiz: string
}>()

</script>

<template>

    <v-row class="" >

      <v-col cols="3">
        <LionIcon class="" style="margin-top: -140px" transform="scale(0.6,0.6)" height="700"/>
      </v-col>
      <v-col cols="5">

        <span class="d-inline-flex align-center">{{ props.quiz }} = ?</span>
      </v-col>
    </v-row>
    <!--    <v-container id="backboard" style="" class="ma-0 d-flex justify-center align-center" width="500">-->
    <!--      <p style="color: white ;font-size: xxx-large">TTT</p>-->
    <!--    </v-container>-->
    <!--    <black-board class="" style="margin-left: -500px;margin-top: -100px" width="600">-->

</template>

<style scoped>


</style>