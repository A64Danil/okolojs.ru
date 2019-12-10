<?php

require_once 'connection.php'; // подключаем скрипт

function show($str)
{
    echo $str;
}

//$mainDBTable = 'usfl_links';


// Handle GET-request
// Get record by ID
if (isset($_GET['id'])) {

    if (!isset($_GET['db'])) {
        exit("Вы не указали имя db в параметрах GET-запроса");
    }
    else
    {
        // Узнать сколько баз запросили



        switch ($_GET['db']) {
            case 'usfl_links':
                $selectorSQL = 'usfl_links';
                $mainDBTable = 'usfl_links';
                $categoryDBTable = 'usfl_tags'; // кажется не нужно
                $boundDBTable = 'usfl_taglinks';
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
            switch ($selectorSQL) {
                case 'usfl_links':
                    $stmt = $mysqli->prepare("SELECT * FROM $mainDBTable WHERE `id`<? ORDER BY `id` DESC LIMIT ?");

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
            if (mysqli_connect_errno()) {
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


// useless
function dbSwitcher($type) {
    $mainDBTable = $type;
}

