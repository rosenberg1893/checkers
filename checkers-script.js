var n = 0;
var checkerLength = 0;
var queenLength = 0;
var queenMargin = 0;
var fieldLength = 0;
var checkerBorderLength = 0;
var isGoing = 'B';
var focusChecker = null;
var isFighting = false;
var wasChecked = false;
var previousGroupChecker = 'B';
var countCheckers = new Array();

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
	queenLength = Math.floor(checkerLength * 0.5);
	queenMargin = Math.floor((checkerLength - queenLength) / 2);
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
		
		var isQueen = data_checker.length > 3;
		if(!isQueen) {
			var canGo_col = Math.abs(colChecker - col) == 1;
			var differenceRow = row - rowChecker;
			canGo_row = groupChecker === 'A' && differenceRow == 1 ||
						groupChecker === 'B' && differenceRow == -1 ? 
						true : false;
			var canGo = canGo_col && canGo_row;
			if(canGo) {
				if(!isFighting) {
					move(oldCell, cell, thisChecker, groupChecker);
					//console.log('AFTER SIMPLE MOVE');
					dontRepeat(thisChecker);
					//console.log('isFighting = ' + isFighting);
					//console.log('isGoing = ' + isGoing);
					//console.log('previousGroupChecker = ' + previousGroupChecker);
				}
			} else {
				checkFight(colChecker, col, rowChecker, row, groupChecker, oldCell, cell, thisChecker, differenceRow, false);
				dontRepeat(thisChecker);
			}
		} else {
			var canGo = Math.abs(row - rowChecker) == Math.abs(col - colChecker);
			if(canGo) {
				if(!isFighting) {
					move(oldCell, cell, thisChecker, groupChecker);
					dontRepeat(null, true);
				} else {
					checkQueenMoveToFight(thisChecker, oldCell, cell, rowChecker, colChecker, row, col, groupChecker);
					dontRepeat(null, true);
				}
			}
		}
	}
}

function dontRepeat(thisChecker, isQueen = false) {
	if(previousGroupChecker != isGoing) {
		//console.log('DONT REPEAT WORK');
		if(!isQueen) checkQueen(thisChecker);
		updateInformation();
		previousGroupChecker = isGoing;
	}
}

function checkQueen(checker) {
	cell = checker.parentNode;
	data_checker = cell.id.split('-');
	rowChecker = parseInt(data_checker[0].substring(4));
	colChecker = parseInt(data_checker[1]);
	groupChecker = checker.id.split('-')[1];
	
	var ok_A = groupChecker === 'A' && rowChecker == n - 1;
	var ok_B = groupChecker === 'B' && rowChecker == 0;
	if(ok_A || ok_B) {
		var divQueen = document.createElement('DIV');
		divQueen.setAttribute('CLASS', 'divQueen');
		checker.setAttribute('ID', checker.id + '-Q');
		divQueen.style.width = queenLength + 'px';
		divQueen.style.height = queenLength + 'px';
		divQueen.style.left = queenMargin + 'px';
		divQueen.style.top = queenMargin + 'px';
		
		checker.appendChild(divQueen);
	}
}

