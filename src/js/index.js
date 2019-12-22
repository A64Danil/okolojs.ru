import jQuery from 'jquery';
import popper from 'popper.js';
import bootstrap from 'bootstrap';
import Handlebars from 'handlebars';


document.addEventListener("DOMContentLoaded", coreFunction);


function coreFunction() {

    const mainManager = document.querySelector('.mainManager');
    function init() {

        console.log("Пасхалка для самых любопытных =) 1735");
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

        recordsMainManager("trendsManager");
        recordsMainManager("rulesManager");
        // usflLinksMainManager();
        recordsMainManager("usflManager", "usfl_links");
        recordsMainManager("usflManager", "usfl_tags");


        // TODO: после редактирования тегов, так же обновлять список полезных ссылок

        function recordsMainManager(mainManagerId, managerType) {
            const manager = document.getElementById(mainManagerId);

            const manageRecordsTable = !!managerType? manager.querySelector('.manageRecordsTable[data-loadtype="'+ managerType +'"]') :  manager.querySelector('.manageRecordsTable');
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

                    jQuery('#addUsflLinkModal').on('shown.bs.modal', function () {
                        removeFromArr(allUsflTags.selected);
                    });
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
                                    console.log("todo 1.5 - работает");
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
                                // TODO: 1.4. Вынести в отдельную функцию про теги
                                console.log("todo 1.4 - работает");
                                removeFromArr(allUsflTags.selected);

                                while (addRecordForm_selectedTags.children.length > 1) {
                                    addRecordForm_selectedTags.removeChild(addRecordForm_selectedTags.children[0])
                                }

                                nodeCreator(allUsflTags.selected, addRecordForm_selectedTags, nodeCreator_divTPL, "resultItem selectedTag tags", "toStart");
                                addRecordForm_searchResult.innerHTML = "";
                                nodeCreator(allUsflTags.arr, addRecordForm_searchResult, nodeCreator_divTPL, "resultItem tag");

                                break;
                            default:
                                break;
                        }

                        !!managerType? jQuery(manager).find('.addRecordModal[data-loadtype="'+ managerType +'"]').modal('hide') : jQuery(manager).find('.addRecordModal').modal('hide');
                    });

                    switch(managerType) {
                        case 'usfl_links':
                            console.log("todo 2 - работает");
                            sendRequest('/core/core.php?id=all&db=usfl_tags', function (response) {
                                if (response) {
                                    allUsflTags.arr = JSON.parse(response)["usfl_tags"];
                                    console.log("Пришли все возможные теги");
                                    nodeCreator(allUsflTags.arr, addRecordForm_searchResult, nodeCreator_divTPL, "resultItem tag");
                                } else {
                                    alert("Что-то пошло не так: \r\n" + response);
                                };

                            });

                            // TODO: вынести в отдельную функцию про теги3 - работает
                            addRecordForm_searchTags.addEventListener("keyup", function (e) {
                                const regex = new RegExp(this.value, 'i');
                                const tempArr = [];
                                allUsflTags.arr.forEach((el, i, arr) => {
                                    if (el["title"].match(regex) ) {
                                        tempArr.push(el);
                                    }
                                });

                                console.log("Итоговый массив: ");
                                console.log(tempArr);
                                addRecordForm_searchResult.innerHTML = "";
                                nodeCreator(tempArr, addRecordForm_searchResult, nodeCreator_divTPL, "resultItem tag");

                            });

                            // TODO: вынести в отдельную функцию про теги2 - работает
                            addRecordForm.addEventListener("click", function (e) {

                                if (e.target.classList.contains("tag") && e.target.dataset.id && e.target.dataset.title) {
                                    const tag = e.target;
                                    const selectedTag = {};
                                    selectedTag.id = parseInt(tag.dataset.id);
                                    selectedTag.title = tag.dataset.title;

                                    if (!checkIsSelected(allUsflTags.selected, selectedTag, "id" )) {
                                        allUsflTags.selected.push(selectedTag);
                                        while (addRecordForm_selectedTags.children.length > 1) {
                                            addRecordForm_selectedTags.removeChild(addRecordForm_selectedTags.children[0])
                                        }

                                        nodeCreator(allUsflTags.selected, addRecordForm_selectedTags, nodeCreator_divTPL, "resultItem selectedTag tags", "toStart");
                                        tag.remove();
                                    }

                                }

                                if (e.target.classList.contains("selectedTag") && e.target.dataset.id && e.target.dataset.title) {
                                    const tag = e.target;
                                    const selectedTag = {};
                                    selectedTag.id = parseInt(tag.dataset.id);
                                    selectedTag.title = tag.dataset.title;

                                    let tempArr;
                                    removeFromArr(allUsflTags.selected, selectedTag, "id" );


                                    tempArr = allUsflTags.arr.filter( commonTag => !allUsflTags.selected.find(selectedTag => commonTag.id === selectedTag.id));


                                    while (addRecordForm_selectedTags.children.length > 1) {
                                        addRecordForm_selectedTags.removeChild(addRecordForm_selectedTags.children[0])
                                    }

                                    nodeCreator(allUsflTags.selected, addRecordForm_selectedTags, nodeCreator_divTPL, "resultItem selectedTag", "toStart");
                                    addRecordForm_searchResult.innerHTML = "";
                                    nodeCreator(tempArr, addRecordForm_searchResult, nodeCreator_divTPL, "resultItem tag");

                                }
                            });


                            break;
                        default:
                            break;
                    }


                } else {
                    console.log('Формы sendRecord не существует');
                }

            }

            function addRecordRequest(response, form) {
                if (response === "Запись добавлена") {
                    alert("Запись добавлена");
                    form.reset();
                } else {
                    alert("Что-то пошло не так: \r\n" + response);
                }
                isSending = false;
                loadRecords();
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
                                // TODO: 4. Вынести в отдельную функцию про теги
                                console.log("todo 4 - работает");
                                removeFromArr(allUsflTags.selected);

                                while (updateRecordForm_selectedTags.children.length > 1) {
                                    updateRecordForm_selectedTags.removeChild(updateRecordForm_selectedTags.children[0])
                                }

                                nodeCreator(allUsflTags.selected, updateRecordForm_selectedTags, nodeCreator_divTPL, "resultItem selectedTag tags", "toStart");
                                updateRecordForm_searchResult.innerHTML = "";
                                nodeCreator(allUsflTags.arr, updateRecordForm_searchResult, nodeCreator_divTPL, "resultItem tag");

                                break;
                            default:
                                break;
                        }

                        !!managerType? jQuery(manager).find('.updateRecordModal[data-loadtype="'+ managerType +'"]').modal('hide') : jQuery(manager).find('.updateRecordModal').modal('hide');
                    });

                    switch(managerType) {
                        case 'usfl_links':
                            // TODO: 5. Протестировать
                            console.log("todo 5");

                            // TODO: вынести в отдельную функцию про теги3 ?
                            updateRecordForm_searchTags.addEventListener("keyup", function (e) {
                                const regex = new RegExp(this.value, 'i');
                                const tempArr = [];
                                allUsflTags.arr.forEach((el, i, arr) => {
                                    if (el["title"].match(regex) ) {
                                        tempArr.push(el);
                                    }
                                });

                                console.log("Итоговый массив: ");
                                console.log(tempArr);
                                updateRecordForm_searchResult.innerHTML = "";
                                nodeCreator(tempArr, updateRecordForm_searchResult, nodeCreator_divTPL, "resultItem tag");

                            });

                            // TODO: вынести в отдельную функцию про теги2 ?
                            updateRecordForm.addEventListener("click", function (e) {

                                if (e.target.classList.contains("tag") && e.target.dataset.id && e.target.dataset.title) {
                                    const tag = e.target;
                                    const selectedTag = {};
                                    selectedTag.id = parseInt(tag.dataset.id);
                                    selectedTag.title = tag.dataset.title;

                                    if (!checkIsSelected(allUsflTags.selected, selectedTag, "id" )) {
                                        allUsflTags.selected.push(selectedTag);
                                        while (updateRecordForm_selectedTags.children.length > 1) {
                                            updateRecordForm_selectedTags.removeChild(updateRecordForm_selectedTags.children[0])
                                        }

                                        nodeCreator(allUsflTags.selected, updateRecordForm_selectedTags, nodeCreator_divTPL, "resultItem selectedTag tags", "toStart");
                                        tag.remove();
                                    }

                                }

                                if (e.target.classList.contains("selectedTag") && e.target.dataset.id && e.target.dataset.title) {
                                    const tag = e.target;
                                    const selectedTag = {};
                                    selectedTag.id = parseInt(tag.dataset.id);
                                    selectedTag.title = tag.dataset.title;

                                    let tempArr;
                                    removeFromArr(allUsflTags.selected, selectedTag, "id" );


                                    tempArr = allUsflTags.arr.filter( commonTag => !allUsflTags.selected.find(selectedTag => commonTag.id === selectedTag.id));
                                    while (updateRecordForm_selectedTags.children.length > 1) {
                                        updateRecordForm_selectedTags.removeChild(updateRecordForm_selectedTags.children[0])
                                    }

                                    nodeCreator(allUsflTags.selected, updateRecordForm_selectedTags, nodeCreator_divTPL, "resultItem selectedTag tags", "toStart");
                                    updateRecordForm_searchResult.innerHTML = "";
                                    nodeCreator(tempArr, updateRecordForm_searchResult, nodeCreator_divTPL, "resultItem tag");

                                }
                            });

                            break;
                        default:
                            break;
                    }



                }
            }

            function updateRecordRequest(response, form) {
                loadRecords();
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

                            while (updateRecordForm_selectedTags.children.length > 1) {
                                updateRecordForm_selectedTags.removeChild(updateRecordForm_selectedTags.children[0])
                            }

                            allUsflTags.selected = formInfo.info.tags;
                            formInputInfo.value = JSON.stringify(formInfo.info, undefined, 4);

                            let tempArr;
                            tempArr = allUsflTags.arr.filter( commonTag => !allUsflTags.selected.find(selectedTag => commonTag.id === selectedTag.id));


                            nodeCreator(allUsflTags.selected, updateRecordForm_selectedTags, nodeCreator_divTPL, "resultItem selectedTag", "toStart");
                            updateRecordForm_searchResult.innerHTML = "";
                            nodeCreator(tempArr, updateRecordForm_searchResult, nodeCreator_divTPL, "resultItem tag");

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
            function loadRecords() {
                if (manageRecordsTable!== null) {
                    let db = manageRecordsTable.dataset.loadtype;
                    manageRecordsTable.querySelector("tbody").innerHTML = "";
                    sendRequest('/core/core.php?id=all&db=' + db, showRecordsInManager, manageRecordsTable);
                }
            }

        }

        function usflLinksMainManager() {

            const addUsflLinkForm = document.querySelector('.addUsflLinkForm');
            const addUsflLinkForm_searchTags = document.querySelector('.addUsflLinkForm .searchTags');
            const addUsflLinkForm_selectedTags = document.querySelector('.addUsflLinkForm .selectedTags');

            const updateUsflLinkForm = document.querySelector('.updateUsflLinkForm');
            const updateUsflLinkForm_searchTags = document.querySelector('.updateUsflLinkForm .searchTags');
            const updateUsflLinkForm_selectedTags = document.querySelector('.updateUsflLinkForm .selectedTags');

            const manageUsflLinksTable = document.querySelector('.manageUsflLinksTable');

            let addUsflLinkForm_searchResult;
            let updateUsflLinkForm_searchResult;
            if (addUsflLinkForm !== null) {
                addUsflLinkForm_searchResult = addUsflLinkForm.querySelector(".search_result");
            }
            if (updateUsflLinkForm !== null) {
                updateUsflLinkForm_searchResult = updateUsflLinkForm.querySelector(".search_result");
            }

            loadUsflLinks();
            addUsflLinkFormControl();
            updateUsflLinkFormControl();
            manageUsflLinksTableControl();


            // Add usflLink
            function addUsflLinkFormControl(callback) {
                if (addUsflLinkForm !== null) {

                    addUsflLinkForm.addEventListener("submit", function (e) {
                        e.preventDefault();


                        if (isSending) {
                            alert("Вы уже отправили запрос. Сначала дождитесь ответ.");
                            return false
                        }
                        if(textAreaJsonValidation(addUsflLinkForm)) {
                            isSending = true;
                            addFieldToInfo(this, "tags");
                            sendRequest('/core/core.php', addUsflLinkRequest, this, "POST");
                        }

                    });

                    addUsflLinkForm.addEventListener("reset", function (e) {
                        removeFromArr(allUsflTags.selected);

                        while (addUsflLinkForm_selectedTags.children.length > 1) {
                            addUsflLinkForm_selectedTags.removeChild(addUsflLinkForm_selectedTags.children[0])
                        }

                        nodeCreator(allUsflTags.selected, addUsflLinkForm_selectedTags, nodeCreator_divTPL, "resultItem selectedTag tags", "toStart");
                        addUsflLinkForm_searchResult.innerHTML = "";
                        nodeCreator(allUsflTags.arr, addUsflLinkForm_searchResult, nodeCreator_divTPL, "resultItem tag");
                        jQuery('#addUsflLinkModal').modal('hide');
                    });

                    sendRequest('/core/core.php?id=all&db=usfl_tags', function (response) {
                        if (response) {
                            allUsflTags.arr = JSON.parse(response)["usfl_tags"];
                            console.log("Пришли все возможные теги");
                            nodeCreator(allUsflTags.arr, addUsflLinkForm_searchResult, nodeCreator_divTPL, "resultItem tag");
                        } else {
                            alert("Что-то пошло не так: \r\n" + response);
                        };

                    });

                    addUsflLinkForm_searchTags.addEventListener("keyup", function (e) {
                        const regex = new RegExp(this.value, 'i');
                        const tempArr = [];
                        allUsflTags.arr.forEach((el, i, arr) => {
                            if (el["title"].match(regex) ) {
                                tempArr.push(el);
                            }
                        });

                        console.log("Итоговый массив: ");
                        console.log(tempArr);
                        addUsflLinkForm_searchResult.innerHTML = "";
                        nodeCreator(tempArr, addUsflLinkForm_searchResult, nodeCreator_divTPL, "resultItem tag");

                    });


                    addUsflLinkForm.addEventListener("click", function (e) {

                        if (e.target.classList.contains("tag") && e.target.dataset.id && e.target.dataset.title) {
                            const tag = e.target;
                            const selectedTag = {};
                            selectedTag.id = parseInt(tag.dataset.id);
                            selectedTag.title = tag.dataset.title;

                            if (!checkIsSelected(allUsflTags.selected, selectedTag, "id" )) {
                                allUsflTags.selected.push(selectedTag);
                                while (addUsflLinkForm_selectedTags.children.length > 1) {
                                    addUsflLinkForm_selectedTags.removeChild(addUsflLinkForm_selectedTags.children[0])
                                }

                                nodeCreator(allUsflTags.selected, addUsflLinkForm_selectedTags, nodeCreator_divTPL, "resultItem selectedTag tags", "toStart");
                                tag.remove();
                            }

                        }

                        if (e.target.classList.contains("selectedTag") && e.target.dataset.id && e.target.dataset.title) {
                            const tag = e.target;
                            const selectedTag = {};
                            selectedTag.id = parseInt(tag.dataset.id);
                            selectedTag.title = tag.dataset.title;

                            let tempArr;
                            removeFromArr(allUsflTags.selected, selectedTag, "id" );


                            tempArr = allUsflTags.arr.filter( commonTag => !allUsflTags.selected.find(selectedTag => commonTag.id === selectedTag.id));


                            while (addUsflLinkForm_selectedTags.children.length > 1) {
                                addUsflLinkForm_selectedTags.removeChild(addUsflLinkForm_selectedTags.children[0])
                            }

                            nodeCreator(allUsflTags.selected, addUsflLinkForm_selectedTags, nodeCreator_divTPL, "resultItem selectedTag", "toStart");
                            addUsflLinkForm_searchResult.innerHTML = "";
                            nodeCreator(tempArr, addUsflLinkForm_searchResult, nodeCreator_divTPL, "resultItem tag");

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

            jQuery('#addUsflLinkModal').on('shown.bs.modal', function () {
                removeFromArr(allUsflTags.selected);
            });


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
                            addFieldToInfo(this, "tags");
                            sendRequest('/core/core.php', updateUsflLinkRequest, this, "POST");
                        }
                    });

                    updateUsflLinkForm.addEventListener("reset", function (e) {
                        removeFromArr(allUsflTags.selected);

                        while (updateUsflLinkForm_selectedTags.children.length > 1) {
                            updateUsflLinkForm_selectedTags.removeChild(updateUsflLinkForm_selectedTags.children[0])
                        }

                        nodeCreator(allUsflTags.selected, updateUsflLinkForm_selectedTags, nodeCreator_divTPL, "resultItem selectedTag tags", "toStart");
                        updateUsflLinkForm_searchResult.innerHTML = "";
                        nodeCreator(allUsflTags.arr, updateUsflLinkForm_searchResult, nodeCreator_divTPL, "resultItem tag");
                        jQuery('#updateUsflLinkModal').modal('hide');
                    });


                    updateUsflLinkForm_searchTags.addEventListener("keyup", function (e) {
                        const regex = new RegExp(this.value, 'i');
                        const tempArr = [];
                        allUsflTags.arr.forEach((el, i, arr) => {
                            if (el["title"].match(regex) ) {
                                tempArr.push(el);
                            }
                        });

                        console.log("Итоговый массив: ");
                        console.log(tempArr);
                        updateUsflLinkForm_searchResult.innerHTML = "";
                        nodeCreator(tempArr, updateUsflLinkForm_searchResult, nodeCreator_divTPL, "resultItem tag");
                        // search_result

                    });


                    updateUsflLinkForm.addEventListener("click", function (e) {

                        if (e.target.classList.contains("tag") && e.target.dataset.id && e.target.dataset.title) {
                            const tag = e.target;
                            const selectedTag = {};
                            selectedTag.id = parseInt(tag.dataset.id);
                            selectedTag.title = tag.dataset.title;

                            if (!checkIsSelected(allUsflTags.selected, selectedTag, "id" )) {
                                allUsflTags.selected.push(selectedTag);
                                while (updateUsflLinkForm_selectedTags.children.length > 1) {
                                    updateUsflLinkForm_selectedTags.removeChild(updateUsflLinkForm_selectedTags.children[0])
                                }

                                nodeCreator(allUsflTags.selected, updateUsflLinkForm_selectedTags, nodeCreator_divTPL, "resultItem selectedTag tags", "toStart");
                                tag.remove();
                            }

                        }

                        if (e.target.classList.contains("selectedTag") && e.target.dataset.id && e.target.dataset.title) {
                            const tag = e.target;
                            const selectedTag = {};
                            selectedTag.id = parseInt(tag.dataset.id);
                            selectedTag.title = tag.dataset.title;

                            let tempArr;
                            removeFromArr(allUsflTags.selected, selectedTag, "id" );


                            tempArr = allUsflTags.arr.filter( commonTag => !allUsflTags.selected.find(selectedTag => commonTag.id === selectedTag.id));
                            while (updateUsflLinkForm_selectedTags.children.length > 1) {
                                updateUsflLinkForm_selectedTags.removeChild(updateUsflLinkForm_selectedTags.children[0])
                            }

                            nodeCreator(allUsflTags.selected, updateUsflLinkForm_selectedTags, nodeCreator_divTPL, "resultItem selectedTag tags", "toStart");
                            updateUsflLinkForm_searchResult.innerHTML = "";
                            nodeCreator(tempArr, updateUsflLinkForm_searchResult, nodeCreator_divTPL, "resultItem tag");

                        }
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
                    removeFromArr(allUsflTags.selected);

                    while (updateUsflLinkForm_selectedTags.children.length > 1) {
                        updateUsflLinkForm_selectedTags.removeChild(updateUsflLinkForm_selectedTags.children[0])
                    }

                    jQuery('#updateUsflLinkModal').modal('show');
                    const formInputID = updateUsflLinkForm.querySelector('[name=id]');
                    const formInputTitle = updateUsflLinkForm.querySelector('[name=title]');
                    const formInputInfo = updateUsflLinkForm.querySelector('[name=info]');
                    const formInfo = JSON.parse(info).usfl_links[0];

                    formInputID.value = formInfo.id;
                    formInputTitle.value = formInfo.title;
                    allUsflTags.selected = formInfo.info.tags;
                    formInputInfo.value = JSON.stringify(formInfo.info, undefined, 4);


                    let tempArr;
                    tempArr = allUsflTags.arr.filter( commonTag => !allUsflTags.selected.find(selectedTag => commonTag.id === selectedTag.id));


                    nodeCreator(allUsflTags.selected, updateUsflLinkForm_selectedTags, nodeCreator_divTPL, "resultItem selectedTag", "toStart");
                    updateUsflLinkForm_searchResult.innerHTML = "";
                    nodeCreator(tempArr, updateUsflLinkForm_searchResult, nodeCreator_divTPL, "resultItem tag");

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
                                        sendRequest('/core/core.php?db=usfl_links&id=' + formDataObj.id, addInfoToUpdateUsflLinkForm);
                                        break;
                                    case 'DELETE':
                                        if (confirm("Точно удалить?")) {
                                            sendRequest('/core/core.php', deleteUsflLinkRequest, form, "POST");
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
                    sendRequest('/core/core.php?id=all&db=usfl_links', showUsflLinksInManager, manageUsflLinksTable);
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
    console.log(arr);

    if(!el) {
        arr.splice(0);
    } else {
        for(let i = 0; i < arr.length; i++) {
            if (arr[i][key] === el[key]) {
                arr.splice(i, 1);
            }
        }
    }

    console.log(arr);
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
function showRecordsInManager(response, table) {
    let db = table.dataset.loadtype;
    const result = JSON.parse(response);
    // TODO: почистить консоль логи
    // console.log(result);
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

// TODO: скоро будет не нужна
function showUsflLinksInManager(response, table) {
    const result = JSON.parse(response);
    // Удалить кнопки, если response пустой
    if(result["usfl_links"].length === 0) {
        alert("Все записи уже загружены!");
        const buttons = document.querySelectorAll("[data-place='#usflLinksTableManage']");
        buttons.forEach(el => el.remove());
    }

    const arrLength = result["usfl_links"].length;
    table.dataset.lastid = result["usfl_links"][arrLength - 1].id;
    result["usfl_links"].forEach(function (item) {
        let newItemROW = manageUsflLinksTPL(item);
        document.querySelector('.manageUsflLinksTable tbody').innerHTML += newItemROW;
        // manageTrendsTable.querySelector("tbody").innerHTML += newItemROW;
    })
}


function showMoreData(e) {
    const target = e.target;

    if(target.classList.contains("showMore") && target.dataset.action == "loadMore") {
        const types = ["trends", "faq", "rules", "usfl_tags", "usfl_links"]
        if (types.indexOf(target.dataset.loadtype) === -1) {
            console.log("неизвестный тип " + target.dataset.loadtype);
            return false;
        }

        let loadtype = target.dataset.loadtype;
        let place = target.dataset.place;
        let placeToInput = document.querySelector(place);
        let lastID = placeToInput.dataset.lastid;
        let limit = target.dataset.limit ? parseInt(target.dataset.limit) : 10 ;
        // let url ="/core/"+ loadtype +".php?id=all&lastid=" + lastID + "&limit=" + limit;
        let url ="/core/core.php?db="+ loadtype +"&id=all&lastid=" + lastID + "&limit=" + limit;

        sendRequest(url, showRecordsInManager, placeToInput);


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

// TODO: скоро будет не нужна
function manageUsflLinksTPL(item) {
    let itemCategories = "";

    // console.log(item);

    if (item["info"]["tags"] && item["info"]["tags"].length > 0) {
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
                            <td>${item["title"]} <br> Tags: ${itemCategories} </td>
                            <td>
                                <form class="editUsflLinkForm" method="GET" action="https://okolojs.ru/core/core.php?db=usfl_links">
                                    <input type="hidden" name="id" value="${item["id"]}">
                                    <input class="btn btn-info js_EditUsflLinkButton" type="submit" value="EDIT" >
                                </form>
                            </td>
                            <td>
                                <form class="deleteUsflLinkForm" method="POST" action="https://okolojs.ru/core/core.php">
                                    <input type="hidden" name="db" value="usfl_links">
                                    <input type="hidden" name="method" value="DELETE">
                                    <input type="hidden" name="id" value="${item["id"]}">
                                    <input class="btn btn-danger js_EditUsflLinkButton" type="submit" value="DELETE">
                                </form>
                            </td>
                        </tr>`
    return newItem;
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