<?php
$imgEnergie = $_POST['energie'];

file_put_contents('img/imgEnergie.svg', $imgEnergie);
?>