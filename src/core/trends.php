<?php
require_once 'connection.php'; // подключаем скрипт

//$trendsTable = 'testtrends';
$trendsTable = 'myguests';

// Print JSON from STR
function showTrendsJson($result)
{

    print '{ "trends": ['."\r\n";
    $teller = 0;
    while ($row = $result->fetch_array(MYSQLI_NUM))
    {
        $teller++;
        $trendId = '"id": '.$row[0].",\r\n";
        $trendTitle = '"title": "'.iconv("windows-1251","utf-8", $row[1]).'"'.",\r\n";
        $trendInfo = '"info": '.iconv("windows-1251","utf-8", $row[2])."\r\n";

        print "{"."\r\n";
        print "$trendId";
        print "$trendTitle";
        print "$trendInfo";
        if($result->num_rows !== $teller) {
            print "},"."\r\n";
        } else {
            print "}"."\r\n";
        }

    }
    print ']'."\r\n";
    print '}'."\r\n";
}


// Handle GET-request
// Get record by ID
if (isset($_GET['id'])) {

    if ($_GET['id'] == 'all')
    {
        if (isset($_GET['limit']) == false) {
            $reqLimit = 10;
        } else {
            $reqLimit = (int)$_GET['limit'];
        }
        // Проверкаа на валидность
        if ($reqLimit > 0)
        {
        //  echo "1-22 Вы запросили ".$reqLimit." записей, начиная с конца";
            $mysqli = new mysqli($host, $user, $password, $database);
            if (mysqli_connect_errno()) {
                printf("Не удалось подключиться: %s\n", mysqli_connect_error());
                exit();
            }
            $stmt = $mysqli->prepare("SELECT * FROM $trendsTable ORDER BY `id` DESC LIMIT 0,?");
            $stmt->bind_param("i",$reqLimit);
            if (!$stmt->execute()) {
                echo "Не удалось выполнить запрос: (" . $stmt->errno . ") " . $stmt->error;
            }
            $result = $stmt->get_result();
            showTrendsJson($result);

            /* закрываем запрос */
            $stmt->close();
            /* закрываем соединение */
            $mysqli->close();
        }
        else {
            echo "Ошибка. Вы запросили неверное (".$reqLimit.") количество записей.";

        }


    }
    else
    {
        //    echo "18-55"."\r\n";
        $reqID = preg_replace('/\s/', '', $_GET['id']);

        if (strlen($reqID) > 0) {
            $reqID = explode(",", $reqID);

            $goodReqIDArr = array(); // Сюда запишем результат;

            // Проверки на валидность каждого отдельного ID в запросе
            foreach ( $reqID as $checkedID) {
                if (strpos($checkedID, '.') !== false) {
                    echo 'Не правильный ID в строке запроса: "'.$checkedID.'". Найден лишний символ в строке';
                    return false;
                }

                if (!is_numeric($checkedID)) {
                    echo 'Не правильный ID в строке запроса: "'.$checkedID.'". Это точно не numeric. Проверьте запрос и попробуйте снова';
                    return false;
                } else {
                    $checkedID = (integer) $checkedID;
                    !in_array($checkedID, $goodReqIDArr) ? array_push($goodReqIDArr, $checkedID) : null; // Если такого ID еще нет, то добавить
                }
            }

            // Коннектимся к БД
            $mysqli = new mysqli($host, $user, $password, $database);
            /* проверяем соединение */
            if (mysqli_connect_errno()) {
                printf("Не удалось подключиться: %s\n", mysqli_connect_error());
                exit();
            }

            if(count($goodReqIDArr) == 1)
            {
                $stmt = $mysqli->prepare("SELECT * FROM $trendsTable WHERE id=?");
                // info заменить на *
                $stmt->bind_param("i", $goodReqIDArr[0]);
                if (!$stmt->execute()) {
                    echo "Не удалось выполнить запрос: (" . $stmt->errno . ") " . $stmt->error;
                }
                $result = $stmt->get_result();
                showTrendsJson($result);
            }
            elseif (count($goodReqIDArr) > 1)
            {

                $clause = implode(',', array_fill(0, count($goodReqIDArr), '?'));
                $stmt = $mysqli->prepare("SELECT * FROM $trendsTable WHERE id IN (" . $clause . ") GROUP BY `id`,`info`");
                $stmt->bind_param(str_repeat('i', count($goodReqIDArr)), ...$goodReqIDArr);
                if (!$stmt->execute()) {
                    echo "Не удалось выполнить запрос: (" . $stmt->errno . ") " . $stmt->error;
                }
                $result = $stmt->get_result();
                showTrendsJson($result);
            }

            /* закрываем запрос */
            $stmt->close();
            /* закрываем соединение */
            $mysqli->close();

        }
        else
        {
            echo "Запрошено неправильное количество записей \r\n";
            echo "Ваш запрос: $reqID"."\r\n";
            return false;
        }

    }

}

