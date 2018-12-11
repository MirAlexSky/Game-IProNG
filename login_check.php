<?php
include_once('connect.php');

$name = $_POST['name'];
$photo = $_FILES['photo'];

// Проверяем, существует ли уже такой пользователь
// Если нет, создаём и приветствуем
// Если да, приветствуем и 
// сообщаем ему его лучший результат
$qSameUser = $mysqli->query("Select login from game where login = '$name'");

if ($qSameUser->num_rows == 0) {

	// загружаем фотографию
	$photoFullName = "images/default.png";

	if ($photo['error'] == UPLOAD_ERR_OK) {
		$photoDir = 'images/';

		$tmp_name = $photo['tmp_name'];
		$photoName = basename($photo['name']);
		$photoFullName = $photoDir . $photoName;
	
		move_uploaded_file($tmp_name, $photoFullName);
	}
	
	$result = $mysqli->query("INSERT into game (login, photo, score) values ('$name', '$photoFullName', 0)");

	if (!$result) {
		die('Что то пошло не так');
	}
}

// текущий игрок
setcookie('userName', $name);
$currentUser = $name;

?>

<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Document</title>
</head>
<body>
	
</body>
</html>
