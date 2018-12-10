<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>Login</title>
</head>
<body>

<?php
include_once('connect.php');

$name = $_POST['name'];

// Проверяем, существует ли уже такой пользователь
// Если нет, создаём и приветствуем
// Если да, приветствуем и 
// сообщаем ему его лучший результат
$qSameUser = $mysqli->query("Select login from game where login = '$name'");

if ($qSameUser->num_rows == 0) {
	
	$result = $mysqli->query("INSERT into game (login, score) values ('$name', 0)");

	if (!$result) {
		die('Что то пошло не так');
	}
}

$currentUser = $name;

?>

</body>
</html>