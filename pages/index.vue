<template>
    <div class="phoneMain">
        <!-- Левая часть -->
        <div class="left-images">
            <img src="../public/img/блокнот_море.png" alt="Картинка 1" class="image-left-top">
            <img src="../public/img/блокнот_горы.png" alt="Картинка 2" class="image-left-bottom">
        </div>
        <!-- Центральная часть -->
        <div class="center-content" v-if="index.config.primeryBlock">
            <img src="../public/img/блокнот_зебра (2).png" alt="Картинка 3" class="center-image">
            <!-- Режим просмотра -->
            <div 
                v-if="!isEditing"
                class="textKra" 
                v-html="notebookText"
            ></div>
            <!-- Режим редактирования -->
            <textarea
                v-else
                class="textKra textKra-edit"
                v-model="editingText"
                @keydown.ctrl.enter="saveText"
                @keydown.esc="cancelEdit"
            ></textarea>
            <!-- Кнопки управления -->
            <div class="edit-controls">
                <button 
                    v-if="!isEditing"
                    @click="startEdit"
                    class="edit-btn"
                    title="Редактировать текст"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                    </svg>
                </button>
                <div v-else class="edit-buttons">
                    <button @click="saveText" class="save-btn" title="Сохранить (Ctrl+Enter)">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                        </svg>
                    </button>
                    <button @click="cancelEdit" class="cancel-btn" title="Отмена (Esc)">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                        </svg>
                    </button>
                </div>
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

<script setup>
import { ref, onMounted, nextTick } from 'vue';

const index = useSearchStore();

const STORAGE_KEY = 'notebook-text';

const defaultText = `<h4>Всем привет! <br>
Будем знакомы, Меня зовут Алена.</h4>
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
так случилось и у меня...</p>`;

const notebookText = ref(defaultText);
const isEditing = ref(false);
const editingText = ref('');

// Загрузка текста из localStorage
const loadText = () => {
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            notebookText.value = saved;
        }
    }
};

// Сохранение текста в localStorage
const saveToStorage = (text) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, text);
    }
};

// Начать редактирование
const startEdit = () => {
    // Конвертируем HTML в простой текст для textarea с сохранением форматирования
    let htmlText = notebookText.value;
    
    // Заменяем закрывающие теги параграфов и заголовков на двойные переносы строк
    htmlText = htmlText.replace(/<\/p>/gi, '\n\n');
    htmlText = htmlText.replace(/<\/h4>/gi, '\n\n');
    htmlText = htmlText.replace(/<\/h[1-6]>/gi, '\n\n');
    
    // Заменяем <br> и <br/> на одинарные переносы строк
    htmlText = htmlText.replace(/<br\s*\/?>/gi, '\n');
    
    // Заменяем &nbsp; на обычные пробелы перед удалением тегов
    htmlText = htmlText.replace(/&nbsp;/gi, ' ');
    
    // Удаляем открывающие теги
    htmlText = htmlText.replace(/<p[^>]*>/gi, '');
    htmlText = htmlText.replace(/<h4[^>]*>/gi, '');
    htmlText = htmlText.replace(/<h[1-6][^>]*>/gi, '');
    
    // Удаляем все остальные HTML теги, но сохраняем текст с пробелами
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlText;
    // Используем textContent вместо innerText, чтобы лучше сохранить пробелы
    let plainText = tempDiv.textContent || tempDiv.innerText || '';
    
    // Нормализуем переносы строк, но сохраняем все пробелы
    plainText = plainText
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
        .replace(/\n{3,}/g, '\n\n'); // Максимум 2 переноса подряд
    // Убираем только начальные и конечные пробелы всего текста (не внутри)
    plainText = plainText.trim();
    
    editingText.value = plainText;
    isEditing.value = true;
    // Фокусируемся на textarea после переключения
    nextTick(() => {
        const textarea = document.querySelector('.textKra-edit');
        if (textarea) {
            textarea.focus();
            // Устанавливаем курсор в конец текста
            textarea.setSelectionRange(textarea.value.length, textarea.value.length);
        }
    });
};

