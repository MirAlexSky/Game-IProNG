'use strict'



// контроль таймеров 
var timeouts = [];
var intervals = [];

window.setMyInterval = function(name, callback, time) {
	const interval = window.setInterval(callback, time);
	intervals.push({
		"name": name,
		"callback": callback,
		"time": time,
		"handler": interval
	});
	return interval;
};	

window.setMyTimeout = function(name, callback, time) {
	const timeout = window.setTimeout(callback, time);	
	timeouts.push({
		"name": name,
		"callback": callback,
		"time": time,
		"handler": timeout
	});
	return timeout;
};

window.clearMyInterval = function(interval) {
	window.clearInterval(interval);
	for (var int of intervals) {
		if (int.handler === interval) {intervals.splice(intervals.indexOf(int), 1);}
	}
};

window.clearMyTimeout = function(timeout) {
	window.clearTimeout(timeout);
	for (var tout of timeouts) {
		if (tout.handler === timeout) {timeouts.splice(timeouts.indexOf(tout), 1);}
	}
};

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
};

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

var loadInterval; // интервал проверки загрузки

$(function() {
	canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');

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

	loadInterval = setMyInterval('loadInterval', loadGame, 1000);
});

/*
 * Раз в секунду мы проверяем
 * загрузились ли картинки.
 * Если загрузились, то начинаем игру
 */
function loadGame() {

	for (var obj in gameObjectLoad) {
		if (!obj) {return;}
	}

	clearMyInterval(loadInterval); // это нам больше не нужно
	startGame();
}

function startGame() {

	setMyInterval("draw", draw, 3); // рисуем холст 20 кадров в секунду
	startEnimies(); // Запускаем снеговиков!
}

// переменные для работы с холстом
var 
	countHero = 1, 			// счётчик позиции спрайта героя
	height = 128,		// высота спрайтов в каждой позиции
	heightNow = 0;

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);

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
			ctx.arc(x, y, 5, 0, Math.PI * 2, false);
			ctx.fill();
		}
		ctx.closePath();
	}
}

// смена спрайтов анимации героя
var heraFrameTimeout;
function moveHeroFrame() {
	if (moveNowHero) {
		countHero = (countHero + 1) % 3;
		heightNow = countHero * height;

		clearMyTimeout(heraFrameTimeout);
		heraFrameTimeout = setMyTimeout("frameHero",moveHeroFrame, 100);
	} else {
		countHero = 0;
		heightNow = 0;
		clearMyTimeout(heraFrameTimeout);
	}
}

// hero moving
var moveTimeout;
function startMove() {
	if (!moveNowHero) {
		clearMyTimeout(moveTimeout);
		return;
	}

	positionHero[0] += currentDirHero[0];
	positionHero[1] += currentDirHero[1];

	clearMyTimeout(moveTimeout);
	moveTimeout = setMyTimeout("moveHero", startMove, 3);

}

document.onkeydown = function(even) {

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

		if (bullet.x > canvas.width) {
			bullets.splice(bullets.indexOf(bullet), 1);
			delete bullet;
			return;
		}

		for (var i = 0; i < enemies.length; i++) {
			if ((bullet.x > enemies[i].x) && (bullet.x < enemies[i].x + 128) &&
				(bullet.y > enemies[i].y) && (bullet.y < enemies[i].y + 128)) {

					enemies.splice(i, 1);
					bullets.splice(bullets.indexOf(bullet), 1);
					console.log('убит, бич');
					return;
			}
		}
	
		bullet.x++;

		setMyTimeout("bulletAnim", move, 5);
	};
	move();
}

// shooting
var timeoutShoot;
function startShoot() {
	shootNowHero = true;

	var shoot = function() {
		if (!shootNowHero) {return;}

		// новый снаряд в текущей позиции
		// добавляем его в массив снарядов
		var bullet = new Bullet(positionHero[0] + 125, positionHero[1] + 40);
		bullets.push(bullet);

		// запускаем анимацию пули
		moveBullet(bullet);

		// пока пробел зажат, стреляем
		timeoutShoot = setMyTimeout("shooting", shoot, 500);
	};
	shoot();
}

function stopShoot() {
	clearMyTimeout(timeoutShoot);
	shootNowHero = false;
}

// Запускаем снеговиков, 
// каждую секунду появляется новый снеговик
var runEnemies;
function startEnimies() {

	runEnemies = setMyInterval("runEnemies", function() {
		var posY = ~~(Math.random() * canvas.height);
		if (posY > canvas.height - 150) {
			posY -= 150;
		} else if (posY < 30) {
			posY += 30;
		}

		var enemy = {
			"x": canvas.width,
			"y": posY,
			"heightNow": 0,
			"count": 0,
		};
		enemies.push(enemy);

		animSnowMan(enemy);
	}, 1000);

}

// snowman's move animation
function animSnowMan(snowMan) {

	// перемещение врагов по оси y
	/* 
	var originY = snowMan.y;
	var stepY = ~~(Math.random() * 10) - 5;
	*/
	
	// Кадры
	var moveFrame = function() {
		if (enemies.indexOf(snowMan) == -1) {return;}


		snowMan.heightNow = snowMan.count * height;	
		snowMan.count = (snowMan.count + 1) % 8;

		setMyTimeout("enemyFrame", moveFrame, 80);
	};

	// положение
	var moveDist = function() {
		if (enemies.indexOf(snowMan) == -1) {return;}

		//console.log(snowMan);

		if (snowMan.x < -100) {
			enemies.splice(enemies.indexOf(snowMan), 1);
			return;
		}

		snowMan.x--;	

		// Перемещение по y
		// if (stepY < 0) {
		// 	snowMan.y--;
		// } else {
		// 	snowMan.y++;
		// }

		// if ((snowMan.y - originY < -50) || (snowMan.y - originY > 50)) {
		// 	stepY = -stepY;
		// }

		setMyTimeout("enemyMove", moveDist, 5);
	};

	moveDist();
	moveFrame();
}

