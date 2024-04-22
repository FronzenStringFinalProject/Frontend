<script lang="ts" setup>

import ChildRankItem from "@/components/ChildRankItem.vue";
import {onMounted, ref} from "vue";
import {ChildRank} from "@/apiRequest/child/childRank.ts";

const props = defineProps<{
  getRank: () => Promise<ChildRank[]>
}>()

const rankLen = 10
const rankList = ref<ChildRank[]>([])
const thisChild = ref<ChildRank | null>(null);

onMounted(() => {
  props.getRank()
      .then((rank: ChildRank[]) => {
            for (let i = 0; i < rank.length; i++) {
              const thisRank = rank[i]
              if (!thisRank.is_child) {
                rankList.value.push(thisRank)
              } else {
                // 是孩子，但是上榜
                if (i < rankLen) {
                  rankList.value.push(thisRank)
                }
                thisChild.value = thisRank
              }
            }
          }
      )
})


</script>

<template>
  <v-list v-if="rankList" class="elevation-1 rounded-lg">
    <child-rank-item v-for="rank in rankList" :child-rank="rank" :key="rank.cid" />
  </v-list>
  <child-rank-item v-if="thisChild" :child-rank="thisChild" color="deep-orange-lighten-1"/>
</template>

<style scoped>

</style>