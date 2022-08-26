function start() {
	for(var i = 0; i < 64; i++) {												//рисуем 64 квадрата (8 строк на 8 столбцов)
		var newField = document.createElement('DIV');							//создаём новый элемент div (будущий квадратик)
		
		var numberRow = Math.floor(i / 8);										//numberRow - номер строки, начинается с 0
		
		var numberClass = (i + numberRow) % 2;									//устанавливаем атрибуты div: стиль (или серый, или тёмно-серый)
		newField.setAttribute('CLASS', 'standartField-' + numberClass);
		
		var top = 10 * (numberRow + 1) + 70 * numberRow;						//устанавливаем атр. div: расст. по вертикали от края странички
		newField.style.top = top + "px";									

		var numberCol = i % 8;													//устанавливаем атр. div: расст. по горизонтали от края странички
		var left = 10 * (numberCol + 1) + 70 * numberCol; 						//numberCol - номер столбца, начинается с 0
		newField.style.left = left + "px";
		
		var id = 'field' + numberRow + '' + numberCol;							//устанавливаем атрибуты div: id
		newField.setAttribute('ID', id);
		
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
	button2.setAttribute('ONCLICK', 'begin()');									//функция JS, запускаемая по клику на кнопку
	divButton2.appendChild(button2);											//добавляем кнопку на слой
}

function begin() {
	
}

function cancel() {
	
}
