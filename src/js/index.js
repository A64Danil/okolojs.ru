import jQuery from 'jquery';
import popper from 'popper.js';
import bootstrap from 'bootstrap';
import Handlebars from 'handlebars';


document.addEventListener("DOMContentLoaded", init);


function init() {

    console.log("Пасхалка для самых любопытных =) 23-01");
    loadModelAndShowBlock('trends', "trend-template", 'trends');
    // loadModelAndShowBlock('trends11', "trend-template", 'trends');

    initManagerForm();
    editTrends();
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
    const sendTrend = document.querySelector('.sendTrend');

    if (sendTrend !== null) {
        sendTrend.addEventListener("submit", function (e) {
            e.preventDefault();
            sendRequest('/core/trends.php', addTrend, this, "POST");
            loadAndShowData();
        });
    } else {
        console.log('Формы sendTrend не существует');
    }



}


function loadAndShowData() {
    const editTrendsTable = document.querySelector('.editTrendsTable');

    if (editTrendsTable!== null) {
        sendRequest('/core/trends.php?id=all', showTrends);
    }
}

function editTrends() {
    const editTrends = document.querySelector('.editTrendsTable');

    if (editTrends !== null) {
        editTrends.addEventListener("click", function (e) {
            e.preventDefault();
            const target = e.target;

            if (target.classList.contains("js_EditTrendButton")) {
                e.preventDefault();
                const button = target;
                const form = button.parentNode;
                const FORM_DATA = jQuery(form).serialize();
                console.log(FORM_DATA);
                const formDataObj = paramsToJson(FORM_DATA);
                sendRequest('/core/trends.php?id=' + formDataObj.id, addInfoToUpdateTrendForm);
            }


        });
    }
}


function sendRequest(url, callback, form, method = "GET") {
    console.log("Отправляем запрос...");
    let FORM_DATA;
    // 1. Создаём новый объект XMLHttpRequest
    var xhr = new XMLHttpRequest();

    // 2. Конфигурируем его: GET-запрос на URL 'phones.json'
    if (method == "GET") {
        xhr.open('GET', url, true);
        xhr.send(); // 3. Отсылаем запрос
    } else {
        xhr.open('POST', url, true);
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded"); //Передает правильный заголовок в запросе
        FORM_DATA = jQuery(form).serialize();
        xhr.send(FORM_DATA); // 3. Отсылаем запрос
    }

    // 4. Если код ответа сервера не 200, то это ошибка
    xhr.onreadystatechange = function() {
        if (this.readyState == 4) {
            form ? callback(xhr.responseText, form) : callback(xhr.responseText); // вызвать колбэк и передать ему ответ
        }
    }
}


function addTrend(response, form) {
    form.reset();
    if (response === "Данные добавлены") {
        alert("Данные добавлены");
    } else {
        alert("Что-то пошло не так. Данные добавлены. \r\n" + response);
    }
}

function showTrends(response) {
    const editTrendsTable = document.querySelector('.editTrendsTable');
    const result = JSON.parse(response);
    editTrendsTable.querySelector("tbody").innerHTML = "";
    result["trends"].forEach(function (item) {
        let newItemROW = `
                        <tr>
                            <td>${item["id"]}</td>
                            <td>${item["title"]}</td>
                            <td>
                                <form class="editTrendForm" action="https://okolojs.ru/core/trends.php">
                                    <input type="hidden" name="method" value="UPDATE">
                                    <input type="hidden" name="id" value="${item["id"]}">
                                    <input class="js_EditTrendButton" type="submit" value="EDIT">
                                </form>
                            </td>
                        </tr>`;
        editTrendsTable.querySelector("tbody").innerHTML += newItemROW;
    })
}

function addInfoToUpdateTrendForm(info) {
    const updateTrendForm = document.querySelector('.updateTrend');
    if (updateTrendForm) {
        const formInputID = updateTrendForm.querySelector('[name=id]');
        const formInputTitle = updateTrendForm.querySelector('[name=title]');
        const formInputInfo = updateTrendForm.querySelector('[name=info]');
        const formInfo = JSON.parse(info).trends[0];

        formInputID.value = formInfo.id;
        formInputTitle.value = formInfo.title;
        formInputInfo.innerText = JSON.stringify(formInfo.info);

    } else {
        console.log("Формы updateTrendForm нет")
    }
}

function paramsToJson(string) {
    const obj = {};
    string.split("&").forEach( el => {
        let newProperty = el.split("=");
        obj[newProperty[0]] = newProperty[1];
    });
    return obj;
}