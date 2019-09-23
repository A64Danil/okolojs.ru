import jQuery from 'jquery';
import popper from 'popper.js';
import bootstrap from 'bootstrap';
import Handlebars from 'handlebars';

// require('./test');
// require('./fetching');

jQuery(function() {
    // jQuery('body').css('color', 'blue');
    console.log("Пасхалка для самых любопытных =) 19-12")
});


const TRENDS = document.getElementById("trends");

function getTest() {
    // 1. Создаём новый объект XMLHttpRequest
    var xhr = new XMLHttpRequest();

    // 2. Конфигурируем его: GET-запрос на URL 'phones.json'
    xhr.open('GET', 'model/trends.json', false);

    // 3. Отсылаем запрос
    xhr.send();

    // 4. Если код ответа сервера не 200, то это ошибка
    if (xhr.status != 200) {
        // обработать ошибку
        console.log( xhr.status + ': ' + xhr.statusText ); // пример вывода: 404: Not Found
    } else {
        // вывести результат
        console.log( xhr.responseText ); // responseText -- текст ответа.
    }
}



var source = document.getElementById("trend-template").innerHTML;;
var template = Handlebars.compile(source);

var data = {
    "trends": [
        {
            "title": "Изучите Nodejs создав 12 проектов",
            "titleOriginal": "Learn Nodejs by building 12 projects",
            "description": "Вы узнаете о серверном JavaScript, модулях Node и NPM, использовании других связанных технологий и инфраструктур при построении двенадцати проектов. Технологии, охватываемые курсом, включают в себя технологии HTML / CSS Frontend, Nodejs NPM, базу данных NoSQL, Column DB, базу данных ORM, Express Framework, асинхронное программирование, Karken layer, управление пользователями Drywall, шифрование Bcrypt, API Socket IO и REST.",
            "language": "английский",
            "difficulty": "Средний",
            "author": "Udemy (Brad Tavares)",
            "url": "https://coursehunter.net/course/izuchite-nodejs-sozdav-12-proektov",
            "published": "11.01.2017",
            "started": "1.04.2019",
            "status": "Будет завершен 1.11.2019"
        },
        {
            "title": "Базовый курс по JS 2018",
            "titleOriginal": "",
            "description": "Свежий курс по комплексному обучению языка Javascript от Loftschool. Если вы хотите сложить по полочкам все свои знания о javascript а также поднять свой скилл на новый уровень - этот курс призван вам в этом помочь.",
            "language": "русский",
            "difficulty": "Лёгкий",
            "author": "LoftSchool",
            "url": "https://coursehunter.net/course/kompleksnoe-obuchenie-javascript",
            "published": "18.01.2018",
            "started": "1.02.2018",
            "status": "Завершен 1.07.2018"
        }
    ]
};

var result = template(data);

TRENDS.innerHTML = result;

console.log(result);


data.forEach(){
    title == .... {
        return id
    }
}