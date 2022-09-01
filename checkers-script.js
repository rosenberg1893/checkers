var n = 0;
var checkerLength = 0;
var fieldLength = 0;
var checkerBorderLength = 0;
var isGoing = 'B';
var focusChecker = null;

function begin() {
	var isStarted = false;
	var parameters = location.search;
	if(parameters != null) {
		parameters = parameters.substring(1);
		var arrayParameters = parameters.split('&');
		for(var i = 0; i < arrayParameters.length; i++) {
			str = arrayParameters[i];
			if(str.startsWith('n='))
				n = parseInt(str.substring(2));
			else if(str.startsWith('start='))
				isStarted = str.substring(6);
		}
	}
	
	fieldLength = Math.floor(window.innerWidth / 20);
	checkerLength = Math.floor(fieldLength * 0.95);
	checkerBorderLength = Math.floor((fieldLength - checkerLength) / 2);
	divSpace0.style.height = fieldLength * 0.25 + 'px';
	
	var borderLength = 5;
	tableGame.style.borderSpacing = borderLength + 'px';
	tableGame.style.borderWidth = 0.8 * borderLength + 'px';
	divSpace1.style.height = borderLength * 2 + 'px';
	
	var data_buttonStartGame = buttonStartGame.getBoundingClientRect();
	buttonStartGame.style.width = data_buttonStartGame['width'] * 1.25 + 'px';
	
	var data_buttonCancel0 = buttonCancel0.getBoundingClientRect();
	divSpace2.style.width = data_buttonCancel0['width'] * 0.75 + 'px';
	
	for(var i = 0; i < n; i++) {
		var newRow = document.createElement('TR');
		newRow.setAttribute('ID', 'row' + i);
		tableGame.appendChild(newRow);
		for(var j = 0; j < n; j++) {
			var newCell = document.createElement('TD');
			newCell.setAttribute('CLASS', 'field' + (i + j) % 2);
			var idNewCell = i + '-' + j;
			newCell.setAttribute('ID', 'cell' + idNewCell);
			newCell.setAttribute('ONMOUSEMOVE', 'recolourCell("' + idNewCell + '")');
			newCell.setAttribute('ONMOUSEOUT', 'returnColorCell("' + idNewCell + '")');	
			if((i + j) % 2 == 1) 
				newCell.setAttribute('ONCLICK', 'ONCLICK_field("' + idNewCell + '")');
			newCell.style.width = fieldLength + 'px';
			newCell.style.height = fieldLength + 'px';
			newRow.appendChild(newCell);
		}
	}
	
	if(isStarted) start();
}

function ONCLICK_field(id) {
	var arrayData = id.split('-');
	var row = parseInt(arrayData[0]);
	var col = parseInt(arrayData[1]);
	var cell = document.getElementById('cell' + id);
	var checker = cell.firstChild;
	
	if(checker != null) {
		var data_checker = checker.id.split('-');
		var groupChecker = data_checker[1];
		if(groupChecker === isGoing) {
			if(focusChecker == null)
				focusChecker = new Array();
			else {
				var oldChecker = document.getElementById(focusChecker['idChecker']);
				oldChecker.setAttribute('CLASS', 'checkers ' + groupChecker);
			}
			focusChecker['idChecker'] = checker.id;
			focusChecker['row'] = row;
			focusChecker['col'] = col; 
			checker.setAttribute('CLASS', 'checkers focus' + groupChecker);
		}
	} else if(focusChecker != null) {
		var data_checker = focusChecker['idChecker'].split('-');
		var rowChecker = focusChecker['row'];
		var colChecker = focusChecker['col'];
		var groupChecker = data_checker[1];
		
		var thisChecker = document.getElementById(focusChecker['idChecker']);
		var oldCell = thisChecker.parentNode;
		
		var isQueen = data_checker.length == 4 ? true : false;
		if(!isQueen) {
			var canGo_col = Math.abs(colChecker - col) == 1;
			var differenceRow = row - rowChecker;
			canGo_row = groupChecker === 'A' && differenceRow == 1 ||
						groupChecker === 'B' && differenceRow == -1 ? 
						true : false;
			canGo = canGo_col && canGo_row;
			if(canGo) {
				move(oldCell, cell, thisChecker, groupChecker);
			} else {
				checkFight(colChecker, col, rowChecker, row, groupChecker, differenceRow, oldCell, cell, thisChecker);
			}
		}
	}
}

