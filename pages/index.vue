<template>

    <div class="phoneMain">
        <!-- Левая часть -->
        <div class="left-images">
            <img src="../public/img/блокнот_море.png" alt="Картинка 1" class="image-left-top">
            <img src="../public/img/блокнот_горы.png" alt="Картинка 2" class="image-left-bottom">
        </div>

        <!-- Центральная часть -->
        <div class="center-content">
            <img src="../public/img/блокнот_зебра (2).png" alt="Картинка 3" class="center-image">
            <div class="quote-container">
                <blockquote class="quote">"Мы все, как карандаши. 
                    Каждый рисует свою судьбу. 
                    Один ломается, другой тупит,
                    а кто-то затачивается и движется вперёд."</blockquote>
                <p class="author">— Светлана Кременецкая</p>
            </div>
        </div>

        <!-- Правая часть -->
        <div class="right-images">
            <img src="../public/img/завиток_большой.png" alt="Картинка 6" class="image-right-bottom">
            <img src="../public/img/карандаш.png" alt="Картинка 4" class="image-right-top">
            <img src="../public/img/карандаш_top.png" alt="Картинка 5" class="image-right-middle">
        </div>
    </div>


</template>

<style scoped>
.phoneMain {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100vw;
    background-image: url("../public/img/зебра_фон_полосы.png");
    background-size: cover;
    background-position: right;
    background-repeat: no-repeat;
    border: 2px solid red;
}

.left-images,
.right-images,
.center-content {
    position: absolute;
}

/* Левая часть */
.left-images {
    left: 13%;
    top: 49%;
    transform: translateY(-50%);
    width: 24%;
}

.left-images img {
    width: 100%;
    height: auto;
    margin-bottom: 10px;
}

/* Центральная часть */
.center-content {
    left: 51%;
    top: 45%;
    transform: translate(-50%, -50%);
    text-align: center;
    width: 56%;
}

.center-image {
    width: 100%;
    height: 100%;

}

.quote-container {
    position: absolute; /* Фиксированное позиционирование */
    bottom: -26%;
    left: 60%;
    transform: translate(-50%, -40%);
    max-width: 420px;
    white-space: initial; 
}

.quote {
    font-size: clamp(1rem, 1vw, 1rem); /* Адаптивный размер шрифта */
    font-style: italic;
    color: #d3cbcb;
}

.author {
    font-size: clamp(0.8rem, 1.5vw, 1rem); /* Адаптивный размер шрифта */
    color: #cfcbcb;
    margin-top: 10px;
}

/* Правая часть */
.right-images {
    right: 20%;
    bottom: 0;
    width: 9%;
}

.right-images img {
    width: 100%;
    height: auto;
}

.image-right-middle {
    position: absolute;
    bottom: -60px;
    right: 60px;
}

.image-right-top {
    position: absolute;
    bottom: -40px;
    right: -10px;
}

.image-right-bottom {
    position: absolute;
    bottom: 70px;
    right: 40px;
    scale: 0.7;
}

/* Медиа-запрос для max-width: 1600px */
@media (max-width: 1600px) {
    .quote-container {
        bottom: -32%; /* Опускаем цитату ниже */
        transform: translate(-50%, -50%); /* Корректируем центрирование */
    }

    .quote {
        font-size: clamp(0.9rem, 1vw, 0.9rem); /* Уменьшаем шрифт для лучшей читаемости */
    }

    .author {
        font-size: clamp(0.7rem, 1.5vw, 0.8rem); /* Уменьшаем шрифт автора */
    }
}
</style>