function deepCheckFight(checker) {
	cell = checker.parentNode;
	data_checker = cell.id.split('-');
	rowChecker = parseInt(data_checker[0].substring(4));
	colChecker = parseInt(data_checker[1]);
	
	data_checker = checker.id.split('-');
	groupChecker = data_checker[1];
	isQueen = data_checker.length > 3;
			
	if(!isQueen) {
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
		if(!canFight11 && ok_row1 && ok_col2)
			canFight12 = checkFight(colChecker, col2, rowChecker, row1, groupChecker, null, null, null, 0, true);
		if(!canFight11 && !canFight12 && ok_row2 && ok_col1)
			canFight21 = checkFight(colChecker, col1, rowChecker, row2, groupChecker, null, null, null, 0, true);
		if(!canFight11 && !canFight12 && !canFight21 && ok_row2 && ok_col2)
			canFight22 = checkFight(colChecker, col2, rowChecker, row2, groupChecker, null, null, null, 0, true);
			
		////console.log('-----' + 'ISQUEEN=' + isQueen);
		////console.log(checker.id);
		////console.log(canFight11 + ' ' + canFight12 + ' ' + canFight21 + ' ' + canFight22);
						
		if(canFight11 || canFight12 || canFight21 || canFight22) {
			isFighting = true;
			checker.dataset.canbefocused = false;
			return(true);
		}
	} else {
		//console.log('ok');
		var tmpColCell1 = colChecker;
		var tmpColCell2 = colChecker;
		
		var result1 = 'no data', result1_is_received = false;
		var result2 = 'no data', result2_is_received = false;
		
		for(var i = rowChecker - 1; i > 0; i--) {
			if(!result1_is_received) result1 = checkQueenFight(i, --tmpColCell1, groupChecker, false, false);
			//console.log(result1 + ' ' + i + ' ' + tmpColCell1 + ' ');
			if(!result2_is_received) result2 = checkQueenFight(i, ++tmpColCell2, groupChecker, false, true);
			//console.log(result2 + ' ' + i + ' ' + tmpColCell2 + ' ');			

			
			if(result1 === 'can fight' || result1 === 'can not fight' || result1 === 'no cell')
				result1_is_received = true;
			if(result2 === 'can fight' || result2 === 'can not fight' || result2 === 'no cell')
				result2_is_received = true;
				
			if(result1_is_received && result2_is_received) break;
		}
		
		result = result1 === 'can fight' || result2 === 'can fight';
		//console.log('result = ' + result);
		if(result) {
			checker.dataset.canbefocused = false;
			isFighting = true;
			return(true);
		} else {
			tmpColCell1 = colChecker;
			tmpColCell2 = colChecker;
			
			result1 = 'no data'; result1_is_received = false;
			result2 = 'no data'; result2_is_received = false;

			for(var i = rowChecker + 1; i < n; i++) {
				if(!result1_is_received) result1 = checkQueenFight(i, --tmpColCell1, groupChecker, true, false);
				//console.log(result1 + ' ' + i + ' ' + tmpColCell1 + ' ');
				if(!result2_is_received) result2 = checkQueenFight(i, ++tmpColCell2, groupChecker, true, true);
				//console.log(result2 + ' ' + i + ' ' + tmpColCell2 + ' ');
				
				if(result1 === 'can fight' || result1 === 'can not fight' || result1 === 'no cell')
					result1_is_received = true;
				if(result2 === 'can fight' || result2 === 'can not fight' || result2 === 'no cell')
					result2_is_received = true;
					
				if(result1_is_received && result2_is_received) break;
			}
			
			result = result1 === 'can fight' || result2 === 'can fight';
			//console.log('result = ' + result);
			if(result) {
				isFighting = true;
				checker.dataset.canbefocused = false;
				return(true);
			}
		}
		
		//console.log('QQQ---QQQ');
		//console.log(checker.id);
	}
	return(false);
}

function checkQueenFight(i, tmpColCell, groupChecker, flag1, flag2) {
	var cell = document.getElementById('cell' + i + '-' + tmpColCell);
	if(cell != null) {
		//console.log(cell.id + ' ' + (cell.firstChild == null) + ' ' + (cell.firstElementChild == null));
		if(cell.firstChild != null) {
			var backRow = i - 1;
			var backCol = tmpColCell - 1;
			if(flag1) backRow = i + 1;
			if(flag2) backCol = tmpColCell + 1;
			var backCell = document.getElementById('cell' + backRow + '-' + backCol);
			//console.log('backCell row = ' + backRow);
			//console.log('backCell col = ' + backCol);
			//console.log('backCell!=null ' + (backCell != null));
			if(backCell != null) //console.log('backCell.firstChild!=null ' + (backCell.firstChild != null));
			if(backCell != null &&  backCell.firstChild != null) //console.log('groupChecker ' + (cell.firstChild.id.split('-')[1]));
			if(backCell == null || backCell.firstChild != null || groupChecker == cell.firstChild.id.split('-')[1])
				return('can not fight');
			else return('can fight');
		} else return('void cell');
	} else return('no cell');
}

