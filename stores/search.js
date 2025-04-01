export const useSearchStore = defineStore('search', {
  state: () => ({
    searchQuery: ref(' '),
    authToggle: true, //перключатель
    userMe: {},
  }),
  actions: {
    async fetchUserMe() {
      try {
        const token = localStorage.getItem('jwt')
        const response = await fetch('https://324cbb377ef9.vps.myjino.ru/api/users/me',
          {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        )

        const data = await response.json();
        this.userMe = data;
      } catch (error) {
        console.log(error);
      }
    },
    logout() {
      localStorage.removeItem('jwt')
      this.userMe = {}
    },
    async login(loginData) {
      try {
        console.log(loginData.email);
        console.log(loginData.password);

        const response = await fetch('https://324cbb377ef9.vps.myjino.ru/api/auth/local', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', // Указываем тип контента
          },
          body: JSON.stringify({
            "identifier": loginData.email,
            "password": loginData.password
          }),
        });

        const data = await response.json();
        localStorage.setItem('jwt', data.jwt)
        this.userMe = data.user
        if (!response.ok) {
          throw new Error(data.error.message); // Обработка ошибок
        }
      } catch (error) {
        console.log('Ошибка при авторизации:', error);
      }
    },
  }
})