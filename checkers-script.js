// n - число строк и столбцов на шашечной доске
let n = 0;

/* подробнее о следующих переменных - в функциях, где вычисляется их значение */
let checkerLength = 0;			// checkerLength - диаметр круга шашки
let queenLength = 0;			// queenLength - диаметр круга внутри дамки
let queenMargin = 0;			// queenMargin - расстояние от круга шашки до круга дамки
let fieldLength = 0;			// fieldLength - длина (и ширина) квадратика поля шашечной доски
let checkerBorderLength = 0;	// checkerBorderLength - толщина обводки шашки

// focusChecker содержит ссылку на текущую выделенную шашку
let focusChecker = null;

// массив countCheckers содержит информацию о том,
// сколько в данный момент у каждого из игроков есть шашек
// когда их количество достигнет определённого числа,
// можно будет говорить о победе одной из сторон или ничье
let countCheckers = new Array();

// флаг isGoing содержит имя игрока ('A' или 'B'),
// шашки которого сейчас могут ходить (в начале это шашки игрока 'B')
let isGoing = 'B';

// флаг canFight показывает, может ли хотя бы одна из шашек рубить
// если шашка может рубить, она должна это сделать
let canFight = false;

//функция begin() запускается сразу при загрузке странички;
function begin() {			
	//флаг isStarted показывает, была ли игра запущена ранее (true) или впервые (false)
	//вначале предполагаем, что игра запускается впервые (false)													
	let isStarted = false;	
	
	//адресная строка может иметь вид как 'checkers.html', так и 'checkers.html?n=6&start=true'
	//если после 'checkers.html' есть '?', то поле location.search содержит всё, что начинается
	//с этого '?' и далее вплоть до конца строки, иначе location.search = null	
	//записываем в parameters содержимое location.search для дальнейшей работы					
	let parameters = location.search;	
	
	//если location.search оказалось не null, то оно содержит важные данные, которые мы должгы
	//получить и в дальнейшем использовать										
	if(parameters != null) {			
		//итак, parameters - не пустая строка, значит, она имеет вид '?n=6&start=true'	
		//знак '?' впереди нам не нужен и только мешает, поэтому перезаписываем в 
		//parameters всё, что идёт после этого символа																									
		parameters = parameters.substring(1);
		
		//теперь parameters имеет вид 'n=6&start=true' или, в общем случае,
		//'<имя>=<значение>&<имя>=<значение>&<имя>=<значение>&...'
		//чтобы получить данные по каждой переменной отдельно, нужно
		//разделить parameters на несколько строк общего вида '<имя>=<значение>'
		//заметим, что такие подстроки разделяются символом '&'
		//записываем в arrayParameters массив подстрок вида 'n=6' и(ли) 'start=true' и т.д.
		let arrayParameters = parameters.split('&');	
			
		//перебираем все подстроки в массиве и проверяем каждую на соответствие данным,
		//которые она может содержать (если это подстрока 'start=true', то мы должны
		//в соответствующую переменную start записать true и тому подобное)
		for(let i = 0; i < arrayParameters.length; i++) {
			//записываем во временную переменную str текущую подстроку массива arrayParameters
			str = arrayParameters[i];
			
			//если такая подстрока начинается с 'n=', выделяем всё, что стоит за этими символами,
			//переводим в число и записываем в переменную n (это размер шашечной доски, длина и ширина)
			if(str.startsWith('n='))
				n = parseInt(str.substring(2));
			//иначе подстрока также может начинаться со 'start='; в таком случае выделяем всё, что
			//стоит после и если это 'true', то isStarted = true и аналогично, если это 'false'
			else if(str.startsWith('start='))
				isStarted = str.substring(6) === 'true' ? true : false;
		}
	}
	
	// fieldLength - длина стороны каждого из квадратиков на доске
	// для каждого экрана она индивидуальна и зависит от её ширины
	fieldLength = Math.floor(window.innerWidth / 20);
	
	// каждая шашка нарисована как кружочек, закрашенный синим или красным цветом
	// с обводкой серого цвета; checkerLength - диаметр такого кружочка без
	// учёта обводки и составляет такой диаметр 95% от длины квадратика-поля
	checkerLength = Math.floor(fieldLength * 0.95);
	
	// толщина обводки шашки составляет 4% от длины квадратика-поля
	checkerBorderLength = Math.floor(fieldLength * 0.04);
	
	// 95% + 4% = 99%. Куда ушёл 1%? Вопрос философский, но если вместо 95%
	// задать 96%, то при отрисовке шашек ячейки таблицы увеличиваются в размерах,
	// что не красиво; а если вместо 4% задать 5%, то обводка становится слишком толстой
	
	// каждая дамка нарисована как шашка, внутри которой размещается
	// дополнительный круг серого цвета; диаметр такого круга
	// составляет половину от диаметра внутреннего кружочка шашки (без учёта обводки)
	queenLength = Math.floor(checkerLength * 0.5);
	
	// чтобы разместить этот дополнительный круг внутри дамки ровно по центру,
	// нужно указать, насколько его сместить относительного начального положения
	// (а начальное положение - левые верхние углы слоёв обычного и дополнительного
	// кружка совпадают)
	queenMargin = Math.floor((checkerLength - queenLength) / 2);
	
	// divSpace0 - пустое пространство между верхним краем странички и шашечной доской
	divSpace0.style.height = fieldLength * 0.25 + 'px';
	
	// шашечные поля располагаются между собой на определённом расстоянии
	// borderLength задаёт это расстояние в 5px
	let borderLength = 5;
	
	// устанавливаем расстояние между шашечными полями
	tableGame.style.borderSpacing = borderLength + 'px';
	
	// устанавливаем толщину обводки вокруг шашечной доски
	tableGame.style.borderWidth = 0.8 * borderLength + 'px';
	
	// divSpace1 - пустое пространство между шашечной доской
	// и кнопками с информационным полем
	divSpace1.style.height = borderLength * 2 + 'px';	

	// buttonStartGame - кнопка "Новая игра" (объект)
	// метод getBoundingClientRect() объекта возвращает
	// его точные координаты относительно верхнего левого угла странички,
	// а также ширину и высоту объекта; результат является массивом и имеет вид
	// {x:679.6, y:44, width:121.8, height:30, top:44, right:801.4, bottom:74, left:679.6}
	// назовём этот массив data_buttonStartGame
	let data_buttonStartGame = buttonStartGame.getBoundingClientRect();
	
	// сделаем ширину кнопки чуть побольше, чем было вначале, чтобы
	// слева и справа около текста внутри кнопки появились пробельчики - это красиво
	buttonStartGame.style.width = data_buttonStartGame['width'] * 1.25 + 'px';

	// buttonCancel0 - крайняя левая кнопка, нужна для отмены хода
	// получаем через getBoundingClientRect() размеры кнопки
	let data_buttonCancel0 = buttonCancel0.getBoundingClientRect();
	// divSpace2 - пустое пространство между кнопками для отмены хода
	// и возврата к исходному положению, зададим его ширину
	// пропорционально ширине каждой из кнопок
	divSpace2.style.width = data_buttonCancel0['width'] * 0.75 + 'px';

	// рисуем шашечное поле: для этого используем таблицу <TABLE> ... </TABLE>
	// для каждой строчки от 0 до n - 1...
	for(let i = 0; i < n; i++) {
		// создаём будущую строчку таблицы
		let newRow = document.createElement('TR');
		// устанавливаем ей уникальный номер вида 'row-3'
		newRow.setAttribute('ID', 'row-' + i);
		// добавляем строчку в таблицу
		tableGame.appendChild(newRow);
		
		// для каждого поля в текущей строке от 0 до n - 1...
		for(let j = 0; j < n; j++) {
			// создаём будущее поле (квадратик) шашечной доски
			let newCell = document.createElement('TD');
			
			// задаём стиль квадратика-поля через CSS
			// есть два стиля для двух полей соответственно:
			// для чёрных 'field0', для белых 'field1'
			newCell.setAttribute('CLASS', 'field' + (i + j) % 2);
			
			// задаём уникальный номер для поля, который имеет вид 'cell-3-2'
			newCell.setAttribute('ID', 'cell-' + i + '-' + j);
			
			// при наведении мыши на поле оно должно перекраситься: 
			// вызываем соответствующую функцию и передаём ей координаты поля
			newCell.setAttribute('ONMOUSEMOVE', 'recolourCell(' + i + ',' + j + ')');
			
			// при сведении мыши с поля оно должно вновь перекраситься
			newCell.setAttribute('ONMOUSEOUT', 'returnColorCell(' + i + ',' + j + ')');
			
			// шашки стоят на чёрных полях: для чёрного поля...
			if((i + j) % 2 == 1) {
				// при нажатии на чёрное поле мы должны многое проверить, поэтому
				// вызываем функцию и передаём ей координаты поля
				newCell.setAttribute('ONCLICK', 'ONCLICK_field(' + i + ',' + j + ')');
			}
			// задаём полю его ширину
			newCell.style.width = fieldLength + 'px';
			// задаём полю его высоту
			newCell.style.height = fieldLength + 'px';
			// добавляем поле в строчку
			newRow.appendChild(newCell);
		}
	}
	
	// если игра была запущена ранее, сразу же рисуем на доске шашки
	if(isStarted) start();
}

