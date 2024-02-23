<script lang="ts" setup>
import {useRouter} from "vue-router";
import AuthorizeManager from "@/utils/authorize.ts";

const router = useRouter();


// callback
const logout = () => {
  AuthorizeManager.clearToken();
  router.push("/")
}
</script>

<template>
  <v-app-bar color="primary" elevation="2">
    <template #prepend>
      <v-avatar color="orange">A</v-avatar>
    </template>

    <template #title>家长管理</template>

    <template #append>
      <v-btn  @click="logout">
        <template #prepend>
          <v-icon icon="mdi mdi-logout"></v-icon>
        </template>
        登出</v-btn>
    </template>
  </v-app-bar>
  <router-view/>
</template>

<style scoped>

</style>