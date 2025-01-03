<template>
    <main
        class="bg-yellow-300 p-0 m-0 w-screen bg-[url('/public/img/zebra.png')] bg-right bg-no-repeat bg-[length:89%_100%]">
        <div class="flex justify-center mt-10">
            <div class="mt-8 relative h-5/6 rounded-2xl border-4 border-green-800 inline-block bottom-5">
                <img src="../public/img/лист.png" alt="" class="w-full h-full object-cover" />
                <div class="absolute top-14 mx-8">
                    <span> <strong>Всем привет! <br> Будем знакомы, Меня зовут Алена.</strong> </span><br><br>
                    <p>В этом блоге я хочу рассказать про свой жизненный путь, с чего всё началось, поиски себя и своего
                        места в жизни, и всё ли так просто, как кажется на первый взгляд. <br><br>
                        Надеюсь, моя история будет для кого-то полезной, как преодолеть трудности, как не потерять себя
                        и найти силы на что-то новое. <br><br>
                        Жизнь, мягко говоря, непредсказуема. В один момент все идет хорошо, а потом вдруг что-то
                        происходит, и вся жизнь переворачивается с ног на голову, так случилось и у меня... </p>
                </div>
            </div>
        </div>
        <blockquote class="blockquote-7">
            <p>"Мы все, как карандаши. <br>
                Каждый рисует свою судьбу. <br>
                Один ломается, другой тупит, <br>
                а кто-то затачивается и движется вперёд".</p>
            <cite class="cite">Светлана Кременецкая</cite>
        </blockquote>
    </main>


</template>


<script setup>



</script>



<!-- <div class="relative w-10/12 rounded-2xl border-4 h-full border-green-800 flex items-center justify-center">
    <img src="../public/img/лист.png" alt="" class="h-5/6 mb-16 p-4" />
    <div class="absolute"> 
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Fugit quos, voluptatum quas cumque libero optio tempore minus architecto asperiores commodi!
    </div>
</div> -->




<!-- bg-[url('/img/главная.png')] bg-no-repeat bg-fixed bg-right -->

<!-- <div id="default-carousel" class="relative w-full" data-carousel="slide">

    <div class="relative h-56 overflow-hidden rounded-lg md:h-96">

        <div class="duration-700 ease-in-out" data-carousel-item>
            <img src="https://avatars.mds.yandex.net/i?id=25f665cea60df8c45db991f33a6902ae_l-5235821-images-thumbs&n=13" class="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt="...">
        </div>

        <div class="duration-700 ease-in-out" data-carousel-item>
            <img src="https://wikiway.com/upload/hl-photo/cd6/479/chernoe-more_100.jpg" class="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt="...">
        </div>
 
        <div class="duration-700 ease-in-out" data-carousel-item>
            <img src="https://wikiway.com/upload/hl-photo/eb4/a77/chernoe-more_89.jpg" class="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt="...">
        </div>
        
        <div class="duration-700 ease-in-out" data-carousel-item>
            <img src="https://wikiway.com/upload/hl-photo/29d/ddd/chernoe-more_85.jpg" class="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt="...">
        </div>
        
        <div class="duration-700 ease-in-out" data-carousel-item>
            <img src="https://avatars.mds.yandex.net/i?id=25f665cea60df8c45db991f33a6902ae_l-5235821-images-thumbs&n=13" class="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt="...">
        </div>
    </div>
    
    <div class="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
        <button type="button" class="w-3 h-3 rounded-full" aria-current="true" aria-label="Slide 1" data-carousel-slide-to="0"></button>
        <button type="button" class="w-3 h-3 rounded-full" aria-current="false" aria-label="Slide 2" data-carousel-slide-to="1"></button>
        <button type="button" class="w-3 h-3 rounded-full" aria-current="false" aria-label="Slide 3" data-carousel-slide-to="2"></button>
        <button type="button" class="w-3 h-3 rounded-full" aria-current="false" aria-label="Slide 4" data-carousel-slide-to="3"></button>
        <button type="button" class="w-3 h-3 rounded-full" aria-current="false" aria-label="Slide 5" data-carousel-slide-to="4"></button>
    </div>
    
    <button type="button" class="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-prev>
        <span class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
            <svg class="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 1 1 5l4 4"/>
            </svg>
            <span class="sr-only">Previous</span>
        </span>
    </button>
    <button type="button" class="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-next>
        <span class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
            <svg class="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
            </svg>
            <span class="sr-only">Next</span>
        </span>
    </button>
</div> -->
