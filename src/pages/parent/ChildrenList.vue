<script lang="ts" setup>

import ChildInfoCard from "@/components/ChildInfoCard.vue";
import {onMounted, ref} from "vue";
import getChildrenList, {ChildrenListItem} from "@/apiRequest/parent/childManage/childrenListItem.ts";
import AuthorizeManager from "@/utils/authorize.ts";
import {useRouter} from "vue-router";
import {ResponseResult} from "@/apiRequest/baseRequest.ts";
import AddChild from "@/components/AddChild.vue";
// utils
const router = useRouter()

// states
const childrenListLoadDone = ref(false)
const childrenList = ref<ChildrenListItem[]|null>(null)

// hooks
onMounted(()=>{
  loadChildrenList()
})

const loadChildrenList = () => {
  getChildrenList(AuthorizeManager.getToken()).then((resp:ResponseResult<ChildrenListItem[]>)=>{
    childrenList.value= resp.expect()
    childrenListLoadDone.value = true
  })
}

// callbacks
const accessDetail=(id:number)=>{
  router.push({name:"child-detail",params:{cid:id}})
}
</script>

<template>
  <child-info-card title="全部孩子基本信息">
    <template #body>
      <v-table v-if="childrenListLoadDone">
        <thead>
          <tr>
            <th class="text-left">
              孩子姓名
            </th>
          <th class="text-left">孩子当前水平</th>
            <th class="text-left">操作</th>
        </tr>
        </thead>
        <tbody>
          <tr v-for="item in childrenList">
            <th>{{item.name}}</th>
            <th>{{item.ability}}</th>
            <th>
              <v-btn @click="accessDetail(item.cid)">查看</v-btn>
            </th>
          </tr>
        </tbody>
      </v-table>
    <v-progress-circular color="primary" v-else indeterminate/>

    </template>
    <template #actions>
      <add-child @done="loadChildrenList"/>
    </template>
  </child-info-card>


</template>

<style scoped>

</style>