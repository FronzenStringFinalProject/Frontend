<script setup lang="ts">

import ChildWrongRecordList from "@/components/ChildWrongRecordList.vue";
const props = defineProps<{cid:number}>()
</script>

<template>

<child-wrong-record-list :cid="cid"/>
</template>

<style scoped>

</style>