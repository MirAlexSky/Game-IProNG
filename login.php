<?php 

	require_once("vendor/autoload.php");

	if (isset($_COOKIE['userName'])) {
		header('Location: game.php');
	}

	$loader = new Twig_Loader_Filesystem('/');
	$twig = new Twig_Environment($loader);
	$template = $twig->load('login.html');

	echo $template->render();


?>