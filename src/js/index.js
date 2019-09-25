import jQuery from 'jquery';
import popper from 'popper.js';
import bootstrap from 'bootstrap';
import Handlebars from 'handlebars';


jQuery(function() {
    // jQuery('body').css('color', 'blue');
    console.log("Пасхалка для самых любопытных =) 12-49");
    init();
});


;

function init() {
    // loadModelAndShowBlock('trends', "trend-template", 'trends');
    loadModelAndShowBlock('trends11', "trend-template", 'trends');

    initManagerForm();
}

function loadModelAndShowBlock(blockid, tpl, filename) {
    const BLOCK = document.getElementById(blockid);
    const SOURCE = document.getElementById(tpl);
    if (BLOCK === null) {
        console.log("Нет места для вывода " + blockid);
        return false;
    }

    if (SOURCE === null) {
        console.log("Нет шаблона " + tpl + "для рендеринга");
        return false;
    }

    if (!filename) {
        console.log("Не указана модель данных, filename is " + filename);
        return false;
    } else {
        console.log("Start render ", blockid, tpl, filename);
        const SRCHTML = SOURCE.innerHTML;
        const template = Handlebars.compile(SRCHTML);


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
                BLOCK.innerHTML = result;
            }
        }
    }



}


function initManagerForm() {
    const sendTrend = document.querySelector('.sendtrend');

    if (sendTrend !== null) {

        sendTrend.addEventListener("submit", function (e) {
            e.preventDefault();

            const FORM_DATA = jQuery(this).serialize();
            console.log("Отправляем запрос...")
            // 1. Создаём новый объект XMLHttpRequest
            var xhr = new XMLHttpRequest();

            // 2. Конфигурируем его: GET-запрос на URL 'phones.json'
            // xhr.open('GET', 'core/trends.php?get=all', true);
            xhr.open('POST', 'core/trends.php', true);
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded"); //Передает правильный заголовок в запросе
            // 3. Отсылаем запрос
            xhr.send(FORM_DATA);

            // 4. Если код ответа сервера не 200, то это ошибка
            xhr.onreadystatechange = function() {
                if (this.readyState == 4) {
                    // вывести результат
                    sendTrend.reset();
                    console.log(xhr.responseText);
                    // console.log(JSON.parse(xhr.responseText));
                    if (xhr.responseText === "Данные добавлены") {
                        alert("Данные добавлены");
                    } else {
                        alert("Что-то пошло не так. Данные добавлены. \r\n" + xhr.responseText);
                    }
                }
            }
        });


    } else {
        console.log('Формы sendTrend не существует');
    }



}


//
//
// jQuery(document).ready(function(){
//     console.log("fetchingjs");
//     console.log(jQuery(".sendtrend"));
//     jQuery(".sendtrend").submit(function(e) { //устанавливаем событие отправки для формы с id=form
//         e.preventDefault();
//         var form_data = jQuery(this).serialize(); //собераем все данные из формы
//         console.log(form_data);
//         var newData = encodeURIComponent(form_data);
//         console.log(newData);
//         jQuery.ajax({
//             type: "POST", //Метод отправки
//             dataType: 'text', // тип ожидаемых данных в ответе
//             url: "core/trends.php", //путь до php фаила отправителя
//             data: form_data,
//             success: function(otvet) {
//                 //alert(otvet);
//                 console.log("Ответ");
//                 console.log(otvet);
//
//             }
//         });
//     });
// });