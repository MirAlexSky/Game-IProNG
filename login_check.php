<?php

include_once('connect.php');
include_once('twig_helper.php');

/* 
 * We find out, whether name is in the POST
 * if it is, initing user via POST['name]
 * else, do it via cookies
 */
if ( isset($_POST['name']) ) {
	$user = initUser();
 } else {
	$user = loadUser();
	if ($user == null) {
		header('Location: login.php');
	}
 }

// Fetch values
$name =  $user['name'];
$photo = $user['photo'];
$score = $user['score'];
 
// Current user
setcookie('userName', $name);
$currentUser = $name;

$twigtmp = iniTmp('preMenu.twig');

echo $twigtmp->render(array(
	"name"      => $name,
	"photoPath" => $photoFullName, 
	"score"     => $score,
));

// Get user via POST
function initUser() {
	$name =  $_POST['name'];
	$photo = $_FILES['photo'];
	
	// Find out, whether this user is already in the DB
	// If he isn't, create new user 
	// If he is, load that user
	$qUser = $mysqli->query("Select login, photo, score from game where login = '$name'");
	
	if ($qUser->num_rows == 0) {
	
		// Loading photo
		$photoFullName = "images/default.png";
	
		if ($photo['error'] == UPLOAD_ERR_OK) {
			$photoDir = 'images/profile';
	
			$tmp_name = $photo['tmp_name'];
			$photoName = basename($photo['name']);
			$photoFullName = $photoDir . $photoName;
		
			move_uploaded_file($tmp_name, $photoFullName);
		}
		
		$mysqli->query("INSERT into game (login, photo, score) values ('$name', '$photoFullName', 0)");

		$qUser = $mysqli->query("Select login, photo, score from game where login = '$name'");
	}
	
	$user = $qUser->fetch_assoc();
	return $user;
 }


// Get user via cookies
function loadUser() {
	if (!isset($_COOKIE['userName'])) {
		return null;
	}

	$name = $_COOKIE['userName'];

	$qUser = $mysqli->query("Select login, photo, score from game where login = '$name'");
	$user = $qUser->getch_assoc();

	return $user;
 }

?>