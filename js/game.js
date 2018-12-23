'use strict'


// библиотека соответсвий клавиш управления с их кодами
var dirChar = {
	"upL":    "w",
	"upA":    'ArrowUp',
	"rightL": "d",
	"rightA": 'ArrowRight',
	"downL":  "s",
	"downA":  'ArrowDown',
	"leftL":  "a",
	"leftA":  'ArrowLeft'
};

// Нажата ли опр. клавиша
var keyIsDown = {
	"toUp":    false,
	"toRight": false,
	"toDown":  false,
	"toLeft":  false
}

// изменение координат всоответствии с направлением
var dir = {
	"toUp": [0, -1],
	"toRight": [1, 0],
	"toDown": [0, 1],
	"toLeft": [-1, 0],
};

// загружаемые объекты
var gameObjectLoad = {
	'hero': false,
	'snowMan': false,
	'back': false,
	'snowball': false,
};

// Элементы меню
var menu = [
	{
		"name": "pause",
		"width": "30",
		"height": "30",
		"x": "return canvas.width - this.width - 10",
		"y": 10,
	}
];

var 
	currentDirHero = [0, 0],
	positionHero = [50, 50],
	moveNowHero = false,
	shootNowHero = false,
	bullets = [],
	enemies = [];

var 
	ctx,
	imgHero,
	imgSnowMan,
	canvas;

var 
	backPattern,
	snowballImg;

var 
	fails = 0;

var 
	gameOnPause = false;


var loadInterval; // интервал проверки загрузки

$(function() {
	canvas = document.getElementById('canvasGame');
	ctx = canvas.getContext('2d');

	$('.pause').click(function() {
		$(this).toggleClass("resume");
		
		if ($(this).hasClass('resume')) {
			$(this).html("Продолжить");
			pauseGame();
		} else {
			$(this).html("Пауза");
			resumeGame();
		}
	});


	// загрузка героя
	imgHero = new Image();
	imgHero.addEventListener('load', function() {
		gameObjectLoad.hero = true;
	});
	imgHero.src = '/images/spriteHero.png';

	// загрузка снеговика
	imgSnowMan = new Image();
	imgSnowMan.addEventListener('load', function() {
		gameObjectLoad.snowMan = true;
	});
	imgSnowMan.src = '/images/spriteSnowmanX8.png';

	loadInterval = setInterval(loadGame, 1000);

	var backImg = new Image();
	backImg.addEventListener('load', function() {

		backPattern = ctx.createPattern(backImg, 'repeat');

		gameObjectLoad.back = true;
	});
	backImg.src = '/images/snow.jpg';

	snowballImg = new Image();
	snowballImg.addEventListener('load', function() {
		gameObjectLoad.snowball = true;
	});
	snowballImg.src = '/images/snowball.png';

});

/*
 * Раз в секунду мы проверяем
 * загрузились ли картинки.
 * Если загрузились, то начинаем игру
 */
function loadGame() {

	for (var obj in gameObjectLoad) {
		console.log(gameObjectLoad[obj]);
		if (!gameObjectLoad[obj]) {return;}
	}

	clearInterval(loadInterval); // это нам больше не нужно
	startGame();
}

var 
	drawInterval;

function startGame() {

	drawInterval = setInterval(draw, 3); // рисуем холст 20 кадров в секунду
	startEnimies(); // Запускаем снеговиков!
}

// переменные для работы с холстом
var 
	countHero = 1, 			// счётчик позиции спрайта героя
	height = 128,		// высота спрайтов в каждой позиции
	heightNow = 0;

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	ctx.save();
	ctx.fillStyle = backPattern;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.restore();
	
	// рисукм героя
	ctx.drawImage(imgHero, 0, heightNow, 128, height, positionHero[0], positionHero[1], 128, height);

	// рисуем снеговиков
	for (var i = 0; i < enemies.length; i++) {
		ctx.drawImage(imgSnowMan, 0, enemies[i].heightNow, 128, height, enemies[i].x, enemies[i].y, 128, height);
	}

	// рисуем снаряды
	for (var i = 0; i < bullets.length; i++) {
		var x = bullets[i].x;
		var y = bullets[i].y;

		ctx.beginPath();
		{
			ctx.drawImage(snowballImg, bullets[i].x,  bullets[i].y, 20, 20);
		}
		ctx.closePath();
	}
}

