<?php
$img = $_POST['test'];
$image = $_POST['image'];
$filedir = $_POST['filedir'];
$name = 1;
$image = str_replace('data:image/png;base64,', '', $image);
$decoded = base64_decode($image);


file_put_contents('img/img.svg', $img);
file_put_contents('img/' . $name . '.png', $decoded, LOCK_EX);


   echo $image;
?>