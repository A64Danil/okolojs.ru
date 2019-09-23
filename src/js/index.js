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
        return xhr.responseText;
    }
}



var source = document.getElementById("trend-template").innerHTML;;
var template = Handlebars.compile(source);

var result = template(getTest());

TRENDS.innerHTML = result;

console.log(result);