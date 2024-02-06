<script lang="ts" setup>
import LionIcon from "../assets/lion.svg?component"
import BlackBoard from "../assets/blackborad.svg?url"
</script>

<template>

  <v-container class="d-flex justify-center align-center pa-0 mt-5" style="">
    <LionIcon class="" style="margin-left: -100px;margin-right: -150px" transform="scale(0.75,0.75)" width="950" height="700"/>
    <v-container id="backboard" style="" class="ma-0 d-flex justify-center align-center" width="500">
      <p style="color: white ;font-size: xxx-large">TTT</p>
    </v-container>
<!--    <black-board class="" style="margin-left: -500px;margin-top: -100px" width="600">-->

  </v-container>
</template>

<style scoped>
#backboard{
  background: v-bind(BlackBoard);
  background: no-repeat center center;
  padding: 100px 20px 115px;
  margin-left: -100px;
}

</style>