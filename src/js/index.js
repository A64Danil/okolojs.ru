import jQuery from 'jquery';
import popper from 'popper.js';
import bootstrap from 'bootstrap';
import Handlebars from 'handlebars';

document.addEventListener("DOMContentLoaded", coreFunction);

const eventLoad = new Event("loaded");

const scrollToHash = (function() {
    let executed = false;
    return function() {
        if (!executed) {
            executed = true;
            const hash = window.location.hash;
            if (hash !== '') {
                const anchorId = hash.slice(1);
                console.log(anchorId);
                setTimeout(()=>{
                    const anchorLink = document.getElementById(anchorId);
                    const anchorParent = anchorLink.parentNode;
                    if (anchorParent.classList.contains('card')) {
                        const collapseCard = anchorParent.querySelector('.collapse');
                        if (collapseCard) collapseCard.classList.add('show');
                    }
                    anchorLink.scrollIntoView();
                }, 500);
            }
        }
    };
})();

function coreFunction() {

    const mainManager = document.querySelector('.mainManager');
    function init() {

        console.log("Пасхалка для самых любопытных =) 1510");
        mainEvents();


        if (mainManager) {
            console.log("Вы в админке");
            initManager();
        } else {
            console.log("Вы не в админке, доп. скрипты грузить не надо");
            findAllRecordsLists();

        }

    }

    init();

    function initManager() {
        let isSending = false;
        const allUsflTags = {
            arr: [],
            selected: []
        };

        recordsMainManager("trendsManager");
        recordsMainManager("newsManager");
        recordsMainManager("rulesManager");
        recordsMainManager("faqManager");
        recordsMainManager("usflManager", "usfl_links");
        recordsMainManager("usflManager", "usfl_tags");

        function recordsMainManager(mainManagerId, managerType) {
            const manager = document.getElementById(mainManagerId);
            // console.log(manager);
            const manageRecordsTable = !!managerType? manager.querySelector('.manageRecordsTable[data-loadtype="'+ managerType +'"]') :  manager.querySelector('.manageRecordsTable');
            // console.log(manageRecordsTable);
            const addRecordForm = !!managerType? manager.querySelector('.addRecordForm[data-loadtype="'+ managerType +'"]'): manager.querySelector('.addRecordForm');
            const updateRecordForm = !!managerType? manager.querySelector('.updateRecordForm[data-loadtype="'+ managerType +'"]'): manager.querySelector('.updateRecordForm');

            const dbName = manageRecordsTable.dataset.loadtype;

            let addRecordForm_searchTags;
            let addRecordForm_selectedTags;
            let updateRecordForm_searchTags;
            let updateRecordForm_selectedTags;

            let addRecordForm_searchResult;
            let updateRecordForm_searchResult;

            switch(managerType) {
                case 'usfl_links':
                    addRecordForm_searchTags = addRecordForm.querySelector('.searchTags');
                    addRecordForm_selectedTags = addRecordForm.querySelector('.selectedTags');

                    updateRecordForm_searchTags = updateRecordForm.querySelector('.searchTags');
                    updateRecordForm_selectedTags = updateRecordForm.querySelector('.selectedTags');

                    if (addRecordForm !== null) {
                        addRecordForm_searchResult = addRecordForm.querySelector(".search_result");
                    }
                    if (updateRecordForm !== null) {
                        updateRecordForm_searchResult = updateRecordForm.querySelector(".search_result");
                    }

                    jQuery(manager).find('.addRecordModal[data-loadtype="'+ managerType +'"]').on('shown.bs.modal', () => removeFromArr(allUsflTags.selected));
                    break;
                case 'usfl_tags':
                    if (addRecordForm !== null) {
                        addRecordForm_searchResult = manager.querySelector('.addRecordForm[data-loadtype="usfl_links"] .search_result');
                    }
                    break;
                default:
                    break;
            }

            loadRecords();
            addRecordFormControl();
            updateRecordFormControl();
            manageRecordsTableControl();


            // Add Record
            function addRecordFormControl() {
                if (addRecordForm !== null) {
                    addRecordForm.addEventListener("submit", function (e) {
                        e.preventDefault();
                        if (isSending) {
                            alert("Вы уже отправили запрос. Сначала дождитесь ответ.");
                            return false
                        }
                        if(textAreaJsonValidation(addRecordForm)) {
                            isSending = true;
                            switch(managerType) {
                                case 'usfl_links':
                                    addFieldToInfo(this, "tags");
                                    break;
                                default:
                                    break;
                            }
                            sendRequest('/core/core.php', addRecordRequest, this, "POST");
                        }
                    });

                    addRecordForm.addEventListener("reset", function (e) {
                        switch(managerType) {
                            case 'usfl_links':
                                removeFromArr(allUsflTags.selected);
                                manageTags(addRecordForm_selectedTags, allUsflTags.selected, addRecordForm_searchResult, allUsflTags.arr);
                                break;
                            default:
                                break;
                        }

                        !!managerType? jQuery(manager).find('.addRecordModal[data-loadtype="'+ managerType +'"]').modal('hide') : jQuery(manager).find('.addRecordModal').modal('hide');
                    });

                    switch(managerType) {
                        case 'usfl_links':
                            loadTags();
                            addRecordForm_searchTags.addEventListener("keyup", function(e) {searchTags(this, addRecordForm_searchResult)});
                            addRecordForm.addEventListener("click", e => tagsController(e, addRecordForm_selectedTags, addRecordForm_searchResult));
                            break;
                        default:
                            break;
                    }


                } else {
                    console.log('Формы sendRecord не существует');
                }

            }

            function addRecordRequest(response, form) {
                loadRecords();

                switch(managerType) {
                    case 'usfl_tags':
                        loadTags();
                        break;
                    default:
                        break;
                }
                if (response === "Запись добавлена") {
                    alert("Запись добавлена");
                    form.reset();
                } else {
                    alert("Что-то пошло не так: \r\n" + response);
                }
                isSending = false;
            }


            // Edit Record
            function updateRecordFormControl() {
                if (updateRecordForm) {
                    updateRecordForm.addEventListener("submit", function (e) {
                        e.preventDefault();
                        if (isSending) {
                            alert("Вы уже отправили запрос. Сначала дождитесь ответ.");
                            return false
                        }
                        if(textAreaJsonValidation(updateRecordForm)) {
                            isSending = true;
                            switch(managerType) {
                                case 'usfl_links':
                                    addFieldToInfo(this, "tags");
                                    break;
                                default:
                                    break;
                            }
                            sendRequest('/core/core.php', updateRecordRequest, this, "POST");
                        }
                    });

                    updateRecordForm.addEventListener("reset", function (e) {
                        switch(managerType) {
                            case 'usfl_links':
                                removeFromArr(allUsflTags.selected);
                                manageTags(updateRecordForm_selectedTags, allUsflTags.selected, updateRecordForm_searchResult, allUsflTags.arr);
                                break;
                            default:
                                break;
                        }
                        !!managerType? jQuery(manager).find('.updateRecordModal[data-loadtype="'+ managerType +'"]').modal('hide') : jQuery(manager).find('.updateRecordModal').modal('hide');
                    });

                    switch(managerType) {
                        case 'usfl_links':
                            updateRecordForm_searchTags.addEventListener("keyup", function(e) {searchTags(this, updateRecordForm_searchResult)});
                            updateRecordForm.addEventListener("click", (e) => tagsController(e, updateRecordForm_selectedTags, updateRecordForm_searchResult));
                            break;
                        default:
                            break;
                    }

                }
            }

            function updateRecordRequest(response, form) {
                loadRecords();

                switch(managerType) {
                    case 'usfl_tags':
                        loadRecords('usfl_links');
                        loadTags();
                        break;
                    default:
                        break;
                }

                if (response === "Запись обновлена") {
                    alert("Запись обновлена");
                    form.querySelector('textarea').value = "";
                    form.reset();
                } else {
                    alert("Не удалось обновить. Что-то пошло не так: \r\n" + response);
                }
                isSending = false;
            }

            function addInfoToUpdateRecordForm(info) {
                if (updateRecordForm) {
                    !!managerType? jQuery(manager).find('.updateRecordModal[data-loadtype="'+ managerType +'"]').modal('show') : jQuery(manager).find('.updateRecordModal').modal('show');

                    const formInputID = updateRecordForm.querySelector('[name=id]');
                    const formInputTitle = updateRecordForm.querySelector('[name=title]');
                    const formInputInfo = updateRecordForm.querySelector('[name=info]');
                    const formInfo = JSON.parse(info)[dbName][0];

                    formInputID.value = formInfo.id;
                    formInputTitle.value = formInfo.title;

                    switch(managerType) {
                        case 'usfl_links':
                            removeFromArr(allUsflTags.selected);

                            allUsflTags.selected = formInfo.info.tags;
                            formInputInfo.value = JSON.stringify(formInfo.info, undefined, 4);

                            let tempArr = allUsflTags.arr.filter( commonTag => !allUsflTags.selected.find(selectedTag => commonTag.id === selectedTag.id));

                            manageTags(updateRecordForm_selectedTags, allUsflTags.selected, updateRecordForm_searchResult, tempArr);

                            break;
                        case 'usfl_tags':
                            delete formInfo.id;
                            formInputInfo.value = JSON.stringify(formInfo, undefined, 4);
                            break;
                        default:
                            formInputInfo.value = JSON.stringify(formInfo.info, undefined, 4);
                            break;
                    }

                } else {
                    console.log("Формы updateRecordForm нет")
                }
            }


            // Delete Record
            function deleteRecordRequest(response, form) {
                loadRecords();

                switch(managerType) {
                    case 'usfl_tags':
                        loadRecords('usfl_links');
                        loadTags();
                        break;
                    default:
                        break;
                }

                if (response === "Запись удалена") {
                    alert("Запись удалена");
                    updateRecordForm.reset();
                } else {
                    alert("Не удалось удалить запись. Что-то пошло не так: \r\n" + response);
                }
            }

            // Кнопки EDIT and DELETE
            function manageRecordsTableControl() {
                if (manageRecordsTable !== null) {
                    manageRecordsTable.addEventListener("click", function (e) {
                        e.preventDefault();
                        const target = e.target;

                        if (target.classList.contains("js_EditRecordButton")) {
                            e.preventDefault();
                            const button = target;
                            const form = button.parentNode;
                            const FORM_DATA = jQuery(form).serialize();
                            // console.log(FORM_DATA);
                            const formDataObj = paramsToJson(FORM_DATA);
                            if (parseInt(formDataObj.id) > 0) {
                                switch(button.value) {
                                    case 'EDIT':
                                        sendRequest('/core/core.php?db=' + dbName + '&id=' + formDataObj.id, addInfoToUpdateRecordForm);
                                        break;
                                    case 'DELETE':
                                        if (confirm("Точно удалить?")) {
                                            sendRequest('/core/core.php', deleteRecordRequest, form, "POST");
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

            // LOAD and SHOW Records helpers
            function loadRecords(dbName) {
                const recordsTable = !!dbName? manager.querySelector('.manageRecordsTable[data-loadtype="'+ dbName +'"]') : manageRecordsTable;
                if (recordsTable!== null) {
                    let db = recordsTable.dataset.loadtype;
                    recordsTable.querySelector("tbody").innerHTML = "";
                    sendRequest('/core/core.php?id=all&db=' + db, showRecordsInManager, recordsTable);
                }
            }

            function loadTags() {
                sendRequest('/core/core.php?id=all&db=usfl_tags&limit=200', function (response) {
                    if (response) {
                        allUsflTags.arr = JSON.parse(response)["usfl_tags"];
                        console.log("Пришли все возможные теги");
                        addRecordForm_searchResult.innerHTML = "";
                        nodeCreator(allUsflTags.arr.slice(0, 10), addRecordForm_searchResult, nodeCreator_divTPL, "resultItem tag");
                    } else {
                        alert("Что-то пошло не так: \r\n" + response);
                    }
                });
            }

            // Manage Tags
            function tagsController(e, selectedTagsPlace, searchTagsPlace) {
                const tag = e.target;
                const selectedTag = {};

                if (e.target.classList.contains("tag") && e.target.dataset.id && e.target.dataset.title) {
                    selectedTag.id = parseInt(tag.dataset.id);
                    selectedTag.title = tag.dataset.title;

                    if (!checkIsSelected(allUsflTags.selected, selectedTag, "id" )) {
                        allUsflTags.selected.push(selectedTag);
                        manageTags(selectedTagsPlace, allUsflTags.selected);
                        tag.remove();
                        let searchTags = selectedTagsPlace.querySelector(".searchTags");
                        searchTags.value = "";
                        searchTags.dispatchEvent(new Event('keyup'));
                    }

                }

                if (e.target.classList.contains("selectedTag") && e.target.dataset.id && e.target.dataset.title) {
                    selectedTag.id = parseInt(tag.dataset.id);
                    selectedTag.title = tag.dataset.title;

                    removeFromArr(allUsflTags.selected, selectedTag, "id" );
                    let tempArr = allUsflTags.arr.filter( commonTag => !allUsflTags.selected.find(selectedTag => commonTag.id === selectedTag.id));

                    manageTags(selectedTagsPlace, allUsflTags.selected, searchTagsPlace, tempArr);
                }
            }

            function manageTags(selectedTagsPlace, selectedTagsArr, searchTagsPlace,  searchTagsArr) {
                while (selectedTagsPlace.children.length > 1) {
                    selectedTagsPlace.removeChild(selectedTagsPlace.children[0])
                }

                nodeCreator(selectedTagsArr, selectedTagsPlace, nodeCreator_divTPL, "resultItem selectedTag tags", "toStart");

                if (!!searchTagsPlace) {
                    searchTagsPlace.innerHTML = "";
                    if (!!searchTagsArr) nodeCreator(searchTagsArr, searchTagsPlace, nodeCreator_divTPL, "resultItem tag")
                };
            }

            function searchTags(searchInput, resultPlace) {
                const regex = new RegExp(searchInput.value, 'i');
                const tempArr = [];
                allUsflTags.arr.forEach((el, i, arr) => {
                    if (el["title"].match(regex)) tempArr.push(el);
                });
                // console.log("Итоговый массив: ");
                // console.log(tempArr);
                let filteredTempArr = tempArr.filter( commonTag => !allUsflTags.selected.find(selectedTag => commonTag.id === selectedTag.id));
                // console.log("Фильтрованный массив: ");
                // console.log(filteredTempArr);

                resultPlace.innerHTML = "";
                nodeCreator(filteredTempArr, resultPlace, nodeCreator_divTPL, "resultItem tag");}
        }



    }
    function mainEvents() {
        console.log("Вешает все обработчики");
        document.body.addEventListener('click', showMoreData);
        document.body.addEventListener('click', miniCollapseManager);
        document.body.addEventListener('loaded', scrollToHash);

        let usflLinks__categoryList = document.querySelector(".usflLinks__categoryList");
        if (usflLinks__categoryList !== null) {

            usflLinks__categoryList.addEventListener('click', function (e) {
                let target = e.target;
                if (target.tagName === "LI") {
                    target.classList.toggle("active");
                    let filtredPlace = document.getElementById(usflLinks__categoryList.dataset.label);
                    filtredPlace.querySelector(".controls").classList.remove("none");

                    let selectedTags = this.querySelectorAll("li.active");
                    let selectedTagsID = "";
                    for(let i = 0; i < selectedTags.length; i++) {
                        let tagid = selectedTags[i].dataset.tagid;
                        if (i !== selectedTags.length - 1) {
                            selectedTagsID += tagid + ",";
                        } else {
                            selectedTagsID += tagid;
                        }
                    }

                    filtredPlace.dataset.lastid = "";
                    filtredPlace.dataset.tags = selectedTagsID;
                    loadInfo(filtredPlace);
                }
            })
        }


    }

}

// LOAD INFO
function findAllRecordsLists() {
    document.querySelectorAll('.records').forEach( el => {
        if (el.getAttribute("id") !== "") {
            console.log(el);
            loadInfo(el);
        }
    })
}

function loadInfo(mainNode) {
    // console.log("loadInfo 23:06");

    const BLOCK = mainNode.querySelector('.output');
    const mainNodeData = mainNode.dataset;

    // const SOURCE = document.getElementById(tpl);
    if (BLOCK === null) {
        console.log("Нет места для вывода " + blockid);
        return false;
    }

    // Формируем URL
    let db = mainNodeData.loadtype;
    let lastID = mainNodeData.lastid;
    let sortDir = mainNodeData.sortdir;
    let tags = mainNodeData.tags;
    let limit = mainNodeData.limit ? parseInt(mainNodeData.limit) : 10 ;

    let url ="/core/core.php?db="+ db +"&id=all" + "&limit=" + limit;
    if (lastID) url += "&lastid=" + lastID;
    if (tags) url += "&tagsid=" + tags;
    if (sortDir) url += "&sortdir=" + sortDir;

    const SOURCE = document.getElementById(mainNodeData.tplid);
    const template = Handlebars.compile(SOURCE.innerHTML);


    // 1. Создаём новый объект XMLHttpRequest
    const xhr = new XMLHttpRequest();

    // 2. Конфигурируем его
    xhr.open('GET', url, true);

    // 3. Отсылаем запрос
    xhr.send();

    // 4. Если код ответа сервера не 200, то это ошибка
    xhr.onreadystatechange = function() {
        if (this.readyState == 4) {
            // вывести результат
            const response = JSON.parse(xhr.responseText);
            const resultHBS = template(response);


            // Удалить кнопки, если response пустой
            if(response[db].length === 0) {
                alert("Все записи уже загружены!");
                mainNode.querySelector(".controls").classList.add("none");
            } else {
                const arrLength = response[db].length;
                mainNode.dataset.lastid = response[db][arrLength - 1].id;
                lastID ? BLOCK.innerHTML += resultHBS : BLOCK.innerHTML = resultHBS;
            }

            document.body.dispatchEvent(eventLoad);
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
    if(!el) {
        arr.splice(0);
    } else {
        for(let i = 0; i < arr.length; i++) {
            if (arr[i][key] === el[key]) {
                arr.splice(i, 1);
            }
        }
    }

}

function addFieldToInfo(form, field) {

    const formInfo = JSON.parse(form.info.value);
    const fieldArr = [];

    form.querySelectorAll("."+field).forEach((el) => {
        let newObj = {};
        for(let key in el.dataset) {
            if (key === "id") {
                newObj[key] = parseInt(el.dataset[key]);
            } else {
                newObj[key] = el.dataset[key];
            }
        }
        fieldArr.push(newObj);
    });



    formInfo[field]=  fieldArr;
    form.info.value = JSON.stringify(formInfo, undefined, 4);
}

function nodeCreator(arr, place, tpl, className, appendMode = "toEnd") {
    arr.forEach(el => {
        const newItem = tpl(el, className);
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
function showRecordsInManager(response, table) {
    let db = table.dataset.loadtype;
    const result = JSON.parse(response);
    // TODO: почистить консоль логи
    console.log(result);
    // console.log(db);
    // console.log(result[db]);
    // Удалить кнопки, если response пустой
    if(result[db].length === 0) {
        alert("Все записи уже загружены!");
        const buttons = table.querySelectorAll("[data-action='loadMore']");
        buttons.forEach(el => el.remove());
    } else {
        const arrLength = result[db].length;
        table.dataset.lastid = result[db][arrLength - 1].id;
        result[db].forEach(function (item) {
            let newItemROW = manageRecordsTPL(item, db);
            table.querySelector('.manageRecordsTable tbody').innerHTML += newItemROW;
        })
    }

}

function loadMoreData(url, place, tpl) {
    const BLOCK = place.querySelector(".output");
    console.log(BLOCK);
    const SOURCE = document.getElementById(tpl);

    if (BLOCK === null) {
        console.log("Нет места для вывода " + place);
        return false;
    }

    if (SOURCE === null) {
        console.log("Нет шаблона " + tpl + "для рендеринга");
        return false;
    }

    if (!url) {
        console.log("Не указан url, url is " + url);
        return false;
    } else {
        // console.log("Start render ", blockid, tpl, url);
        const SRCHTML = SOURCE.innerHTML;
        const template = Handlebars.compile(SRCHTML);
        const db = place.dataset.loadtype;

        // 1. Создаём новый объект XMLHttpRequest
        const xhr = new XMLHttpRequest();

        // 2. Конфигурируем его
        xhr.open('GET', url, true);

        // 3. Отсылаем запрос
        xhr.send();

        // 4. Если код ответа сервера не 200, то это ошибка
        xhr.onreadystatechange = function() {
            if (this.readyState == 4) {
                // вывести результат
                const result = JSON.parse(xhr.responseText);
                const resultHBS = template(result);

                // TODO: почистить консоль логи
                // console.log(result);
                // console.log(db);
                console.log(result[db]);
                // Удалить кнопки, если response пустой
                if(result[db].length === 0) {
                    alert("Все записи уже загружены!");
                    const buttons = place.querySelectorAll("[data-action='loadMore']");
                    buttons.forEach(el => el.remove());
                } else {
                    const arrLength = result[db].length;
                    place.dataset.lastid = result[db][arrLength - 1].id;
                    BLOCK.innerHTML += resultHBS;
                }
            }
        }
    }

}

function showMoreData(e) {
    const target = e.target;
    const targetParent = target.parentNode;

    if(target.classList.contains("showMore") && target.dataset.action == "loadMore") {
        const types = ["trends", "faq", "rules", "usfl_tags", "usfl_links"];
        if (types.indexOf(target.dataset.loadtype) === -1) {
            console.log("неизвестный тип " + target.dataset.loadtype);
            return false;
        }


        // Часть для старого функционала
        let loadtype = target.dataset.loadtype;
        let place = target.dataset.place;
        let placeToInput = document.querySelector(place);
        let lastID = placeToInput.dataset.lastid;
        let limit = target.dataset.limit ? parseInt(target.dataset.limit) : 10 ;
        let url ="/core/core.php?db="+ loadtype +"&id=all&lastid=" + lastID + "&limit=" + limit;


        switch(target.dataset.callback) {
            case 'loadData':
                console.log("showMoreData from loadData");
                loadMoreData(url, placeToInput, "usfl_links-template");
                break;
            case 'usfl_tags':
                break;
            default:
                sendRequest(url, showRecordsInManager, placeToInput);
                break;
        }


    }

    if(targetParent.classList.contains("controls") && target.dataset.action == "loadLikeControls") {
        // добавить изменение mainNodeData.limit при наличии параметра data-limit
        if (target.dataset.limit) {
            targetParent.parentNode.dataset.limit = target.dataset.limit;
        } else {
            targetParent.parentNode.dataset.limit = 10;
        }
        loadInfo(targetParent.parentNode);
    }


}


//
function miniCollapseManager(e) {
    const minElHeight = 250;
    let target = e.target;
    let collapseNode;
    console.log("15-40 miniCollapseManager");

    if (target.classList.contains("miniCollapseControl")) {
        collapseNode = target.parentNode.parentNode;
    } else if (target.parentNode.classList.contains("miniCollapseControl")) {
        collapseNode = target.parentNode.parentNode.parentNode;
    } else {
        return false;
    }

    // console.log(collapseNode);
    let collapse = collapseNode.querySelector('.collapse');

    let newComputedHeight = getComputedStyle(collapse).height; // Получаем его настоящий размер

    // console.log("Parsed height: " + parseInt(newComputedHeight));
    // console.log("Min el: " + minElHeight);
    // console.log(parseInt(newComputedHeight ) > minElHeight);

    if (parseInt(newComputedHeight) >= 200) {

        if (!collapse.classList.contains('active')) {
            collapse.classList.add('active');
            collapse.style.height = "auto"; // Делаем наш спойлер обычного размера
            newComputedHeight = getComputedStyle(collapse).height;
            console.log("(open)NEW height: " + newComputedHeight);
            collapse.style.height = minElHeight + "px"; // Делаем спойлер снова маленьким (200рх)
            setTimeout(function () {
                collapse.style.height = newComputedHeight; // Отрисовываем до настоящего размера с неольшой задержкой
            }, 100);
        } else {
            collapse.style.height = minElHeight + "px"; // Делаем спойлер снова маленьким (200рх)
            setTimeout(function () {
                collapse.classList.remove('active');
            }, 300);
        }

    }



}

//  --==:: TPL ::==-
function manageRecordsTPL(item, dbName) {
    let itemCategories = "";

    if (item["info"] && item["info"]["tags"] && item["info"]["tags"].length > 0) {
        itemCategories = "<br> Tags: ";
        item["info"]["tags"].forEach((el, i, arr) => {
            // console.log(el.id);
            // console.log(el.title);
            let newTagInRow = el.title + ` (${el.id})`;
            if (arr.length !== (i+1)) newTagInRow += ", ";
            itemCategories += newTagInRow;
            // console.log(itemCategories);
        });
    };


    const newItem = `
                        <tr>
                            <td>${item["id"]}</td>
                            <td>${item["title"]} ${itemCategories} </td>
                            <td>
                                <form class="editTrendForm" method="GET" action="https://okolojs.ru/core/core.php">
                                    <input type="hidden" name="id" value="${item["id"]}">
                                    <input class="btn btn-info js_EditRecordButton" type="submit" value="EDIT" >
                                </form>
                            </td>
                            <td>
                                <form class="deleteTrendForm" method="POST" action="https://okolojs.ru/core/core.php">
                                    <input type="hidden" name="db" value="${dbName}">
                                    <input type="hidden" name="method" value="DELETE">
                                    <input type="hidden" name="id" value="${item["id"]}">
                                    <input class="btn btn-danger js_EditRecordButton" type="submit" value="DELETE">
                                </form>
                            </td>
                        </tr>`
    return newItem;
}

//  --==:: HBS - HELPERS ::==-
Handlebars.registerHelper('shortText', function(text) {
    let newString = text.slice(0, 504);
    if (text.length > 504) {
        let lastWhitespace = newString.lastIndexOf(' ');
        return newString.slice(0, lastWhitespace) + "... ";
    } else {
        return newString;
    }
});

Handlebars.registerHelper('nl2br', nl2br);

Handlebars.registerHelper('langSup', function(lang) {
    if (!lang) return
    return new Handlebars.SafeString( '<sup' + (lang !== 'ru' ? ' class="colored"' : '') +'>'+ lang + '</sup>' );

});

Handlebars.registerHelper('formatedDate', function(date) {
    var date = new Date(date).toLocaleString('ru', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    });
    return date;
});

function nl2br (str) {
    // http://kevin.vanzonneveld.net
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Philip Peterson
    // +   improved by: Onno Marsman
    // +   improved by: Atli Þór
    // +   bugfixed by: Onno Marsman
    // +      input by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // +   improved by: Maximusya
    // *     example 1: nl2br('Kevin\nvan\nZonneveld');
    // *     returns 1: 'Kevin<br />\nvan<br />\nZonneveld'
    // *     example 2: nl2br("\nOne\nTwo\n\nThree\n", false);
    // *     returns 2: '<br>\nOne<br>\nTwo<br>\n<br>\nThree<br>\n'
    // *     example 3: nl2br("\nOne\nTwo\n\nThree\n", true);
    // *     returns 3: '<br />\nOne<br />\nTwo<br />\n<br />\nThree<br />\n'
    var breakTag = '<br>'; // Adjust comment to avoid issue on phpjs.org display
    console.log()
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
}