import jQuery from 'jquery';
import popper from 'popper.js';
import bootstrap from 'bootstrap';
import Handlebars from 'handlebars';

// require('./test');
// require('./fetching');

jQuery(function() {
    // jQuery('body').css('color', 'blue');
    console.log("Пасхалка для самых любопытных =) 19-12")
    init();
});


;

function init() {
    loadModelAndShowBlock('trends', "trend-template", 'trends');
}

function loadModelAndShowBlock(blockid, tpl, filename) {
    const block = document.getElementById(blockid);
    if (blockid === null) {
        console.log("Нет места для вывода " + filename);
    } else {

        console.log("Start render ", blockid, tpl, filename)
        const source = document.getElementById(tpl).innerHTML;
        const template = Handlebars.compile(source);


        // 1. Создаём новый объект XMLHttpRequest
        var xhr = new XMLHttpRequest();

        // 2. Конфигурируем его: GET-запрос на URL 'phones.json'
        xhr.open('GET', 'model/'+filename+'.json', true);

        // 3. Отсылаем запрос
        xhr.send();

        // 4. Если код ответа сервера не 200, то это ошибка
        xhr.onreadystatechange = function() {
            if (this.readyState == 4) {
                // вывести результат

                const result = template(JSON.parse(xhr.responseText));
                block.innerHTML = result;
            }
        }
    }



}
