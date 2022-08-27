function begin() {
	for(var i = 0; i < 64; i++) {												//рисуем 64 квадрата (8 строк на 8 столбцов)
		var newField = document.createElement('DIV');							//создаём новый элемент div (будущий квадратик)
		
		var numberRow = Math.floor(i / 8);										//numberRow - номер строки, начинается с 0
		
		var numberClass = (i + numberRow) % 2;									//устанавливаем атрибуты div: стиль (или серый, или тёмно-серый)
		newField.setAttribute('CLASS', 'field' + numberClass);
		
		var top = 10 * (numberRow + 1) + 70 * numberRow;						//устанавливаем атр. div: расст. по вертикали от края странички
		newField.style.top = top + "px";									

		var numberCol = i % 8;													//устанавливаем атр. div: расст. по горизонтали от края странички
		var left = 10 * (numberCol + 1) + 70 * numberCol; 						//numberCol - номер столбца, начинается с 0
		newField.style.left = left + "px";
		
		var id = 'field' + numberRow + '' + numberCol;							//устанавливаем атрибуты div: id
		newField.setAttribute('ID', id);

		if(numberClass == 1) {
			var jsFunction = 'recolourDiv(\'' + id + '\')';
			newField.setAttribute('ONMOUSEMOVE', jsFunction);
	
			jsFunction = 'returnColorDiv(\'' + id + '\')';
			newField.setAttribute('ONMOUSEOUT', jsFunction);
		}

		document.body.appendChild(newField);									//добавляем квадратик на страничку
	}
	
	var divButton1 = document.createElement('DIV');								//создаём новый элемент div
	divButton1.setAttribute('ID', 'divButton');									//задаём имя слоя для первой кнопки
	document.body.appendChild(divButton1);										//добавляем слой на страничку
	
	var button1 = document.createElement('INPUT');								//создаём новый интерактивный элемент
	button1.setAttribute('TYPE', 'button');										//указываем, что это кнопка
	button1.setAttribute('ID', 'buttonCancel');									//задаём имя кнопки (кнопка отмены хода)
	button1.setAttribute('VALUE', 'Отменить ход');								//текст на кнопке, видный пользователю
	button1.setAttribute('ONCLICK', 'cancel()');								//функция JS, запускаемая по клику на кнопку
	divButton1.appendChild(button1);											//добавляем кнопку на слой
	
	var divButton2 = document.createElement('DIV');								//создаём новый элемент div
	divButton2.setAttribute('ID', 'divButton');									//задаём имя слоя для второй кнопки
	divButton2.style.left = '120px';											//в отличие от первого, этот слой смещаем, чтобы кнопки
	document.body.appendChild(divButton2);										// не накладывались друг на друга; добавляем слой на страничку
	
	var button2 = document.createElement('INPUT');								//создаём новый интерактивный элемент
	button2.setAttribute('TYPE', 'button');										//указываем, что это кнопка
	button2.setAttribute('ID', 'buttonStart');									//задаём имя кнопки (кнопка старта)
	button2.setAttribute('VALUE', 'Старт');										//текст на кнопке, видный пользователю
	button2.setAttribute('ONCLICK', 'start()');									//функция JS, запускаемая по клику на кнопку
	divButton2.appendChild(button2);											//добавляем кнопку на слой
}

function start() {
	var listCheckersRows = [0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 5, 5, 5, 5, 6, 6, 6, 6, 7, 7, 7, 7];
	var listCheckersCols = [1, 3, 5, 7, 0, 2, 4, 6, 1, 3, 5, 7, 0, 2, 4, 6, 1, 3, 5, 7, 0, 2, 4, 6];
	var colorChecker = "blackChecker", WB = "B-";

	for(var i = 0; i < 24; i++) {
		var newChecker = document.createElement('DIV');
		newChecker.setAttribute('CLASS', 'border');
		
		var numberRow = listCheckersRows[i];
		var numberCol = listCheckersCols[i];
		var idField = "field" + numberRow + numberCol;
		var field = document.getElementById(idField);
		newChecker.style.top = "0px";						
		newChecker.style.left = "0px";
		
		if(i == 12) {
			colorChecker = "whiteChecker";
			WB = "W-";
		}
		
		var newCheckerA = document.createElement('DIV');
		newCheckerA.setAttribute('CLASS', colorChecker);
		newCheckerA.style.top = "3px";	
		newCheckerA.style.left = "3px";						
		
		var numberChecker = i % 12;
		var id = 'checkerBorder-' + WB + numberChecker;
		newChecker.setAttribute('ID', id);
		
		id = 'checker-' + WB + numberChecker;
		newCheckerA.setAttribute('ID', id);
		
		field.appendChild(newChecker);
		newChecker.appendChild(newCheckerA);
	}

	var buttonStart = document.getElementById('buttonStart');
	buttonStart.setAttribute('VALUE', 'Новая игра');
	buttonStart.setAttribute('ONCLICK', 'restart()');
}

function restart() {
	
}

function cancel() {
	
}

function recolourDiv(id) {
	var field = document.getElementById(id);
	field.style.background = '#998d4dff';
}

function returnColorDiv(id) {
	var field = document.getElementById(id);
	field.style.background = '#989898ff';
}
