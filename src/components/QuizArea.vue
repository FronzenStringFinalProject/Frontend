<script lang="ts" setup>
import LionIcon from "../assets/lion.svg?component"
import BlackBoard from "../assets/blackborad.svg?component"
const props = defineProps<{
  quiz: string
}>()

</script>

<template>

    <v-row class="d-flex align-center" >
      <v-col offset="1" cols="3">
        <LionIcon transform="scale(0.7,0.7)" height="700"/>
      </v-col>
      <v-col cols="4">
        <div class="blackboard d-flex align-center justify-center">

        <span  class="quiz">{{ props.quiz }} = ?</span>
        </div>


      </v-col>
    </v-row>


</template>

<style scoped>
.blackboard{
  position: relative;
  z-index: 1;
  width: 700px;
  height: 350px;
  background: url("../assets/blackborad.svg") no-repeat;
}
.quiz{
  position: relative;
  z-index: 2;
  font-family: '黑体', system-ui;
  font-size: 2.2rem;
  font-weight: 900;
  color: white;
}

</style>