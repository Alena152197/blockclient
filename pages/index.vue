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
            <div class="textKra">
                <h4>Всем привет! <br>
                    Будем знакомы, Меня зовут Алена. </h4>
                <p>В этом блоге я хочу рассказать
                    про свой жизненный путь, с чего всё
                    началось, поиски себя и своего места
                    в жизни, и всё ли так просто, как кажется
                    на первый взгляд. <br><br>
                    Надеюсь, моя история будет для кого-то
                    полезной, как преодолеть трудности ,
                    как не потерять себя и найти силы на
                    что-то новое. <br><br>
                    Жизнь, мягко говоря, непредсказуема.
                    В один момент все идет хорошо, а потом
                    вдруг что-то происходит, и вся жизнь
                    переворачивается с ног на голову,
                    так случилось и у меня...
                </p>
            </div>
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
            <img src="../public/img/блокнот_зебра1024 (3).png" alt="" class="imageRightBlock">
            <img src="../public/img/блокнот_зебра768.png" alt="" class="imageRightNone">
            <img src="../public/img/завиток большой_phone.png" alt="" class="topKara">
            <img src="../public/img/завиток_top.png" alt="" class="nizKara">
            <img src="../public/img/завиток_niz.png" alt="" class="tocKara">
            <img src="../public/img/графит_phone.png" alt="" class="grafKara">
            <img src="../public/img/точилкаPhone.png" alt="" class="phoneToc">
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
    overflow: hidden;
}

.textKra {
    position: absolute;
    top: 10%;
    /* Размещаем текст ближе к верху */
    left: 70%;
    transform: translateX(-30%);
    /* Центрируем только по горизонтали */
    color: rgb(10, 10, 10);
    font-size: 17px;
    text-align: left;
    width: 400px;
    z-index: 10;
    padding: 5px 10px;
    border-radius: 5px;
    height: auto;
    overflow: hidden;
    max-width: 90%;
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
    position: absolute;
    /* Фиксированное позиционирование */
    bottom: -26%;
    left: 60%;
    transform: translate(-50%, -40%);
    max-width: 420px;
    white-space: initial;
}

.quote {
    font-size: clamp(1rem, 1vw, 1rem);
    /* Адаптивный размер шрифта */
    font-style: italic;
    color: #d3cbcb;
}

