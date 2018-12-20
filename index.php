<?php

require_once('vendor/autoload.php');
require_once('twig_helper.php');

$tmp = createTmp('intro.html');

echo $tmp->render();

?>