// смена спрайтов анимации героя
var heraFrameTimeout;
function moveHeroFrame() {
	if (gameOnPause) {return;}

	if (moveNowHero) {
		countHero = (countHero + 1) % 3;
		heightNow = countHero * height;

		clearTimeout(heraFrameTimeout);
		heraFrameTimeout = setTimeout(moveHeroFrame, 100);
	} else {
		countHero = 0;
		heightNow = 0;
		clearTimeout(heraFrameTimeout);
	}
}

// hero moving
var moveHeroTimeout;
function startMove() {
	if (!moveNowHero) {
		clearTimeout(moveHeroTimeout);
		return;
	}

	if (gameOnPause) {return;}

	if ((positionHero[0] + currentDirHero[0] < -20) || (positionHero[1] + currentDirHero[1] < -20) ||
		(positionHero[0] + currentDirHero[0] + 128 > canvas.width + 20) || (positionHero[1] + currentDirHero[1] + 128 > canvas.height + 20)) {
		clearTimeout(moveHeroTimeout);
		moveHeroTimeout = setTimeout(startMove, 3);
		return;
	}

	positionHero[0] += currentDirHero[0];
	positionHero[1] += currentDirHero[1];

	clearTimeout(moveHeroTimeout);
	moveHeroTimeout = setTimeout(startMove, 3);

}

document.onkeydown = function(even) {
	event.preventDefault();

	if (gameOnPause) {
		return;
	}

	switch (even.key) {
		case dirChar.upA: 
		case dirChar.upL:
			keyIsDown.toUp = true;
			break;
		case dirChar.rightA: 
		case dirChar.rightL: 
			keyIsDown.toRight = true;
			break;
		case dirChar.downA: 
		case dirChar.downL: 
			keyIsDown.toDown = true;
			break;
		case dirChar.leftA: 
		case dirChar.leftL: 
			keyIsDown.toLeft = true;
			break;
		case " ": 
			//key space it is fire
			if (!shootNowHero) {startShoot();}
			return;
		default: 
			return;
	}
	setDirection();
};

document.onkeyup = function(even) {

	if (gameOnPause) {
		return;
	}

	switch (even.key) {
		case dirChar.upA: 
		case dirChar.upL:
			keyIsDown.toUp = false;
			break;
		case dirChar.rightA: 
		case dirChar.rightL: 
			keyIsDown.toRight = false;
			break;
		case dirChar.downA: 
		case dirChar.downL: 
			keyIsDown.toDown = false;
			break;
		case dirChar.leftA: 
		case dirChar.leftL: 
			keyIsDown.toLeft = false;
			break;
		case " ": 
			//key space it is fire
			stopShoot();
			return;
		default: 
			return;
	}
	setDirection();
};


function setDirection() {

	currentDirHero = [0, 0];

	if (keyIsDown.toUp) {
		currentDirHero[0] += dir.toUp[0];
		currentDirHero[1] += dir.toUp[1];
	} 
	if (keyIsDown.toRight) {
		currentDirHero[0] += dir.toRight[0];
		currentDirHero[1] += dir.toRight[1];
	} 
	if (keyIsDown.toDown) {
		currentDirHero[0] += dir.toDown[0];
		currentDirHero[1] += dir.toDown[1];
	} 
	if (keyIsDown.toLeft) {
		currentDirHero[0] += dir.toLeft[0];
		currentDirHero[1] += dir.toLeft[1];
	}

	if (currentDirHero[0] == 0 && currentDirHero[1] == 0) {
		moveNowHero = false;
	} else if (!moveNowHero) {
		moveNowHero = true;
		startMove();
		moveHeroFrame();
	}
	
}

function Bullet(posX, posY) {
	this.x = posX;
	this.y = posY;
}

