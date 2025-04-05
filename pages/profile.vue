<template>

<div class="max-w-3xl mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
    <h1 class="text-2xl font-bold text-center text-gray-800 mb-6">Заполните ваш профиль</h1>
    <form action="/submit-profile" method="POST" enctype="multipart/form-data">
      <!-- Фото -->
      <div class="mb-4">
        <label for="avatar" class="block text-sm font-medium text-gray-700">Фото профиля:</label>
        <input type="file" id="avatar" name="avatar" accept="image/*" class="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" required>
      </div>

      <!-- Имя и фамилия -->
      <div class="mb-4">
        <label for="name" class="block text-sm font-medium text-gray-700">Имя и фамилия:</label>
        <input type="text" id="name" name="name" placeholder="Введите ваше имя и фамилию" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required>
      </div>


      <!-- Город -->
      <div class="mb-4">
        <label for="city" class="block text-sm font-medium text-gray-700">Город:</label>
        <input type="text" id="city" name="city" placeholder="Например: Москва, Россия" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
      </div>

      <!-- Электронная почта -->
      <div class="mb-4">
        <label for="email" class="block text-sm font-medium text-gray-700">Электронная почта:</label>
        <input type="email" id="email" name="email" placeholder="Введите ваш email" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" required>
      </div>

      <!-- Телефон -->
      <div class="mb-4">
        <label for="phone" class="block text-sm font-medium text-gray-700">Телефон:</label>
        <input type="tel" id="phone" name="phone" placeholder="+7 (999) 123-45-67" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
      </div>

      <!-- Профессия -->
      <div class="mb-4">
        <label for="profession" class="block text-sm font-medium text-gray-700">Профессия:</label>
        <input type="text" id="profession" name="profession" placeholder="Например: Frontend-разработчик" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
      </div>

      <!-- О себе -->
      <div class="mb-4">
        <label for="about" class="block text-sm font-medium text-gray-700">О себе:</label>
        <textarea id="about" name="about" rows="4" placeholder="Расскажите о себе" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
      </div>

      <!-- Навыки -->
      <div class="mb-4">
        <label for="skills" class="block text-sm font-medium text-gray-700">Навыки (через запятую):</label>
        <input type="text" id="skills" name="skills" placeholder="Например: HTML, CSS, JavaScript" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
      </div>

      <!-- Опыт работы -->
      <div class="mb-4">
        <label for="experience" class="block text-sm font-medium text-gray-700">Опыт работы:</label>
        <textarea id="experience" name="experience" rows="4" placeholder="Опишите ваш опыт работы" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
      </div>

      <!-- Портфолио -->
      <div class="mb-4">
        <label for="portfolio" class="block text-sm font-medium text-gray-700">Портфолио (ссылки через запятую):</label>
        <input type="text" id="portfolio" name="portfolio" placeholder="Например: https://example.com" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
      </div>

      <!-- Социальные сети -->
      <div class="mb-4">
        <label for="socials" class="block text-sm font-medium text-gray-700">Социальные сети (ссылки через запятую):</label>
        <input type="text" id="socials" name="socials" placeholder="Например: Instagram, LinkedIn" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
      </div>

      <!-- Кнопка отправки -->
      <button type="submit" class="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
        Сохранить профиль
      </button>
    </form>
  </div>
</template>