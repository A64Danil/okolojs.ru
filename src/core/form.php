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

            <div class="mainManagerMenu">
                <a class="btn btn-primary" data-toggle="collapse" href="#trendsManager" role="button" aria-expanded="false" aria-controls="trendsManager">
                    trends
                </a>

                <a class="btn btn-primary" data-toggle="collapse" href="#rulesManager" role="button" aria-expanded="false" aria-controls="rulesManager">
                    rules
                </a>

                <a class="btn btn-primary" data-toggle="collapse" href="#faqManager" role="button" aria-expanded="false" aria-controls="faqManager">
                    faq
                </a>
            </div>

            <div class="mainManager">


                <div class="trendsManager dataManager collapse" id="trendsManager" data-parent=".mainManager">
                    <div class="trendsManager__menu innerMenu">
                        <a class="btn btn-primary" data-toggle="collapse" href="#addTrend" role="button" aria-expanded="true" aria-controls="addTrend">
                            Add trend
                        </a>

                        <!-- Button trigger modal -->
                        <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#updateTrendModal">
                            Launch demo modal
                        </button>
                    </div>

                    <div class="manageForm addData collapse show" id="addTrend" data-parent=".trendsManager">
                        <p class="manageForm__title">Добавить тренд</p>
                        <ul class="schema">
                            <p>Доступные поля:</p>
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
                        <form method="POST" action="https://okolojs.ru/core/trends.php" class="addTrendForm">
                            <!--                <p>Введите название:<br>-->
                            <!--                    <input type="text" name="title"/></p>-->
                            <div class="form-group">
                                <label for="">Введите Info в формате JSON: </label>
                                <textarea class="form-control" id="" cols=60 rows=12 name="info"></textarea>
                            </div>
                            <input type="submit" value="Добавить" class="btn btn-success">
                        </form>
                    </div>



                    <!-- Modal -->
                    <div class="manageForm updateData modal fade" id="updateTrendModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
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

                                <!--
                                <div class="modal-header">
                                    <p class="manageForm__title">Редактировать тренд</p>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div class="modal-body">
                                    ...
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                                    <button type="button" class="btn btn-primary">Save changes</button>
                                </div> -->

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

                <div class="rulesManager dataManager collapse" id="rulesManager" data-parent=".mainManager">
                    rules manager
                </div>

                <div class="rulesManager dataManager collapse" id="faqManager" data-parent=".mainManager">
                    rules manager
                </div>

                <div class="usefullManager dataManager collapse">
                    other manager
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