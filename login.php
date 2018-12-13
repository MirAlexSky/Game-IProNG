<?php 

	require_once("vendor/autoload.php");

	$userName = $_COOKIE['userName'];
	if ($userName != "") {
		header('Location: game.php');
	}

	$loader = new Twig_Loader_Filesystem('/');
	$twig = new Twig_Environment($loader);
	$template = $twig->load('login.html');

	echo $template->render();


?>