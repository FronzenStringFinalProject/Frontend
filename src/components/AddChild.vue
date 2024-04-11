<script setup lang="ts">
import {computed, ref} from "vue";
import {createChild} from "@/apiRequest/parent/childManage/childBase.ts";
import AuthorizeManager from "@/utils/authorize.ts";
import {ResponseResult} from "@/apiRequest/baseRequest.ts";

const childName = ref("")
const canAdd = computed(()=>{return childName.value != ""})
const activate = ref(false)

const addChild = ()=>{
  createChild(AuthorizeManager.getToken(),childName.value)
      .then((resp:ResponseResult<number>)=>{
        console.log("child ID is ",resp.expect())
        activate.value=false
        emits("done")
      })
}

const emits = defineEmits([
    "done"
])

</script>

<template>
  <v-dialog v-model="activate">
    <template #activator="{props}">
      <v-btn prepend-icon="mdi mdi-plus" class="bg-green" rounded="lg" elevation="3" v-bind="props">添加孩子</v-btn>

    </template>
    <v-card title="添加孩子" class="w-50" style="align-self: center">
      <v-card-text>
        <v-text-field label="孩子姓名" v-model="childName"></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn rounded="lg" elevation="3" :disabled="!canAdd" @click="addChild">确认</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>

</style>