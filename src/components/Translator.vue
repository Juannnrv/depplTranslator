<template>
  <div class="p-6 max-w-lg mx-auto bg-white rounded-lg shadow-md">
    <h1 class="text-2xl font-bold mb-4">Traductor de Idiomas</h1>

    <div v-if="isLoading" class="text-center">
      <p>Cargando idiomas...</p>
    </div>

    <div v-else>
      <div class="mb-4">
        <label for="text-to-translate" class="block text-sm font-medium text-gray-700">Texto a traducir</label>
        <textarea
          id="text-to-translate"
          v-model="textToTranslate"
          rows="4"
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Escribe el texto aquí"
        ></textarea>
      </div>

      <div class="mb-4 flex space-x-4">
        <div class="w-1/2">
          <label for="source-language" class="block text-sm font-medium text-gray-700">Idioma de origen</label>
          <select
            id="source-language"
            v-model="sourceLang"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option
              v-for="language in languages"
              :key="language.language"
              :value="language.language"
            >
              {{ language.name }}
            </option>
          </select>
        </div>

        <div class="w-1/2">
          <label for="target-language" class="block text-sm font-medium text-gray-700">Idioma de destino</label>
          <select
            id="target-language"
            v-model="targetLang"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option
              v-for="language in languages"
              :key="language.language"
              :value="language.language"
            >
              {{ language.name }}
            </option>
          </select>
        </div>
      </div>

      <button
        @click="handleTranslate"
        class="w-full bg-blue-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-600"
        :disabled="!canTranslate"
      >
        Traducir
      </button>

      <div v-if="translatedText" class="mt-4">
        <h2 class="text-xl font-semibold">Traducción:</h2>
        <p class="text-gray-700">{{ translatedText }}</p>
      </div>

      <div v-if="errorMessage" class="mt-4 text-red-600">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import { getLanguages, translateText } from '../controllers/translateController';

interface Language {
  language: string;
  name: string;
}

export default defineComponent({
  name: 'Translator',
  setup() {
    const languages = ref<Language[]>([]);
    const textToTranslate = ref('');
    const sourceLang = ref('');
    const targetLang = ref('');
    const translatedText = ref<string | null>(null);
    const isLoading = ref(true);
    const errorMessage = ref('');

    const canTranslate = computed(() => {
      return textToTranslate.value.trim() !== '' &&
        sourceLang.value !== '' &&
        targetLang.value !== '' &&
        sourceLang.value !== targetLang.value;
    });

    onMounted(async () => {
      try {
        const result = await getLanguages();
        // Asegúrate de que la estructura sea correcta
        languages.value = result.map((lang: any) => ({
          language: lang.language,
          name: lang.name
        }));
      } catch (error) {
        errorMessage.value = 'Error al cargar los idiomas. Por favor, recarga la página.';
      } finally {
        isLoading.value = false;
      }
    });

    const handleTranslate = async () => {
      errorMessage.value = '';
      if (!canTranslate.value) {
        errorMessage.value = 'Por favor, completa todos los campos y asegúrate de que los idiomas de origen y destino sean diferentes.';
        return;
      }

      try {
        const translation = await translateText(textToTranslate.value, sourceLang.value, targetLang.value);
        console.log(translation); // Verifica qué estás recibiendo
        translatedText.value = translation.data?.translations?.translatedText || 'Error en la traducción';
      } catch (error) {
        errorMessage.value = 'Error en la traducción. Por favor, inténtalo de nuevo.';
      }
    };

    return {
      languages,
      textToTranslate,
      sourceLang,
      targetLang,
      translatedText,
      handleTranslate,
      isLoading,
      errorMessage,
      canTranslate,
    };
  },
});
</script>
