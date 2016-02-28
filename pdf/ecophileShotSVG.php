<?php
$image = $_POST['image'];
$image = str_replace('data:image/png;base64,', '', $image);
$decoded = base64_decode($image);

file_put_contents('img/screenShotEcophile.png', $decoded, LOCK_EX);

?>