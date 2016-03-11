<?php
$imgPreactive = $_POST['preactive'];

file_put_contents('img/imgPreactive.svg', $imgPreactive);
?>