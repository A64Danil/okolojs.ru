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

            <p>Успех. Скоро тут будет более интересно.</p>

            <form method="POST" action="https://okolojs.ru/core/trends.php" class="sendtrend">
                <p>Введите название:<br>
                    <input type="text" name="title"/></p>
                <p>JSON: <br>
                    <textarea name="info"></textarea></p>
                <input type="submit" value="Добавить">
            </form>

        <div class="infoFromDB2"></div>

        <table class="infoFromDB">
            <thead>
                <th>ID</th>
                <th>TITLE</th>
                <th>EDIT</th>
            </thead>
            <tbody>
                <td>1</td>
                <td>test</td>
                <td>
                    <form action="">
                        <input type="submit" value="EDIT">
                    </form>
                </td>
            </tbody>
        </table>

        <?php


        // Вывести таблицу

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