function checkQueenMoveToFight(checker, oldCell, cell, rowChecker, colChecker, row, col, groupChecker) {
	var i = rowChecker - 1, j = colChecker - 1, step_i = -1, step_j = -1;
	if(rowChecker < row) {
		i = rowChecker + 1;
		step_i = 1;
	}
	if(colChecker < col) {
		j = colChecker + 1;
		step_j = 1;
	}
	var haveChecker = false;
	var isThisOurChecker = false;
	var moreThanTwoCheckers = false;
	var enemyCell, rowEnemy = 0, colEnemy = 0, enemyChecker;
	for(; i != row;) {
		thisCell = document.getElementById('cell' + i + '-' + j);
		if(thisCell.firstChild != null) {
			if(!haveChecker) {
				enemyCell = thisCell;
				enemyChecker = enemyCell.firstChild;
				isThisOurChecker = groupChecker === thisCell.firstChild.id.split('-')[1];
				haveChecker = true;
			} else {
				moreThanTwoCheckers = true;
				break;
			}
		}
		i += step_i; j += step_j;
	}
	var canFight = !moreThanTwoCheckers && haveChecker && !isThisOurChecker;
	if(canFight) {
		var groupEnemy = enemyChecker.id.split('-')[1];
		countCheckers[groupEnemy]--;
		enemyCell.removeChild(enemyChecker);
		var oldFocusChecker = focusChecker;
		move(oldCell, cell, checker, groupChecker);
		extraCheckFight(oldFocusChecker);
	}
}

function updateInformation() {
	//console.log('UPDATE INFORMATION BEGIN');	
	isFighting = false;
	var arrayCheckers = document.getElementsByClassName('checkers ' + isGoing);
	for(var i = 0; i < arrayCheckers.length; i++)
		arrayCheckers[i].dataset.canbefocused = 'true';
	//console.log('-------');
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

	checkFail('A'); checkFail('B');
	//console.log('UPDATE INFORMATION END');
}

function checkFail(groupCheckers) {
	if(countCheckers[groupCheckers] == 0) {
		nameChecker = 'Синие';
		color = 'blue';
		if(groupCheckers === 'A') {
			nameChecker = 'Красные';
			color = 'red';	
		}
		information(nameChecker + ' ПОБЕДИЛИ', color, true);
	}
		
}

function checkFight(colChecker, col, rowChecker, row, groupChecker, oldCell, cell, thisChecker, differenceRow, isFullChecking) {
	var canGo = false;
	////console.log('yes');
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
					countCheckers[groupCheckerBetween]--;
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

function move(oldCell, cell, thisChecker, groupChecker) {
	oldCell.removeChild(thisChecker);
	cell.appendChild(thisChecker);
	focusChecker = null;
	isGoing = groupChecker === 'A' ? 'B' : 'A';
	thisChecker.setAttribute('CLASS', 'checkers ' + groupChecker);
}

function redraw(id, color1, color2, color3) {
	var arrayData = id.split('-');
	var rows = parseInt(arrayData[0]);
	var cols = parseInt(arrayData[1]);
	
	var cell = document.getElementById('cell' + id);
	cell.style.background = (rows + cols) % 2 == 0 ? color1 : color2;
	
	var checker = cell.firstChild;
	if(checker != null) {
		checker.style.borderColor = color3;
		if(checker.id.split('-').length > 3) {
			var divQueen = checker.firstChild;
			divQueen.style.background = color3;
		}
	}
}

function recolourCell(id) {
	var gray = '#474747ff';
    var dark_gray = '#1f1f1fff';
    var border = '#dee0aaff';

	redraw(id, gray, dark_gray, border);
}

function returnColorCell(id) {
	var dark_gray_1 = '#262626ff';
    var dark_gray_2 = '#333333ff';
    var gray = '#e0e0e0ff';
    
    redraw(id, dark_gray_2, dark_gray_1, gray);
}

function information(str, color, win = false) {
	var colors = new Array();
	colors['gray'] = '#e0e0e0ff';	
   	colors['blue'] = '#262739ff';												
    colors['red'] = '#6e2327ff';														
    colors['border'] = '#dee0aaff';	
    
    divInformation.textContent = str;
	if(win) {
		divInformation.style.background = colors[color];
		divInformation.style.color = colors['border'];
		divSpace3.style.background = colors[color];
		divSpace4.style.background = colors[color];
	} else {
		divInformation.style.color = colors[color];
	}
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
	
	var halfNumberCheckers = numberCheckers / 2;
	countCheckers['A'] = halfNumberCheckers;
	countCheckers['B'] = halfNumberCheckers;
	
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
