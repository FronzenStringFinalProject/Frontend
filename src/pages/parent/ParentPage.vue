<script lang="ts" setup>
import {useRouter} from "vue-router";
import AuthorizeManager from "@/utils/authorize.ts";
import {onMounted, ref} from "vue";
import {getParentName} from "@/apiRequest/parent/authorize/parent_info.ts";
import {ResponseResult} from "@/apiRequest/baseRequest.ts";

const router = useRouter();
const parentName = ref<string>("x")

// callback
const logout = () => {
  AuthorizeManager.clearToken();
  router.push("/")
}

onMounted(()=>{
  getParentName(AuthorizeManager.getToken())
      .then((resp:ResponseResult<string>)=>{
        parentName.value=resp.expect()
      })
})

</script>

<template>
  <v-app-bar color="primary" elevation="2">
    <template #prepend>
      <v-col>

      <v-avatar color="deep-purple-accent-4">{{ parentName.length > 0 ? parentName[0] : "-"}}</v-avatar>
      <span class="ms-4">{{parentName}} 欢迎回来</span>
      </v-col>
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