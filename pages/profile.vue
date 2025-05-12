<template>
  <div class="flex justify-center items-center min-h-screen bg-gray-100">
    <!-- Фото профиля и данные -->
    <div class="text-center">
      <div class="relative group inline-block mx-auto">
        <!-- Аватар -->
        <div
          class="w-28 h-28 rounded-full overflow-hidden border-4 border-transparent bg-gradient-to-tr from-pink-400 via-purple-400 to-indigo-500 p-[2px] group-hover:from-purple-500 group-hover:to-blue-500 transition-all duration-500">
          <img :src="profileImage || 'https://placehold.co/350x350'" alt="Фото профиля"
            class="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-500" />
        </div>

        <!-- Кнопка загрузки фото -->
        <label
          class="absolute bottom-0 right-0 bg-gradient-to-r from-green-500 to-teal-400 text-white rounded-full p-2 cursor-pointer shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd"
              d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
              clip-rule="evenodd" />
          </svg>
          <input type="file" accept="image/*" @change="uploadProfileImage" class="hidden" />
        </label>
      </div>

      <!-- Имя и Email под аватаром -->
      <div class="mt-4 text-center">
        <p class="text-lg font-semibold text-gray-800">{{ username }}</p>
        <p class="text-sm text-gray-500">{{ userEmail }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSearchStore } from '@/stores/search'

const index = useSearchStore()
const profileImage = ref(null)
const username = ref('Загрузка...')   // Поле для имени
const userEmail = ref('Загрузка...')   // Поле для email
const baseUrl = 'https://324cbb377ef9.vps.myjino.ru'

// Получаем ID пользователя из хранилища
const userId = index.userMe?.id

onMounted(async () => {
  if (!userId) return

  const savedAvatar = localStorage.getItem(`userAvatar_${userId}`)
  if (savedAvatar) {
    profileImage.value = savedAvatar
  }

  try {
    const response = await fetch(`${baseUrl}/api/users/me?populate=avatar`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt')}`
      }
    })

    if (!response.ok) throw new Error('Ошибка получения данных')

    const data = await response.json()

    // Обновляем фото профиля
    if (data.avatar?.url) {
      const avatarUrl = `${baseUrl}${data.avatar.url}`
      profileImage.value = avatarUrl
      localStorage.setItem(`userAvatar_${userId}`, avatarUrl)
    }

    // Обновляем имя и email
    username.value = data.username || data.email.split('@')[0]  // если нет username — берём часть email
    userEmail.value = data.email || 'Не указан'

  } catch (error) {
    console.error('Ошибка:', error)
  }
})

// --- Загрузка аватара ---
const uploadProfileImage = async (event) => {
  const file = event.target.files[0]
  if (!file) return

  try {
    // Шаг 1: Загрузка файла в Media Library
    const formData = new FormData()
    formData.append('files', file)

    const uploadResponse = await fetch(`${baseUrl}/api/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt')}`
      },
      body: formData
    })

    if (!uploadResponse.ok) {
      const err = await uploadResponse.json()
      console.error('Ошибка загрузки файла:', err)
      alert('Не удалось загрузить файл')
      return
    }

    const uploadedFile = await uploadResponse.json()

    // Шаг 2: Обновление пользователя с новым avatar.id
    const updateUserResponse = await fetch(`${baseUrl}/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        avatar: uploadedFile[0].id
      })
    })

    if (!updateUserResponse.ok) {
      const err = await updateUserResponse.json()
      console.error('Ошибка обновления пользователя:', err)
      alert('Не удалось связать аватар с пользователем')
      return
    }

    // Шаг 3: Получаем обновлённого пользователя
    const updatedUser = await fetch(
      `${baseUrl}/api/users/me?populate=avatar`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`
        }
      }
    ).then(res => res.json())

    console.log('Обновлённый пользователь:', updatedUser)

    if (updatedUser.avatar?.url) {
      const avatarUrl = `${baseUrl}${updatedUser.avatar.url}`
      profileImage.value = avatarUrl
      localStorage.setItem(`userAvatar_${userId}`, avatarUrl)
      alert('Фото успешно загружено!')
    } else {
      alert('Файл загружен, но не привязан к пользователю')
    }
  } catch (e) {
    console.error('Ошибка сети:', e)
    alert('Ошибка сети')
  }
}
</script>
