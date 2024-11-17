<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500 p-4">
    <div class="w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-8 m-4 transition-all duration-500 ease-in-out transform hover:scale-[1.02]">
      <h1 class="text-5xl font-extrabold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center gap-3">
        <Globe class="h-12 w-12 text-blue-500" />
        Traductor de Idiomas
      </h1>

      <div v-if="isLoading" class="flex justify-center items-center h-60">
        <div class="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>

      <div v-else class="space-y-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-36 relative">
          <div class="space-y-2 relative">
            <label for="source-language" class="block text-lg font-medium text-gray-700">Idioma de origen</label>
            <select v-model="sourceLang" id="source-language" class="appearance-none mt-1 block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg shadow-sm transition-all duration-300 ease-in-out hover:border-blue-400">
              <option v-for="lang in languages" :key="lang.language" :value="lang.language">{{ lang.name }}</option>
            </select>
            <ChevronDown class="absolute right-3 bottom-3 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>
          <div class="space-y-2 relative">
            <label for="target-language" class="block text-lg font-medium text-gray-700">Idioma de destino</label>
            <select v-model="targetLang" id="target-language" class="appearance-none mt-1 block w-full pl-3 pr-10 py-3 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-lg shadow-sm transition-all duration-300 ease-in-out hover:border-blue-400">
              <option v-for="lang in languages" :key="lang.language" :value="lang.language">{{ lang.name }}</option>
            </select>
            <ChevronDown class="absolute right-3 bottom-3 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>
          <button @click="swapLanguages" class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors duration-300 shadow-md hover:shadow-lg">
            <ArrowRightLeft class="h-6 w-6 text-blue-600" />
          </button>
        </div>
        <div class="space-y-2">
          <label for="text-to-translate" class="block text-lg font-medium text-gray-700">Texto a traducir</label>
          <textarea id="text-to-translate" v-model="textToTranslate" rows="6" class="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-300 ease-in-out hover:border-blue-400" placeholder="Escribe el texto aquí..."></textarea>
        </div>
        <p v-if="errorMessage" class="text-red-500 text-lg font-medium bg-red-100 p-3 rounded-lg">{{ errorMessage }}</p>
      </div>

      <div class="flex justify-center mt-8">
        <button @click="handleTranslate" :disabled="isTranslating || isLoading" class="group w-full max-w-xs bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
          <div class="flex items-center justify-center">
            <Loader2 v-if="isTranslating" class="mr-2 h-5 w-5 animate-spin" />
            <Languages v-else class="mr-2 h-5 w-5 transition-transform duration-300 ease-in-out group-hover:rotate-180" />
            {{ isTranslating ? 'Traduciendo...' : 'Traducir' }}
          </div>
        </button>
      </div>

      <transition name="fade" mode="out-in">
        <div v-if="translatedText" class="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200 shadow-inner">
          <h2 class="text-2xl font-semibold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Traducción:</h2>
          <p class="text-gray-700 whitespace-pre-wrap">{{ translatedText }}</p>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Globe, Loader2, ArrowRightLeft, Languages, ChevronDown } from 'lucide-vue-next';
import { getLanguages, detectLanguage, translateText } from '../controllers/translateController';

const isLoading = ref(true);
const languages = ref([]);
const sourceLang = ref('');
const targetLang = ref('');
const textToTranslate = ref('');
const translatedText = ref('');
const errorMessage = ref('');
const isTranslating = ref(false);

onMounted(async () => {
  try {
    languages.value = await getLanguages();
    isLoading.value = false;
  } catch (error) {
    console.error("Error fetching languages:", error);
    errorMessage.value = "Error al cargar los idiomas. Por favor, intenta de nuevo más tarde.";
    isLoading.value = false;
  }
});

const handleTranslate = async () => {
  if (!sourceLang.value || !targetLang.value || !textToTranslate.value) {
    errorMessage.value = 'Por favor, completa todos los campos.';
    return;
  }
  isTranslating.value = true;
  errorMessage.value = '';
  try {
    const translatedTextResult = await translateText(textToTranslate.value, sourceLang.value, targetLang.value);
    translatedText.value = translatedTextResult;
  } catch (error) {
    console.error("Error translating text:", error);
    errorMessage.value = "Error al traducir el texto. Por favor, intenta de nuevo.";
  } finally {
    isTranslating.value = false;
  }
};

const swapLanguages = () => {
  [sourceLang.value, targetLang.value] = [targetLang.value, sourceLang.value];
};

const autoDetectLanguage = async () => {
  if (!textToTranslate.value) return;
  try {
    const result = await detectLanguage(textToTranslate.value);
    sourceLang.value = result.data.detections[0].language;
  } catch (error) {
    console.error("Error detecting language:", error);
  }
};
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

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.bg-gradient-to-br {
  background-size: 200% 200%;
  animation: gradient 15s ease infinite;
}
</style>