<script setup lang="ts">
import {useRouter} from "vue-router";

const router = useRouter()

</script>

<template>
  <p>Home</p>
  <v-btn @click="router.push('parent')">家长管理</v-btn>
  <v-btn @click="router.push({name:'child-manage'})">孩子管理</v-btn>
</template>

<style scoped>

</style>