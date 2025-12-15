<template>
  <div class="min-h-screen bg-black flex items-center justify-center p-6">
    <!-- Контейнер профиля -->
    <div
      class="relative w-full max-w-md bg-gray-900 rounded-3xl overflow-hidden shadow-2xl transform transition-all duration-500 hover:scale-[1.02]">

      <!-- Абстрактные формы для фона -->
      <div
        class="absolute -top-10 -right-10 w-40 h-40 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob">
      </div>
      <div
        class="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000">
      </div>

      <!-- Основной контент -->
      <div class="relative z-10 p-8 text-white">

        <!-- Аватар с эффектами -->
        <div class="flex justify-center mb-6">
          <div class="group relative">
            <div
              class="w-32 h-32 rounded-full overflow-hidden border-4 border-transparent bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 p-[3px] group-hover:from-purple-500 group-hover:to-blue-500 transition-all duration-500 animate-pulse-slow">
              <img :src="profileImage || 'https://placehold.co/550x550'" alt="Фото профиля" @click="openModal"
                class="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-700 cursor-pointer" />
            </div>
            <label
              class="absolute bottom-0 right-0 bg-white text-gray-900 rounded-full p-2 cursor-pointer shadow-lg transform translate-y-1 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-13 13-5.586-5.586a2 2 0 112.828-2.828L13.586 3.586z" />
              </svg>
              <input type="file" accept="image/*" @change="uploadProfileImage" class="hidden" />
            </label>
          </div>
        </div>

        <!-- Заголовок -->
        <h2
          class="text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 mb-8 tracking-tight">
          Редактировать профиль
        </h2>

        <!-- Форма -->
        <div class="space-y-6">
          <!-- Имя пользователя -->
          <div class="relative">
            <input v-model="search.userMe.username" id="username" type="text" required
              class="peer w-full px-5 py-3 text-white placeholder-transparent bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300" />
            <label for="username"
              class="absolute left-4 -top-2.5 text-sm text-gray-400 bg-gray-900 px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:left-5 peer-focus:-top-2.5 peer-focus:text-purple-400 transition-all duration-300">
              Имя пользователя
            </label>
          </div>

          <!-- Email -->
          <div class="relative">
            <input v-model="search.userMe.email" id="email" type="email" required
              class="peer w-full px-5 py-3 text-white placeholder-transparent bg-gray-800 border border-gray-700 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all duration-300" />
            <label for="email"
              class="absolute left-4 -top-2.5 text-sm text-gray-400 bg-gray-900 px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:left-5 peer-focus:-top-2.5 peer-focus:text-purple-400 transition-all duration-300">
              Email
            </label>
          </div>

          <!-- Кнопка сохранить -->
          <button @click="updateUserProfile"
            class="w-full py-3 mt-2 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
            Сохранить изменения
          </button>
        </div>
      </div>
    </div>

    <!-- Модальное окно -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div class="relative max-w-xl w-full">
        <!-- Кнопка закрытия -->
        <button @click="closeModal"
          class="absolute top-2 right-2 text-white bg-black bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 z-10">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <!-- Изображение в оригинальном размере -->
        <img :src="profileImage || 'https://placehold.co/650x650'" alt="Полноразмерное фото"
          class="w-full h-auto rounded-lg shadow-2xl" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSearchStore } from '@/stores/search'

const router = useRouter()
const search = useSearchStore()
const profileImage = ref(null)
const isModalOpen = ref(false) // Для модального окна

const baseUrl = 'https://324cbb377ef9.vps.myjino.ru'

// Данные пользователя
const username = computed(() => search.userMe?.username || 'Гость')
const userEmail = computed(() => search.userMe?.email)
const userId = computed(() => search.userMe?.id)

// Инициализация аватара
const initProfileImage = () => {
  if (search.userMe?.avatar?.url) {
    profileImage.value = `${baseUrl}${search.userMe.avatar.url}`
    localStorage.setItem(`userAvatar_${userId.value}`, profileImage.value)
  } else {
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

// Открыть / закрыть модальное окно
const openModal = () => {
  isModalOpen.value = true
}
const closeModal = () => {
  isModalOpen.value = false
}

// Загрузка аватара
const uploadProfileImage = async (event) => {
  const file = event.target.files[0]
  if (!file || !userId.value) return

  if (!file.type.startsWith('image/')) {
    alert('Можно загружать только изображения')
    return
  }

  const formData = new FormData()
  formData.append('files', file)

  try {
    // Используем локальный API route для обхода CORS
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt')}`
      },
      body: formData
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: 'Ошибка загрузки файла' }))
      throw new Error(errorData.message || 'Ошибка загрузки файла')
    }

    const resData = await res.json()
    const data = Array.isArray(resData) ? resData : [resData]
    const avatarId = data[0].id

    // Привязываем аватар к пользователю
    const updateRes = await fetch(`${baseUrl}/api/users/${userId.value}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ avatar: avatarId })
    })

    if (!updateRes.ok) {
      alert('Не удалось связать аватар')
      return
    }

    await search.fetchUserMe()
    initProfileImage()
    alert('Аватар успешно загружен!')

  } catch (err) {
    console.error('Ошибка сети:', err)
    const errorMessage = err?.data?.message || err?.message || 'Ошибка при загрузке фото'
    alert(errorMessage)
  }
}

// Обновление данных пользователя
const updateUserProfile = async () => {
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
      const error = await res.json()
      alert('Не удалось сохранить изменения')
      console.error(error)
      return
    }

    alert('Данные успешно обновлены!')
    await search.fetchUserMe()

  } catch (err) {
    console.error('Ошибка сети:', err)
    alert('Ошибка при сохранении данных')
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