// Сохранить изменения
const saveText = () => {
    if (!editingText.value.trim()) {
        notebookText.value = defaultText;
    } else {
        // Конвертируем простой текст обратно в HTML с сохранением форматирования
        let formattedText = editingText.value
            .replace(/\r\n/g, '\n') // Нормализуем переносы строк
            .replace(/\r/g, '\n');
        
        // Сначала заменяем пробелы перед знаками препинания на &nbsp; во всем тексте
        // Это сохранит пробелы типа "слово ," или "слово ."
        formattedText = formattedText.replace(/([ \t]+)([,\.;:!?\)])/g, (match, spaces, punct) => {
            return '&nbsp;'.repeat(spaces.length) + punct;
        });
        
        // Разбиваем на строки, сохраняя пустые строки
        const allLines = formattedText.split('\n');
        
        // Обрабатываем строки, группируя их в параграфы
        // Двойной перенос строки (\n\n) = новый параграф (включая пустые)
        // Одинарный перенос (\n) = <br> внутри параграфа
        const result = [];
        let currentParagraph = [];
        
        for (let i = 0; i < allLines.length; i++) {
            const line = allLines[i];
            const isLineEmpty = line.trim() === '';
            const nextLine = allLines[i + 1];
            const isNextLineEmpty = nextLine !== undefined && nextLine.trim() === '';
            
            // Если строка пустая - это означает двойной перенос (новая строка после предыдущей)
            if (isLineEmpty) {
                // Сохраняем текущий параграф, если он есть
                if (currentParagraph.length > 0) {
                    result.push(currentParagraph);
                    currentParagraph = [];
                }
                // Добавляем пустой параграф
                result.push([]);
            } else {
                // Непустая строка - добавляем в текущий параграф
                currentParagraph.push(line);
            }
        }
        
        // Добавляем последний параграф, если он есть
        if (currentParagraph.length > 0) {
            result.push(currentParagraph);
        }
        
        // Преобразуем параграфы в HTML
        formattedText = result.map(paragraph => {
            // Если параграф пустой - возвращаем пустой параграф
            if (paragraph.length === 0 || paragraph.every(line => !line.trim())) {
                return '<p><br></p>';
            }
            
            // Обрабатываем строки в параграфе
            const processedLines = paragraph.map(line => {
                // Заменяем пробелы в конце строки на &nbsp;
                return line.replace(/([ \t]+)$/g, (match) => {
                    return '&nbsp;'.repeat(match.length);
                });
            });
            
            const paragraphContent = processedLines.join('<br>');
            const paragraphText = paragraph.join(' ').trim();
            
            // Если строка короткая и содержит ключевые слова - это заголовок
            if (paragraphText.length < 60 && (
                paragraphText.toLowerCase().includes('привет') || 
                paragraphText.toLowerCase().includes('знакомы') ||
                paragraphText.toLowerCase().includes('меня зовут')
            )) {
                return `<h4>${paragraphContent}</h4>`;
            }
            // Обычный параграф
            return `<p>${paragraphContent}</p>`;
        }).join('');
        
        notebookText.value = formattedText || defaultText;
    }
    
    saveToStorage(notebookText.value);
    isEditing.value = false;
};

// Отменить редактирование
const cancelEdit = () => {
    isEditing.value = false;
    editingText.value = '';
};

// Загружаем текст при монтировании
onMounted(() => {
    loadText();
});
</script>

<style scoped>
.phoneMain {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(100vh - 151px);
    width: 100vw;
    max-width: 100vw;
    background-image: url("../public/img/зебра_фон_полосы.png");
    background-size: 100% 110%;
    background-position: center;
    background-repeat: no-repeat;
    overflow: hidden;
}

.textKra {
    position: absolute;
    top: 5%;
    right: 6%;
    left: 58%;
    bottom: 8%;
    color: rgb(10, 10, 10);
    font-size: clamp(11px, 1.1vw, 15px);
    text-align: left;
    z-index: 10;
    padding: 20px 15px;
    overflow: hidden;
    outline: none;
    word-wrap: break-word;
    line-height: 1.6;
    max-height: 100%;
    box-sizing: border-box;
    cursor: text;
    user-select: text;
}

