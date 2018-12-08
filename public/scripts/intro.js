'use strict'

let btnNext;
let textDescribe;
let describes = [
	"Добро пожаловать, добро пожаловать в Сити-2019! " +
	"Город наступающего года, здесь вы найдёте счастье!",
	"У нас тут всё тихо и спокойно, на дворе зима," +
		"все в предвкушении нового года, снеговики в каждом дворе...", 
	"...о боже, кажется что то происходит...", 
	"Древнее зло пробудилось, на наш с вами драгоценный " +
		"Новй Год покусился дьявольски злой СнегоДЯД" +
		" (Снежный Древный Яростный Димон)",
	"Предупреждаю, он умеет оживлять снеговиков!",
	"Ну.. Кажется, тебе предстоит противостоять ему, Удачи!",
	"Стой! Зхвати вот это, я спроектировал его на кануне...",
	"...*Даёт какую-то штуковину*...",
	"Я назвал это ТеплоГрейка, нет времени объяснять, " +
	"просто растопи ей оживших снеговиков!"
];

let descStep = 0;
let btnStart;

$(function() {
	btnNext= $('.btn_next');
	textDescribe = $('.describe_text');
	btnStart = $('.start');

	btnNext.click(nextDescribe);

	btnStart.click(function() {
		$('.describe').show();
		btnStart.hide();
		nextDescribe();
	});
});

function typeText(text) {
	let i = 0;

	btnNext.hide();
	console.log('btn is hide');

	let typeing = function() {
		if (text.length > i) {
			textDescribe.append(text[i]);
			i++;
			setTimeout(typeing, 1);
		} else {

			if (descStep != describes.length) {
				btnNext.show();
			} else {
				$(".btnGO").show();
			}
		}
	}

	typeing();
}

function nextDescribe() {
	textDescribe.text("");
	typeText(describes[descStep]);
	descStep++;


}
