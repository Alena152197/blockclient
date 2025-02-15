<template>
    <div class="phoneMain w-full h-full overflow-hidden">

        <div class="absolute z-10 inset-0 h-full w-full flex flex-wrap content-center items-center justify-center">
            <!-- большой экран блокнот -->
            <div
                class="image-container relative w-full mx-auto overflow-hidden lg:max-w-[55rem] 2xl:max-w-[60rem] 2xl:mb-[63px] 2xl:mr-[390px]">
                <img src="../public/img/блокнот_зебра (2).png" alt="Image 2"
                class="zebraMax hidden lg:block w-full h-auto object-cover rounded-lg">

                <div
                    class="hidden lg:block inset-0 overlay-text absolute left-[58%] 2xl:top-[10%] p-2 text-black bg-gradient-to-l to-transparent">
                    <h4 class="text-2xl font-bold">Всем привет! <br> Будем знакомы, Меня зовут Алена.</h4>
                    <p class="text-[18px]">
                        В этом блоге я хочу рассказать про свой жизненный путь, с чего всё началось, поиски себя и
                        своего
                        места в жизни, и всё ли так просто, как кажется на первый взгляд. <br><br>
                        Надеюсь, моя история будет для кого-то полезной, как преодолеть трудности, как не потерять себя
                        и
                        найти силы на что-то новое. <br><br>
                        Жизнь, мягко говоря, непредсказуема! В один момент все идет хорошо, а потом вдруг что-то
                        происходит,
                        и вся жизнь переворачивается с ног на голову, так случилось и у меня...
                    </p>
                </div>
            </div>

            <!-- маленький экран блокнот -->
            <div
                class="image-contain relative max-w-[310px] mx-auto h-auto -top-12 sm:max-w-[430px] lg:hidden overflow-hidden">
                <img src="../public/img/лист_блокнот1024.png" alt="Image 1"
                    class="w-full h-auto object-cover rounded-lg">

                <div class="overlay-text absolute inset-0 flex flex-col justify-center px-10 text-black">
                    <h4 class="text-xl font-bold text-center">
                        Всем привет! <br> Будем знакомы, Меня зовут Алена.
                    </h4>
                    <p class="mt-4 text-[12px] sm:text-base text-center">
                        В этом блоге я хочу рассказать про свой жизненный путь, с чего всё началось, поиски себя и
                        своего
                        места в жизни, и всё ли так просто, как кажется на первый взгляд. <br><br>
                        Надеюсь, моя история будет для кого-то полезной, как преодолеть трудности, как не потерять себя
                        и
                        найти силы на что-то новое. <br><br>
                        Жизнь, мягко говоря, непредсказуема! В один момент все идет хорошо, а потом вдруг что-то
                        происходит,
                        и вся жизнь переворачивается с ног на голову, так случилось и у меня...
                    </p>
                </div>
            </div>
        </div>


        <div class="grid grid-cols-3 grid-rows-[minmax(0,_2fr),minmax(0,_2fr),auto] h-full mx-auto sm:ml-5 md:ml-20">
            <!-- Объединенные ячейки 1 и 4 (прижаты к низу) -->
            <div class="row-span-2 flex flex-col items-center justify-start py-4 z-9"
                style="grid-row: 1 / 3; grid-column: 1 / 2;">
                <div class="flex flex-col space-y-4 transform -translate-x-2 w-48 h-48 
             sm:w-62 sm:h-62 sm:mt-5 md:w-full md:h-82 lg:w-82 lg:h-82 lg:transform lg:-translate-x-10
             2xl:transform 2xl:translate-x-47 2xl:w-98 2xl:h-98 2xl:-mt-7 2xl:space-y-8">
                    <!-- Первое изображение -->
                    <img src="../public/img/блокнот_море.png" alt="Изображение 1"
                        class="-rotate-20 object-contain sm:rotate-0">

                    <!-- Второе изображение -->
                    <img src="../public/img/блокнот_горы.png" alt="Изображение 2"
                        class="-rotate-20 object-contain sm:rotate-0">
                </div>
            </div>

            <!-- Ячейка 2 -->
            <div class="text-center py-4 invisible"
                style="grid-row: 1 / 3; grid-column: 2 / 3;">
                2
            </div>

            <!-- Объединенные ячейки 3 и 6 (остаются сверху) -->
            <div class="row-start-1 row-end-2 flex flex-col justify-start sm:justify-center sm:z-1 "
                style="grid-row: 1 / 3; grid-column: 3 / 4;">
                <div class="space-y-4 w-58 h-58 ml-[-30px] mt-[-30px] md:mt-[70px] z-10 ">
                    <!-- Первое изображение (прижато к верху) -->
                    <img src="../public/img/блокнот_зебраPhone.png" alt="Изображение 1"
                        class=" sm:hidden object-contain">

                    <!-- Второе изображение -->
                    <img src="../public/img/блокнот_зебра1024 (3).png" alt="Изображение 2"
                        class="hidden sm:block sm:ml-5 md:-ml-5 lg:hidden object-contain">
                </div>
            </div>

            <!-- Объединенные ячейки 7-9 -->
            <div class="col-span-3 relative flex items-center justify-center mx-auto w-full"
                style="grid-row: 3 / 4; grid-column: 1 / 4;">
                <!-- Контейнер с изображениями -->
                <div class=" flex flex-row flex-nowrap w-full z-0">
                    <!-- Левый блок с изображениями -->
                    <div class="relative w-full p-4 ">
                        <img src="../public/img/графит.png" alt="" class="absolute -bottom-20 right-0 w-62 h-62 rotate-170 object-contain
                            sm:-bottom-30 lg:-bottom-10 lg:left-50 lg:w-54 lg:h-54 lg:rotate-30
                            2xl:left-148 2xl:-bottom-15 2xl:-rotate-5">
                        <img src="../public/img/точиолка.png" alt="" class="absolute bottom-10 right-12 rotate-45 w-16 h-16 object-contain
                            sm:-bottom-2 sm:right-17 md:right-35 lg:bottom-10
                            2xl:-bottom-5 2xl:rotate-5 2xl:right-28">
                        <img src="../public/img/завиток_niz.png" alt="" class="absolute bottom-18 right-2 -rotate-30 w-8 h-8 object-contain
                            sm:bottom-4 sm:right-7 md:bottom-10 md:right-30 lg:bottom-8 lg:right-25
                            2xl:bottom-0 2xl:right-10">
                        <img src="../public/img/завиток_top.png" alt="" class="absolute bottom-2 left-1 w-8 h-8 md:hidden lg:block
                            sm:-bottom-6 sm:left-20 lg:bottom-3 lg:left-67 lg:rotate-240
                            2xl:bottom-5 2xl:left-180 2xl:rotate-0">
                        <img src="../public/img/завиток_большой1Phone.png" alt="" class="absolute -bottom-10 left-5 w-18 h-18 
                            sm:-bottom-15 sm:left-20 md:hidden">
                    </div>

                    <!-- Центральный блок (пустой, но занимает место) -->
                    <div class="w-full md:w-64 h-32 md:h-48 lg:w-80 lg:h-56 pr-4"></div>

                    <!-- Правый блок с изображениями -->
                    <div class="relative w-full ">
                        <img src="../public/img/завиток_большой.png" alt="" class="absolute hidden bottom-0 right-0 w-32 h-32 object-contain
                          md:block md:w-20 md:h-20 md:right-30 md:bottom-7 md:-rotate-25
                          lg:right-35 lg:bottom-7 lg:rotate-0 2xl:right-100 2xl:bottom-5 2xl:w-32 2xl:h-32">
                        <img src="../public/img/карандаш_leftPhone.png" alt="" class="absolute lg:hidden -bottom-35 right-0 w-20 h-43 object-contain
                            sm:right-7 md:right-28">
                        <img src="../public/img/карандаш_leftPhone.png" alt="" class="absolute lg:hidden -bottom-23 -right-7 w-20 h-43 object-contain
                            sm:-right-0 md:right-20">
                        <img src="../public/img/карандаш_top.png" alt=""
                            class="absolute hidden lg:block -bottom-30 right-43 w-32 h-42
                            2xl:right-107 2xl:-bottom-25">
                        <img src="../public/img/карандаш.png" alt="" 
                            class="absolute hidden lg:block -bottom-20 right-25 w-32 h-42
                            2xl:right-92 2xl:-bottom-18">
                    </div>
                </div>

                <!-- Текст поверх всех изображений -->
                <div class="absolute inset-0 flex flex-col justify-center items-center z-10 text-white w-full">
                    <!-- Обертка для блокнота -->
                    <div class="hidden md:flex flex-col justify-center items-center w-full mt-35 2xl:ml-60">
                        <blockquote class="text-center italic line-clamp-5 px-4 font-clamp">
                            "Мы все, как карандаши. 
                            Каждый рисует свою судьбу. <br>
                            Один ломается, другой тупит, <br>
                            а кто-то затачивается и движется вперёд."
                        </blockquote>
                        <cite class="block mt-1 font-semibold text-center font-clamp-author">( Светлана Кременецкая
                            )</cite>
                    </div>

                    <!-- Блок для маленьких экранов -->
                    <div class="flex flex-col justify-center items-end md:hidden">
                        <blockquote class="text-right italic line-clamp-5 px-4  transform translate-y-13 font-clamp 
                         sm:transform sm:translate-y-33">
                            "Мы все, как карандаши. <br>
                            Каждый рисует свою судьбу. <br>
                            Один ломается, другой тупит, <br>
                            а кто-то затачивается и движется вперёд."
                        </blockquote>
                        <cite class="block mt-14 mr-20 font-semibold text-right font-clamp-author 
                         sm:mt-35">( Светлана Кременецкая )</cite>
                    </div>
                </div>
            </div>
        </div>

    </div>



</template>














<!-- "Мы все, как карандаши.
Каждый рисует свою судьбу.
Один ломается, другой тупит,
а кто-то затачивается и движется вперёд."
Светлана Кременецкая -->
