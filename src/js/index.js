import jQuery from 'jquery';
import popper from 'popper.js';
import bootstrap from 'bootstrap';
import Handlebars from 'handlebars';


document.addEventListener("DOMContentLoaded", coreFunction);


function coreFunction() {

    const mainManager = document.querySelector('.mainManager');
    function init() {

        console.log("Пасхалка для самых любопытных =) 2020");
        loadModelAndShowBlock('trends', "trend-template", 'trends');
        // loadModelAndShowBlock('trends11', "trend-template", 'trends');
        mainEvents();

        if (mainManager) {
            console.log("Вы в админке");
            initManager();
        } else {
            console.log("Вы не в админке, доп. скрипты грузить не надо");

        }

    }

    init();

    function initManager() {
        let isSending = false;


        trendsMainManager();
        usflMainManager();


        function trendsMainManager() {

            const addTrendForm = document.querySelector('.addTrendForm');
            const updateTrendForm = document.querySelector('.updateTrendForm');
            const manageTrendsTable = document.querySelector('.manageTrendsTable');


            loadTrends();
            addTrendFormControl();
            updateTrendFormControl();
            manageTrendsTableControl();


            // Add trend
            function addTrendFormControl() {
                if (addTrendForm !== null) {
                    addTrendForm.addEventListener("submit", function (e) {
                        e.preventDefault();


                        if (isSending) {
                            alert("Вы уже отправили запрос. Сначала дождитесь ответ.");
                            return false
                        }
                        if(textAreaJsonValidation(addTrendForm)) {
                            isSending = true;
                            sendRequest('/core/db/trends.php', addTrendRequest, this, "POST");
                        }

                    });

                    addTrendForm.addEventListener("reset", function (e) {
                        jQuery('#addTrendModal').modal('hide');
                    })
                } else {
                    console.log('Формы sendTrend не существует');
                }



            }

            function addTrendRequest(response, form) {
                if (response === "Запись добавлена") {
                    alert("Запись добавлена");
                    form.reset();
                } else {
                    alert("Что-то пошло не так: \r\n" + response);
                }
                isSending = false;
                loadTrends();
            }


            // Edit trend
            function updateTrendFormControl() {
                if (updateTrendForm) {
                    updateTrendForm.addEventListener("submit", function (e) {
                        e.preventDefault();

                        if (isSending) {
                            alert("Вы уже отправили запрос. Сначала дождитесь ответ.");
                            return false
                        }
                        if(textAreaJsonValidation(updateTrendForm)) {
                            isSending = true;
                            sendRequest('/core/db/trends.php', updateTrendRequest, this, "POST");
                        }
                    });

                    updateTrendForm.addEventListener("reset", function (e) {
                        jQuery('#updateTrendModal').modal('hide');
                    })
                }
            }

            function updateTrendRequest(response, form) {
                loadTrends();
                if (response === "Запись обновлена") {
                    alert("Запись обновлена");
                    form.querySelector('textarea').value = "";
                    form.reset();
                } else {
                    alert("Не удалось обновить. Что-то пошло не так: \r\n" + response);
                }
                isSending = false;
            }

            function addInfoToUpdateTrendForm(info) {
                if (updateTrendForm) {
                    jQuery('#updateTrendModal').modal('show');
                    const formInputID = updateTrendForm.querySelector('[name=id]');
                    const formInputTitle = updateTrendForm.querySelector('[name=title]');
                    const formInputInfo = updateTrendForm.querySelector('[name=info]');
                    const formInfo = JSON.parse(info).trends[0];

                    formInputID.value = formInfo.id;
                    formInputTitle.value = formInfo.title;
                    formInputInfo.value = JSON.stringify(formInfo.info, undefined, 4);

                } else {
                    console.log("Формы updateTrendForm нет")
                }
            }


            // Delete trend
            function deleteTrendRequest(response, form) {
                loadTrends();
                if (response === "Запись удалена") {
                    alert("Запись удалена");
                    updateTrendForm.reset();
                } else {
                    alert("Не удалось удалить запись. Что-то пошло не так: \r\n" + response);
                }
            }


            // Кнопки EDIT and DELETE
            function manageTrendsTableControl() {
                if (manageTrendsTable !== null) {
                    manageTrendsTable.addEventListener("click", function (e) {
                        e.preventDefault();
                        const target = e.target;

                        if (target.classList.contains("js_EditTrendButton")) {
                            e.preventDefault();
                            const button = target;
                            const form = button.parentNode;
                            const FORM_DATA = jQuery(form).serialize();
                            // console.log(FORM_DATA);
                            const formDataObj = paramsToJson(FORM_DATA);
                            if (parseInt(formDataObj.id) > 0) {
                                switch(button.value) {
                                    case 'EDIT':
                                        sendRequest('/core/db/trends.php?id=' + formDataObj.id, addInfoToUpdateTrendForm);
                                        break;
                                    case 'DELETE':
                                        if (confirm("Точно удалить?")) {
                                            sendRequest('/core/db/trends.php?', deleteTrendRequest, form, "POST");
                                        }

                                        break;
                                }
                            } else {
                                alert("Что-то пошло не так, передан не верный id: " + formDataObj.id);
                            }


                        }


                    });
                }
            }


            // LOAD and SHOW Trends helpers
            function loadTrends() {
                if (manageTrendsTable!== null) {
                    manageTrendsTable.querySelector("tbody").innerHTML = "";
                    sendRequest('/core/db/trends.php?id=all', showTrendsInManager, manageTrendsTable);
                }
            }




        }

        function usflMainManager() {

            const addUsflLinkForm = document.querySelector('.addUsflLinkForm');
            const updateUsflLinkForm = document.querySelector('.updateUsflLinkForm');
            const manageUsflLinksTable = document.querySelector('.manageUsflLinksTable');


            loadUsflLinks();
            addUsflLinkFormControl();
            updateUsflLinkFormControl();
            manageUsflLinksTableControl();


            // Add usflLink
            function addUsflLinkFormControl() {
                if (addUsflLinkForm !== null) {
                    addUsflLinkForm.addEventListener("submit", function (e) {
                        e.preventDefault();


                        if (isSending) {
                            alert("Вы уже отправили запрос. Сначала дождитесь ответ.");
                            return false
                        }
                        if(textAreaJsonValidation(addUsflLinkForm)) {
                            isSending = true;
                            sendRequest('/core/db/usfl.php', addUsflLinkRequest, this, "POST");
                        }

                    });

                    addUsflLinkForm.addEventListener("reset", function (e) {
                        jQuery('#addUsflLinkModal').modal('hide');
                    })
                } else {
                    console.log('Формы sendUsflLink не существует');
                }



            }

            function addUsflLinkRequest(response, form) {
                if (response === "Запись добавлена") {
                    alert("Запись добавлена");
                    form.reset();
                } else {
                    alert("Что-то пошло не так: \r\n" + response);
                }
                isSending = false;
                loadUsflLinks();
            }


            // Edit usflLink
            function updateUsflLinkFormControl() {
                if (updateUsflLinkForm) {
                    updateUsflLinkForm.addEventListener("submit", function (e) {
                        e.preventDefault();

                        if (isSending) {
                            alert("Вы уже отправили запрос. Сначала дождитесь ответ.");
                            return false
                        }
                        if(textAreaJsonValidation(updateUsflLinkForm)) {
                            isSending = true;
                            sendRequest('/core/db/usfl.php', updateUsflLinkRequest, this, "POST");
                        }
                    });

                    updateUsflLinkForm.addEventListener("reset", function (e) {
                        jQuery('#updateUsflLinkModal').modal('hide');
                    })
                }
            }

            function updateUsflLinkRequest(response, form) {
                loadUsflLinks();
                if (response === "Запись обновлена") {
                    alert("Запись обновлена");
                    form.querySelector('textarea').value = "";
                    form.reset();
                } else {
                    alert("Не удалось обновить. Что-то пошло не так: \r\n" + response);
                }
                isSending = false;
            }

            function addInfoToUpdateUsflLinkForm(info) {
                if (updateUsflLinkForm) {
                    jQuery('#updateUsflLinkModal').modal('show');
                    const formInputID = updateUsflLinkForm.querySelector('[name=id]');
                    const formInputTitle = updateUsflLinkForm.querySelector('[name=title]');
                    const formInputInfo = updateUsflLinkForm.querySelector('[name=info]');
                    const formInfo = JSON.parse(info).usflLinks[0];

                    formInputID.value = formInfo.id;
                    formInputTitle.value = formInfo.title;
                    formInputInfo.value = JSON.stringify(formInfo.info, undefined, 4);

                } else {
                    console.log("Формы updateUsflLinkForm нет")
                }
            }


            // Delete usflLink
            function deleteUsflLinkRequest(response, form) {
                loadUsflLinks();
                if (response === "Запись удалена") {
                    alert("Запись удалена");
                    updateUsflLinkForm.reset();
                } else {
                    alert("Не удалось удалить запись. Что-то пошло не так: \r\n" + response);
                }
            }


            // Кнопки EDIT and DELETE
            function manageUsflLinksTableControl() {
                if (manageUsflLinksTable !== null) {
                    manageUsflLinksTable.addEventListener("click", function (e) {
                        e.preventDefault();
                        const target = e.target;

                        if (target.classList.contains("js_EditUsflLinkButton")) {
                            e.preventDefault();
                            const button = target;
                            const form = button.parentNode;
                            const FORM_DATA = jQuery(form).serialize();
                            // console.log(FORM_DATA);
                            const formDataObj = paramsToJson(FORM_DATA);
                            if (parseInt(formDataObj.id) > 0) {
                                switch(button.value) {
                                    case 'EDIT':
                                        sendRequest('/core/db/usfl.php?id=' + formDataObj.id, addInfoToUpdateUsflLinkForm);
                                        break;
                                    case 'DELETE':
                                        if (confirm("Точно удалить?")) {
                                            sendRequest('/core/db/usfl.php?', deleteUsflLinkRequest, form, "POST");
                                        }

                                        break;
                                }
                            } else {
                                alert("Что-то пошло не так, передан не верный id: " + formDataObj.id);
                            }


                        }


                    });
                }
            }


            // LOAD and SHOW UsflLinks helpers
            function loadUsflLinks() {
                if (manageUsflLinksTable!== null) {
                    manageUsflLinksTable.querySelector("tbody").innerHTML = "";
                    sendRequest('/core/db/usfl.php?id=all', showUsflLinksInManager, manageUsflLinksTable);
                }
            }




        }


    }
    function mainEvents() {
        console.log("Вешает все обработяики")
        document.body.addEventListener('click', showMoreData)
    }

}

