<script lang="ts" setup>
const props = defineProps<{
  title?:string
}>()
</script>

<template>
  <v-container class="d-flex justify-center h-100">
    <v-card class="w-66  ma-10 rounded-lg elevation-3 ">
      <template #title>
        <slot name="title">{{title}}</slot>

      </template>
      <v-card-text>
        <slot name="body"/>
      </v-card-text>
      <v-card-actions>
        <slot name="actions"/>
      </v-card-actions>

    </v-card>
  </v-container>
</template>

<style scoped>

</style>