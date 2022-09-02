var n = 0;
var checkerLength = 0;
var fieldLength = 0;
var checkerBorderLength = 0;
var isGoing = 'B';
var focusChecker = null;
var isFighting = false;
var wasChecked = false;
var previousGroupChecker = 'B';

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
		if(checker.dataset.canbefocused === 'true') {
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
				if(!isFighting) {
					move(oldCell, cell, thisChecker, groupChecker);
					updateInformation();
				}
			} else {
				checkFight(colChecker, col, rowChecker, row, groupChecker, oldCell, cell, thisChecker, differenceRow, false);
				updateInformation();
			}
		}
	}
}

function deepCheckFight(checker) {
	cell = checker.parentNode;
	data_checker = cell.id.split('-');
	rowChecker = parseInt(data_checker[0].substring(4));
	colChecker = parseInt(data_checker[1]);
	
	groupChecker = checker.id.split('-')[1];
			
	col1 = colChecker - 2; row1 = rowChecker - 2;
	col2 = colChecker + 2; row2 = rowChecker + 2;
	var canFight11 = false, canFight12 = false, 
	canFight21 = false, canFight22 = false;
				
	var ok_col1 = col1 >= 0;
	var ok_col2 = col2 < n;
	var ok_row1 = row1 >= 0;
	var ok_row2 = row2 < n;
			
	if(ok_row1 && ok_col1)
		canFight11 = checkFight(colChecker, col1, rowChecker, row1, groupChecker, null, null, null, 0, true);
	if(ok_row1 && ok_col2)
		canFight12 = checkFight(colChecker, col2, rowChecker, row1, groupChecker, null, null, null, 0, true, true);
	if(ok_row2 && ok_col1)
		canFight21 = checkFight(colChecker, col1, rowChecker, row2, groupChecker, null, null, null, 0, true);
	if(ok_row2 && ok_col2)
		canFight22 = checkFight(colChecker, col2, rowChecker, row2, groupChecker, null, null, null, 0, true);
					
	if(canFight11 || canFight12 || canFight21 || canFight22) {
		isFighting = true;
		checker.dataset.canbefocused = false;
		return(true);
	}
	return(false);
}

function updateInformation() {
	if(previousGroupChecker != isGoing) {
		isFighting = false;
		var arrayCheckers = document.getElementsByClassName('checkers ' + isGoing);
		for(var i = 0; i < arrayCheckers.length; i++)
			arrayCheckers[i].dataset.canbefocused = 'true';
		console.log('-------');
		for(var i = 0; i < arrayCheckers.length; i++) {
			deepCheckFight(arrayCheckers[i]);
		}
		
		if(!isFighting) {
			nameChecker = 'СИНИХ';
			color = 'blue';
			if(isGoing === 'B') {
				nameChecker = 'КРАСНЫХ';
				color = 'red';
			}
			information('Ход ' + nameChecker, color);
		} else {
			var arrayCheckers = document.getElementsByClassName('checkers ' + isGoing);
			for(var i = 0; i < arrayCheckers.length; i++) {
				var canbefocused = arrayCheckers[i].dataset.canbefocused;
				arrayCheckers[i].dataset.canbefocused = canbefocused === 'true' ? 'false' : 'true';
			}
			
			nameChecker = 'Синие';
			color = 'blue';
			if(isGoing === 'B') {
				nameChecker = 'Красные';
				color = 'red';	
			}
			information(nameChecker + ' РУБЯТ', color);
		}
		previousGroupChecker = isGoing;
	}
}

function checkFight(colChecker, col, rowChecker, row, groupChecker, oldCell, cell, thisChecker, differenceRow, isFullChecking) {
	var canGo = false;
	if(!isFullChecking) {
		canGo_col = Math.abs(colChecker - col) == 2;
		canGo_row = Math.abs(differenceRow) == 2;
		canGo = canGo_col && canGo_row;
	} else {
		var mustFreeCell = document.getElementById('cell' + row + '-' + col);
		var mustBeNullChecker = mustFreeCell.firstChild;
		if(mustBeNullChecker != null) return(false);
	}
	if(isFullChecking || canGo) {
		var cellBetween_row = (rowChecker + row) / 2; 
		var cellBetween_col = (colChecker + col) / 2; 
		var cellBetween_id = 'cell' + cellBetween_row + '-' + cellBetween_col;
		var cellBetween = document.getElementById(cellBetween_id);
		var checkerBetween = cellBetween.firstChild;
		if(checkerBetween != null) {
			var data_checkerBetween = checkerBetween.id.split('-');
			var groupCheckerBetween = data_checkerBetween[1];
			if(groupCheckerBetween != groupChecker) {
				if(!isFullChecking) {
					cellBetween.removeChild(checkerBetween);
					var oldFocusChecker = focusChecker;
					move(oldCell, cell, thisChecker, groupChecker);
					extraCheckFight(oldFocusChecker);
				}
				return(true);
			}
		}
	}
	return(false);
}

function extraCheckFight(fChecker) {
	var checker = document.getElementById(fChecker['idChecker']);
	var canFight = deepCheckFight(checker);
	if(canFight) {
		isGoing = checker.id.split('-')[1];
		
		var arrayCheckers = document.getElementsByClassName('checkers ' + isGoing);
		for(var i = 0; i < arrayCheckers.length; i++)
			arrayCheckers[i].dataset.canbefocused = 'false';
		checker.dataset.canbefocused = 'true';
	}
}

function move(oldCell, cell, thisChecker, groupChecker, isFight) {
	oldCell.removeChild(thisChecker);
	cell.appendChild(thisChecker);
	focusChecker = null;
	isGoing = groupChecker === 'A' ? 'B' : 'A';
	thisChecker.setAttribute('CLASS', 'checkers ' + groupChecker);
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
				divChecker.setAttribute('DATA-CANBEFOCUSED', 'true');
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
