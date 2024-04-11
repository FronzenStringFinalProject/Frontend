<script setup lang="ts">

import CheckIn from "@/components/CheckIn.vue";

const props = defineProps<{cid:number}>()
</script>

<template>
<check-in :in-parent="true" :cid="props.cid"/>
</template>

<style scoped>

</style>