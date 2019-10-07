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

            <div class="addData">
                <p class="addData__title">Добавить тренд</p>
                <form method="POST" action="https://okolojs.ru/core/trends.php" class="sendTrend">
    <!--                <p>Введите название:<br>-->
    <!--                    <input type="text" name="title"/></p>-->
                    <p>Введите Info в формате JSON: </p>
                    <textarea cols=60 rows=12 name="info"></textarea>
                    <input type="submit" value="Добавить">
                </form>
            </div>

            <div class="addData">
                <p class="addData__title">Редактировать тренд</p>
                <form method="POST" action="https://okolojs.ru/core/trends.php" class="updateTrend">
                    <input type="hidden" name="method" value="UPDATE">
                    <p>ID: <input type="text" name="id" value="" readonly /></p>
                    <p>Название: <input type="text" name="title" value="" disabled /></p>
                    <p>Info (JSON): <br>
                        <textarea cols=60 rows=12 name="info"></textarea></p>
                    <input type="submit" value="Сохранить">
                </form>
            </div>
            <table class="manageTrendsTable">
                <thead>
                    <th>ID</th>
                    <th>TITLE</th>
                    <th>EDIT</th>
                    <th>DELETE</th>
                </thead>
                <tbody>

                </tbody>
            </table>


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