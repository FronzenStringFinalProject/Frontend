<script setup lang="ts">
import {useRouter} from "vue-router";

const router = useRouter()

</script>

<template>
  <v-container dense class="d-flex flex-column ">

  <h2>欢迎使用童蒙启算——自适应儿童盲算系统</h2>
  <v-btn size="x-large"  style="margin-top: 150px; align-self: center" append-icon="mdi mdi-arrow-right-circle" @click="router.push('/entry')">立即开始使用</v-btn>
  </v-container>
</template>

<style scoped>

</style>