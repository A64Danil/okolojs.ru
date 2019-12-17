<?php

require_once 'connection.php'; // подключаем скрипт

function show($str)
{
    echo $str;
}

//$mainDBTable = 'usfl_links';


// Handle GET-request
if (isset($_GET['id'])) {

    // Орпеделяем запрошенную базу и устанавливаем настройки
    if (!isset($_GET['db'])) {
        exit("Вы не указали имя db в параметрах GET-запроса");
    }
    else
    {
        switch ($_GET['db']) {
            case 'usfl_links':
                $mainDBTable = 'usfl_links';
                $boundDBTable = 'usfl_taglinks'; // кажется не нужно
                $selectorSQL = 'usfl_links'; // кажется не нужно
                $categoryDBTable = 'usfl_tags'; // кажется не нужно
                break;
            case 'somenew':
                echo "i равно 1";
                break;
            default:
                $mainDBTable = $_GET['db'];
                break;
        };
//        echo "Имя таблицы ".$mainDBTable;
    }


    // Get record by ID
    if ($_GET['id'] == 'all')
    {
        if (empty($_GET['limit'])) {
            $reqLimit = 10;
        } else {
            $reqLimit = (int)$_GET['limit'];
        }

        if (empty($_GET['lastid'])) {
            $lastId = 1000000;
        } else {
            $lastId = (int)$_GET['lastid'];
        }

        // Проверкаа на валидность
        if ($reqLimit > 0 && $lastId > 0)
        {
            $mysqli = new mysqli($host, $user, $password, $database);
            if (mysqli_connect_errno()) {
                printf("Не удалось подключиться: %s\n", mysqli_connect_error());
                exit();
            }
            // Если будет тормозить переписать на
            //SELECT * FROM `myguests` INNER JOIN (SELECT id FROM `myguests` ORDER BY `id` DESC LIMIT 40,10 ) AS lim USING(id)

            // Здесь будет свитч
            // TODO: свитч не нужен, убрать и оставить дефол
            switch ($mainDBTable) {
                case 'usfl_linksOFF':
                    $stmt = $mysqli->prepare("SELECT * FROM $mainDBTable WHERE `id`<? ORDER BY `id` DESC LIMIT ?");
// TODO: useless
//                    $stmt2 = $mysqli->prepare("SELECT usfl_tags.id, usfl_tags.title
//FROM (($mainDBTable
//INNER JOIN $mainDBTable ON $mainDBTable.id = $boundDBTable.link_id)
//INNER JOIN $categoryDBTable ON $boundDBTable.tag_id = $categoryDBTable.id)
//WHERE $mainDBTable.id=?
//GROUP BY id");

                    $stmt->bind_param("ii", $lastId, $reqLimit);
//                    $stmt2->bind_param("i", $lastId, $reqLimit);

                    if (!$stmt->execute()) {
                        echo "Не удалось выполнить запрос: (" . $stmt->errno . ") " . $stmt->error;
                    }
                    $result = $stmt->get_result();
                    showAsJson($result, $_GET['db']);
                    break;
                case 'somenew':
                    echo "i равно 1";
                    break;
                default:
                    $stmt = $mysqli->prepare("SELECT * FROM $mainDBTable WHERE `id`<? ORDER BY `id` DESC LIMIT ?");
                    // LastID, limit,
                    $stmt->bind_param("ii", $lastId, $reqLimit);

                    if (!$stmt->execute()) {
                        echo "Не удалось выполнить запрос: (" . $stmt->errno . ") " . $stmt->error;
                    }
                    $result = $stmt->get_result();
                    showAsJson($result, $_GET['db']);
                    break;
            };



            $stmt->close(); /* закрываем запрос */
            $mysqli->close();  /* закрываем соединение */
        }
        else {
            echo "Ошибка. Вы запросили неверное (".$reqLimit.") количество записей. Так же lastID должен быть больше 0, а у вас (".$lastId.") ";
        }


    }
    else
    {
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
            if (mysqli_connect_errno())
            {
                printf("Не удалось подключиться: %s\n", mysqli_connect_error());
                exit();
            }

            if(count($goodReqIDArr) == 1)
            {
                $stmt = $mysqli->prepare("SELECT * FROM $mainDBTable WHERE id=?");
                $stmt->bind_param("i", $goodReqIDArr[0]);
            }
            elseif (count($goodReqIDArr) > 1)
            {
                $clause = implode(',', array_fill(0, count($goodReqIDArr), '?'));
                $stmt = $mysqli->prepare("SELECT * FROM $mainDBTable WHERE id IN (" . $clause . ") GROUP BY `id`");
                $stmt->bind_param(str_repeat('i', count($goodReqIDArr)), ...$goodReqIDArr);
            }

            if (!$stmt->execute()) {
                echo "Не удалось выполнить запрос: (" . $stmt->errno . ") " . $stmt->error;
            }

            $result = $stmt->get_result();
            showAsJson($result, $_GET['db']);

            $stmt->close(); /* закрываем запрос */
            $mysqli->close(); /* закрываем соединение */
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

    // Орпеделяем запрошенную базу и устанавливаем настройки
    if (!isset($_POST['db'])) {
        exit("Вы не указали имя db в параметрах POST-запроса");
    }
    else
    {
        $mainDBTable = $_POST['db'];
    }



    if(isset($_POST['method'])) {
        // UPDATE record
        if($_POST['method'] == "UPDATE") {
            //echo "Вы пытаетесь сделать ".$_POST['method']."\r\n";
            if (isset($_POST['info']) && isset($_POST['id']) && $_POST['id'] !== "")
            {
                $tendINFO = json_decode($_POST['info']);
                $newRecordTitle = trim($tendINFO->title);
                if (empty($newRecordTitle)) {
                    echo "Ошибка! Вы не указали title.";
                } else {
                    $link = mysqli_connect($host, $user, $password, $database);
                    /* проверка подключения */
                    if (!$link) {
                        printf("Не удалось подключиться: %s\n", mysqli_connect_error());
                        exit();
                    };

                    $codedTitle = iconv("utf-8", "windows-1251", $newRecordTitle); // смена кодировки


                    switch ($_POST['db']) {
                        case 'usfl_tags':
                            $stmt = mysqli_prepare($link, "UPDATE $mainDBTable SET title=? WHERE id=?"); // создание строки запроса
                            $stmt->bind_param('si', $codedTitle, $_POST['id']);
                            break;
                        case 'somenew':
                            echo "i равно 1";
                            break;
                        default:
                            $codedInfo = iconv("utf-8", "windows-1251", $_POST['info']);
                            $stmt = mysqli_prepare($link, "UPDATE $mainDBTable SET title=?, info=? WHERE id=?"); // создание строки запроса
                            mysqli_stmt_bind_param($stmt, 'ssi', $codedTitle, $codedInfo, $_POST['id']); // экранирования символов для mysql
                            break;
                    };


                    if (mysqli_stmt_execute($stmt)) { // выполнение подготовленного запроса
                        echo "Запись обновлена";

                        switch ($_POST['db']) {
                            case 'usfl_links':
                                $boundDBTable = 'usfl_taglinks';
                                $boundLinkId = $_POST['id'];
                                $newTags = json_decode($_POST['info'])->tags;

                                // Удалить все связи где link_id = $_POST['id']
                                $stmtBound = mysqli_prepare($link, "DELETE FROM $boundDBTable WHERE link_id=?");
                                $stmtBound->bind_param('i', $boundLinkId);

                                if (mysqli_stmt_execute($stmtBound)) {
                                    //echo "Связь добавлена.\n";
                                } else {
                                    print_r($stmtBound->errorInfo());
                                }
                                mysqli_stmt_close($stmtBound);


                                // Создать новые связи по всем тегам из $newTags
                                for ($i = 0; $i < count($newTags); $i++)
                                {
                                    $boundTagId = $newTags[$i]->id;
                                    $stmtBound = mysqli_prepare($link, "INSERT INTO $boundDBTable(tag_id, link_id) VALUES (?,?)");
                                    $stmtBound->bind_param('ii', $boundTagId, $boundLinkId);

                                    if (mysqli_stmt_execute($stmtBound)) {
                                        //echo "Связь добавлена.\n";
                                    } else {
                                        print_r($stmtBound->errorInfo());
                                    }
                                    mysqli_stmt_close($stmtBound); // закрываем запрос
                                }

                                break;
                            case 'usfl_tags':
                                $boundDBTable = 'usfl_taglinks';
                                $boundTagId = $_POST['id'];
                                // Найти все связи Ссылок с тегом из $_POST['id']
                                $stmtBound = mysqli_prepare($link, "SELECT link_id FROM $boundDBTable WHERE tag_id=?");
                                $stmtBound->bind_param('i', $boundTagId);

                                // Найти все записи, содержащие линк с этим тегом. Поместить результат в переменую.
                                if (mysqli_stmt_execute($stmtBound)) {
                                    changeTagsInLinks($stmtBound, $link);
                                } else {
                                    print_r($stmtBound->errorInfo());
                                }

                                mysqli_stmt_close($stmtBound); // закрываем запрос
                                break;
                            default:
                                break;
                        };
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

                $stmt = mysqli_prepare($link, "DELETE FROM $mainDBTable WHERE id=?");
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
        $newRecordTitle = trim($tendINFO->title);
        if (empty($newRecordTitle)) {
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

            $codedTitle = iconv("utf-8", "windows-1251", $newRecordTitle); // смена кодировки

            switch ($_POST['db']) {
                case 'usfl_tags':
                    $stmt = mysqli_prepare($link, "INSERT INTO $mainDBTable(title) VALUES (?)"); // создание строки запроса
                    $stmt->bind_param('s', $codedTitle);
                    break;
                case 'somenew':
                    echo "i равно 1";
                    break;
                default:
                    $codedInfo = iconv("utf-8", "windows-1251", $_POST['info']);
                    $stmt = mysqli_prepare($link, "INSERT INTO $mainDBTable(title, info) VALUES (?, ?)"); // создание строки запроса
                    $stmt->bind_param('ss', $codedTitle, $codedInfo);
                    break;
            };



            if (mysqli_stmt_execute($stmt)) { // выполнение подготовленного запроса
                echo "Запись добавлена";


                switch ($_POST['db']) {
                    case 'usfl_links':
                        $boundLinkId = $link->insert_id;
                        $boundDBTable = 'usfl_taglinks';

                        $newTags = json_decode($_POST['info'])->tags;

                        for ($i = 0; $i < count($newTags); $i++)
                        {
                            $boundTagId = $newTags[$i]->id;
                            $stmtBound = mysqli_prepare($link, "INSERT INTO $boundDBTable(tag_id, link_id) VALUES (?,?)");
                            $stmtBound->bind_param('ii', $boundTagId, $boundLinkId);

                            if (mysqli_stmt_execute($stmtBound)) { // выполнение подготовленного запроса
//                            echo "Связь добавлена.\n";
                            } else {
                                print_r($stmtBound->errorInfo());
                            }
                            mysqli_stmt_close($stmtBound); // закрываем запрос
                        }

                        break;
                    default:
                        break;
                };
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


// Print JSON from STR
function showAsJson($result, $type)
{

    print '{ "'.$type.'": ['."\r\n";
    $teller = 0;
    while ($row = $result->fetch_array(MYSQLI_NUM))
    {
        $teller++;
        $Id = '"id": '.$row[0].",\r\n";
        $Title = '"title": "'.iconv("windows-1251","utf-8", $row[1]).'"';
        count($row) == 2 ? $Title .= "\r\n" : $Title .= ",\r\n";


        print "{"."\r\n";
        print "$Id";
        print "$Title";
        // если в info что-то есть
        if (!empty($row[2])) {
            $Info = '"info": '.iconv("windows-1251","utf-8", $row[2])."\r\n";
            print "$Info";
        }
        if($result->num_rows !== $teller) {
            print "},"."\r\n";
        } else {
            print "}"."\r\n";
        }

    }
    print ']'."\r\n";
    print '}'."\r\n";
}

function changeTagsInLinks($request, $link) {
//    echo "changeTagsInLinks";
    $tendINFO = json_decode($_POST['info']);
    $newRecordTitle = trim($tendINFO->title);


    $result = $request->get_result();
    $boundedLinksID = [];
    while ($row = $result->fetch_array(MYSQLI_NUM))
    {
        array_push($boundedLinksID, $row[0]);
    }
    // Для каждой Ссылки сделать выборку всей её инфы
    for ($i = 0; $i < count($boundedLinksID); $i++)
    {
        $linkId = $boundedLinksID[$i];
        $stmtBoundedLink = mysqli_prepare($link, "SELECT * FROM `usfl_links` WHERE id=?");
        $stmtBoundedLink->bind_param('i', $linkId);
        if (mysqli_stmt_execute($stmtBoundedLink)) {
            $result = $stmtBoundedLink->get_result();
            $linkInfo = $result->fetch_array(MYSQLI_NUM);


            $linkInfo__Info = json_decode(iconv("windows-1251","utf-8", $linkInfo[2]));
            $linkInfo__InfoTags = $linkInfo__Info->tags;
            // Пройтись по всем тегам, подменить искомый и сделать апдейт записи
            for($z = 0; $z < count($linkInfo__InfoTags); $z++)
            {
                if ($linkInfo__InfoTags[$z]->id == $_POST['id']) {
                    $linkInfo__InfoTags[$z]->title = $newRecordTitle;
                }
            }

            $linkInfo__codedTitle = iconv("utf-8","windows-1251", $linkInfo__Info->title);
            $linkInfo__codedInfo = iconv("utf-8","windows-1251", json_encode($linkInfo__Info, JSON_UNESCAPED_UNICODE));

            $stmtBoundedLinkUpdated = mysqli_prepare($link, "UPDATE `usfl_links` SET title=?, info=? WHERE id=?");
            $stmtBoundedLinkUpdated->bind_param('ssi', $linkInfo__codedTitle, $linkInfo__codedInfo, $linkId);
            if (mysqli_stmt_execute($stmtBoundedLinkUpdated))
            {
                // success
            }
            else {
                print_r($stmtBoundedLinkUpdated->errorInfo());
            }
            mysqli_stmt_close($stmtBoundedLinkUpdated); // закрываем запрос

        } else {
            print_r($stmtBoundedLink->errorInfo());
        }
        mysqli_stmt_close($stmtBoundedLink); // закрываем запрос

    }



}

// Устарело
function changeObjEncode($encodedObj, $fromEncode, $toEncode) {

    $newConvertedObj = new stdClass();

    $newConvertedObj->title  = $encodedObj->title;
//    $newConvertedObj->title  = iconv($fromEncode, $toEncode, $encodedObj->title);
    $newConvertedObj->description  = iconv($fromEncode, $toEncode, $encodedObj->description);
    $newConvertedObj->url = iconv($fromEncode, $toEncode, $encodedObj->url);
    $newConvertedObj->tags = $encodedObj->tags;

    echo "newConvertedObj \r\n";
    print_r($newConvertedObj);
    echo "\r\n";
    return $newConvertedObj;
}

// useless
function dbSwitcher($type) {
    $mainDBTable = $type;
}