// если игрок нажал на поле, мы получаем его номер строки rowField
// и номер столбца colField и проверяем...
function ONCLICK_field(rowField, colField) {
	// получаем ссылку на объект шашечного поля, составив его номер через строку и столбец
	let thisField = document.getElementById('cell-' + rowField + '-' + colField);
	
	// получаем ссылку на первый объект внутри этого шашечного поля
	// если такого внутреннего объекта нет, в переменную будет записан null
	let thisChecker = thisField.firstChild;
	
	// если шашка на этом поле есть...
	if(thisChecker != null) {
		// получаем данные о шашке и записываем их в массив data_checker
		// так как номер шашки выглядит так: 'checker-A-3',
		// этот массив выглядит так: { 'checker', 'A', '3' }
		let data_checker = thisChecker.id.split('-');
		
		// извлекаем из data_checker информацию о том,
		// ... дамка ли это (варианты: 'Checker', 'Queen')
		//let typeChecker = data_checker[0];
		
		// ... какого игрока эта шашка (варианты: 'A', 'B')
		let groupChecker = data_checker[1];
	
		// если сейчас ходит игрок, чью шашку выделили...
		if(isGoing === groupChecker) {
			// если шашку можно выделить...
			if(thisChecker.dataset.canbefocused === 'true') {
				// если ранее была выделена какая-то шашка...
				if(focusChecker != null) {
					returnStandartColorOfFocusChecker();
				}
				
				// выделяем новую шашку цветом
				thisChecker.setAttribute('CLASS', 'checkers focus' + groupChecker);
			
				// запоминаем её в переменной для хранения текущей выделенной шашки
				focusChecker = thisChecker;
			}
		// иначе, если выделили шашку противника и сейчас нужно рубить...
		} else if(canFight) {
			
		}
	// иначе, если на поле шашки нет, поле пустое...	
	} else {
		// если была выделена какая-то шашка...
		if(focusChecker != null) {
			// получаем массив данных о текущем поле
			let data_thisCell = thisField.id.split('-');
				
			// получаем массив данных о расположении выделенной шашки
			let data_cellFocusChecker = focusChecker.parentNode.id.split('-');
			
			// если мы не должны рубить...
			if(!canFight) {
				// в этой переменной будет храниться информация
				// о том, может ли сходить выделенная шашка на
				// данную клетку или нет;
				// пока что мы можем определить, может ли клетка иметь подходящий
				// столбец (для всех шашек это правило одно - номер столбца клетки
				// должен отличаться от номера столбца выд. шашки ровно на 1)
				let canGo = (Math.abs(data_thisCell[2] - data_cellFocusChecker[2]) == 1);
				
				// проверяем, может ли она сходить
				// если шашка синяя (группа "А")
				if(isGoing === 'A') {
					// теперь определяем, приемлема ли клетка, на которую нажали, 
					// по строке (номер строки клетки должен быть больше на 1 номера 
					// строки выделенной шашки)
					// соединяем полученные данные
					canGo = canGo && (data_thisCell[1] - data_cellFocusChecker[1] == 1);
				// иначе, если шашка красная (группа "В")
				} else {
					// теперь определяем, приемлема ли клетка, на которую нажали, 
					// по строке (номер строки клетки должен быть больше на 1 номера 
					// строки выделенной шашки)
					// соединяем полученные данные
					canGo = canGo && (data_cellFocusChecker[1] - data_thisCell[1] == 1);
				}
				
				// если выделенная шашка на клетку сходить может...
				if(canGo) {
					// ходим: убираем шашку со старой клетки
					focusChecker.parentNode.removeChild(focusChecker);
					
					// и добавляем на новую
					thisField.appendChild(focusChecker);
					
					// снимаем цветовое выделение с этой шашки
					returnStandartColorOfFocusChecker();
					
					// теперь ходит другой игрок: показываем программе
					// если группа шашки, которая только что сходила,
					// была "А", то теперь ходить будут шашки группы "В" и наоборот
					isGoing = focusChecker.id.split('-')[1] === 'A' ? 'B' : 'A';
					
					// сообщаем игроку, что ходят теперь другие шашки
					information('Ходят ', isGoing);
					
					// показываем программе, что выделенной шашки больше нет
					focusChecker = null;
					
					// ПРОВЕРЯЕМ, МОЖЕТ ЛИ КТО-ТО РУБИТЬ
					checkFightForEveryChecker();
					
					//saveGame();
				}
			// иначе, если мы должны рубить...
			} else {
				// получаем разницу между строками указанной ячейки и выделенной шашки
				let diffRows = data_thisCell[1] - data_cellFocusChecker[1];
				
				// получаем разницу между столбцами указанной ячейки и выделенной шашки
				let diffCols = data_thisCell[2] - data_cellFocusChecker[2];
				
				// в этой переменной будет храниться информация о том, может ли
				// выделенная шашка перейти на указанное поле, срубив шашку противника;
				// если разница между строками и столбцами равна 2, ХОДИТЬ можно (можно ли рубить, пока неизвестно)
				let canGo = Math.abs(diffRows) == 2 && Math.abs(diffCols) == 2;
				
				// если мы нажали на подходящую клетку...
				if(canGo) {
					// получаем шашку на клетке между указанной клеткой и клеткой с нашей шашкой
					let enemyChecker = document.getElementById('cell-' + (parseInt(data_thisCell[1]) - parseInt(diffRows) / 2) + '-' + (parseInt(data_thisCell[2]) - parseInt(diffCols) / 2)).firstChild;
					
					// теперь к информации о том, можно ли так сходить,
					// присоединим информацию о том, можно ли рубить:
					// мы должны убедиться, что шашка, которую мы хотим срубить,
					// вообще существует, и если да, она вражеская
					canGo = canGo && enemyChecker != null && enemyChecker.id.split('-')[1] != isGoing;	
					
					// если выделенная шашка на клетку сходить, срубя врага, может...
					if(canGo) {
						// отдельно получаем группу вражеской шашки - она многократно потребуется
						let enemyGroup = enemyChecker.id.split('-')[1];
						
						// ходим: убираем шашку со старой клетки
						focusChecker.parentNode.removeChild(focusChecker);
						
						// и добавляем на новую
						thisField.appendChild(focusChecker);
						
						// убираем срубленную шашку
						enemyChecker.parentNode.removeChild(enemyChecker);
						
						// отмечаем в статистике количества шашек
						countCheckers[enemyGroup]--;
						
						// теперь рубить нельзя, но если окажется, что эта шашка может
						// срубить ещё раз, флаг вновь изменится
						canFight = false;
						
						// ПРОВЕРЯЕМ, МОЖЕТ ЛИ ЭТА ШАШКА ЕЩЁ РАЗ СРУБИТЬ
						checkFightForThisChecker(focusChecker);
						
						// если оказалось, что шашка больше рубить НЕ может...
						if(!canFight) {
							// снимаем цветовое выделение с этой шашки
							returnStandartColorOfFocusChecker();
							
							// теперь ходит другой игрок: показываем программе
							// если группа шашки, которая только что сходила,
							// была "А", то теперь ходить будут шашки группы "В" и наоборот
							isGoing = enemyGroup;
							
							// показываем программе, что выделенной шашки больше нет
							focusChecker = null;
							// если у противника больше нет шашек...
							if(countCheckers[isGoing] == 0) {
								// сообщаем игроку о победе
								information('ПОБЕДИЛИ ', enemyGroup === 'A' ? 'B' : 'A', true);
							// иначе, если у противника шашки ещё есть...
							} else {
								// сообщаем игроку, что ходят теперь другие шашки
								information('Ходят ', isGoing);
							}
							
							// ПРОВЕРЯЕМ, МОЖЕТ ЛИ КТО-ТО РУБИТЬ
							checkFightForEveryChecker();
						}
					}
				}
			}
		}
	}
}