.textKra:focus {
    background: rgba(255, 255, 255, 0.15);
    border-radius: 4px;
    box-shadow: 0 0 0 2px rgba(139, 120, 80, 0.2);
}

.textKra:hover {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
}

.textKra-edit {
    resize: none;
    border: 2px solid rgba(139, 120, 80, 0.3);
    background: rgba(255, 255, 255, 0.9);
    border-radius: 4px;
    font-family: inherit;
    overflow-y: auto;
}

.textKra-edit:focus {
    outline: none;
    border-color: rgba(139, 120, 80, 0.6);
    box-shadow: 0 0 0 3px rgba(139, 120, 80, 0.1);
    background: rgba(255, 255, 255, 0.95);
}

.textKra h4 {
    margin: 0 0 0.5em 0;
    font-size: 1.1em;
    font-weight: 600;
}

.textKra p {
    margin: 0 0 0.8em 0;
    text-indent: 0;
}

.edit-controls {
    position: absolute;
    top: 2%;
    right: 2%;
    z-index: 20;
    display: flex;
    gap: 8px;
}

.edit-btn,
.save-btn,
.cancel-btn {
    background: rgba(255, 255, 255, 0.9);
    border: 2px solid rgba(139, 120, 80, 0.4);
    border-radius: 50%;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    color: #6b5a3a;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.edit-btn:hover {
    background: rgba(255, 255, 255, 1);
    border-color: rgba(139, 120, 80, 0.6);
    transform: scale(1.05);
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
}

.save-btn {
    background: rgba(76, 175, 80, 0.9);
    border-color: rgba(76, 175, 80, 0.6);
    color: white;
}

.save-btn:hover {
    background: rgba(76, 175, 80, 1);
    transform: scale(1.05);
    box-shadow: 0 3px 8px rgba(76, 175, 80, 0.3);
}

.cancel-btn {
    background: rgba(244, 67, 54, 0.9);
    border-color: rgba(244, 67, 54, 0.6);
    color: white;
}

.cancel-btn:hover {
    background: rgba(244, 67, 54, 1);
    transform: scale(1.05);
    box-shadow: 0 3px 8px rgba(244, 67, 54, 0.3);
}

.edit-buttons {
    display: flex;
    gap: 8px;
}

.left-images,
.right-images,
.center-content {
    position: absolute;
}

.left-images {
    left: 24%;
    top: 46%;
    transform: translateY(-50%);
    width: 19%;
}

.left-images img {
    width: 100%;
    height: auto;
    margin-bottom: 10px;
}

.center-content {
    left: 56%;
    top: 45%;
    transform: translate(-50%, -50%);
    text-align: center;
    width: 47%;
}

.center-image {
    width: 100%;
    height: 100%;
}

.quote-container {
    position: absolute;
    left: 62%;
    transform: translate(-70%, -15%);
    max-width: 420px;
    white-space: initial;
}

.quote {
    font-size: clamp(1rem, 1vw, 1rem);
    font-style: italic;
    font-weight: 700;
    color: #000000;
    line-height: 1.6;
    text-shadow: 
        2px 2px 4px rgba(255, 255, 255, 1),
        0 0 10px rgba(255, 255, 255, 0.9),
        0 0 20px rgba(255, 255, 255, 0.7),
        -1px -1px 2px rgba(255, 255, 255, 0.8);
    -webkit-text-stroke: 0.3px rgba(255, 255, 255, 0.5);
}

.author {
    font-size: clamp(0.8rem, 1.5vw, 1rem);
    font-weight: 600;
    color: #0a0a0a;
    margin-top: 12px;
    text-shadow: 
        1px 1px 3px rgba(255, 255, 255, 1),
        0 0 8px rgba(255, 255, 255, 0.9),
        0 0 15px rgba(255, 255, 255, 0.7),
        -1px -1px 1px rgba(255, 255, 255, 0.8);
    -webkit-text-stroke: 0.2px rgba(255, 255, 255, 0.5);
}

.right-images {
    right: 20%;
    bottom: -7%;
    width: 8%;
}

