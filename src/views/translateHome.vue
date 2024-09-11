<template>
  <div>
    <h1 class="text-2xl font-bold">Lenguajes Disponibles</h1>
    <ul>
      <li v-for="language in languages" :key="language.code">
        {{ language.name }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { getLanguages } from '../controllers/translateController.ts';

const languages = ref<string[]>([]);

onMounted(async () => {
  try {
    const result = await getLanguages();
    languages.value = result.languages;
  } catch (error) {
    console.error('Error loading languages:', error);
  }
});
</script>

<style scoped>
  /* Estilos específicos de la vista */
</style>