// проверяем для данной шашки, может ли она рубить кого-нибудь
function checkFightForThisChecker(thisChecker) {
	// запрещаем (временно) выделять какие-либо шашки
	// (затем будем разрешать выделять те, которые могут срубить)
	// (если рубить не сможет ни одна шашка, мы разрешим выделять все)
	thisChecker.setAttribute('DATA-CANBEFOCUSED', 'false');
	
	// получаем данные о ячейке шашечной доски, на которой стоит эта шашка
	let data_thisCell = thisChecker.parentNode.id.split('-');
	// проверяем, может ли она рубить
	// массив смещений: 
	// 0-й подмассив - для верхней левой диагонали
	// 1-й подмассив - для верхней правой диагонали
	// 2-й подмассив - для нижней левой диагонали
	// 3-й подмассив - для нижней правой диагонали
		
	// 0-й элемент любого подмассива - для строки дальней клетки
	// 1-й элемент любого подмассива - для столбца дальней клетки
	// 2-й элемент любого подмассива - для строки ближней клетки
	// 3-й элемент любого подмассива - для столбца ближней клетки
	let offsets = [[-2, -2, -1, -1], [-2, 2, -1, 1], [2, -2, 1, -1], [2, 2, 1, 1]];
	
	// для всех четырёх сторон, куда может рубить шашка...
	for(let i = 0; i < 4; i++) {
		// вычисляем строку, в которой должна находиться дальняя ячейка
		let rowCell = parseInt(data_thisCell[1]) + parseInt(offsets[i][0]);

		// вычисляем столбец, в котором должна находиться дальняя ячейка
		let colCell = parseInt(data_thisCell[2]) + parseInt(offsets[i][1]);
			
		// определяем переменную, в которой будет храниться ссылка на объект дальней ячейки
		// изначально null, и если строка и столбец выходят за пределы таблицы, то null и останется
		let remoteCell = null;
		
		// проверяем, находится ли искомая ячейка в таблице или её не существует
		if(rowCell >= 0 && colCell >= 0 && rowCell < n && colCell < n) 
			// если ячейка существует, ссылку на её объект записываем в переменную remoteCell
			remoteCell = document.getElementById('cell-' + rowCell + '-' + colCell);
		
		// если она существует и на ней нет шашки...
		if(remoteCell != null && remoteCell.firstChild == null) {
			// вычисляем строку, в которой должна находиться ячейка между текущей и дальней
			rowCell = parseInt(data_thisCell[1]) + parseInt(offsets[i][2]);
				
			// вычисляем столбец, в котором должна находиться ячейка между текущей и дальней
			colCell = parseInt(data_thisCell[2]) + parseInt(offsets[i][3]);
				
			// получаем ближнюю ячейку данной диагонали
			let nearCell = document.getElementById('cell-' + rowCell + '-' + colCell);
			
			// если на ней есть шашка, и она вражеская...
			if(nearCell.firstChild != null && nearCell.firstChild.id.split('-')[1] != isGoing) {
				// показываем программе, что шашки могут и должны рубить
				canFight = true;
					
				// разрешаем выделить эту шашку
				thisChecker.setAttribute('DATA-CANBEFOCUSED', 'true');
			}
		}
	}
}

