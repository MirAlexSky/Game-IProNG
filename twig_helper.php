<?php
	
 // Create menu pattern via Twig
 function createTmp($fileName) {
	$loader = new Twig_Loader_Filesystem('/');
	$twig = new Twig_Environment($loader);
	$template = $twig->load($fileName);

	return $template;
}

?>