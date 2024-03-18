<script lang="ts" setup>

import CheckInIcon from "@/assets/check_in.svg?component";
import ErrorRecordIcon from "@/assets/error_record.svg?component";
import RankIcon from "@/assets/rank.svg?component"
import SvgIconBtn from "@/components/SvgIconBtn";
import {useRouter} from "vue-router";
import ChildLevel from "@/components/ChildLevel.vue";
import {ref} from "vue";
import CheckIn from "@/components/CheckIn.vue";

const router = useRouter()
const showCheckIn = ref(false)

</script>

<template>
  <v-card class="flex-column align-center d-flex justify-center" style="width: fit-content;align-self: center">
    <v-card-title class="mb-5 d-inline-flex flex-column justify-start align-self-baseline w-100">

      <child-level />
    </v-card-title>
    <v-card-text>
      <svg-icon-btn :icon="CheckInIcon" :on-click="()=>{showCheckIn = true}"
                    class="mr-5 justify-end" text="打卡"/>
      <svg-icon-btn :icon="ErrorRecordIcon" :on-click="()=>{}"
                    class="justify-end mr-5" text="错题本"/>
      <SvgIconBtn :icon="RankIcon" :on-click="()=>{}" text="排行榜" class="justify-center"/>

      <!--      <check-in/>-->

    </v-card-text>
    <v-card-actions>
      <v-btn @click="router.push({name:'child-quiz'})">前往练习</v-btn>
    </v-card-actions>
  </v-card>
  <v-dialog v-model="showCheckIn" width="auto">
    <check-in/>
  </v-dialog>
</template>

<style scoped>

</style>