// Устаревшая функция, заменить на новую когда база заработает
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
        const xhr = new XMLHttpRequest();

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


//  --==:: HELPERS ::==-
function sendRequest(url, callback, form, method = "GET") {
    console.log("Отправляем запрос...");
    let FORM_DATA;
    // 1. Создаём новый объект XMLHttpRequest
    const xhr = new XMLHttpRequest();

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


function textAreaJsonValidation(form) {
    const errMsg = "Ошибка при проверке данных. ";
    const textArea = form.querySelector('textarea');
    const textAreaVal = textArea.value;
    // собрать данные с текстареа и проверить на соответствие json
    if (IsJsonString(textAreaVal)) {
        const newTrend = JSON.parse(textAreaVal);
        // Проверить на наличие поля title
        if("title" in newTrend) {
            if (newTrend.title !== "") {
                return true;
            } else {
              alert(errMsg + "Поле Title не должно быть пустым.")
            }
        } else {
            alert(errMsg + "Вы не указали Title, это обязательный параметр.");
        }
    }
    else {
        alert(errMsg + "Формат данных не соответствует JSON.");
    }
    return false;
}


function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}


function paramsToJson(string) {
    const obj = {};
    string.split("&").forEach( el => {
        let newProperty = el.split("=");
        obj[newProperty[0]] = newProperty[1];
    });
    return obj;
}


