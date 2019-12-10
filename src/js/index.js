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
        const allUsflTags = {
            arr: [],
            selected: []
        };

        trendsMainManager();
        usflLinksMainManager();
        usflTagsMainManager();


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

        function usflLinksMainManager() {



            const addUsflLinkForm = document.querySelector('.addUsflLinkForm');
            const addUsflLinkForm_searchTags = document.querySelector('.searchTags');
            const addUsflLinkForm_selectedTags = document.querySelector('.selectedTags');
            const updateUsflLinkForm = document.querySelector('.updateUsflLinkForm');
            const manageUsflLinksTable = document.querySelector('.manageUsflLinksTable');


            loadUsflLinks();
            addUsflLinkFormControl(tagsLoader);
            updateUsflLinkFormControl();
            manageUsflLinksTableControl();


            // Add usflLink
            function addUsflLinkFormControl(callback) {
                if (addUsflLinkForm !== null) {

                    if (callback) callback(addUsflLinkForm); // Подгрузить категории

                    const searchResult = addUsflLinkForm.querySelector(".search_result");

                    addUsflLinkForm.addEventListener("submit", function (e) {
                        e.preventDefault();


                        if (isSending) {
                            alert("Вы уже отправили запрос. Сначала дождитесь ответ.");
                            return false
                        }
                        if(textAreaJsonValidation(addUsflLinkForm)) {
                            isSending = true;
                            addFieldToInfo(this, "tags");
                            addFieldToInfo(this, "selectedTag");
                            sendRequest('/core/db/usfl.php', addUsflLinkRequest, this, "POST");
                        }

                    });

                    addUsflLinkForm.addEventListener("reset", function (e) {
                        jQuery('#addUsflLinkModal').modal('hide');
                    });

                    sendRequest('/core/core.php?id=all&db=usfl_tags', function (response) {
                        // console.log()
                        allUsflTags.arr = JSON.parse(response)["usfl_tags"];
                    });

                    addUsflLinkForm_searchTags.addEventListener("keyup", function (e) {
                        const regex = new RegExp(this.value, 'i');
                        const tempArr = [];
                        allUsflTags.arr.forEach((el, i, arr) => {
                            if (el["title"].match(regex) ) {
                                // console.log("Есть совпадение " + this.value + " - " + el);
                                tempArr.push(el);
                            }
                        });

                        console.log("Итоговый массив: ");
                        console.log(tempArr);
                        searchResult.innerHTML = "";
                        nodeCreator(tempArr, searchResult, nodeCreator_divTPL, "resultItem tag");
                        // search_result

                    });


                    addUsflLinkForm.addEventListener("click", function (e) {

                        if (e.target.classList.contains("tag") && e.target.dataset.id && e.target.dataset.title) {
                            const tag = e.target;
                            const selectedTag = {};
                            selectedTag.id = tag.dataset.id;
                            selectedTag.title = tag.dataset.title;

                            if (!checkIsSelected(allUsflTags.selected, selectedTag, "id" )) {
                                allUsflTags.selected.push(selectedTag);
                                // addUsflLinkForm_selectedTags.innerHTML = "";
                                while (addUsflLinkForm_selectedTags.children.length > 1) {
                                    console.log(addUsflLinkForm_selectedTags.children.length);
                                    console.log(addUsflLinkForm_selectedTags.children[0]);
                                    addUsflLinkForm_selectedTags.removeChild(addUsflLinkForm_selectedTags.children[0])
                                }

                                nodeCreator(allUsflTags.selected, addUsflLinkForm_selectedTags, nodeCreator_divTPL, "resultItem selectedTag", "toStart");

                            }

                            console.log(allUsflTags.selected);
                        }

                        if (e.target.classList.contains("selectedTag") && e.target.dataset.id && e.target.dataset.title) {
                            const tag = e.target;
                            const selectedTag = {};
                            selectedTag.id = tag.dataset.id;
                            selectedTag.title = tag.dataset.title;
                            console.log(selectedTag);

                            removeFromArr(allUsflTags.selected, selectedTag, "id" );

                            while (addUsflLinkForm_selectedTags.children.length > 1) {
                                console.log(addUsflLinkForm_selectedTags.children.length);
                                console.log(addUsflLinkForm_selectedTags.children[0]);
                                addUsflLinkForm_selectedTags.removeChild(addUsflLinkForm_selectedTags.children[0])
                            }

                            nodeCreator(allUsflTags.selected, addUsflLinkForm_selectedTags, nodeCreator_divTPL, "resultItem selectedTag", "toStart");

                            console.log(allUsflTags.selected);
                        }
                    })
                } else {
                    console.log('Формы addUsflLink не существует');
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


            //
            function tagsLoader(form) {
                sendRequest('/core/core.php?id=all&db=usfl_tags', addTagsToSelectorField, form);
            }

            // Устаревшее, добавляет тэги в выпадающий список
            function addTagsToSelectorField(response, form) {
                    if (response) {
                        const result = JSON.parse(response);
                        console.log("Пришли все возможные теги");
                        // form.tags.innerHTML
                        result["usfl_tags"].forEach(function (item) {
                            let newItemROW = tagsInSelectorTPL(item);
                            form.querySelectorAll(".tags").forEach((el) => {
                                el.innerHTML += newItemROW;
                            });

                            // form.tags.innerHTML += newItemROW;
                            // form["tags2"].innerHTML += newItemROW;
                        })
                    } else {
                        alert("Что-то пошло не так: \r\n" + response);
                    };
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
                    const formInfo = JSON.parse(info).links[0];

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

        function usflTagsMainManager() {

            const addUsflTagForm = document.querySelector('.addUsflTagForm');
            const updateUsflTagForm = document.querySelector('.updateUsflTagForm');
            const manageUsflTagsTable = document.querySelector('.manageUsflTagsTable');


            loadUsflTags();
            addUsflTagFormControl();
            updateUsflTagFormControl();
            manageUsflTagsTableControl();


            // Add usflTag
            function addUsflTagFormControl() {
                if (addUsflTagForm !== null) {
                    addUsflTagForm.addEventListener("submit", function (e) {
                        e.preventDefault();


                        if (isSending) {
                            alert("Вы уже отправили запрос. Сначала дождитесь ответ.");
                            return false
                        }
                        if(textAreaJsonValidation(addUsflTagForm)) {
                            isSending = true;
                            sendRequest('/core/db/usfl.php', addUsflTagRequest, this, "POST");
                        }

                    });

                    addUsflTagForm.addEventListener("reset", function (e) {
                        jQuery('#addUsflTagModal').modal('hide');
                    })
                } else {
                    console.log('Формы addUsflTag не существует');
                }



            }

            function addUsflTagRequest(response, form) {
                if (response === "Запись добавлена") {
                    alert("Запись добавлена");
                    form.reset();
                } else {
                    alert("Что-то пошло не так: \r\n" + response);
                }
                isSending = false;
                loadUsflTags();
            }


            // Edit usflTag
            function updateUsflTagFormControl() {
                if (updateUsflTagForm) {
                    updateUsflTagForm.addEventListener("submit", function (e) {
                        e.preventDefault();

                        if (isSending) {
                            alert("Вы уже отправили запрос. Сначала дождитесь ответ.");
                            return false
                        }
                        if(textAreaJsonValidation(updateUsflTagForm)) {
                            isSending = true;
                            sendRequest('/core/db/usfl.php', updateUsflTagRequest, this, "POST");
                        }
                    });

                    updateUsflTagForm.addEventListener("reset", function (e) {
                        jQuery('#updateUsflTagModal').modal('hide');
                    })
                }
            }

            function updateUsflTagRequest(response, form) {
                loadUsflTags();
                if (response === "Запись обновлена") {
                    alert("Запись обновлена");
                    form.querySelector('textarea').value = "";
                    form.reset();
                } else {
                    alert("Не удалось обновить. Что-то пошло не так: \r\n" + response);
                }
                isSending = false;
            }

            function addInfoToUpdateUsflTagForm(info) {
                if (updateUsflTagForm) {
                    jQuery('#updateUsflTagModal').modal('show');
                    const formInputID = updateUsflTagForm.querySelector('[name=id]');
                    const formInputTitle = updateUsflTagForm.querySelector('[name=title]');
                    const formInputInfo = updateUsflTagForm.querySelector('[name=info]');
                    const formInfo = JSON.parse(info).tags[0];

                    formInputID.value = formInfo.id;
                    formInputTitle.value = formInfo.title;
                    formInputInfo.value = JSON.stringify(formInfo.info, undefined, 4);

                } else {
                    console.log("Формы updateUsflTagForm нет")
                }
            }


            // Delete usflTag
            function deleteUsflTagRequest(response, form) {
                loadUsflTags();
                if (response === "Запись удалена") {
                    alert("Запись удалена");
                    updateUsflTagForm.reset();
                } else {
                    alert("Не удалось удалить запись. Что-то пошло не так: \r\n" + response);
                }
            }


            // Кнопки EDIT and DELETE
            function manageUsflTagsTableControl() {
                if (manageUsflTagsTable !== null) {
                    manageUsflTagsTable.addEventListener("click", function (e) {
                        e.preventDefault();
                        const target = e.target;

                        if (target.classList.contains("js_EditUsflTagButton")) {
                            e.preventDefault();
                            const button = target;
                            const form = button.parentNode;
                            const FORM_DATA = jQuery(form).serialize();
                            // console.log(FORM_DATA);
                            const formDataObj = paramsToJson(FORM_DATA);
                            if (parseInt(formDataObj.id) > 0) {
                                switch(button.value) {
                                    case 'EDIT':
                                        sendRequest('/core/db/usfl.php?id=' + formDataObj.id, addInfoToUpdateUsflTagForm);
                                        break;
                                    case 'DELETE':
                                        if (confirm("Точно удалить?")) {
                                            sendRequest('/core/db/usfl.php?', deleteUsflTagRequest, form, "POST");
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


            // LOAD and SHOW UsflTags helpers
            function loadUsflTags() {
                if (manageUsflTagsTable!== null) {
                    manageUsflTagsTable.querySelector("tbody").innerHTML = "";
                    sendRequest('/core/core.php?id=all&db=usfl_tags', showUsflTagsInManager, manageUsflTagsTable);
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

function checkIsSelected(arr, el, key) {
    for(let i = 0; i < arr.length; i++) {
        if (arr[i][key] === el[key]) {
            // console.log("Найден совпадающий элемент");
            return true;
        }
    }
    // console.log("Cовпадающих элементов не найдено");
    return false;

}
function removeFromArr(arr, el, key) {
    for(let i = 0; i < arr.length; i++) {
        if (arr[i][key] === el[key]) {
            arr.splice(i, 1);
        }
    }

}


function nodeCreator(arr, place, tpl, className, appendMode = "toEnd") {
    // place.innerHTML = "";
    arr.forEach(el => {
        const newItem = tpl(el, className);
        // place.innerHTML += newItem;
        appendMode === "toStart" ? place.prepend(newItem) : place.appendChild(newItem);

    })
}

function nodeCreator_divTPL(el, className) {

    const newDiv = document.createElement("div");
    for(let key in el) {
        newDiv.dataset[key] = el[key];
    }
    newDiv.textContent = el["title"];
    newDiv.setAttribute("class", className);

    return newDiv;

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
function showUsflLinksInManager(response, table) {
    const result = JSON.parse(response);
    // Удалить кнопки, если response пустой
    if(result["links"].length === 0) {
        alert("Все записи уже загружены!");
        const buttons = document.querySelectorAll("[data-place='#usflLinksTableManage']");
        buttons.forEach(el => el.remove());
    }

    const arrLength = result["links"].length;
    table.dataset.lastid = result["links"][arrLength - 1].id;
    result["links"].forEach(function (item) {
        let newItemROW = manageUsflLinksTPL(item);
        document.querySelector('.manageUsflLinksTable tbody').innerHTML += newItemROW;
        // manageTrendsTable.querySelector("tbody").innerHTML += newItemROW;
    })
}
function showUsflTagsInManager(response, table) {
    const result = JSON.parse(response);
    // Удалить кнопки, если response пустой
    if(result["usfl_tags"].length === 0) {
        alert("Все записи уже загружены!");
        const buttons = document.querySelectorAll("[data-place='#usflTagsTableManage']");
        buttons.forEach(el => el.remove());
    }

    const arrLength = result["usfl_tags"].length;
    table.dataset.lastid = result["usfl_tags"][arrLength - 1].id;
    result["usfl_tags"].forEach(function (item) {
        let newItemROW = manageUsflTagsTPL(item);
        document.querySelector('.manageUsflTagsTable tbody').innerHTML += newItemROW;
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

function manageUsflLinksTPL(item) {
    let itemCategories = "";


    console.log(item);

    if (item["info"]["tags"] && item["info"]["tags"].length > 0) {
        item["info"]["tags"].forEach((el, i, arr) => {
           console.log(el.id);
           console.log(el.title);
           let newTagInRow = el.title + ` (${el.id})`;
           if (arr.length !== (i+1)) newTagInRow += ", ";
           itemCategories += newTagInRow;
           console.log(itemCategories);
        });
    };

    const newItem = `
                        <tr>
                            <td>${item["id"]}</td>
                            <td>${item["title"]} <br> Tags: ${itemCategories} </td>
                            <td>
                                <form class="editUsflLinkForm" method="GET" action="https://okolojs.ru/core/db/usfl.php">
                                    <input type="hidden" name="id" value="${item["id"]}">
                                    <input class="btn btn-info js_EditUsflLinkButton" type="submit" value="EDIT" >
                                </form>
                            </td>
                            <td>
                                <form class="deleteUsflLinkForm" method="POST" action="https://okolojs.ru/core/db/usfl.php">
                                    <input type="hidden" name="method" value="DELETE">
                                    <input type="hidden" name="id" value="${item["id"]}">
                                    <input class="btn btn-danger js_EditUsflLinkButton" type="submit" value="DELETE">
                                </form>
                            </td>
                        </tr>`
    return newItem;
}

function manageUsflTagsTPL(item) {
    const newItem = `
                        <tr>
                            <td>${item["id"]}</td>
                            <td>${item["title"]}</td>
                            <td>
                                <form class="editUsflTagForm" method="GET" action="https://okolojs.ru/core/db/usfl.php">
                                    <input type="hidden" name="id" value="${item["id"]}">
                                    <input class="btn btn-info js_EditUsflTagButton" type="submit" value="EDIT" >
                                </form>
                            </td>
                            <td>
                                <form class="deleteUsflTagForm" method="POST" action="https://okolojs.ru/core/db/usfl.php">
                                    <input type="hidden" name="method" value="DELETE">
                                    <input type="hidden" name="id" value="${item["id"]}">
                                    <input class="btn btn-danger js_EditUsflTagButton" type="submit" value="DELETE">
                                </form>
                            </td>
                        </tr>`
    return newItem;
}


function tagsInSelectorTPL(item) {
    return `<option value='${JSON.stringify(item)}'>${item["title"]}</option>`;
}


function addFieldToInfo(form, field) {

    const formInfo = JSON.parse(form.info.value);
    const fieldArr = [];

    form.querySelectorAll("."+field).forEach((el) => {
        if (el.value) {
            console.log("el.value существует - " + el.value)
        } else {
            // for(let key in el) {
            //     newDiv.dataset[key] = el[key];
            // }
            console.log("el.value существует - " + el.value)
        }
        let newString = JSON.parse(el.value);


        fieldArr.push(newString);
    });


    formInfo[field]=  fieldArr;

    console.log(formInfo);
    form.info.value = JSON.stringify(formInfo, undefined, 4);
}

function addItemsToSearchResult(place, arr) {
    console.log(" addItemsToSearchResult");
    console.log(place);
    console.log(arr);
}



Accordion.prototype.dropdown = function (e) {
    var $el = e.data.el;
    $this = $(this),
    $next = $this.next();

    console.log(isAnimation);

    if (!isAnimation) { // если не анимирован
        isAnimation = true // чтобы не запустили повторно
        console.log(3);
        $next.slideToggle();

        $this.parent().toggleClass('open');

        if (!e.data.multiple) {
            $el.find('.submenu').not($next).slideUp().parent().removeClass('open');
        }


        setTimeout(function () {

            isAnimation = false  // чтобы запустили снова
        }, 2000)
    }

};