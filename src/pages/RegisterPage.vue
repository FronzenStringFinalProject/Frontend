<script lang="ts" setup>
import {computed, ref} from "vue";
import {register} from "@/apiRequest/parent/authorize/login.ts";
import {useRouter} from "vue-router";

const onRegister = ref(false)
const parentName = ref("")
const parentPwd = ref("")
const parentId = ref("")
const parentSecret = ref("")

const canRegister = computed(() => parentName.value.length > 0 && parentPwd.value.length > 0 && parentId.value.length > 0 && parentSecret.value.length > 0);
const rules = [
  (value) => !!value || "请输入用户名或密码"
]
const router = useRouter()


const doParentRegister
    = () => {
  register(parentName.value, parentPwd.value, parentId.value, parentSecret.value).then(() => {
    onRegister.value = false
    router.push({name: "login"})

  })
  onRegister.value = true
}

</script>

<template>
  <v-app-bar color="primary" title="家长注册">
  </v-app-bar>

  <v-card :loading="onRegister" class="w-50 ma-5 elevation-4 rounded-lg d-inline-flex flex-column pa-10 h-75">
    <v-card-text class="font-weight-thin">
      <v-text-field ref="user_id" v-model="parentName" :rules="rules" class="ma-5" clearable
                    hint="家长姓名" label="家长名称" prepend-icon="mdi mdi-account-circle"/>
      <v-text-field ref="user_id" v-model="parentId" :rules="rules" class="ma-5" clearable
                    hint="家长登录时的唯一凭证" label="家长ID" prepend-icon="mdi mdi-account-circle"/>
      <v-text-field ref="user_pwd" v-model="parentPwd" :rules="rules" class="ma-5" clearable hint="家长登录用密码"
                    label="家长密码" prepend-icon="mdi mdi-lock" type="password"/>
      <v-text-field ref="user_pwd" v-model="parentSecret" :rules="rules" class="ma-5" clearable
                    hint="从孩子模式返回家长模式使用的密钥"
                    label="家长返回密钥" prepend-icon="mdi mdi-lock" type="password"/>
    </v-card-text>
    <v-card-actions class="d-inline-flex justify-end">
      <v-btn :disabled="!canRegister" elevation="3" @click="doParentRegister">
        注册
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>

</style>