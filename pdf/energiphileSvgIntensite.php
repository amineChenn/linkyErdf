<?php

$imgIntensite = $_POST['intensite'];

file_put_contents('img/imgIntensite.svg', $imgIntensite);
?>