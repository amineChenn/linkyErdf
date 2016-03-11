<?php
$imgTension = $_POST['tension'];

file_put_contents('img/imgTension.svg', $imgTension);
?>