<?php

$img = $_POST['test'];

file_put_contents('img/img.svg', $img);

?>