<template>
    <div class="phone">
        <div class="absolute z-10 inset-0 h-screen flex items-center justify-center">
            <img src="../public/img/блокнот_зебра (2).png" alt="Image 2" class="zebraMax hidden lg:block">
            <img src="../public/img/лист_блокнот1024.png" alt="" class="block lg:hidden absolute scale-[.7] sm:scale-[.9]">
        </div>
        <div class="grid-container">
            <div class="item-grid item1">
                <div class="samolet">
                    <img src="../public/img/блокнот_море.png" alt="Image1" class="scale-[.6] sm:scale-[.9] ">
                </div>
            </div>
            <div class="item-grid item2">
                <div class="gory-rek">
                    <img src="../public/img/блокнот_горы.png" alt="Image2" class="scale-[.6] sm:scale-[.9] ">
                </div>
            </div>
            <div class="item-grid item3">
                <div class="bloknot">
                    <img src="../public/img/блокнот_зебра (2).png" alt="Image 2" class=" invisible">
                </div>
            </div>
            <div class="item-grid item4">

                <div class="mini-bloknot block md:hidden">
                    <img src="../public/img/блокнот_зебра1024.png" alt="" class="zebraNon">
                </div>

                <div class="block-item4">
                    <div class="tochilka -translate-y-[200px] -translate-x-[100px] sm:translate-y-[0] sm:translate-x-[0]">
                        <img src="../public/img/графит.png" alt="" class="base-image">
                        <img src="../public/img/точиолка.png" alt="" class="toc_image">
                        <img src="../public/img/завиток_top.png" alt="" class="overlay-image image1">
                        <img src="../public/img/завиток_niz.png" alt="" class="overlay-image image2">
                    </div>

                    <div class="text-quote">
                        <blockquote class="quote font-bold text-white text-xl -translate-y-[200px] -translate-x-[350px] sm:translate-y-[0] sm:translate-x-[0] md:mt-[250px]">
                            <p>"Мы все, как карандаши.
                                Каждый рисует свою судьбу.
                                Один ломается, другой тупит, <br>
                                а кто-то затачивается и движется вперёд".</p>
                            <cite class="cite">Светлана Кременецкая</cite>
                        </blockquote>
                    </div>
                    
                    <div class="karandash">
                        <img src="../public/img/завиток_большой.png" alt="" class="next-image big">
                        <img src="../public/img/карандаш_top.png" alt="" class="next-image top">
                        <img src="../public/img/карандаш.png" alt="" class="next-image bottom">
                    </div>
                </div>


            </div>
        </div>
    </div>
</template>
