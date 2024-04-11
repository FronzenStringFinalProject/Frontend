<script lang="ts" setup>
import {computed, ref} from "vue";
import {parentLogin} from "@/apiRequest/parent/authorize/login.ts";
import {ResponseResult} from "@/apiRequest/baseRequest.ts";
import AuthorizeManager from "@/utils/authorize.ts";
import {useRouter} from "vue-router";

const props = defineProps<{
  returnUri?: string
}>()

const router = useRouter()

const rules = [
  (value) => !!value || "请输入用户名或密码"
]

const doParentLogin=()=>{
  parentLogin(parentId.value,parentPwd.value).then((resp:ResponseResult<string>)=>{
        AuthorizeManager.setToken(resp.expect());
        AuthorizeManager.SwitchState("Parent")
        if (props.returnUri){

        router.push({
         path:props.returnUri
        })
        }else {
          router.push({
            path:"/parent"
          })
        }
  }).catch((err)=>{
    alert(`登录失败：${err}`)
  })
      .finally(()=>{
    onLogin.value= false
  })
  onLogin.value=true
}


const parentId =ref("")
const parentPwd = ref("")
const canLogin=computed(()=>parentId.value.length>0 && parentPwd.value.length>0);
const onLogin = ref(false)

</script>

<template>
  <v-app-bar color="primary" title="家长登录">
  </v-app-bar>

  <v-card :loading="onLogin" class="w-50 ma-5 elevation-4 rounded-lg d-inline-flex flex-column pa-10 h-50">
    <v-card-text>
      <v-text-field v-model="parentId" ref="user_id" :rules="rules" clearable label="家长ID" prepend-icon="mdi mdi-account-circle" class="ma-5"/>
      <v-text-field type="password" v-model="parentPwd" ref="user_pwd" :rules="rules" clearable label="家长密码" prepend-icon="mdi mdi-lock" class="ma-5"/>
    </v-card-text>
      <v-card-actions class="d-inline-flex justify-end" @click="router.push({name:'register'})">
        <v-btn elevation="3">
          注册
        </v-btn>
      <v-btn elevation="3" :disabled="!canLogin" @click="doParentLogin">
        <template #prepend>
          <v-icon icon="mdi mdi-login-variant"/>
        </template>
        登录
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>

</style>