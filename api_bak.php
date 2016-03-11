<?php

// get the HTTP method, path and body of the request
$method = $_SERVER['REQUEST_METHOD'];
$request = explode('/', trim($_SERVER['PATH_INFO'],'/'));

// connect to the mysql database
$link = mysqli_connect('192.168.0.100:47852', 'root', 'linky', 'ProjetERDF_BDD');
mysqli_set_charset($link,'utf8');

// retrieve the table and key from the path
$table = preg_replace('/[^a-z0-9_]+/i','',array_shift($request));
$key = array_shift($request)+0;

// create SQL based on HTTP method
//SELECT * FROM ProjetERDF_BDD.`Values`;
switch ($method) {
    case 'GET':
        $sql = "select * from `$table`".($key?" WHERE id=$key":''); break;
    case 'PUT':
        $sql = "update `$table` set $set where id=$key"; break;
    case 'POST':
        $sql = "insert into `$table` set $set"; break;
    case 'DELETE':
        $sql = "delete `$table` where id=$key"; break;
}

// excecute SQL statement
$result = mysqli_query($link,$sql);

// die if SQL statement failed
if (!$result) {
    http_response_code(404);
    die(mysqli_error($link));
}

// print results, insert id or affected row count
if ($method == 'GET') {
    if (!$key) echo '[';
    for ($i=0;$i<mysqli_num_rows($result);$i++) {

        echo ($i>0?',':'').json_encode(mysqli_fetch_object($result));

    }
    if (!$key) echo ']';
}
elseif ($method == 'POST') {
    echo mysqli_insert_id($link);
} else {
    echo mysqli_affected_rows($link);
}

// close mysql connection
mysqli_close($link);