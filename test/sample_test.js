/*
usage

первый запуск
gemini gather test/ - запустить все тесты из папки /test
gemini gather test/index_test.js - запустить один тест из папки /test

сравнить скрины + отчет в html
gemini test --reporter html test/
gemini test --reporter html test/index_test.js
*/

/*
сюда собираем элементы для теста, указываем .class, #id или <тег>,
и состояние, в котором надо проверить этот элемент, например:
#main	 							- plain
.banner 							- plain
.container .form-holder				- plain
	.skill .slide					- plain, hover, click
	<button type="submit">		 	- plain, hover, click
*/

var gemini = require('gemini');

gemini.suite('index page', function(parent) { //название родительского тест-сьюта, должно быть уникальным, в папке со скринами будет создана папка с таким же названием
    //данный набор захватывает разные элементы на одной и той же странице
        parent.setUrl('/index.html')  //линка на тестируемую страницу относительно адреса rootUrl в конфиг файле

		//находим и скриним элемент в дефолтном состоянии (plain)
        gemini.suite('banner', function(child) { //название дочернего тест-сьюта, должно быть уникальным в пределах родительского сьюта, эта папка создается в родительской
            child.setCaptureElements('.banner') //задаем область для скрина
                .capture('banner-plain'); //скриним элемент, название для папки со скринами для этого элемента, должно быть уникальным в пределах дочернего сьюта
		});

		//находим и скриним элемент в ховерном состоянии и на клик
        gemini.suite('dedicated-photo-thumb', function(child) {
            child.setCaptureElements('.dedicated-photo .thumb')
				.before(function(actions, find) {
					this.button = find('.dedicated-photo .thumb'); //перед выполнением сьюта, находим нужный элемент, чтобы потом не искать его каждый раз в пределах сьюта
				})
                .capture('dedicated-photo-thumb-plain') //скриним элемент в дефолтном состоянии
				.capture('dedicated-photo-thumb-hovered', function(actions, find) {
					actions.mouseMove(this.button) //скриним элемент в ховерном состоянии
					actions.wait(1500); //пауза нужна для того, чтобы ховер эффект гарантированно отработал
				})
				.capture('dedicated-photo-thumb-clicked', function(actions, find) {
					actions.click(this.button) //кликаем по элементу
					actions.wait(1000); //ждем секунду и скриним элемент
				}); //точка с запятой ставится только перед закрывающей фигурной скобкой
		}); //либо в конце сьюта

		//кнопки с дропом
        gemini.suite('button skill', function(child) {
            child.setCaptureElements('.skill') //перед .capture должна быть задана область, иначе будет ошибка, пока задаем любую
				//захватить кнопку с открытым дропом
				.capture('button skill clicked', function(actions, find) {
					actions.click('.skill') //кликаем на кнопку
					actions.wait(1500) //ждем 1.5 сек, чтобы дроп гарантированно выпал
					child.setCaptureElements('.skill', '.skill .slide'); //задаем область для скрина кнопка+дроп и скриним
				})
				.capture('skill drop-down link hovered', function(actions, find) {
					actions.mouseMove('.skill .slide li a'); //скриним линку на ховер в открытом дропе
				});
		});
});