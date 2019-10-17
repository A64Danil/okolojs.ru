<?php
require_once '../connection.php'; // подключаем скрипт

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
        if (empty($_GET['limit'])) {
            $reqLimit = 10;
        } else {
            $reqLimit = (int)$_GET['limit'];
        }

        if (empty($_GET['offset'])) {
            $reqOffset = 0;
        } else {
            $reqOffset = (int)$_GET['offset'];
        }

        if (empty($_GET['lastid'])) {
            $lastId = 1000000;
        } else {
            $lastId = (int)$_GET['lastid'];
        }

        // Ввести lastReqID

        // Проверкаа на валидность
        if ($reqLimit > 0 && $reqOffset >= 0 && $lastId > 0)
        {
            //  echo "1-22 Вы запросили ".$reqLimit." записей, начиная с конца";
            $mysqli = new mysqli($host, $user, $password, $database);
            if (mysqli_connect_errno()) {
                printf("Не удалось подключиться: %s\n", mysqli_connect_error());
                exit();
            }
            // Если будет тормозить переписать на
            //SELECT * FROM `myguests` INNER JOIN (SELECT id FROM `myguests` ORDER BY `id` DESC LIMIT 40,10 ) AS lim USING(id)


            // LastID, limit,
            $stmt = $mysqli->prepare("SELECT * FROM $trendsTable WHERE `id`<? ORDER BY `id` DESC LIMIT ?");

            // offset, limit
//            $stmt = $mysqli->prepare("SELECT * FROM $trendsTable ORDER BY `id` DESC LIMIT ?,?");
            // SELECT * FROM `myguests` ORDER BY `id` DESC LIMIT 49,10


            $stmt->bind_param("ii", $lastId, $reqLimit);
//            $stmt->bind_param("ii",$reqOffset, $reqLimit);
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
            echo "Ошибка. Вы запросили неверное (".$reqLimit.") количество записей. Или неверный отступ (".$reqOffset."). Так же lastID должен быть больше 0, а у вас (".$lastId.") ";

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
                        echo "Запись обновлена";
                    } else {
                        print_r($stmt->errorInfo());
                    }

                    mysqli_stmt_close($stmt); // закрываем запрос
                    mysqli_close($link); // закрываем подключение
                }
            }
            else
            {
                echo "Ошибка. Вы не прислали INFO или ID";
            }
        }

        // DELETE
        if($_POST['method'] == "DELETE") {
            // остановились тут
            if(isset($_POST['id']) && $_POST['id'] !== "") {
                $link = mysqli_connect($host, $user, $password, $database);
                /* проверка подключения */
                if (!$link) {
                    printf("Не удалось подключиться: %s\n", mysqli_connect_error());
                    exit();
                };

                $stmt = mysqli_prepare($link, "DELETE FROM $trendsTable WHERE id=?");
                mysqli_stmt_bind_param($stmt, 'i', $_POST['id']);

                if (mysqli_stmt_execute($stmt)) { // выполнение подготовленного запроса
                    echo "Запись удалена";
                } else {
                    print_r($stmt->errorInfo());
                }

                mysqli_stmt_close($stmt);
                mysqli_close($link);
            }
            else
            {
                echo "Ошибка. Вы не прислали ID";
            }
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
                echo "Запись добавлена";
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