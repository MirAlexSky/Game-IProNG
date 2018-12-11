<?php

?>

<!DOCTYPE html>
<html lang="en">
<?php 
	$userName = $_COOKIE['userName'];
	if ($userName != "") {
		header('Location', 'game.php');
	}

?>

<link rel="stylesheet" href="css/font_style.css">
<link rel="stylesheet" href="css/base_style.css">
<link rel="stylesheet" href="css/header_style.css">
<link rel="stylesheet" href="css/login.style.css">

<head>
	<meta charset="UTF-8">
	<title>Login</title>
</head>

<body>
	<div class="container">

		<form action="login_check.php" method="POST" name="login" enctype="multipart/form-data">
			<p>
				<input type="text" name="name" placeholder="Имя">
			</p>
			<label>
				Выберите себе аватар
				<input type="file" accept="image/*" name="photo">
			</label>
			<input type="submit" name="submit" value="В бой!">
		</form>

	</div>

	<script src="/public/scripts/login.js"></script>
</body>

</html>