// проверяем, могут ли шашки, которые сейчас ходят,
// срубить шашку противника
function checkFightForEveryChecker() {
	// получаем массив несрубленных шашек, которые сейчас ходят
	let arrayActiveCheckers = document.getElementsByClassName('checkers ' + isGoing);
	
	// для каждой шашки, которая сейчас ходит...
	for(let i = 0; i < arrayActiveCheckers.length; i++) {
		// получаем i-тую шашку и проверяем, может ли она рубить
		checkFightForThisChecker(arrayActiveCheckers[i])
	}
	
	// если шашки могут рубить...
	if(canFight) {
		// сообщаем игроку, что шашки должны рубить
		information('РУБЯТ ', isGoing);
	// иначе, если шашки не могут рубить...
	} else {
		// для каждой шашки этой группы...
		for(let i = 0; i < arrayActiveCheckers.length; i++) {
			// разрешаем выделить i-тую шашку
			arrayActiveCheckers[i].setAttribute('DATA-CANBEFOCUSED', 'true');
		}
	}
}

// возвращает выделенной шашке её обычный цвет
function returnStandartColorOfFocusChecker() {
	// получаем группу шашки (чтобы понять, в какой цвет её вновь перекрашивать)
	// напоминаю, id шашки имеет вид 'checker-B-17', разделяем эту строку по символу
	// '-' и получаем массив из трёх подстрок, вторая из которых - группа шашки
	let groupFocusChecker = focusChecker.id.split('-')[1];

	// снимаем цветовое выделение со старой шашки
	focusChecker.setAttribute('CLASS', 'checkers ' + groupFocusChecker);
}

