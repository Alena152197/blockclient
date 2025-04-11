<template>
  <div
    class="bg-yellow-100 profMain p-6 rounded-lg shadow-2xl w-full max-w-md mx-auto my-12 text-left flex flex-col md:flex-row">
    <!-- Фотография и кнопка смены фото -->
    <div class="flex flex-col items-center mr-0 md:mr-6 mb-6 md:mb-0">
      <div
        class="relative w-32 h-32 mb-2 rounded-full overflow-hidden bg-gray-200 border-4 border-blue-500 cursor-pointer transition-transform transform hover:scale-105">
        <img :src="profileImage" alt="Фото профиля" class="w-full h-full object-cover" />
      </div>
      <button
        class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-300 text-sm md:text-base"
        @click="changeImage">
        Сменить фото
      </button>
      <input type="file" ref="uploadImage" accept="image/*" class="hidden" @change="onImageChange" />
    </div>

    <div class="flex-1">
      <h1 class="text-xl md:text-3xl font-bold mb-6 text-gray-800">Мой профиль</h1>
      <!-- Форма -->
      <form v-if="!isSubmitted" @submit.prevent="submitForm">
        <!-- Имя -->
        <div class="mb-4">
          <label for="firstName" class="block text-left text-sm font-medium text-gray-700 mb-2">Имя</label>
          <input v-model="formData.firstName" type="text" id="firstName" placeholder="Введите ваше имя"
            class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-sm md:text-base" />
        </div>
        <!-- Email -->
        <div class="mb-4">
          <label for="email" class="block text-left text-sm font-medium text-gray-700 mb-2">Email</label>
          <input v-model="formData.email" type="email" id="email" placeholder="Введите ваш email"
            class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 text-sm md:text-base" />
        </div>
        <!-- Кнопка отправки -->
        <button
          class="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-300 transform hover:scale-105 text-sm md:text-base">
          Сохранить
        </button>
      </form>
      <!-- Блок с результатами -->
      <div v-else class="mt-6">
        <h2 class="text-xl font-bold mb-4 text-gray-800">Ваши данные:</h2>
        <div class="space-y-2">
          <p><strong>Имя:</strong> {{ formData.firstName }}</p>
          <p><strong>Email:</strong> {{ formData.email }}</p>
          <img :src="profileImage" alt="Фото профиля" class="w-24 h-24 rounded-full object-cover mt-4" />
        </div>
        <button
          class="mt-6 w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition duration-300 transform hover:scale-105 text-sm md:text-base"
          @click="resetForm">
          Вернуться к редактированию
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formData: {
        firstName: '',
        email: ''
      },
      profileImage: 'https://via.placeholder.com/150', // URL изображения по умолчанию
      isSubmitted: false
    };
  },
  created() {
    // Загружаем данные из localStorage при создании компонента
    const savedData = localStorage.getItem('profileData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      this.formData.firstName = parsedData.firstName || '';
      this.formData.email = parsedData.email || '';
      this.profileImage = parsedData.profileImage || this.profileImage;
    }
  },
  methods: {
    changeImage() {
      this.$refs.uploadImage.click();
    },
    onImageChange(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.profileImage = e.target.result;
          this.saveDataToLocalStorage(); // Сохраняем данные после изменения фото
        };
        reader.readAsDataURL(file);
      }
    },
    submitForm() {
      if (!this.formData.firstName || !this.formData.email) {
        alert('Пожалуйста, заполните все обязательные поля.');
        return;
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(this.formData.email)) {
        alert('Пожалуйста, введите корректный email.');
        return;
      }

      this.isSubmitted = true;
      this.saveDataToLocalStorage(); // Сохраняем данные после отправки формы
      console.log('Данные формы:', this.formData);
    },
    resetForm() {
      this.isSubmitted = false;
    },
    saveDataToLocalStorage() {
      // Сохраняем данные в localStorage
      const dataToSave = {
        firstName: this.formData.firstName,
        email: this.formData.email,
        profileImage: this.profileImage
      };
      localStorage.setItem('profileData', JSON.stringify(dataToSave));
    }
  }
};
</script>