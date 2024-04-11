<script lang="ts" setup>
import {useRouter} from "vue-router";

const router = useRouter()

</script>

<template>
  <v-container class="d-flex flex-column " dense>

    <h2>欢迎使用童蒙启算——自适应儿童盲算系统</h2>
    <v-btn append-icon="mdi mdi-arrow-right-circle" size="x-large" style="margin-top: 150px; align-self: center" rounded="xl"
           class="bg-deep-purple-accent-4"
           @click="router.push('/entry')">立即开始使用
    </v-btn>
  </v-container>
</template>

<style scoped>

</style>