// при наведении мышью на поле оно должно поменять свой цвет
// получаем строчку и столбец поля
function recolourCell(rowField, colField) {
	// задаём цвета, в которые будем перекрашивать поля
	// gray - светло-серый для "белых" полей
	let gray = '#474747ff';
	// dark-gray - тёмно-серый для "чёрных" полей
    let dark_gray = '#1f1f1fff';
    // border - светло-жёлтый для обводки шашек
    let border = '#dee0aaff';

	// передаём данные для общей функции перекраски полей
	redraw(rowField, colField, gray, dark_gray, border);
}

// при сведении мышки с поля оно должно изменить свой цвет на
// первоначальный; получаем строчку и столбец поля
function returnColorCell(rowField, colField) {
	// задаём исходные цвета полей
	// dark_gray_1 - серый для "чёрных" полей
	let dark_gray_1 = '#262626ff';
	// dark_gray_2 - серый для "белых" полей
    let dark_gray_2 = '#333333ff';
    // gray - светло-серый для обводки шашек
    let gray = '#e0e0e0ff';
    
    // передаём данные для общей функции перекраски полей
    redraw(rowField, colField, dark_gray_2, dark_gray_1, gray);
}

// общая функция для изменения цвета поля
// получаем координаты поля и возможные цвета поля и обводки шашки на этом поле
function redraw(rowField, colField, color1, color2, color3) {
	// формируем номер ячейки (имеет вид 'cell-3-7') и получаем
	// ссылку на соответствующую номеру ячейку
	let cell = document.getElementById('cell-' + rowField + '-' + colField);
	
	// если ячейка светлая, она перекрашивается в color1, иначе в color2
	cell.style.background = (rowField + colField) % 2 == 0 ? color1 : color2;
	
	// шашечная доска (таблица) имеет следующую структуру: в таблице размещаются
	// строки; в строках - ячейки (поля); в любом поле может размещаться шашка
	// свойство firstChild содержит ссылку на объект, находящийся внутри данного
	// в переменную checker записываем ссылку на то, что находится внутри ячейки
	let checker = cell.firstChild;
	
	// если на поле есть шашка, то checker содержит ссылку на неё, иначе null
	// если на поле есть шашка, мы должны выделить её обводку цветом, как и поле
	if(checker != null) {
		// перекрашиваем обводку шашки в нужный цвет
		checker.style.borderColor = color3;
		
		// если же это не просто шашка, а дамка, нужно
		// также выделить цветом внутренний круг дамки 
		// если номер шашки имеет вид 'checker-3-5',
		// то номер дамки имеет вид 'queen-4-7'
		if(checker.id.split('-')[0] === 'Queen') {
			// получаем внутренний круг дамки
			let divQueen = checker.firstChild;
			
			// перекрашиваем его в нужный цвет
			divQueen.style.background = color3;
		}
	}
}

