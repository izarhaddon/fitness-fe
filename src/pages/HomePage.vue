<script setup lang="ts">
import { api } from '@/utils/api.ts'
import { ref } from 'vue'

const users = ref([]);

api.get('/api/users')
.then((res) => {
  users.value = res.data
})
</script>

<template>
<div>HomePage</div>
<div>{{ users }}</div>
</template>

<style scoped>

</style>
