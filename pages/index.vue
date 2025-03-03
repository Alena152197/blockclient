<template>




    <!-- <div class="phoneMain">

        <div class="parent">
            <div class="child child1">1
                <img src="../public/img/блокнот_море.png" alt="" class="">
            </div>
            <div class="child child2">2
                <img src="" alt="">
            </div>
            <div class="child child3 invisible">3
                <img src="../public/img/блокнот_зебра768.png" alt="">
            </div>
            <div class="child child4">4
                <img src="../public/img/блокнот_горы.png" alt="">
            </div>
            <div class="child child5">5
            </div>
            <div class="child child6">6
                <img src="" alt="">
            </div>
            <div class="child child7 footer-item">
                <div class="border-2 flex flex-col justify-end items-center min-h-full w-full relative">
                    <div class="border-2">
                        <img src="../public/img/графит.png" alt="" class="absolute bottom-0 left-0">
                        <img src="../public/img/точиолка.png" alt="" class="absolute bottom-0 left-10">
                        <img src="../public/img/завиток_niz.png" alt="" class="absolute bottom-0 left-0">
                        <img src="../public/img/завиток_top.png" alt="" class="absolute bottom-0 left-0">
                    </div>
                    <div class="border-2 max-w-[430px]">
                        <p class="text-center">"Мы все, как карандаши.
                            Каждый рисует свою судьбу.
                            Один ломается, другой тупит,
                            а кто-то затачивается и движется вперёд." <br>
                            Светлана Кременецкая </p>
                    </div>
                    <div class="border-2">
                        <img src="../public/img/завиток_большой.png" alt="" class="absolute bottom-0 right-0">
                        <img src="../public/img/карандаш_top.png" alt="" class="absolute bottom-10 right-10">
                        <img src="../public/img/карандаш.png" alt="" class="absolute bottom-0 right-0">
                    </div>
                </div>
            </div>
            <div class="child child8 invisible">8

            </div>

        </div>
    </div> -->

    <div class="phoneMainContainer relative w-full h-full overflow-hidden md:hidden">
        <!-- Фоновое изображение -->
        <div class="phonePaint">
            <img src="../public/img/полосыPhone.png" alt="" class="w-full h-full object-cover">
        </div>

        <!-- Две картинки слева (друг под другом) -->
        <img src="../public/img/блокнот_мореPhone.png" alt="Left Image 2"
            class="absolute -left-13 top-10 object-cover w-[58vw] h-[58vw]">
        <img src="../public/img/блокнот_горыPhone.png" alt="Left Image 1"
            class="absolute -left-13 top-70 object-cover w-[58vw] h-[58vw]">




        <!-- Картинка справа в верхнем углу -->
        <img src="../public/img/блокнот_зебра768.png" alt="Top Right Image"
            class="absolute -right-12 -top-17 object-cover z-11 w-[55vw] h-[55vw]">

        <div class="absolute inset-0 m-auto bottom-28 z-10 w-[90vw] h-[122vw]">
            <img src="../public/img/блокнотPhone.png" alt="Center Image" class="w-full h-full object-cover">
            <div class="absolute inset-0 flex flex-col items-start justify-evenly text-black px-12 py-2">
                <!-- Заголовок -->
                <h6 class="font-bold text-left">
                    Всем привет! <br>
                    Будем знакомы, Меня зовут Алена.
                </h6>
                <!-- Основной текст -->
                <p class="text-[3vw] font-medium text-left">
                    В этом блоге я хочу рассказать
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
        </div>



        <!-- Пять картинок внизу слева -->
        <img src="../public/img/графитPhone.png" alt="Bottom Left Image 1"
            class="absolute bottom-0 left-0 w-[59vw] h-[67vw] object-cover">
        <img src="../public/img/точилкаPhone.png" alt="Bottom Left Image 2"
            class="absolute bottom-30 left-7 w-[19vw] h-[17vw] object-cover">
        <img src="../public/img/завиток_endPhone.png" alt="Bottom Left Image 3"
            class="absolute bottom-22 left-2 w-[10vw] h-[10vw] object-cover">
        <img src="../public/img/завиток_большой1Phone.png" alt="Bottom Left Image 4"
            class="absolute bottom-5 left-2 w-[18vw] h-[14vw] object-cover">
        <img src="../public/img/завиток_topPhone.png" alt="Bottom Left Image 5"
            class="absolute bottom-38 left-26 w-[14vw] h-[10vw] object-cover">




        <!-- Цитата с автором по центру внизу -->
        <div class="absolute bottom-14 right-13 left-8 text-right">
            <blockquote class="text-xs font-normal mb-2 text-amber-100 line-clamp-4">
                "Мы все, как карандаши. <br>
                Каждый рисует свою судьбу. <br>
                Один ломается, другой тупит,<br>
                а кто-то затачивается и движется вперёд."</blockquote>
            <p class="text-sm font-light text-amber-100 text-center ">— Светлана Кременецкая</p>
        </div>

        <!-- Две картинки справа внизу -->
        <img src="../public/img/карандаш_leftPhone.png" alt="Bottom Right Image 1"
            class="absolute -bottom-22 right-12 w-[7vw] h-[45vw] object-cover">
        <img src="../public/img/карандаш_rigthPhone.png" alt="Bottom Right Image 2"
            class="absolute bottom-0 right-4 w-[7vw] h-[45vw] object-cover">
    </div>
</template>
