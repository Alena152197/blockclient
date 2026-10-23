<template>
    <main class="mx-auto w-full max-w-lg px-4 py-10">
        <h1 class="mb-3 text-3xl font-extrabold tracking-tight text-[#4a4a4a]">Поддержать</h1>
        <p class="mb-6 text-sm leading-relaxed text-gray-600">
            Мне важно знать, что тексты находят отклик. Ваша поддержка — это тёплый знак внимания и мотивация писать дальше: чаще, честнее и с большим вдохновением.
        </p>

        <ul class="mb-8 space-y-3 text-sm text-gray-800">
            <li class="rounded-lg border border-gray-200 bg-white px-4 py-3">
                <span class="font-semibold text-[#4a4a4a]">Сказать спасибо</span>
                <p class="mt-1 text-gray-600">Напишите пару слов в комментарии к статье — это тоже поддержка.</p>
            </li>
            <li class="rounded-lg border border-gray-200 bg-white px-4 py-3">
                <span class="font-semibold text-[#4a4a4a]">Поделиться ссылкой</span>
                <p class="mt-1 text-gray-600">Перешлите пост другу — так блог живёт лучше любой кнопки «донат».</p>
            </li>
            <li class="rounded-lg border border-gray-200 bg-white px-4 py-3">
                <span class="font-semibold text-[#4a4a4a]">Добровольный перевод</span>
                <p class="mt-1 text-gray-600">
                    Реквизиты появятся здесь позже. Пока можно написать мне через
                    <NuxtLink to="/suggestions" class="font-medium text-[#a79d1c] underline-offset-2 hover:underline">предложения</NuxtLink>
                    — подскажу актуальный способ.
                </p>
            </li>
        </ul>

        <NuxtLink
            to="/blog"
            class="inline-flex items-center rounded-lg border border-[#a79d1c] bg-[#a79d1c]/15 px-4 py-2.5 text-sm font-semibold text-[#6b6414] hover:bg-[#a79d1c]/25"
        >
            К статьям
        </NuxtLink>
    </main>
</template>
