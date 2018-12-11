<?php

$mysqli = new mysqli('localhost', 'root', '', 'iprong');

if ($mysqli->connect_errno) {
	die('Проблемы с подключение к базе данных: ' . $mysqli->connect_errno . " /n" . $mysqli->connect_error);
} 

?>