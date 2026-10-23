<template>
  <div class="min-h-screen bg-black flex items-center justify-center p-6">
    <div
      class="relative w-full max-w-md bg-gray-900 rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-500 hover:scale-[1.02]">

      <div
        class="absolute -top-10 -right-10 w-40 h-40 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob">
      </div>
      <div
        class="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000">
      </div>

      <div class="relative z-10 p-8 text-white">
        <div class="flex justify-center mb-2">
          <div class="group relative">
            <div
              class="w-32 h-32 rounded-full overflow-hidden border-4 border-transparent bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 p-[3px] group-hover:from-purple-500 group-hover:to-blue-500 transition-all duration-500 animate-pulse-slow">
              <img
                :src="displayAvatar"
                alt="Фото профиля"
                @click="openModal"
                class="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-700 cursor-pointer"
              />
            </div>
            <label
              class="absolute bottom-0 right-0 bg-white text-gray-900 rounded-full p-2.5 cursor-pointer shadow-lg transition-all duration-300 hover:scale-105"
              :class="{ 'opacity-60 pointer-events-none': uploading }"
              title="Сменить фото"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path
                  fill-rule="evenodd"
                  d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                  clip-rule="evenodd"
                />
              </svg>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                class="hidden"
                :disabled="uploading"
                @change="uploadProfileImage"
              />
            </label>
          </div>
        </div>
        <p class="mb-6 text-center text-xs text-gray-400">
          {{ uploading ? 'Загружаю фото…' : 'Нажмите на камеру, чтобы сменить фото' }}
        </p>
        <p v-if="avatarMessage" class="mb-4 text-center text-sm" :class="avatarOk ? 'text-emerald-400' : 'text-red-400'">
          {{ avatarMessage }}
        </p>

        <h2
          class="text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 mb-8 tracking-tight">
          Редактировать профиль
        </h2>

        <div class="space-y-6">
          <div class="relative">
            <input v-model="search.userMe.username" id="username" type="text" required
              class="peer w-full px-5 py-3 text-white placeholder-transparent bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300" />
            <label for="username"
              class="absolute left-4 -top-2.5 text-sm text-gray-400 bg-gray-900 px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:left-5 peer-focus:-top-2.5 peer-focus:text-purple-400 transition-all duration-300">
              Имя пользователя
            </label>
          </div>

          <div class="relative">
            <input v-model="search.userMe.email" id="email" type="email" required
              class="peer w-full px-5 py-3 text-white placeholder-transparent bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300" />
            <label for="email"
              class="absolute left-4 -top-2.5 text-sm text-gray-400 bg-gray-900 px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:left-5 peer-focus:-top-2.5 peer-focus:text-purple-400 transition-all duration-300">
              Email
            </label>
          </div>

          <button
            type="button"
            :disabled="saving"
            @click="updateUserProfile"
            class="w-full py-3 mt-2 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-60"
          >
            {{ saving ? 'Сохраняю…' : 'Сохранить изменения' }}
          </button>
          <p v-if="formMessage" class="text-center text-sm text-emerald-400">
            {{ formMessage }}
          </p>
        </div>
      </div>
    </div>

    <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div class="relative max-w-xl w-full">
        <button @click="closeModal"
          class="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 z-10">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <img :src="displayAvatar" alt="Полноразмерное фото" class="w-full h-auto rounded-lg shadow-2xl" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSearchStore } from '@/stores/search'
import { STRAPI_BASE } from '~/utils/strapiBase'
import { compressImageForUpload } from '~/utils/contactBookApi'

const router = useRouter()
const search = useSearchStore()
const profileImage = ref(null)
const isModalOpen = ref(false)
const uploading = ref(false)
const avatarMessage = ref('')
const avatarOk = ref(false)
const saving = ref(false)
const formMessage = ref('')

const baseUrl = STRAPI_BASE
const DEFAULT_AVATAR = '/img/default-avatar.png'

const userId = computed(() => search.userMe?.id)
const displayAvatar = computed(() => profileImage.value || DEFAULT_AVATAR)

const initProfileImage = () => {
  const url = search.userMe?.avatar?.url
  if (url) {
    profileImage.value = url.startsWith('http') ? url : `${baseUrl}${url}`
    if (userId.value) localStorage.setItem(`userAvatar_${userId.value}`, profileImage.value)
  } else if (userId.value) {
    const saved = localStorage.getItem(`userAvatar_${userId.value}`)
    if (saved) profileImage.value = saved
  }
}

onMounted(() => {
  const token = localStorage.getItem('jwt')
  if (!token) {
    router.push('/')
    return
  }

  if (!search.userMe?.id) {
    search.fetchUserMe().then(() => {
      initProfileImage()
    })
  } else {
    initProfileImage()
  }
})

const openModal = () => {
  isModalOpen.value = true
}
const closeModal = () => {
  isModalOpen.value = false
}

const uploadProfileImage = async (event) => {
  const input = event.target
  const file = input?.files?.[0]
  if (!file || !userId.value) return

  if (!file.type.startsWith('image/')) {
    avatarOk.value = false
    avatarMessage.value = 'Можно загружать только изображения'
    return
  }

  uploading.value = true
  avatarMessage.value = ''
  try {
    // Всегда сжимаем (maxBytes: 1) — иначе nginx у Strapi часто отвечает 413
    const prepared = await compressImageForUpload(file, {
      maxSide: 800,
      quality: 0.8,
      maxBytes: 1
    })
    const formData = new FormData()
    formData.append('files', prepared)

    const res = await fetch('/api/profile/avatar', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt')}`
      },
      body: formData
    })

    const rawText = await res.text()
    let data = {}
    try {
      data = rawText ? JSON.parse(rawText) : {}
    } catch {
      data = {}
    }
    if (!res.ok) {
      if (res.status === 413 || /413|Request Entity Too Large/i.test(rawText)) {
        throw new Error(
          'Файл слишком большой для сервера. Попробуйте другое фото или попросите увеличить client_max_body_size в nginx у Strapi.'
        )
      }
      throw new Error(data.message || data.statusMessage || 'Ошибка загрузки файла')
    }

    if (data.url) {
      profileImage.value = data.url.startsWith('http') ? data.url : `${baseUrl}${data.url}`
      localStorage.setItem(`userAvatar_${userId.value}`, profileImage.value)
    }

    await search.fetchUserMe()
    initProfileImage()
    avatarOk.value = true
    avatarMessage.value = data.message || 'Фото профиля обновлено'
  } catch (err) {
    console.error('Ошибка загрузки аватара:', err)
    avatarOk.value = false
    avatarMessage.value = err?.message || 'Ошибка при загрузке фото'
  } finally {
    uploading.value = false
    if (input) input.value = ''
  }
}

const updateUserProfile = async () => {
  saving.value = true
  formMessage.value = ''
  try {
    const res = await fetch(`${baseUrl}/api/users/${userId.value}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: search.userMe.username,
        email: search.userMe.email
      })
    })

    if (!res.ok) {
      const error = await res.json().catch(() => ({}))
      console.error(error)
      return
    }

    await search.fetchUserMe()
    formMessage.value = 'Данные успешно обновлены!'
  } catch (err) {
    console.error('Ошибка сети:', err)
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }

  33% {
    transform: translate(30px, -50px) scale(1.1);
  }

  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }

  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

.animate-pulse-slow {
  animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {

  0%,
  100% {
    box-shadow: 0 0 10px rgba(120, 140, 255, 0.2);
  }

  50% {
    box-shadow: 0 0 20px rgba(120, 140, 255, 0.6);
  }
}
</style>
