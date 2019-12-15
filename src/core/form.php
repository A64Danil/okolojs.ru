<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>OkoloJS - Manager Form</title>

    <link rel="shortcut icon" href="../favicon/favicon.png">
    <link rel="stylesheet" href="../css/style.bundle.css">
</head>
<body>


<?php if (count($_POST) != 0) {
    require_once 'guard.php';

    if ($_POST['login'] == $mngr_login && $_POST['password'] == $mngr_password) {
        require_once 'connection.php'; // подключаем скрипт

        ?>

            <nav class="mainManagerMenu">
                <div class="nav nav-tabs" id="nav-tab" role="tablist">
                    <a class="nav-item nav-link active" id="nav-trends-tab" data-toggle="tab" href="#trendsManager" role="tab" aria-controls="trendsManager" aria-selected="true">Trends</a>
                    <a class="nav-item nav-link" id="nav-rules-tab" data-toggle="tab" href="#rulesManager" role="tab" aria-controls="rulesManager" aria-selected="false">Rules</a>
                    <a class="nav-item nav-link" id="nav-faq-tab" data-toggle="tab" href="#faqManager" role="tab" aria-controls="faqManager" aria-selected="false">FAQ</a>
                    <a class="nav-item nav-link" id="nav-usfl-tab" data-toggle="tab" href="#usflManager" role="tab" aria-controls="usflManager" aria-selected="false">
                        Usefull Links
                    </a>
                </div>
            </nav>

            <div class="mainManager tab-content" >

                <div class="trendsManager dataManager tab-pane fade show active" id="trendsManager" role="tabpanel" aria-labelledby="nav-trends-tab">
                    <div class="trendsManager__menu innerMenu">
                        <!-- Button trigger modal -->
                        <button type="button" class="btn btn-success" data-toggle="modal" data-target="#addTrendModal">
                            Add trend
                        </button>
                        <button type="button" class="btn btn-outline-success" data-toggle="modal" data-target="#addTrendModal">
                            Add trend
                        </button>
                    </div>


                    <!-- Modal -->
                    <div class="manageForm modal fade" id="addTrendModal" tabindex="-1" role="dialog" aria-hidden="true">
                        <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
                            <div class="modal-content">

                                <div class="modal-header">
                                    <p class="manageForm__title">Добавить тренд</p>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div class="modal-body">
                                    <div class="card">
                                        <div class="card-header">
                                            <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#trendsSchema" aria-expanded="false" aria-controls="trendsSchema">
                                                Описание доступных полей
                                            </button>
                                        </div>

                                        <div id="trendsSchema" class="collapse">
                                            <div class="card-body">
                                                <ul class="schema">
                                                    <li><b>Title*</b> - название тренда (обяз. поле)</li>
                                                    <li><b>titleOriginal</b> - название без перевода</li>
                                                    <li><b>description</b> - краткое описание</li>
                                                    <li><b>language</b> - язык тренда</li>
                                                    <li><b>difficulty</b> - сложость </li>
                                                    <li><b>author</b> - автор тренда</li>
                                                    <li><b>url</b> - ссылка на тренд</li>
                                                    <li><b>published</b> - дата появления в сети</li>
                                                    <li><b>started</b> - дата, когда тренд стал актуален у нас</li>
                                                    <li><b>status</b> - статус тренда на текущий момент</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <!--
                                    <a class="btn btn-outline-dark schemaBtn" data-toggle="collapse" href="#trendsSchema" role="button" aria-expanded="false" aria-controls="trendsManager">
                                        Описание доступных полей
                                    </a>
                                    -->
                                    <form method="POST" action="https://okolojs.ru/core/core.php" class="addTrendForm">
                                        <input type="hidden" value="myguests" name="db">
                                        <div class="form-group">
                                            <label for="">Введите Info в формате JSON: </label>
                                            <textarea class="form-control" id="" cols=60 rows=12 name="info">
{
    "title": "Новый Тренд",
    "titleOriginal": "New Trend",
    "description": "",
    "difficulty": "",
    "author": "",
    "url": "",
    "started": "",
    "published": "",
    "started": "",
    "status": ""
}
                                            </textarea>
                                        </div>
                                        <div class="modal-footer">
                                            <input type="submit" value="Добавить" class="btn btn-success">
                                            <input type="reset" value="Отменить" class="btn btn-secondary js_CancelEdit">
                                        </div>

                                    </form>

                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="manageForm modal fade" id="updateTrendModal" tabindex="-1" role="dialog" aria-hidden="true">
                        <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
                            <div class="modal-content">

                                <div class="modal-header">
                                    <p class="manageForm__title">Редактировать тренд</p>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div class="modal-body">
                                    <form method="POST" action="https://okolojs.ru/core/trends.php" class="updateTrendForm">
                                        <input type="hidden" name="method" value="UPDATE">

                                        <div class="form-group row">
                                            <label for="" class="col-sm-2 col-form-label col-form-label-lg">ID </label>
                                            <div class="col-sm-10">
                                                <input class="form-control form-control-lg" type="text" name="id" value="" readonly />
                                            </div>
                                        </div>

                                        <div class="form-group row">
                                            <label for="" class="col-sm-2 col-form-label col-form-label-lg">Title </label>
                                            <div class="col-sm-10">
                                                <input class="form-control form-control-lg" type="text" name="title" value="" disabled readonly />
                                            </div>
                                        </div>

                                        <div class="form-group">
                                            <label for="">Введите Info в формате JSON: </label>
                                            <textarea class="form-control" id="" cols=60 rows=12 name="info"></textarea>
                                        </div>

                                        <div class="modal-footer">
                                            <input type="submit" value="Сохранить" class="btn btn-success" >
                                            <input type="reset" value="Отменить" class="btn btn-secondary js_CancelEdit">
                                        </div>
                                    </form>

                                </div>
                            </div>
                        </div>
                    </div>


                    <div class="table-responsive" >
                        <table id="trendsTableManage" class="manageTrendsTable table table-striped table-hover" data-lastid="">
                            <thead>
                            <th>ID</th>
                            <th>TITLE</th>
                            <th>EDIT</th>
                            <th>DELETE</th>
                            </thead>
                            <tbody>

                            </tbody>
                        </table>
                        <button type="button"
                                class="btn btn-primary showMore"
                                data-action="loadMore"
                                data-loadtype="trends"
                                data-place="#trendsTableManage">
                            Показать еще
                        </button>
                        <button type="button"
                                class="btn btn-primary showMore"
                                data-action="loadMore"
                                data-loadtype="trends"
                                data-limit="30"
                                data-place="#trendsTableManage">
                            Показать еще 30
                        </button>
                    </div>
                </div>

                <div class="rulesManager dataManager tab-pane fade" id="rulesManager" role="tabpanel" aria-labelledby="nav-rules-tab">
                    rules manager
                </div>

                <div class="faqManager dataManager tab-pane fade" id="faqManager" role="tabpanel" aria-labelledby="nav-faq-tab">
                    faq manager
                </div>

                <div class="usflManager dataManager tab-pane fade" id="usflManager" role="tabpanel" aria-labelledby="nav-usfl-tab">
                    <div class="usflManager__menu innerMenu">
                        <!-- Button trigger modal -->
                        <button type="button" class="btn btn-success" data-toggle="modal" data-target="#addUsflLinkModal">
                            Add usflLink
                        </button>
                        <button type="button" class="btn btn-outline-success" data-toggle="modal" data-target="#addUsflTagModal">
                            Add usflTag
                        </button>
                    </div>


                    <!-- Modal -->
                    <div class="manageForm modal fade" id="addUsflLinkModal" tabindex="-1" role="dialog" aria-hidden="true">
                        <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
                            <div class="modal-content">

                                <div class="modal-header">
                                    <p class="manageForm__title">Добавить полезную ссылку</p>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div class="modal-body">
                                    <div class="card">
                                        <div class="card-header">
                                            <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#usflLinkSchema" aria-expanded="false" aria-controls="usflLinkSchema">
                                                Описание доступных полей
                                            </button>
                                        </div>

                                        <div id="usflLinkSchema" class="collapse">
                                            <div class="card-body">
                                                <ul class="schema">
                                                    <li><b>Title*</b> - заголовок ссылки(обяз. поле)</li>
                                                    <li><b>description</b> - краткое описание</li>
                                                    <li><b>url</b> - ссылка на страницу</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <form method="POST" action="https://okolojs.ru/core/core.php" class="addUsflLinkForm">
                                        <input type="hidden" name="db" value="usfl_links" >
                                        <div class="form-group">
                                            <label for="">Введите Info в формате JSON: </label>
                                            <textarea class="form-control" id="" cols=60 rows=12 name="info">
{
    "title": "Новая Ссылка",
    "description": "",
    "url": "https://"
}
                                            </textarea>

                                        </div>
                                        <div class="form-group">
                                            <label for="" class="col-form-label">Тэги </label>
                                            <div class="selectedTags form-control ">
                                                <input type="text" class="search searchTags" >
                                            </div>
                                            <div class="jsSearchTags_result search_result"></div>
                                        </div>
                                        <div class="modal-footer">
                                            <input type="submit" value="Добавить" class="btn btn-success">
                                            <input type="reset" value="Отменить" class="btn btn-secondary js_CancelEdit">
                                        </div>

                                    </form>

                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="manageForm modal fade" id="updateUsflLinkModal" tabindex="-1" role="dialog" aria-hidden="true">
                        <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
                            <div class="modal-content">

                                <div class="modal-header">
                                    <p class="manageForm__title">Редактировать полезную ссылку</p>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div class="modal-body">
                                    <form method="POST" action="https://okolojs.ru/core/db/usfl.php" class="updateUsflLinkForm">
                                        <input type="hidden" name="db" value="usfl_links">
                                        <input type="hidden" name="method" value="UPDATE">

                                        <div class="form-group row">
                                            <label for="" class="col-sm-2 col-form-label col-form-label-lg">ID </label>
                                            <div class="col-sm-10">
                                                <input class="form-control form-control-lg" type="text" name="id" value="" readonly />
                                            </div>
                                        </div>

                                        <div class="form-group row">
                                            <label for="" class="col-sm-2 col-form-label col-form-label-lg">Title </label>
                                            <div class="col-sm-10">
                                                <input class="form-control form-control-lg" type="text" name="title" value="" disabled readonly />
                                            </div>
                                        </div>

                                        <div class="form-group">
                                            <label for="">Введите Info в формате JSON: </label>
                                            <textarea class="form-control" id="" cols=60 rows=12 name="info"></textarea>
                                        </div>

                                        <div class="form-group">
                                            <label for="" class="col-form-label">Тэги </label>
                                            <div class="selectedTags form-control ">
                                                <input type="text" class="search searchTags" >
                                            </div>
                                            <div class="jsSearchTags_result search_result"></div>
                                        </div>

                                        <div class="modal-footer">
                                            <input type="submit" value="Сохранить" class="btn btn-success" >
                                            <input type="reset" value="Отменить" class="btn btn-secondary js_CancelEdit">
                                        </div>
                                    </form>

                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Modal -->
                    <div class="manageForm modal fade" id="addUsflTagModal" tabindex="-1" role="dialog" aria-hidden="true">
                        <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
                            <div class="modal-content">

                                <div class="modal-header">
                                    <p class="manageForm__title">Добавить Тэг для полезных ссылок</p>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div class="modal-body">
                                    <div class="card">
                                        <div class="card-header">
                                            <button class="btn btn-tag" type="button" data-toggle="collapse" data-target="#usflTagschema" aria-expanded="false" aria-controls="usflTagschema">
                                                Описание доступных полей
                                            </button>
                                        </div>

                                        <div id="usflTagschema" class="collapse">
                                            <div class="card-body">
                                                <ul class="schema">
                                                    <li><b>Title*</b> - имя тэга (обяз. поле)</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <form method="POST" action="https://okolojs.ru/core/core.php" class="addUsflTagForm">
                                        <input type="hidden" name="db" value="usfl_tags">
                                        <div class="form-group">
                                            <label for="">Введите Info в формате JSON: </label>
                                            <textarea class="form-control" id="" cols=60 rows=12 name="info">
{
    "title": "Новый Тэг"
}
                                            </textarea>
                                        </div>
                                        <div class="modal-footer">
                                            <input type="submit" value="Добавить" class="btn btn-success">
                                            <input type="reset" value="Отменить" class="btn btn-secondary js_CancelEdit">
                                        </div>

                                    </form>

                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="manageForm modal fade" id="updateUsflTagModal" tabindex="-1" role="dialog" aria-hidden="true">
                        <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
                            <div class="modal-content">

                                <div class="modal-header">
                                    <p class="manageForm__title">Редактировать Тэг для полезных ссылок</p>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div class="modal-body">
                                    <form method="POST" action="https://okolojs.ru/core/db/usfl.php" class="updateUsflTagForm">
                                        <input type="hidden" name="db" value="usfl_tags">
                                        <input type="hidden" name="method" value="UPDATE">

                                        <div class="form-group row">
                                            <label for="" class="col-sm-2 col-form-label col-form-label-lg">ID </label>
                                            <div class="col-sm-10">
                                                <input class="form-control form-control-lg" type="text" name="id" value="" readonly />
                                            </div>
                                        </div>

                                        <div class="form-group row">
                                            <label for="" class="col-sm-2 col-form-label col-form-label-lg">Title </label>
                                            <div class="col-sm-10">
                                                <input class="form-control form-control-lg" type="text" name="title" value="" disabled readonly />
                                            </div>
                                        </div>

                                        <div class="form-group">
                                            <label for="">Введите Info в формате JSON: </label>
                                            <textarea class="form-control" id="" cols=60 rows=12 name="info"></textarea>
                                        </div>

                                        <div class="modal-footer">
                                            <input type="submit" value="Сохранить" class="btn btn-success" >
                                            <input type="reset" value="Отменить" class="btn btn-secondary js_CancelEdit">
                                        </div>
                                    </form>

                                </div>
                            </div>
                        </div>
                    </div>


                    <div class="table-responsive" >
                        <table id="usflTagsTableManage" class="manageUsflTagsTable table table-striped table-hover" data-lastid="">
                            <thead>
                            <th>ID</th>
                            <th>TITLE</th>
                            <th>EDIT</th>
                            <th>DELETE</th>
                            </thead>
                            <tbody>

                            </tbody>
                        </table>
                        <button type="button"
                                class="btn btn-primary showMore"
                                data-action="loadMore"
                                data-loadtype="usflTag"
                                data-place="#usflTagsTableManage">
                            Показать еще
                        </button>
                        <button type="button"
                                class="btn btn-primary showMore"
                                data-action="loadMore"
                                data-loadtype="usflTag"
                                data-limit="30"
                                data-place="#usflTagsTableManage">
                            Показать еще 30
                        </button>
                        
                        <table id="usflLinksTableManage" class="manageUsflLinksTable table table-striped table-hover" data-lastid="">
                            <thead>
                            <th>ID</th>
                            <th>TITLE</th>
                            <th>EDIT</th>
                            <th>DELETE</th>
                            </thead>
                            <tbody>

                            </tbody>
                        </table>
                        <button type="button"
                                class="btn btn-primary showMore"
                                data-action="loadMore"
                                data-loadtype="usflLink"
                                data-place="#usflLinksTableManage">
                            Показать еще
                        </button>
                        <button type="button"
                                class="btn btn-primary showMore"
                                data-action="loadMore"
                                data-loadtype="usflLink"
                                data-limit="30"
                                data-place="#usflLinksTableManage">
                            Показать еще 30
                        </button>
                    </div>
                </div>


            </div>


            <div>Блок для опытов</div>



    <?php

    } else {
        echo "Не верный логин или пароль. Вы вводите: \r\n";
        echo "Логин ".$_POST['login']."\r\n";
        echo "Пароль ".$_POST['password'];

    }
    ?>



<?php } else {?>
    <h2>Авторизация</h2>
    <form method="POST" action="form.php">
        <p>Login:<br>
            <input type="text" name="login"/>
        </p>
        <p>Password:<br>
            <input type="password" name="password"/>
        </p>
        <input type="submit" value="Войти">
    </form>

<?php } ?>


<script src="../js/bundle.js"></script>
</body>
</html>