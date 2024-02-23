<script setup lang="ts">
import {useRouter} from "vue-router";

const router = useRouter()

</script>

<template>
  <p>Home</p>
  <v-btn @click="router.push('parent')">家长管理</v-btn>
  <v-btn @click="router.push('quiz')">做题</v-btn>
</template>

<style scoped>

</style>