// Handle POST-request
if (count($_POST) != 0) {
    if(isset($_POST['method'])) {
        // UPDATE record
        if($_POST['method'] == "UPDATE") {
            //echo "Вы пытаетесь сделать ".$_POST['method']."\r\n";
            if (isset($_POST['info']) && isset($_POST['id']) && $_POST['id'] !== "")
            {
                $tendINFO = json_decode($_POST['info']);
                $newTrendTitle = trim($tendINFO->title);
                if (empty($newTrendTitle)) {
                    echo "Ошибка! Вы не указали title.";
                } else {
                    $link = mysqli_connect($host, $user, $password, $database);
                    /* проверка подключения */
                    if (!$link) {
                        printf("Не удалось подключиться: %s\n", mysqli_connect_error());
                        exit();
                    };

                    $codedTitle = iconv("utf-8", "windows-1251", $newTrendTitle); // смена кодировки
                    $codedInfo = iconv("utf-8", "windows-1251", $_POST['info']);

                    $stmt = mysqli_prepare($link, "UPDATE $trendsTable SET title=?, info=? WHERE id=?"); // создание строки запроса
                    mysqli_stmt_bind_param($stmt, 'ssi', $codedTitle, $codedInfo, $_POST['id']); // экранирования символов для mysql

                    if (mysqli_stmt_execute($stmt)) { // выполнение подготовленного запроса
                        echo "Данные обновлены";
                    } else {
                        print_r($stmt->errorInfo());
                    }

                    mysqli_stmt_close($stmt); // закрываем запрос
                    mysqli_close($link); // закрываем подключение
                }
            }
            else
            {
                echo "Вы не прислали INFO или ID";
            }
        }

        // DELETE
        if($_POST['method'] == "DELETE") {
            // остановились тут
            echo "Вы пытаетесь сделать ".$_POST['method']."\r\n";
        }

    }
    // Add new record form POST
    elseif (isset($_POST['info']))
    {
        $tendINFO = json_decode($_POST['info']);
        $newTrendTitle = trim($tendINFO->title);
        if (empty($newTrendTitle)) {
            echo "Ошибка! Вы не указали title.";
        }
        else
        {
            $link = mysqli_connect($host, $user, $password, $database);
            /* проверка подключения */
            if (!$link) {
                printf("Не удалось подключиться: %s\n", mysqli_connect_error());
                exit();
            };

            $codedTitle = iconv("utf-8", "windows-1251", $newTrendTitle); // смена кодировки
            $codedInfo = iconv("utf-8", "windows-1251", $_POST['info']);

            $stmt = mysqli_prepare($link, "INSERT INTO $trendsTable(title, info) VALUES (?, ?)"); // создание строки запроса
            mysqli_stmt_bind_param($stmt, 'ss', $codedTitle, $codedInfo); // экранирования символов для mysql

            if (mysqli_stmt_execute($stmt)) { // выполнение подготовленного запроса
                echo "Данные добавлены";
            } else {
                print_r($stmt->errorInfo());
            }

            mysqli_stmt_close($stmt); // закрываем запрос
            mysqli_close($link); // закрываем подключение
        }
    }
    else {
        echo "Ошибка! Не правильный post-запрос";
    }
}

?>