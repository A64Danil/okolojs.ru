<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
</head>
<body>
<?php
require_once 'connection.php'; // подключаем скрипт

if (isset($_POST['title']) && isset($_POST['info'])) {
// подключаемся к серверу
    $link = mysqli_connect($host, $user, $password, $database)
    or die("Ошибка " . mysqli_error($link));

// экранирования символов для mysql
    $title = htmlentities(mysqli_real_escape_string($link, $_POST['title']));
    $info = htmlentities(mysqli_real_escape_string($link, $_POST['info']));

// создание строки запроса
    $query = "INSERT INTO testtrends VALUES(NULL, '$title','$info')";

// выполняем запрос
    $result = mysqli_query($link, $query) or die("Ошибка " . mysqli_error($link));
    if ($result) {
        echo "<span style='color:blue;'>Данные добавлены</span>";
    }
// закрываем подключение
    mysqli_close($link);
}



$link = mysqli_connect($host, $user, $password, $database)
or die("Ошибка " . mysqli_error($link));


$query ="SELECT * FROM testtrends";

$result = mysqli_query($link, $query) or die("Ошибка " . mysqli_error($link));
if($result)
{
    $rows = mysqli_num_rows($result); // количество полученных строк

    echo "<table><tr><th>Id</th><th>Title</th><th>Info</th></tr>";
    for ($i = 0 ; $i < $rows ; ++$i)
    {
        $row = mysqli_fetch_row($result);
        echo "<tr>";
        for ($j = 0 ; $j < 3 ; ++$j) echo "<td>$row[$j]</td>";
        echo "</tr>";
    }
    echo "</table>";

    // очищаем результат
    mysqli_free_result($result);
}

?>
<h2>Добавить новый тренд</h2>
<form method="POST">
    <p>Введите название:<br>
        <input type="text" name="title"/></p>
    <p>JSON: <br>
        <textarea name="info"></textarea></p>
    <input type="submit" value="Добавить">
</form>
</body>
</html>