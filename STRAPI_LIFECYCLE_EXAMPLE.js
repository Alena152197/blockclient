// Файл для копирования в Strapi
// Путь: src/api/post/content-types/post/lifecycles.js

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
      console.log(`Автоматически установлен автор для поста: ${user.id} (${user.username})`);
    }
  },

  /**
   * Before updating a post
   * Можно добавить проверки безопасности здесь
   */
  async beforeUpdate(event) {
    const { data } = event.params;
    const user = event.state.user;
    
    // Опционально: можно добавить проверку, что только автор может редактировать свой пост
    // Но это не обязательно для базовой функциональности
  },
};