.author {
    font-size: clamp(0.8rem, 1.5vw, 1rem);
    /* Адаптивный размер шрифта */
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

.imageRightBlock {
    position: absolute;
    bottom: 50px;
    scale: 2.4;
    display: none;
}

.imageRightNone {
    display: none;
    overflow: hidden;

}

.grafKara {
    display: none;
}

.topKara {
    display: none;
}

.nizKara {
    display: none;
}

.tocKara {
    display: none;
}

.phoneToc {
    display: none;

}


/* Медиа-запрос для max-width: 1600px */
@media (max-width: 1600px) {
    .quote-container {
        bottom: -32%;
        /* Опускаем цитату ниже */
        transform: translate(-50%, -50%);
        /* Корректируем центрирование */
    }

    .quote {
        font-size: clamp(0.9rem, 1vw, 0.9rem);
        /* Уменьшаем шрифт для лучшей читаемости */
    }

    .author {
        font-size: clamp(0.7rem, 1.5vw, 0.8rem);
        /* Уменьшаем шрифт автора */
    }

    .textKra {
        font-size: 15px;
        width: 400px;
        z-index: 10;
        padding: 15px 30px;

    }
}


@media (max-width: 1500px) {
    .phoneMain {
        background-image: url(../public/img/зебра_полосы1536.png);
    }

    /* Левая часть */
    .left-images {
        left: 13%;
        top: 53%;
    }

    /* Центральная часть */
    .center-content {
        left: 50%;
        top: 51%;
        transform: translate(-50%, -50%);
        text-align: center;
        width: 58%;
    }

    .quote-container {
        bottom: -31%;
    }

    .textKra {
        top: 25px;
        font-size: 14px;
        width: 350px;
        z-index: 10;
        padding: 15px 30px;

    }
}

@media (max-width: 1320px) {
    .quote-container {
        bottom: -43%;
    }

    .image-right-middle {
        position: absolute;
        bottom: -40px;
        right: 40px;
    }

    .image-right-top {
        position: absolute;
        bottom: -30px;
        right: -10px;
    }

    .image-right-bottom {
        position: absolute;
        bottom: 60px;
        right: 30px;
        scale: 0.8;
    }

    .textKra {
        top: 20px;
        font-size: 13px;
        width: 320px;
        z-index: 10;
        padding: 10px 30px;

    }
}

@media (max-width: 1200px) {
    .center-content {
        left: 48%;
        top: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        width: 70%;
    }

    .left-images {
        left: 3%;
        top: 59%;
        scale: 1.2;
    }

    .quote-container {
        bottom: -38%;
        left: 50%;
    }

    .image-right-middle {
        position: absolute;
        bottom: -40px;
        right: 85px;
        scale: 1.2;
    }

    .image-right-top {
        position: absolute;
        bottom: -30px;
        right: 35px;
        scale: 1.2;
    }

    .image-right-bottom {
        position: absolute;
        bottom: 50px;
        right: 80px;
        scale: 0.9;
    }



}

@media (max-width: 1024px) {

    .left-images {
        left: 18%;
        top: 55%;
        scale: 1.3;
    }

    .center-content {
        left: 50%;
        top: 43%;
        transform: translate(-50%, -50%);
        text-align: center;
        width: 40%;
        z-index: 3;
    }

    .center-image {
        content: url("../public/img/блокнотPhone.png");
    }

    .phoneMain {
        background-image: url(../public/img/полоски1024.png);
        background-size: cover;
    }

    /* Изменения для цитаты */
    .quote-container {
        bottom: -14rem;
        left: 92%;
        transform: translateX(-50%);
        width: 300px;
        text-align: center;
    }

    .quote {
        font-size: 14px;
        /* Адаптивный размер шрифта */
        font-style: italic;
        color: #b0b3b0;
    }

    .author {
        font-size: clamp(0.7rem, 1.2vw, 0.8rem);
        /* Адаптивный размер шрифта */
        color: #cfcbcb;
        margin-top: 10px;
    }

    .image-right-middle {
        position: absolute;
        bottom: -30px;
        right: -70px;
        scale: 1.4;
    }

    .image-right-top {
        position: absolute;
        bottom: -15px;
        right: -130px;
        scale: 1.4;
    }

    .image-right-bottom {
        position: absolute;
        bottom: 90px;
        right: -140px;
        scale: 1.2;
    }

    .imageRightBlock {
        position: absolute;
        bottom: 28rem;
        z-index: 1;
        left: -20px;
        scale: 3.5;
        display: block;
    }

    .textKra {
        top: 2%;
        left: 32%;
        font-size: 14px;
        text-align: left;
        width: 500px;
    }


}

@media (max-width: 875px) {
    .quote-container {
        bottom: -16rem;
        left: 80%;
        transform: translateX(-50%);
        width: 300px;
        text-align: center;
    }

    .imageRightNone {
        display: none;
    }

    .image-right-middle {
        position: absolute;
        bottom: -30px;
        right: -40px;
        scale: 1.4;
    }

    .image-right-top {
        position: absolute;
        bottom: -15px;
        right: -90px;
        scale: 1.4;
    }

    .image-right-bottom {
        position: absolute;
        bottom: 90px;
        right: -100px;
        scale: 1.2;
    }

    .textKra {
        font-size: 12px;
    }
}

@media (max-width: 768px) {
    .imageRightBlock {
        display: none;
    }

    .imageRightNone {
        display: block;
        position: absolute;
        bottom: 46rem;
        left: -40px;
        scale: 4;
        z-index: 5;
    }

    .left-images {
        left: 13%;
        top: 55%;
        scale: 1.6;

    }

    .center-content {
        left: 50%;
        top: 43%;
        transform: translate(-50%, -50%);
        text-align: center;
        width: 50%;
        z-index: 3;
    }

    .center-image {
        content: url("../public/img/блокнотPhone.png");
    }

    .phoneMain {
        background-image: url(../public/img/полосыPhone.png);
        background-size: cover;
    }

    /* Изменения для цитаты */
    .quote-container {
        bottom: -14rem;
        left: 93%;
        transform: translateX(-50%);
        width: 280px;
        text-align: right;
    }

    .quote {
        font-size: clamp(0.9rem, 1.5vw, 1rem);
        /* Адаптивный размер шрифта */
        font-style: italic;
        color: #d3cbcb;
    }

    .author {
        font-size: clamp(0.8rem, 1.2vw, 0.8rem);
        /* Адаптивный размер шрифта */
        color: #cfcbcb;
        margin-top: 10px;
    }

    .image-right-middle {
        display: none;
    }

    .image-right-top {
        display: none;
    }

    .image-right-bottom {
        display: none;
    }

    .left-images img {
        transform: rotate(-20deg);
    }

    .grafKara {
        display: block;
        position: absolute;
        bottom: 4rem;
        left: -16rem;
        scale: 2.6;
        z-index: 5;
    }

    .topKara {
        display: block;
        position: absolute;
        bottom: 2rem;
        left: -16rem;
        scale: 1;
        z-index: 6;
    }

    .nizKara {
        display: block;
        position: absolute;
        bottom: 4rem;
        left: -20rem;
        scale: 0.6;
        z-index: 6;
    }

    .tocKara {
        display: block;
        position: absolute;
        bottom: 8rem;
        left: -13rem;
        scale: 0.6;
        z-index: 6;
    }

    .phoneToc {
        display: block;
        position: absolute;
        bottom: 7rem;
        left: -17rem;
        scale: 1;
        z-index: 6;
    }

    .textKra {
        font-size: 13px;
    }


}


@media (max-width: 650px) {

    .imageRightNone {
        display: block;
        position: absolute;
        bottom: 48rem;
        left: 1rem;
        scale: 5;
        z-index: 5;
    }

    .left-images {
        left: 8%;
        top: 55%;
        scale: 1.8;

    }

    .center-content {
        left: 50%;
        top: 43%;
        transform: translate(-50%, -50%);
        text-align: center;
        width: 65%;
        z-index: 3;
    }


    /* Изменения для цитаты */
    .quote-container {
        bottom: -13rem;
        left: 75%;
        transform: translateX(-50%);
        width: 280px;
        text-align: right;
    }


    .grafKara {
        display: block;
        position: absolute;
        bottom: 5rem;
        left: -17rem;
        scale: 2.6;
        z-index: 5;
    }

    .topKara {
        display: block;
        position: absolute;
        bottom: 2rem;
        left: -18rem;
        scale: 1.2;
        z-index: 6;
    }

    .nizKara {
        display: block;
        position: absolute;
        bottom: 5rem;
        left: -21rem;
        scale: 0.6;
        z-index: 6;
    }

    .tocKara {
        display: block;
        position: absolute;
        bottom: 7rem;
        left: -14rem;
        scale: 0.6;
        z-index: 6;
    }

    .phoneToc {
        display: block;
        position: absolute;
        bottom: 7rem;
        left: -18rem;
        scale: 1;
        z-index: 6;
    }

    .textKra {
        font-size: 14px;
        top: 3%;
    }


}

@media (max-width: 550px) {

    .imageRightNone {
        display: block;
        position: absolute;
        bottom: 48rem;
        left: 4rem;
        scale: 6;
        z-index: 5;
    }

    .left-images {
        left: 8%;
        top: 58%;
        scale: 2.2;

    }

    .center-content {
        left: 50%;
        top: 40%;
        transform: translate(-50%, -50%);
        text-align: center;
        width: 75%;
        z-index: 3;
    }


    /* Изменения для цитаты */
    .quote-container {
        bottom: -14rem;
        left: 50%;
        transform: translateX(-50%);
        width: 300px;
        text-align: right;
    }

    .quote {
        font-size: 14px;
        /* Адаптивный размер шрифта */
        font-style: italic;
        color: #d3cbcb;
    }

    .author {
        font-size: 14px;
        /* Адаптивный размер шрифта */
        color: #cfcbcb;
        margin-top: 10px;
    }


    .grafKara {
        display: none;
    }

    .topKara {
        display: none;
    }

    .nizKara {
        display: none;
    }

    .tocKara {
        display: none;
    }

    .phoneToc {
        display: none;

    }

    
    .textKra {
        font-size: 12px;
        top: 8%;
        text-align: center;
    }


}

@media (max-width: 430px) {

    .imageRightNone {
        display: block;
        position: absolute;
        bottom: 47rem;
        left: 3rem;
        scale: 7.5;
        z-index: 5;
    }

    .left-images {
        left: 8%;
        top: 60%;
        scale: 2.5;

    }

    .center-content {
        left: 50%;
        top: 38%;
        transform: translate(-50%, -50%);
        text-align: center;
        width: 82%;
        z-index: 3;
    }


    /* Изменения для цитаты */
    .quote-container {
        bottom: -15rem;
        left: 47%;
        transform: translateX(-50%);
        width: 250px;
        text-align: right;
    }

    .quote {
        font-size: 12px;
        /* Адаптивный размер шрифта */
        font-style: italic;
        color: #d3cbcb;
    }

    .author {
        font-size: 12px;
        /* Адаптивный размер шрифта */
        color: #cfcbcb;
        margin-top: 10px;
    }


    .grafKara {
        display: none;
    }

    .topKara {
        display: none;
    }

    .nizKara {
        display: none;
    }

    .tocKara {
        display: none;
    }

    .phoneToc {
        display: none;

    }

    .textKra {
        font-size: 10px;
        top: 8%;
        text-align: center;
    }


}
</style>
