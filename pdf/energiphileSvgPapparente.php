<?php
$imgPapparente = $_POST['papparente'];

file_put_contents('img/imgPapparente.svg', $imgPapparente);
?>