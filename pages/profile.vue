<template>
  <div class="profMain p-6 rounded-lg shadow-2xl w-full max-w-md mx-auto my-12 text-left flex flex-col md:flex-row">
    <!-- Фотография и кнопка смены фото -->
    <div class="flex flex-col justify-center items-center mr-0 md:mr-6 mb-6 md:mb-0">
      <div
        class="relative w-32 h-32 mb-2 rounded-full overflow-hidden bg-gray-200 border-4 border-blue-500 cursor-pointer transition-transform transform hover:scale-105">
        <img :src="profileImage" alt="Фото профиля" class="w-full h-full object-cover">
      </div>
      <button
        class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300 text-sm md:text-base">
        Сменить фото
      </button>
      <input type="file" ref="uploadImage" accept="image/*" class="hidden" @change="onImageChange">
    </div>

    <div class="flex-1">
      <h1 class="text-xl md:text-3xl font-bold mb-6 text-gray-800">Мой профиль</h1>

      <!-- Имя и фамилия -->
      <div class="mb-4">
        <label for="firstName" class="block text-left text-sm font-medium text-gray-700 mb-2">Имя</label>
        <input v-model="formData.firstName" type="text" id="firstName" placeholder="Введите ваше имя"
          class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-sm md:text-base">
      </div>

      <div class="mb-4">
        <label for="lastName" class="block text-left text-sm font-medium text-gray-700 mb-2">Фамилия</label>
        <input v-model="formData.lastName" type="text" id="lastName" placeholder="Введите вашу фамилию"
          class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-sm md:text-base">
      </div>

      <!-- Email -->
      <div class="mb-4">
        <label for="email" class="block text-left text-sm font-medium text-gray-700 mb-2">Email</label>
        <input v-model="formData.email" type="email" id="email" placeholder="Введите ваш email"
          class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-sm md:text-base">
      </div>

      <!-- Номер телефона -->
      <div class="mb-4">
        <label for="phone" class="block text-left text-sm font-medium text-gray-700 mb-2">Телефон
          (необязательно)</label>
        <input v-model="formData.phone" type="tel" id="phone" placeholder="Введите ваш номер телефона"
          class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-sm md:text-base">
      </div>

      <!-- Город -->
      <div class="mb-4">
        <label for="city" class="block text-left text-sm font-medium text-gray-700 mb-2">Город</label>
        <select v-model="formData.city"
          class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-sm md:text-base">
          <option value="">Выберите город</option>
          <option value="Москва">Москва</option>
          <option value="Санкт-Петербург">Санкт-Петербург</option>
          <option value="Казань">Казань</option>
          <option value="Новосибирск">Новосибирск</option>
          <option value="Екатеринбург">Екатеринбург</option>
        </select>
      </div>

      <!-- Социальные сети -->
      <div class="mb-6">
        <label for="social" class="block text-left text-sm font-medium text-gray-700 mb-2">Социальные сети
          (необязательно)</label>
        <input v-model="formData.social" type="text" id="social" placeholder="Введите ссылку на соцсеть"
          class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-sm md:text-base">
      </div>

      <!-- Кнопка отправки -->
      <button
        class="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-300 transform hover:scale-105 text-sm md:text-base">
        Отправить
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Реактивные данные
const profileImage = ref('https://via.placeholder.com/100');
const formData = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '', // Необязательное поле
  city: '',
  social: '' // Необязательное поле
});

// Метод для открытия окна выбора файла
const changeImage = () => {
  const uploadInput = document.querySelector('input[type="file"]');
  uploadInput.click();
};

// Метод для обработки загруженного изображения
const onImageChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      profileImage.value = e.target.result; // Обновляем src изображения
    };
    reader.readAsDataURL(file);
  }
};

// Метод для отправки формы
const submitForm = () => {
  const { firstName, lastName, email, city } = formData.value;

  // Проверяем только обязательные поля
  if (!firstName || !lastName || !email || !city) {
    alert('Пожалуйста, заполните все обязательные поля.');
    return;
  }

  console.log('Данные профиля:', {
    ...formData.value,
    profileImage: profileImage.value
  });

  alert('Данные успешно отправлены!');
};
</script>