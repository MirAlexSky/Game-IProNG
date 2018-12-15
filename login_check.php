<?php
include_once('connect.php');

 if ($_SERVER['HTTP_REFERER'] == 'http://iprong/login.php') {
	initUser();
 } else {
	 loadUser();
 }


 function initUser() {
	$name = $_POST['name'];
	$photo = $_FILES['photo'];
	
	// Проверяем, существует ли уже такой пользователь
	// Если нет, создаём и приветствуем
	// Если да, приветствуем и 
	// сообщаем ему его лучший результат
	$qSameUser = $mysqli->query("Select login, photo, score from game where login = '$name'");
	
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
	
		// текущий счёт = 0
		$score = 0;
	} else {
		$users = $qSameUser->fetch_assoc();
	
		$photoFullName = $users['photo'];
		$score = $users['score'];
	}
 }

 function loadUser() {
	$name = $_COOKIE['userName'];
	$qSameUser = $mysqli->query("Select login, photo, score from game where login = '$name'");
 }

// текущий игрок
setcookie('userName', $name);
$currentUser = $name;

$twigtmp = iniTmp();
echo $twigtmp->render(array(
	"photoPath" => $photoFullName, 
	"score" => $score));

function iniTmp() {
	require_once("vendor/autoload.php");

	$loader = new Twig_Loader_Filesystem('/');
	$twig = new Twig_Environment($loader);
	$template = $twig->load('preMenu.twig');

	return $template;
}

?>