// функция start() вызывается при нажатии на кнопку "Начать игру"
// главное предназначение функции - отрисовка шашек
function start() {
	// вызываем функции для отрисовки шашек игрока А, игрока В	
	drawCheckers('A');
	drawCheckers('B');
	
	// сообщаем, какие шашки ходят первыми
	information('Ход КРАСНЫХ', 'red');
	
	// получаем данные о размерах и положении информационного поля
	let data_divInformation = divInformation.getBoundingClientRect();
	
	// divSpace3 - верхняя часть информационного поля, необходимая для
	// красивого размещения текста внутри поля; задаём её высоту в
	// зависимости от средней части поля, в которой и содержится текст
	divSpace3.style.height = data_divInformation['height'] * 0.20 + 'px';
	// divSpace4 - нижняя часть информационного поля, также нужная для
	// красивой разметки; также задаётся её высота зависимо от средней части поля
	divSpace4.style.height = data_divInformation['height'] * 0.05 + 'px';
	
	// ширина средней части информационного поля, её длина зависит от
	// количества ячеек шашечной доски
	divInformation.style.width = (n - 3) * fieldLength + 'px';
	
	// если доска маленькая, информационное поле имеет
	// наименьшую допустимую длину - чтобы текст влезал
	if(n <= 4) {
		// divSpace5 - пустое пространство между правой кнопкой из двух кнопок слева
		// и информационным полем; чтобы кнопка вплотную не прилегала к полю,
		// задаём длину divSpace5, отличную от нуля (ноль по умолчанию)
		// (эта длина равна высоте средней части информационного поля)
		divSpace5.style.width = data_divInformation['height'] + 'px';
		
		// divSpace6 - пустое пространство между кнопкой "Начать игру" и 
		// информационным полем; по той же причине задаём длину пространства
		divSpace6.style.width = data_divInformation['height'] + 'px';
		divInformation.style.width = 2 * fieldLength + 'px';
	}
	
	// задаём переменную, хранящую светло-серый цвет в RGB-формате
	let gray = '#e0e0e0ff';
	
	// задаём фон всего информационного поля; так как оно
	// состоит из трёх слоёв, раскрашиваем все сверху вниз
	divSpace3.style.background = gray;
	divInformation.style.background = gray;
	divSpace4.style.background = gray;
	
	// меняем название кнопки "Начать игру" на "Новая игра":
	// теперь кнопка отвечает за сброс положения шашек до начального
	buttonStartGame.value = "Новая игра";
	// при нажатии кнопки вызывается функция restart(), она начинает игру заново
	buttonStartGame.setAttribute('ONCLICK', 'restart()');
}