.right-images img {
    width: 100%;
    height: auto;
}

.image-right-middle,
.image-right-top,
.image-right-bottom,
.imageRightBlock {
    position: absolute;
}

.image-right-middle {
    bottom: 10px;
    right: 60px;
}

.image-right-top {
    bottom: 20px;
    right: -10px;
}

.image-right-bottom {
    bottom: 120px;
    right: 40px;
    scale: 0.5;
}

.imageRightBlock {
    bottom: 120px;
    scale: 2.4;
    display: none;
}

.imageRightNone {
    display: none;
    overflow: hidden;
}

.grafKara,
.topKara,
.nizKara,
.tocKara,
.phoneToc {
    display: none;
}

@media (max-width: 1600px) {
    .quote-container {
        bottom: -32%;
        transform: translate(-50%, -50%);
    }

    .quote {
        font-size: clamp(0.9rem, 1vw, 0.9rem);
    }

    .author {
        font-size: clamp(0.7rem, 1.5vw, 0.8rem);
    }

    .textKra {
        font-size: clamp(11px, 1.1vw, 15px);
        padding: 18px 12px;
    }
}

@media (max-width: 1500px) {
    .phoneMain {
        background-image: url(../public/img/зебра_полосы1536.png);
    }

    .left-images {
        left: 13%;
        top: 53%;
    }

    .center-content {
        left: 50%;
        top: 51%;
        width: 58%;
    }

    .quote-container {
        bottom: -31%;
    }

    .textKra {
        font-size: clamp(11px, 1.1vw, 14px);
        padding: 18px 12px;
    }
}

@media (max-width: 1320px) {
    .quote-container {
        bottom: -43%;
    }

    .image-right-middle {
        bottom: -40px;
        right: 40px;
    }

    .image-right-top {
        bottom: -30px;
        right: -10px;
    }

    .image-right-bottom {
        bottom: 60px;
        right: 30px;
        scale: 0.8;
    }

    .textKra {
        font-size: clamp(10px, 1vw, 13px);
        padding: 15px 10px;
    }
}