function checkFight(colChecker, col, rowChecker, row, groupChecker, differenceRow, oldCell, cell, thisChecker) {
	canGo_col = Math.abs(colChecker - col) == 2;
	canGo_row = Math.abs(differenceRow) == 2;
	canGo = canGo_col && canGo_row;
	if(canGo) {
		var cellBetween_row = (rowChecker + row) / 2; 
		var cellBetween_col = (colChecker + col) / 2; 
		var cellBetween_id = 'cell' + cellBetween_row + '-' + cellBetween_col;
		var cellBetween = document.getElementById(cellBetween_id);
		var checkerBetween = cellBetween.firstChild;
		if(checkerBetween != null) {
			var data_checkerBetween = checkerBetween.id.split('-');
			var groupCheckerBetween = data_checkerBetween[1];
			if(groupCheckerBetween != groupChecker) {
				cellBetween.removeChild(checkerBetween);
				move(oldCell, cell, thisChecker, groupChecker);
			}
		}
	}
}

function move(oldCell, cell, thisChecker, groupChecker) {
	oldCell.removeChild(thisChecker);
	cell.appendChild(thisChecker);
	isGoing = groupChecker === 'A' ? 'B' : 'A';
	focusChecker = null;
	thisChecker.setAttribute('CLASS', 'checkers ' + groupChecker);
				
	nameChecker = 'СИНИХ';
	color = 'blue';
	if(isGoing === 'B') {
		nameChecker = 'КРАСНЫХ';
		color = 'red';
	}
	information('Ход ' + nameChecker, color);
}


function recolourCell(id) {
    var gray = '#474747ff';
    var dark_gray = '#1f1f1fff';
    var border = '#dee0aaff';

	var arrayData = id.split('-');
	var rows = parseInt(arrayData[0]);
	var cols = parseInt(arrayData[1]);
	
	var cell = document.getElementById('cell' + id);
	cell.style.background = (rows + cols) % 2 == 0 ? gray : dark_gray;
	
	var checker = cell.firstChild;
	if(checker != null) checker.style.borderColor = border;
}

function returnColorCell(id) {
	var dark_gray_1 = '#262626ff';
    var dark_gray_2 = '#333333ff';
    var gray = '#e0e0e0ff';

	var arrayData = id.split('-');
	var rows = parseInt(arrayData[0]);
	var cols = parseInt(arrayData[1]);
	
	var cell = document.getElementById('cell' + id);
	cell.style.background = (rows + cols) % 2 == 0 ? dark_gray_2 : dark_gray_1;
	
	var checker = cell.firstChild;
	if(checker != null) checker.style.borderColor = gray;
}

function information(str, color) {
	var colors = new Array();
	colors['gray'] = '#e0e0e0ff';	
   	colors['blue'] = '#262739ff';												
    colors['red'] = '#6e2327ff';														
    colors['border'] = '#dee0aaff';	

	divInformation.textContent = str;
	divInformation.style.color = colors[color];
}

function start() {
	var numberCheckers = n * n / 2 - n;
	var rows = Math.round(numberCheckers / n);
		
	drawCheckers('A', numberCheckers, rows);
	drawCheckers('B', numberCheckers, rows);
	
	information('Ход КРАСНЫХ', 'red');
	
	var data_divInformation = divInformation.getBoundingClientRect();
	divSpace3.style.height = data_divInformation['height'] * 0.20 + 'px';
	divSpace4.style.height = data_divInformation['height'] * 0.05 + 'px';
	divInformation.style.width = (n - 3) * fieldLength + 'px';
	if(n <= 4) {
		divSpace5.style.width = data_divInformation['height'] + 'px';
		divSpace6.style.width = data_divInformation['height'] + 'px';
		divInformation.style.width = 2 * fieldLength + 'px';
	}
	var gray = '#e0e0e0ff';
	divSpace3.style.background = gray;
	divSpace4.style.background = gray;
	divInformation.style.background = gray;
	
	
	buttonStartGame.value = "Новая игра";
	buttonStartGame.setAttribute('ONCLICK', 'restart()');
}

function drawCheckers(groupChecker, numberCheckers, rows) {
	var i = 0, final = rows, k = 0;
	if(groupChecker === 'B') {
		i = n - rows;
		final = n;
		k = numberCheckers / 2;
	}
	
	for(; i < final; i++) {
		for(var j = 0; j < n; j++) {
			if((i + j) % 2 != 0) {
				var cell = document.getElementById('cell' + i + '-' + j);
				var divChecker = document.createElement('DIV');
				divChecker.setAttribute('CLASS', 'checkers ' + groupChecker);
				divChecker.setAttribute('ID', 'checker-' + groupChecker + '-' + k++);
				divChecker.style.borderWidth = checkerBorderLength + 'px';
				divChecker.style.width = checkerLength + 'px';
				divChecker.style.height = checkerLength + 'px';
		
				cell.appendChild(divChecker);
			}
		}
	}
}

function restart() {
	location.assign('checkers.html?n=' + n + '&start=true');
}

function cancel() {
	
}
