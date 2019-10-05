import jQuery from 'jquery';
import popper from 'popper.js';
import bootstrap from 'bootstrap';
import Handlebars from 'handlebars';


document.addEventListener("DOMContentLoaded", init);


function init() {

    console.log("Пасхалка для самых любопытных =) 18-54");
    // loadModelAndShowBlock('trends', "trend-template", 'trends');
    loadModelAndShowBlock('trends11', "trend-template", 'trends');

    initManagerForm();
    loadAndShowData();
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
            console.log("Готовим запрос");
            xhr.open('POST', '/core/trends.php', true);
            xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded"); //Передает правильный заголовок в запросе
            // 3. Отсылаем запрос
            console.log(FORM_DATA);
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


function loadAndShowData() {
    const infoTable = document.querySelector('.infoFromDB');

    if (infoTable !== null) {
        // 1. Создаём новый объект XMLHttpRequest
        var xhr = new XMLHttpRequest();

        // 2. Конфигурируем его: GET-запрос на URL 'phones.json'
        xhr.open('GET', '/core/trends.php?get=all', true);
        // 3. Отсылаем запрос
        xhr.send();

        // 4. Если код ответа сервера не 200, то это ошибка
        xhr.onreadystatechange = function() {
            if (this.readyState == 4) {
                // вывести результат
                // infoTable.innerHTML = xhr.responseText;

                const result = JSON.parse(xhr.responseText);
                result["trends"].forEach(function (item, i) {
                    let newItemROW = `
                        <tr>
                            <td>${item["id"]}</td>
                            <td>${item["title"]}</td>
                            <td>
                                <form action="">
                                    <input type="submit" value="EDIT">
                                </form>
                            </td>
                        </tr>`;
                    infoTable.querySelector("tbody").innerHTML += newItemROW;
                })

            }
        }
    }
}