// Show More Buttons Services
function showTrendsInManager(response, table) {
    const result = JSON.parse(response);
    // Удалить кнопки, если response пустой
    if(result["trends"].length === 0) {
        alert("Все записи уже загружены!");
        const buttons = document.querySelectorAll("[data-place='#trendsTableManage']");
        buttons.forEach(el => el.remove());
    }

    const arrLength = result["trends"].length;
    table.dataset.lastid = result["trends"][arrLength - 1].id;
    result["trends"].forEach(function (item) {
        let newItemROW = manageTrendsTPL(item);
        document.querySelector('.manageTrendsTable tbody').innerHTML += newItemROW;
        // manageTrendsTable.querySelector("tbody").innerHTML += newItemROW;
    })
}

function showMoreData(e) {
    const target = e.target;

    if(target.classList.contains("showMore") && target.dataset.action == "loadMore") {
        console.log("showMoreData");
        const types = ["trends", "faq", "rules"]
        if (types.indexOf(target.dataset.loadtype) === -1) {
            console.log("неизвестный тип " + target.dataset.loadtype);
            return false;
        }

        let loadtype = target.dataset.loadtype;
        let place = target.dataset.place;
        let placeToInput = document.querySelector(place);
        let lastID = placeToInput.dataset.lastid;
        let limit = target.dataset.limit ? parseInt(target.dataset.limit) : 10 ;
        let url ="/core/"+ loadtype +".php?id=all&lastid=" + lastID + "&limit=" + limit;

        switch (place) {
            case "#trendsTableManage":
                console.log("Будут загружены Тренды в менеджере");
                sendRequest(url, showTrendsInManager, placeToInput);
                break;
            default:
                console.log("неизвестное место");
                break;
        }


    }


}


//  --==:: TPL ::==-
function manageTrendsTPL(item) {
    const newTrend = `
                        <tr>
                            <td>${item["id"]}</td>
                            <td>${item["title"]}</td>
                            <td>
                                <form class="editTrendForm" method="GET" action="https://okolojs.ru/core/db/trends.php">
                                    <input type="hidden" name="id" value="${item["id"]}">
                                    <input class="btn btn-info js_EditTrendButton" type="submit" value="EDIT" >
                                </form>
                            </td>
                            <td>
                                <form class="deleteTrendForm" method="POST" action="https://okolojs.ru/core/db/trends.php">
                                    <input type="hidden" name="method" value="DELETE">
                                    <input type="hidden" name="id" value="${item["id"]}">
                                    <input class="btn btn-danger js_EditTrendButton" type="submit" value="DELETE">
                                </form>
                            </td>
                        </tr>`
    return newTrend;
}