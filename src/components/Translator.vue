<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 p-4">
    <div class="w-full max-w-4xl bg-white rounded-xl shadow-lg p-8 m-4 transition-all duration-500 ease-in-out transform hover:scale-[1.01]">
      <h1 class="text-4xl font-bold mb-8 text-center text-blue-600 flex items-center justify-center gap-3">
        <Globe class="h-10 w-10 text-blue-500" />
        Traductor de Idiomas
      </h1>

      <div v-if="isLoading" class="flex justify-center items-center h-40">
        <Loader2 class="h-12 w-12 animate-spin text-blue-500" />
      </div>

      <div v-else class="space-y-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
          <div class="space-y-2">
            <label for="source-language" class="block text-lg font-medium text-gray-700">Idioma de origen</label>
            <select v-model="sourceLang" id="source-language" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
              <option v-for="lang in languages" :key="lang.language" :value="lang.language">{{ lang.name }}</option>
            </select>
          </div>
          <div class="space-y-2">
            <label for="target-language" class="block text-lg font-medium text-gray-700">Idioma de destino</label>
            <select v-model="targetLang" id="target-language" class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
              <option v-for="lang in languages" :key="lang.language" :value="lang.language">{{ lang.name }}</option>
            </select>
          </div>
          <button @click="swapLanguages" class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors duration-300">
            <ArrowRightLeft class="h-5 w-5 text-blue-600" />
          </button>
        </div>
        <div class="space-y-2">
          <label for="text-to-translate" class="block text-lg font-medium text-gray-700">Texto a traducir</label>
          <textarea id="text-to-translate" v-model="textToTranslate" rows="6" class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" placeholder="Escribe el texto aquí"></textarea>
        </div>
        <p v-if="errorMessage" class="text-red-500 text-lg font-medium">{{ errorMessage }}</p>
      </div>

      <div class="flex justify-center mt-8">
        <button @click="handleTranslate" :disabled="isTranslating || isLoading" class="w-full max-w-xs bg-blue-600 text-white py-3 px-6 rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
          <div class="flex items-center justify-center">
            <Loader2 v-if="isTranslating" class="mr-2 h-5 w-5 animate-spin" />
            <Languages v-else class="mr-2 h-5 w-5" />
            {{ isTranslating ? 'Traduciendo...' : 'Traducir' }}
          </div>
        </button>
      </div>

      <transition name="fade" mode="out-in">
        <div v-if="translatedText" class="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <h2 class="text-2xl font-semibold mb-3 text-blue-800">Traducción:</h2>
          <p class="text-gray-700 whitespace-pre-wrap">{{ translatedText }}</p>
        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { Globe, Loader2, ArrowRightLeft, Languages } from 'lucide-vue-next';

interface Language {
  language: string;
  name: string;
}

export default defineComponent({
  name: 'Translator',
  components: {
    Globe,
    Loader2,
    ArrowRightLeft,
    Languages,
  },
  setup() {
    const isLoading = ref(true);
    const languages = ref<Language[]>([]);
    const sourceLang = ref('');
    const targetLang = ref('');
    const textToTranslate = ref('');
    const translatedText = ref('');
    const errorMessage = ref('');
    const isTranslating = ref(false);

    onMounted(() => {
      setTimeout(() => {
        languages.value = [
          { language: 'es', name: 'Español' },
          { language: 'en', name: 'Inglés' },
          { language: 'fr', name: 'Francés' },
          { language: 'de', name: 'Alemán' },
          { language: 'it', name: 'Italiano' },
          { language: 'pt', name: 'Portugués' },
          { language: 'ru', name: 'Ruso' },
          { language: 'zh', name: 'Chino' },
          { language: 'ja', name: 'Japonés' },
          { language: 'ko', name: 'Coreano' },
        ];
        isLoading.value = false;
      }, 1000);
    });

    const handleTranslate = () => {
      if (!sourceLang.value || !targetLang.value || !textToTranslate.value) {
        errorMessage.value = 'Por favor, completa todos los campos.';
        return;
      }
      isTranslating.value = true;
      errorMessage.value = '';
      setTimeout(() => {
        translatedText.value = `Texto traducido de ${sourceLang.value} a ${targetLang.value}:\n\n${textToTranslate.value}`;
        isTranslating.value = false;
      }, 1500);
    };

    const swapLanguages = () => {
      const temp = sourceLang.value;
      sourceLang.value = targetLang.value;
      targetLang.value = temp;
    };

    return {
      isLoading,
      languages,
      sourceLang,
      targetLang,
      textToTranslate,
      translatedText,
      errorMessage,
      isTranslating,
      handleTranslate,
      swapLanguages,
    };
  },
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>