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

    if ($_POST['login'] == "dark" && $_POST['password'] == "lord2019") {
        require_once 'connection.php'; // подключаем скрипт

        ?>

            <div class="manageForm addData active">
                <p class="manageForm__title">Добавить тренд</p>
                <form method="POST" action="https://okolojs.ru/core/trends.php" class="addTrend">
    <!--                <p>Введите название:<br>-->
    <!--                    <input type="text" name="title"/></p>-->
                    <div class="form-group">
                        <label for="">Введите Info в формате JSON: </label>
                        <textarea class="form-control" id="" cols=60 rows=12 name="info"></textarea>
                    </div>
                    <input type="submit" value="Добавить" class="btn btn-success">
                </form>
            </div>

            <div class="manageForm updateData">
                <p class="manageForm__title">Редактировать тренд</p>
                <form method="POST" action="https://okolojs.ru/core/trends.php" class="updateTrend">
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

                    <input type="submit" value="Сохранить" class="btn btn-success">
                    <input type="reset" value="Отменить" class="btn btn-secondary js_AbortTrendUpdating">
                </form>
            </div>
            <div class="table-responsive">
                <table class="manageTrendsTable table table-striped table-hover">
                    <thead>
                        <th>ID</th>
                        <th>TITLE</th>
                        <th>EDIT</th>
                        <th>DELETE</th>
                    </thead>
                    <tbody>

                    </tbody>
                </table>
            </div>


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