function moveBullet(bullet) {

	var move = function() {
		if (bullets.indexOf(bullet) == -1) {return;}

		if (gameOnPause) {return;}

		if (bullet.x > canvas.width) {
			bullets.splice(bullets.indexOf(bullet), 1);
			return;
		}

		for (var i = 0; i < enemies.length; i++) {
			if ((bullet.x > enemies[i].x) && (bullet.x < enemies[i].x + 128) &&
				(bullet.x + 20 > enemies[i].x) && (bullet.x + 20 < enemies[i].x + 128) &&
				(bullet.y > enemies[i].y) && (bullet.y < enemies[i].y + 128) &&
				(bullet.y + 20 > enemies[i].y) && (bullet.y + 20 < enemies[i].y + 128)) {

					enemies.splice(i, 1);
					bullets.splice(bullets.indexOf(bullet), 1);
					return;
			}
		}
	
		bullet.x++;

		setTimeout(move, 5);
	};
	move();
}

// shooting
var timeoutShoot;
function startShoot() {
	shootNowHero = true;

	var shoot = function() {
		if (!shootNowHero) {return;}

		if (gameOnPause) {return;}

		// новый снаряд в текущей позиции
		// добавляем его в массив снарядов
		var bullet = new Bullet(positionHero[0] + 115, positionHero[1] + 30);
		bullets.push(bullet);

		// запускаем анимацию пули
		moveBullet(bullet);

		// пока пробел зажат, стреляем
		timeoutShoot = setTimeout(shoot, 500);
	};
	shoot();
}

function stopShoot() {
	clearTimeout(timeoutShoot);
	shootNowHero = false;
}

// Запускаем снеговиков, 
// каждую секунду появляется новый снеговик
var runEnemies;
function startEnimies() {

	runEnemies = setInterval(function() {

		var posY = ~~(Math.random() * canvas.height);
		if (posY > canvas.height - 150) {
			posY -= 150;
		} else if (posY < 50) {
			posY += 50;
		}

		
		// перемещение врагов по оси y
		var originY = posY;
		var stepY = ~~(Math.random() * 10) - 5;

		if (stepY == 0) {stepY++;}

		var enemy = {
			"originY": originY,
			"stepY": stepY,
			"x": canvas.width,
			"y": posY,
			"heightNow": 0,
			"count": 0,
		};
		enemies.push(enemy);

		animSnowMan(enemy);
	}, 2000);

}

// snowman's move animation
var 
	enemyFrame,
	enemyMove;

function animSnowMan(snowMan) {

	// Кадры
	var moveFrame = function() {
		if (enemies.indexOf(snowMan) == -1) {return;}

		if (gameOnPause) {return;}

		snowMan.heightNow = snowMan.count * height;	
		snowMan.count = (snowMan.count + 1) % 8;

		enemyFrame = setTimeout(moveFrame, 80);
	};

	// положение
	var moveDist = function() {
		if (enemies.indexOf(snowMan) == -1) {return;}

		if (gameOnPause) {return;}

		if (snowMan.x < -100) {
			fail();
			enemies.splice(enemies.indexOf(snowMan), 1);
			return;
		}

		snowMan.x--;	

		// Перемещение по y

		if (snowMan.stepY < 0) {
			snowMan.y--;
		} else {
			snowMan.y++;
		}

		if ((snowMan.y - snowMan.originY < -50) || (snowMan.y - snowMan.originY > 50)) {
			snowMan.stepY = -snowMan.stepY;
		}

		enemyMove = setTimeout(moveDist, 5);
	};

	moveDist();
	moveFrame();
}

function fail() {
	fails++;

	if (fails > 2) {
		gameOver();
	}
}

function gameOver() {
	pauseGame();

	ctx.font = "48px serif";
	ctx.fillText("Вы проиграли", canvas.width/2 - 100, canvas.height / 2 - 100);

	$('.pause').hide();
}

function pauseGame() {
	gameOnPause = true;

	clearTimeout(heraFrameTimeout);
	clearTimeout(moveHeroTimeout);

	clearInterval(runEnemies);

	clearInterval(drawInterval);
}

function resumeGame() {
	gameOnPause = false;

	drawInterval = setInterval(draw, 3);

	for (var prop in keyIsDown) {
		keyIsDown[prop] = false;
	}
	setDirection();

	enemies.forEach( function(item, i, arr) {
		animSnowMan(item);
	});

	bullets.forEach( function(item, i, arr) {
		moveBullet(item);
	});

	startEnimies();

}

