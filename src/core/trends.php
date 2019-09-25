<?php
require_once 'connection.php'; // подключаем скрипт

// Обработать гет-запрос
if (isset($_GET['get'])) {
    if ($_GET['get'] == 'all') {
        $link = mysqli_connect($host, $user, $password, $database)
        or die("Ошибка " . mysqli_error($link));


        $query = "SELECT * FROM testtrends";

        $result = mysqli_query($link, $query) or die("Ошибка " . mysqli_error($link));
        if ($result) {
            $rows = mysqli_num_rows($result); // количество полученных строк

            echo '{ "trends":'." \r\n";
            echo "[ \r\n";
//            echo "<table><tr><th>Id</th><th>Title</th><th>Info</th></tr>";
            for ($i = 0; $i < $rows; ++$i) {
                $row = mysqli_fetch_row($result);

                $row1 = iconv("windows-1251","utf-8",$row[1]);
                $row2 = iconv("windows-1251","utf-8",$row[2]);
//                echo "<tr>";
//                for ($j = 0; $j < 3; ++$j) {
//                    $encode = mb_detect_encoding($row[j], array("UTF-8", "Windows-1251", "CP866", "KOI8-R"));
//                    echo "<td style='padding-bottom: 20px;'>$row[$j] $encode</td>";
//                }
//                echo "</tr>";
                echo "{\r\n";
                echo '"id": '.$row[0].",\r\n";
                //echo '"title": '."\"$row[1]\"".",\r\n";
                //echo '"info": '.$row[2]."\r\n";
                echo '"title": '."\"$row1\"".",\r\n";
                echo '"info": '.$row2."\r\n";
                if (($i + 1) < $rows) {
                    echo "}, \r\n";
                } else {
                    echo "} \r\n";
                }
            }
//            echo "</table>";
            echo "] \r\n";
            echo "}";

            // очищаем результат
            mysqli_free_result($result);
        }
    } else {
        echo 'Не правильный гет-запрос';
    }
}

if (count($_POST) != 0) {

    if (isset($_POST['title']) && isset($_POST['info'])) {
        $link = mysqli_connect($host, $user, $password, $database);
        /* проверка подключения */
        if (!$link) {
            printf("Не удалось подключиться: %s\n", mysqli_connect_error());
            exit();
        };

        $codedTitle = iconv("utf-8", "windows-1251", $_POST['title']); // смена кодировки
        $codedInfo = iconv("utf-8", "windows-1251", $_POST['info']);

        $stmt = mysqli_prepare($link, "INSERT INTO testtrends(title, info) VALUES (?, ?)"); // создание строки запроса
        mysqli_stmt_bind_param($stmt, 'ss', $codedTitle, $codedInfo); // экранирования символов для mysql

        if (mysqli_stmt_execute($stmt)) { // выполнение подготовленного запроса
            echo "Данные добавлены";
        } else {
            print_r($stmt->errorInfo());
        }

        mysqli_stmt_close($stmt); // закрываем запрос
        mysqli_close($link); // закрываем подключение
    } else {
        echo 'Не правильный post-запрос';
    }
}

?>