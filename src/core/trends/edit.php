<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>OkoloJS - Edit Trend</title>

    <link rel="shortcut icon" href="../favicon/favicon.png">
    <link rel="stylesheet" href="../css/style.bundle.css">
</head>
<body>


<?php if ($_POST['method'] == "UPDATE") {

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


        <table class="editTrends">
            <thead>
                <th>ID</th>
                <th>TITLE</th>
                <th>EDIT</th>
            </thead>
            <tbody>

            </tbody>
        </table>

        <?php


        // Вывести таблицу

    }
  }
  ?>


<script src="../js/bundle.js"></script>
</body>
</html>