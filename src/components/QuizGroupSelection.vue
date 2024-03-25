<script lang="ts" setup>
import {onMounted, ref} from "vue";
import {
  addQuizGroup,
  getAllQuizGroup,
  QuizGroupItem,
  removeQuizGroup
} from "@/apiRequest/child/quiz_group_selection.ts";
import AuthorizeManager from "@/utils/authorize.ts";
import {ServiceResponse} from "@/apiRequest/baseRequest.ts";

const quizGroupList = ref<QuizGroupItem[]>([])

onMounted(() => {
  getAllQuizGroup(AuthorizeManager.getToken())
      .then((resp: ServiceResponse<QuizGroupItem[]>) => {
        quizGroupList.value = resp.body
      })
})

const onChangeSelection = async (select: boolean, gid: number) => {
  if (select) {
    await addQuizGroup(AuthorizeManager.getToken(), gid)
  } else {
    await removeQuizGroup(AuthorizeManager.getToken(), gid)
  }
  quizGroupList.value = (await getAllQuizGroup(AuthorizeManager.getToken())).body
}

</script>

<template>
  <v-card
      title="题型选择"

  >
    <v-card-text>
      <v-list>
        <v-list-item v-for="info in quizGroupList" :key="info.gid" class=""
                     @click="onChangeSelection(!info.select,info.gid)">
          <template #prepend="{}">
            <v-checkbox-btn v-model="info.select"
                            @update:model-value="(select)=>{onChangeSelection(select,info.gid)}"></v-checkbox-btn>
          </template>
          <v-list-item-title class="font-weight-bold" style="font-size: 25px">{{ info.name }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card-text>
  </v-card>
</template>

<style scoped>

</style>