// функция drawCheckers создаёт и рисует на соответствующих полях
// шашки данного игрока в указанном количестве
// принимает как аргументы группу шашек ('A' или 'B')
// общее число всех шашек
function drawCheckers(groupChecker) {
	// вычисляем число строк, на которых будут находиться
	// шашки одного из игроков (для n = 8 число строк rows = 3)
	let rows = Math.floor((n - 1) / 2);
	
	// i - номер строки, начиная с которой, будут создаваться шашки
	// (final - 1) - номер последней строки, в которой будут шашки
	// k - уникальный, идентификационный номер шашки в данной группе
	let i, final, k = 0;
	
	// если мы работаем с шашками игрока А
	if(groupChecker === 'A') {
		// рисовать начнём их с нулевой строки (с начала)
		i = 0;
		// закончим, когда отрисуем их на всех нужных строках
		final = rows;
	// иначе, если мы работаем с шашками игрока В
	} else {
		// рисовать их будем с определённой строки в нижней части доски
		i = n - rows;
		// и закончим самой последней строкой
		final = n;
	}
	
	// для каждой строки, начиная с i и до final не включая...
	for(; i < final; i++) {
		// для каждого поля текущей строки...
		for(let j = 0; j < n; j++) {
			// если это поле чёрное...
			if((i + j) % 2 != 0) {	
				// создаём слой будущей шашки
				let divChecker = document.createElement('DIV');
				
				// устанавливаем стиль шашки через классы CSS
				// класс checkers округляет квадратный слой и задаёт серую обводку
				// класс A (B) задаёт цвет заливки шашки в соответствии с её группой
				divChecker.setAttribute('CLASS', 'checkers ' + groupChecker);
				
				// составляем для шашки её уникальный номер вида 'checkers-A-4'
				let idChecker = 'checker-' + groupChecker + '-' + k++;
				
				// задаём шашке её уникальный номер
				divChecker.setAttribute('ID', idChecker);
				
				// задаём шашке свойство, которое в дальнейшем нам
				// подскажет, можно ли выделить эту шашку или нет
				divChecker.setAttribute('DATA-CANBEFOCUSED', 'true');
				
				// задаём толщину обводку шашки
				divChecker.style.borderWidth = checkerBorderLength + 'px';
				
				// задаём ширину шашки
				divChecker.style.width = checkerLength + 'px';
				// задаём высоту шашки
				divChecker.style.height = checkerLength + 'px';
				
				// получаем ссылку на объект - поле шашечной доски
				let cell = document.getElementById('cell-' + i + '-' + j);
				
				// добавляем на это поле нашу шашку
				cell.appendChild(divChecker);
			}
		}
	}
	// записываем начальное кол-во шашек у данного игрока
	countCheckers[groupChecker] = k;
}

