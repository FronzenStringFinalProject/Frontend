<script lang="ts" setup>
import {onMounted, ref} from "vue";
import {
  addQuizGroup,
  getAllQuizGroup,
  QuizGroupItem,
  removeQuizGroup
} from "@/apiRequest/child/quiz_group_selection.ts";
import AuthorizeManager from "@/utils/authorize.ts";
import {ResponseResult} from "@/apiRequest/baseRequest.ts";

const quizGroupList = ref<QuizGroupItem[]>([])

onMounted(() => {
  getAllQuizGroup(AuthorizeManager.getToken())
      .then((resp: ResponseResult<QuizGroupItem[]>) => {
        quizGroupList.value = resp.expect()
      })
})

const onChangeSelection = async (select: boolean, gid: number) => {
  if (select) {
    await addQuizGroup(AuthorizeManager.getToken(), gid)
  } else {
    await removeQuizGroup(AuthorizeManager.getToken(), gid)
  }
  quizGroupList.value = (await getAllQuizGroup(AuthorizeManager.getToken())).expect()
}

</script>

<template>
  <v-card  class="pa-3">
    <v-card-title class="font-weight-bold" style="font-size: 25px">
      题型选择
    </v-card-title>
    <v-card-subtitle>
      选择想要进行练习的题目
    </v-card-subtitle>
    <v-divider class="mt-4"/>
    <v-card-text>
      <v-list>
        <v-list-item v-for="info in quizGroupList" :key="info.gid" class=""
                     @click="onChangeSelection(!info.select,info.gid)">
          <template #prepend="{}">
            <v-checkbox-btn v-model="info.select" color="primary"
                            @update:model-value="(select)=>{onChangeSelection(select,info.gid)}"></v-checkbox-btn>
          </template>
          <v-list-item-title class="font-weight-medium" style="font-size: large">{{ info.name }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<style scoped>

</style>