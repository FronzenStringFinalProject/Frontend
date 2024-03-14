<script setup lang="ts">

import CheckInIcon from "@/assets/check_in.svg?component";
import ErrorRecordIcon from "@/assets/error_record.svg?component";
import SvgIconBtn from "@/components/SvgIconBtn";
import CheckIn from "@/components/CheckIn.vue";
import {useRouter} from "vue-router";

const router = useRouter()
</script>

<template>
  <v-row id="button-area" class="w-100" no-gutters style="">
    <v-col cols="2">

    </v-col>
    <v-col cols="4" offset="6">

      <svg-icon-btn :icon="CheckInIcon" :on-click="()=>{}"
                    class="mr-5 justify-end" text="打卡"/>
      <svg-icon-btn :icon="ErrorRecordIcon" :on-click="()=>{}"
                    class="justify-end" text="错题本"/>
    </v-col>
  </v-row>
  <check-in/>
  <v-btn @click="router.push({name:'child-quiz'})">开始练习</v-btn>
</template>

<style scoped>

</style>