@media (max-width: 1200px) {
    .center-content {
        left: 48%;
        top: 50%;
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
        bottom: -40px;
        right: 85px;
        scale: 1.2;
    }

    .image-right-top {
        bottom: -30px;
        right: 35px;
        scale: 1.2;
    }

    .image-right-bottom {
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

    .quote-container {
        bottom: -14rem;
        left: 92%;
        transform: translateX(-50%);
        width: 300px;
        text-align: center;
    }

    .quote {
        font-size: 14px;
        color: #b0b3b0;
    }

    .author {
        font-size: clamp(0.7rem, 1.2vw, 0.8rem);
    }

    .image-right-middle {
        bottom: -30px;
        right: -70px;
        scale: 1.4;
    }

    .image-right-top {
        bottom: -15px;
        right: -130px;
        scale: 1.4;
    }

    .image-right-bottom {
        bottom: 90px;
        right: -140px;
        scale: 1.2;
    }

    .imageRightBlock {
        bottom: 28rem;
        z-index: 1;
        left: -20px;
        scale: 3.5;
        display: block;
    }

    .textKra {
        font-size: clamp(10px, 1vw, 14px);
        padding: 15px 10px;
        right: 6%;
        left: 60%;
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
        bottom: -30px;
        right: -40px;
        scale: 1.4;
    }

    .image-right-top {
        bottom: -15px;
        right: -90px;
        scale: 1.4;
    }

    .image-right-bottom {
        bottom: 90px;
        right: -100px;
        scale: 1.2;
    }

    .textKra {
        font-size: clamp(9px, 0.9vw, 12px);
        padding: 12px 8px;
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

    .quote-container {
        bottom: -14rem;
        left: 93%;
        transform: translateX(-50%);
        width: 280px;
        text-align: right;
    }

    .quote {
        font-size: clamp(0.9rem, 1.5vw, 1rem);
        color: #d3cbcb;
    }

    .author {
        font-size: clamp(0.8rem, 1.2vw, 0.8rem);
    }

    .image-right-middle,
    .image-right-top,
    .image-right-bottom {
        display: none;
    }

    .left-images img {
        transform: rotate(-20deg);
    }

    .grafKara,
    .topKara,
    .nizKara,
    .tocKara,
    .phoneToc {
        display: block;
        position: absolute;
        z-index: 6;
    }

    .grafKara {
        bottom: 4rem;
        left: -16rem;
        scale: 2.6;
        z-index: 5;
    }

    .topKara {
        bottom: 2rem;
        left: -16rem;
        scale: 1;
    }

    .nizKara {
        bottom: 4rem;
        left: -20rem;
        scale: 0.6;
    }

    .tocKara {
        bottom: 8rem;
        left: -13rem;
        scale: 0.6;
    }

    .phoneToc {
        bottom: 7rem;
        left: -17rem;
        scale: 1;
    }

    .textKra {
        font-size: clamp(10px, 1vw, 13px);
        padding: 12px 8px;
    }
}

@media (max-width: 650px) {
    .imageRightNone {
        bottom: 48rem;
        left: 1rem;
        scale: 5;
    }

    .left-images {
        left: 8%;
        top: 55%;
        scale: 1.8;
    }

    .center-content {
        left: 50%;
        top: 43%;
        width: 65%;
    }

    .quote-container {
        bottom: -13rem;
        left: 75%;
        transform: translateX(-50%);
        width: 280px;
        text-align: right;
    }

    .grafKara {
        bottom: 5rem;
        left: -17rem;
        scale: 2.6;
        z-index: 5;
    }

    .topKara {
        bottom: 2rem;
        left: -18rem;
        scale: 1.2;
    }

    .nizKara {
        bottom: 5rem;
        left: -21rem;
    }

    .tocKara {
        bottom: 7rem;
        left: -14rem;
    }

    .phoneToc {
        bottom: 7rem;
        left: -18rem;
    }

    .textKra {
        font-size: clamp(10px, 1vw, 14px);
        padding: 10px 6px;
    }
}

@media (max-width: 550px) {
    .imageRightNone {
        bottom: 48rem;
        left: 4rem;
        scale: 6;
    }

    .left-images {
        left: 8%;
        top: 58%;
        scale: 2.2;
    }

    .center-content {
        left: 50%;
        top: 40%;
        width: 75%;
    }

    .quote-container {
        bottom: -14rem;
        left: 50%;
        transform: translateX(-50%);
        width: 300px;
        text-align: right;
    }

    .quote {
        font-size: 14px;
    }

    .author {
        font-size: 14px;
    }

    .grafKara,
    .topKara,
    .nizKara,
    .tocKara,
    .phoneToc {
        display: none;
    }

    .textKra {
        font-size: clamp(9px, 0.9vw, 12px);
        padding: 10px 6px;
        text-align: left;
    }
}

@media (max-width: 430px) {
    .imageRightNone {
        bottom: 47rem;
        left: 3rem;
        scale: 7.5;
    }

    .left-images {
        left: 8%;
        top: 60%;
        scale: 2.5;
    }

    .center-content {
        left: 50%;
        top: 38%;
        width: 82%;
    }

    .quote-container {
        bottom: -15rem;
        left: 47%;
        transform: translateX(-50%);
        width: 250px;
        text-align: right;
    }

    .quote {
        font-size: 12px;
    }

    .author {
        font-size: 12px;
    }

    .textKra {
        font-size: clamp(8px, 0.8vw, 10px);
        padding: 8px 5px;
        text-align: left;
    }

    .edit-controls {
        top: 1%;
        right: 1%;
    }

    .edit-btn,
    .save-btn,
    .cancel-btn {
        width: 32px;
        height: 32px;
    }
}

@media (max-width: 768px) {
    .edit-controls {
        top: 1%;
        right: 1%;
    }

    .edit-btn,
    .save-btn,
    .cancel-btn {
        width: 30px;
        height: 30px;
    }

    .edit-btn svg,
    .save-btn svg,
    .cancel-btn svg {
        width: 16px;
        height: 16px;
    }
}
</style>

