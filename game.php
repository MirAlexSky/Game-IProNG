<?php 

require_once('vendor/autoload.php');
require_once('twig_helper.php');

$tmp = createTmp('game.html');

echo $tmp->render();

?>