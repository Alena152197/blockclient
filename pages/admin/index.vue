<template>
    <div class="containerForm">
        <div class="boxForm">
            <form class="registration-form" id="registrationForm">
            <h2>Вход</h2>
            <input type="email" id="email" placeholder="Email" required>
            <input type="password" id="password" placeholder="Пароль" required>
            <button type="submit">Войти</button>
            <div class="error-message" id="errorMessage"></div>
        </form>
        </div>
    </div>

</template>


<style scoped>

.containerForm {
    max-width: 500px;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    margin: 0 auto;
}

.boxForm {
    max-width: 700px;
    height: 300px;
    border-radius: 10px;
    margin: 3rem;
    
}

.registration-form {
    background: #fff;
    padding: 50px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    
}

.registration-form h2 {
    text-align: center;
    margin-bottom: 30px;
    margin-top: 10px;
}

.registration-form input[type="email"],
.registration-form input[type="password"] {
    max-width: 300px;
    padding: 10px;
    margin: 10px 0;
    border: 1px solid #ccc;
    border-radius: 10px;
}

.registration-form button {
    width: 40%;
    padding: 10px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    
}

.registration-form button:hover {
    background-color: #218838;
}
.error-message {
    color: red;
    font-size: 14px;
    margin-top: 10px;
    text-align: center;
}


</style>


