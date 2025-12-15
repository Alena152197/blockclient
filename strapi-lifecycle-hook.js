// ============================================
// ФАЙЛ ДЛЯ КОПИРОВАНИЯ В STRAPI
// ============================================
// 
// КУДА КОПИРОВАТЬ:
// На сервере Strapi найдите папку:
//   src/api/post/content-types/post/
// 
// Создайте там файл: lifecycles.js
// Скопируйте содержимое этого файла в lifecycles.js
//
// ПОСЛЕ КОПИРОВАНИЯ:
// Перезапустите Strapi: npm run develop или npm run start
//
// ============================================

'use strict';

/**
 * Post lifecycle hooks
 * Автоматически устанавливает автора из токена при создании поста
 */

module.exports = {
  /**
   * Before creating a post, set the author from the authenticated user
   */
  async beforeCreate(event) {
    const { data } = event.params;
    
    // Получаем текущего пользователя из контекста (из токена)
    const user = event.state.user;
    
    // Если пользователь авторизован и автор не указан, устанавливаем автора автоматически
    if (user && !data.author) {
      data.author = user.id;
      console.log(`✅ Автоматически установлен автор для поста: ${user.id} (${user.username || user.email})`);
    } else if (!user) {
      console.warn('⚠️ Пользователь не авторизован, автор не будет установлен');
    }
  },

  /**
   * Before updating a post
   * Можно добавить проверки безопасности здесь
   */
  async beforeUpdate(event) {
    const { data, where } = event.params;
    const user = event.state.user;
    
    // Опционально: можно добавить проверку, что только автор может редактировать свой пост
    // Но это не обязательно для базовой функциональности
  },
};