// функция information() выводит в информационное поле
// заданное сообщение заданного цвета
// принимает в качестве аргументов текст строки str,
// цвет строки color вида 'blue' и т.п.,
// логическое значение true, если это сообщение о победе игрока
function information(str, color, win = false) {
	// массив colors содержит пары ключ-значение
	// текстовому описанию цвета соответствует его RGB
	let colors = new Array();
	colors['gray'] = '#e0e0e0ff';	
   	colors['blue'] = '#262739ff';												
    colors['red'] = '#6e2327ff';														
    colors['border'] = '#dee0aaff';
    // иногда вместо цвета я буду передавать в качестве аргумента
    // группу шашек, т.к. фактически она соответствует определённому цвету
    colors['A'] = colors['blue'];
    colors['B'] = colors['red'];
    
    // если это сообщение о ходе или рубке,
    // в качестве цвета передавалась группа шашек
    // и мы должны вставить в текст имя группы шашек;
    // создаём дополнительную строку, которая изначально пуста,
    // но при сообщении о ходе или рубке она заполняется именем группы шашек
    // затем она прибавляется к основной строке
    let extraStr = '';
    if(color === 'A') {
    	extraStr = 'СИНИЕ';
    } else if(color === 'B') {
    	extraStr = 'КРАСНЫЕ';
    }
    
    // меняем текст в информационном поле на нужный
    divInformation.textContent = str + extraStr;
    
    // если это сообщение о победе одного из игроков...
	if(win) {
		// меняем цвет фона информационного поля, который
		// задаётся аж целыми тремя слоями (это нужно для
		// красивого размещения текста внутри поля) на
		// цвет игрока (красный или синий)
		divInformation.style.background = colors[color];
		divSpace3.style.background = colors[color];
		divSpace4.style.background = colors[color];
		
		// меняем цвет букв на светло-жёлтый - для эффекта
		divInformation.style.color = colors['border'];
	// иначе, если это сообщение о том, кто делает ход или рубит
	} else {
		// меняем цвет текста на цвет игрока (красный или синий)
		divInformation.style.color = colors[color];
	}
}

// функция saveGame() считывает расположение всех шашек на доске
// записывает информацию об этом в массив и сохраняет массив в session storage
function saveGame() {
	// общий массив для текущих игровых данных
	let data_game = new Array();
	
	// записываем, кто должен сейчас ходить
	data_game['isGoing'] = isGoing;
	
	// записываем, нужно ли сейчас рубить
	data_game['canFight'] = canFight;
	
	// записываем, сколько и у кого шашек
	data_game['countCheckers'] = countCheckers;
	
	// создаём массив шашек и их расположений на доске
	data_game['arrayCheckers'] = new Array();
	
	// получаем все шашки на доске
	let checkers = document.getElementsByClassName('checkers');
	
	// для каждой шашки...
	for(let i = 0; i < checkers.length; i++) {
		// записываем данные о ячейке текущей шашки в переменную
		let data_cellThisChecker = checkers[i].parentNode.id.split('-');
		
		// каждые данные о шашке имеют структуру: строка, столбец ячейки, в которой находится шашка, 
		// номер шашки, может ли быть выделена
		data_game['arrayCheckers'][i] = new Array();
		
		// записываем в общий массив ID шашки
		data_game['arrayCheckers'][i]['id'] = checkers[i].id;
		
		// записываем в общий массив данные о том, может ли шашка быть выделена
		data_game['arrayCheckers'][i]['canbefocused'] = checkers[i].dataset.canbefocused;
		
		// записываем в общий массив строчку поля, в которой находится шашка
		data_game['arrayCheckers'][i]['row'] = data_cellThisChecker[1];
		
		// записываем в общий массив строчку поля, в которой находится шашка
		data_game['arrayCheckers'][i]['col'] = data_cellThisChecker[2];
	}
	
	// преобразуем объект в строку - сериализуем данные
	let serializedData = JSON.stringify(data_game);
	
	console.log(data_game);
	console.log(serializedData);
	//sessionStorage.setItem(++num, serializedData);
}

// функция restart() вновь загружает в текущую вкладку
// страничку checkers.html с тем же кол-вом шашек,
// но с условием, что игра ранее была запущена (start=true)
function restart() {
	location.assign('checkers.html?n=' + n + '&start=true');
}

function cancel() {
	
}
